<template>
<div class="table_box" id="jubu">
    <div class="madeBySelfBox">
        <p>
            <el-select v-model="selectReportId" class="green18x10">
                <el-option v-for="(item,index) in reportList" :key="index" :label="item.ReportName" :value="item.ReportId"></el-option>
            </el-select>
            <el-date-picker v-model="search_date" type="daterange" align="right" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="GLOBAL.pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button type="primary" class="btn120x40" @click="creatReport">查询报表</el-button>
        </p>
        <p class="madeBySelfBoxRightP">
            <el-input v-model.trim="searchField" placeholder="输入查询的产品名称" @input="searchInputEvent"></el-input>
            <el-button class="btn120x40empty" @click="exportData">导出报表</el-button>
            <el-button @click="printView">打印预览</el-button>
        </p>
    </div>
    <el-table :data="tableData" show-summary row-key="Id" border height="100%" @filter-change="tableFilteredEvent" ref="multipleTable">
        <el-table-column v-for="(item,index) in columnList" :key="index" :label="item.DisplayName" :prop="dropCol[index].SpliceName" :filters="item.FilterArr" :filter-method="filterData" :column-key="dropCol[index].SpliceName" sortable :sort-by="dropCol[index].SpliceName"></el-table-column>
    </el-table>
    <PrintPreview v-if="isShowPrintView"></PrintPreview>
</div>
</template>

<script>
import '@/assets/css/hiprint/hiprint.css';
import '@/assets/css/hiprint/print-lock.css'

import Sortable from "sortablejs";
import toExcel from "@/utils/json2excel";
import '@/assets/css/hiprint/hiprint.css';
import '@/assets/css/hiprint/print-lock.css';

import '@/plugins/hiprint/jquery.min.js';
import '@/plugins/hiprint/jquery.minicolors.min.js';
import {
    hiprint
} from '@/plugins/hiprint/hiprint.bundle.js';
import '@/plugins/hiprint/jquery.hiwprint.js';
import PrintPreview from '@/components/common/PrintPreview';
export default {
    inject: ['reload'],
    data() {
        return {
            isShowPrintView: false,
            hiprintTemplate: null, //打印实例
            customPrintJson: {
                "panels": [{
                    "index": 0,
                    "height": 297,
                    "width": 210,
                    "paperHeader": 40.5,
                    "paperFooter": 780,
                    "printElements": [{
                        "options": {
                            "left": 10,
                            "top": 50,
                            "height": 44,
                            "width": 511.5,
                            "field": "table",
                            "columns": [
                                []
                            ]
                        },
                        "printElementType": {
                            "title": "表格",
                            "type": "tableCustom"
                        }
                    }, ],
                    "paperNumberLeft": 565.5,
                    "paperNumberTop": 819
                }]
            },
            printData: {
                table: []
            },
            searchField: "", //查询的字串
            search_date: [], //查询的日期
            selectReportId: "",
            reportList: [], //报表列表
            columnList: [],
            dropCol: [],
            totalData: [], //所有数据
            tableData: [], //报表数据
            currentReportId: 0 //当前报表的Id
        };
    },
    components: {
        PrintPreview
    },
    provide() {
        return {
            closePrintView: this.closePrintView,
            startPrinting: this.startPrinting,
            printDesign: this.printDesign,
            rotatePrintPaper: this.rotatePrintPaper
        }
    },
    created() {
        axios("/api/Report")
            .then(res => {
                if (res.data.Code == 200) {
                    this.reportList = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
    },
    mounted() {
        // this.rowDrop();
        // this.columnDrop();
        $(document).ready(() => {
            //初始化打印插件
            hiprint.init();
        })
    },
    methods: {
        //过滤数据method
        filterData(value, row, column) {
            for (let i = 0; i < this.columnList.length; i++) {
                if (this.columnList[i].DisplayName === column.label) {
                    if(row[this.columnList[i].SpliceName] == value){
                        row.Visiable = true;
                        return true;
                    }else{
                        row.Visiable = false;
                        return false;
                    }
                    
                }
            }
        },
        //生成报表
        creatReport() {
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.selectReportId,
                        type: "StringNotEmpty",
                        msg: "请选择报表！"
                    },
                    {
                        val: this.search_date,
                        type: "ArrayNotEmpty",
                        msg: "请选择查询日期！"
                    }
                ])
            ) {
                let url = "";
                for (let i = 0; i < this.reportList.length; i++) {
                    if (this.selectReportId === this.reportList[i].ReportId) {
                        url = this.reportList[i].ReportUrl;
                        this.columnList = JSON.parse(JSON.stringify(this.reportList[i].Parameters));
                        if (this.columnList.length < 6) {}
                        this.dropCol = JSON.parse(JSON.stringify(this.columnList));
                        break;
                    }
                }
                axios(`${url}&$filter=CreatedTime ge ${ this.search_date[0] } and CreatedTime le ${this.search_date[1]}`)
                    .then(res => {
                        this.currentReportId = this.selectReportId;
                        let getData = res.data.value;
                        let data = [];
                        for (let i = 0; i < getData.length; i++) {
                            let temp_obj = {};
                            let temp_arr = [];
                            // delete getData[i].Products
                            for (let j in getData[i]) {
                                if (
                                    Object.prototype.toString.call(getData[i][j]) ==
                                    "[object Array]"
                                ) {
                                    let returnData = this.collationArrayData(j, getData[i][j]);
                                    for (let k = 0; k < returnData.length; k++) {
                                        temp_arr.push(returnData[k]);
                                    }
                                } else if (
                                    Object.prototype.toString.call(getData[i][j]) ==
                                    "[object Object]"
                                ) {
                                    //可能是array
                                    let returnData = this.collationObjectData(j, getData[i][j]);
                                    if (returnData.length == 1) {
                                        Object.assign(temp_obj, returnData[0]);
                                    } else {
                                        for (let k = 0; k < returnData.length; k++) {
                                            temp_arr.push(returnData[k]);
                                        }
                                    }
                                } else {
                                    if (/Time$/.test(j)) {
                                        getData[i][j] =
                                            getData[i][j].slice(0, 10) +
                                            " " +
                                            getData[i][j].slice(11, 19);
                                    }
                                    temp_obj[j] = getData[i][j];
                                }
                            }
                            if (temp_arr == "") {
                                data.push(temp_obj);
                            } else {
                                for (let j = 0; j < temp_arr.length; j++) {
                                    data.push(Object.assign(temp_arr[j], temp_obj));
                                }
                            }
                        }
                        for (let i = 0; i < data.length; i++) {
                            data[i].Id = i + 1;
                            data[i].Visiable = true;
                        }
                        this.tableData = data;
                        this.totalData = JSON.parse(JSON.stringify(data));
                        //过滤功能数组
                        for (let i = 0; i < this.columnList.length; i++) {
                            let filterArr = [];
                            for (let j = 0; j < this.tableData.length; j++) {
                                filterArr.push(
                                    this.tableData[j][this.columnList[i].SpliceName]
                                );
                            }
                            this.columnList[i].FilterArr = this.unique(filterArr);
                            for (let j = 0; j < this.columnList[i].FilterArr.length; j++) {
                                this.columnList[i].FilterArr[j] = {
                                    text: this.columnList[i].FilterArr[j],
                                    value: this.columnList[i].FilterArr[j]
                                };
                            }
                        }
                    })
                    .catch(err => {});
            }
        },
        //整理object数据
        collationObjectData(key, data) {
            let tempArr = [];
            let tempObj = {};
            for (let i in data) {
                if (Object.prototype.toString.call(data[i]) == "[object Array]") {
                    let returnData = this.collationArrayData(key + i, data[i]);
                    for (let j = 0; j < returnData.length; j++) {
                        tempArr.push(returnData[j]);
                    }
                } else if (
                    Object.prototype.toString.call(data[i]) == "[object Object]"
                ) {
                    let returnData = this.collationObjectData(key + i, data[i]);
                    if (returnData.length == 1) {
                        Object.assign(tempObj, returnData[0]);
                    } else {
                        for (let j = 0; j < returnData.length; j++) {
                            tempArr.push(returnData[j]);
                        }
                    }
                } else {
                    if (/Time$/.test(key + i)) {
                        data[i] = data[i].slice(0, 10) + " " + data[i].slice(11, 19);
                    }
                    tempObj[key + i] = data[i];
                }
            }
            if (tempArr == "") {
                tempArr.push(tempObj);
                return tempArr;
            } else {
                for (let i = 0; i < tempArr.length; i++) {
                    Object.assign(tempArr[i], tempObj);
                }
                return tempArr;
            }
        },
        //数组去重
        unique(arr) {
            return Array.from(new Set(arr));
        },
        //整理array数据
        collationArrayData(key, data) {
            let tempArr = [];
            for (let i = 0; i < data.length; i++) {
                let returnData = this.collationObjectData(key, data[i]);
                for (let j = 0; j < returnData.length; j++) {
                    tempArr.push(returnData[j]);
                }
            }
            return tempArr;
        },
        //行拖拽
        rowDrop() {
            const tbody = document.querySelector(
                "#jubu .el-table__body-wrapper tbody"
            );
            Sortable.create(tbody, {
                animation: 180,
                delay: 0,
                onEnd: ({
                    newIndex,
                    oldIndex
                }) => {
                    const currRow = this.tableData.splice(oldIndex, 1)[0];
                    this.tableData.splice(newIndex, 0, currRow);
                }
            });
        },
        //列拖拽
        columnDrop() {
            const wrapperTr = document.querySelector(
                "#jubu .el-table__header-wrapper tr"
            );
            this.sortable = Sortable.create(wrapperTr, {
                animation: 180,
                delay: 0,
                onEnd: evt => {
                    let oldItem = this.dropCol[evt.oldIndex];
                    this.dropCol.splice(evt.oldIndex, 1);
                    this.dropCol.splice(evt.newIndex, 0, oldItem);
                }
            });
        },
        //旋转打印纸张
        rotatePrintPaper() {
            this.hiprintTemplate.rotatePaper();
        },
        //打印预览
        printView() {
            let printTablefields = [];
            this.columnList.forEach(element => {
                printTablefields.push({
                    "title": element.DisplayName,
                    "field": element.SpliceName,
                    "width": 85.25,
                    "colspan": 1,
                    "align": "center",
                    "rowspan": 1
                });
            });
            this.customPrintJson.panels[0].printElements[0].options.columns[0] = printTablefields;
            this.hiprintTemplate = new hiprint.PrintTemplate({
                template: this.customPrintJson,
                settingContainer: '#PrintElementOptionSetting',
                paginationContainer: '.hiprint-printPagination'
            });
            this.isShowPrintView = true;
        },
        //打印设计
        printDesign() {
            this.hiprintTemplate.design('#hiprint-printTemplate');
        },
        //开始打印
        startPrinting() {
            this.printData.table = this.tableData.filter(element=>element.Visiable);
            this.hiprintTemplate.print(this.printData);
        },
        //关闭预览
        closePrintView() {
            this.isShowPrintView = false;
        },
        //导出数据
        exportData() {
            if (this.tableData.length > 0) {
                const th = [];
                const filterVal = [];
                this.columnList.forEach(element => {
                    th.push(element.DisplayName);
                    filterVal.push(element.SpliceName);
                });
                const data = this.tableData.map(v => filterVal.map(k => v[k]));
                let excelName = this.reportList.filter(item => {
                    return item.ReportId === this.currentReportId;
                })[0].ReportName;
                const [fileName, fileType, sheetName] = [excelName, "xlsx", "Sheet1"];
                let temporary_Arr = [];
                for (let i = 0; i < data[0].length; i++) {
                    let temporaryNum = 0;
                    if (typeof (data[0][i]) == "number") {
                        for (let j = 0; j < data.length; j++) {
                            temporaryNum += data[j][i];
                        }
                        temporary_Arr.push(temporaryNum);
                    } else {
                        temporary_Arr.push("");
                    }
                }
                temporary_Arr[0] = "合计";
                data.push(temporary_Arr);
                toExcel({
                    th,
                    data,
                    fileName,
                    fileType,
                    sheetName
                });
            } else {
                this.showInformation({
                    classify: "message",
                    msg: "请至少导出一条数据！"
                });
            }
        },
        //筛选change事件
        tableFilteredEvent(filters){
            for (const key in filters) {
                if(filters[key]==''){
                    this.tableData.forEach(element=>{
                        element.Visiable = true;
                    });
                    this.$refs.multipleTable.clearFilter();
                }
            }
        },
        //input筛选数据
        searchInputEvent() {
            if (this.searchField) {
                this.tableData =  this.totalData.filter(data => {
                    for (let key in data) {
                        if (/ProductName$/.test(key) && data[key].toLowerCase().includes(this.searchField.toLowerCase())) {
                            data.Visiable = true;
                            return true;
                        }
                    }
                });
            } else {
                this.tableData = JSON.parse(JSON.stringify(this.totalData));
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";

#jubu.table_box {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 90px 40px 30px;
    box-sizing: border-box;
    overflow-x: auto;

    &::-webkit-scrollbar {
        width: 0;
        height: 10px;
    }

    .madeBySelfBox {
        position: absolute;
        left: 40px;
        right: 40px;
        top: 30px;
        min-width: 1300px;
        display: flex;
        justify-content: space-between;

        .el-date-editor {
            margin: 0 20px;

            input {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
        }

        .el-select {
            input {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
        }

        .el-button {
            font-size: 18px;
            font-family: Microsoft YaHei;
            color: #fff;
            background: #00c16b;
            border: 0;
            line-height: 40px;

            &.el-button--default {
                background: #fff;
                color: #00c16b;
                border: 1px solid #00c16b;
                width: 120px;
            }
        }

        .madeBySelfBoxRightP {
            display: flex;

            .el-input {
                width: 200px;
                margin-right: 10px;
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
        }
    }

    .el-table {
        min-width: 1300px;
        border-color: #aeb2ba;

        &::before,
        &::after {
            background-color: #aeb2ba;
        }

        .el-table__empty-block {
            font-size: 18px;
        }

        thead {
            th {
                background: #f7f8fa;
                border-color: #aeb2ba;

                .cell {
                    font-size: 18px;
                    color: #878d9f;
                }
            }
        }

        .el-table__body-wrapper {
            tbody {
                tr {
                    &:hover {
                        td {
                            background-color: transparent;
                        }
                    }

                    td {
                        border-color: #aeb2ba;

                        .cell {
                            color: #232e41;
                            font-size: 18px;
                            font-weight: bold;
                        }
                    }
                }
            }
        }

        .el-table__footer-wrapper {
            tbody {
                tr {
                    td {
                        border-color: #aeb2ba;

                        .cell {
                            color: #878d9f;
                            font-size: 18px;
                            font-weight: normal;
                        }
                    }
                }
            }
        }
    }
}

#viewEffect {
    overflow-y: scroll;
    padding: 30px 40px;
    position: fixed;
    z-index: 999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    box-sizing: border-box;

    .el-table {
        table {
            border-collapse: collapse;
        }

        thead {
            display: table-header-group;

            .cell {
                display: flex;
                align-items: center;
            }
        }
    }

    table,
    th,
    td {
        border: 1px solid #aeb2ba;
        padding: 5px 0;
        text-align: center;
    }

    .tr_th th {
        background: #f7f8fa;
        text-align: center;
        font-size: 18px;
        font-family: Microsoft YaHei;
        color: #878d9f;
        font-weight: normal;
        padding: 12px 5px;
    }

    tbody {
        td {
            .cell {
                font-size: 18px;
                font-weight: bold;
                font-family: Microsoft YaHei;
                color: #232e41;
            }
        }
    }

    tfoot tr td {
        background-color: #f7f8fa;
        color: #878d9f;
        font-family: Microsoft YaHei;
        font-weight: normal;
    }

    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #aeb2ba;
    }

    .el-table--border,
    .el-table--group {
        border-left: 1px solid #aeb2ba;
        border-bottom: 1px solid #aeb2ba;
    }
}

@page {
    size: auto;
    /* auto is the initial value */
    margin: 0mm;
    /* this affects the margin in the printer settings */
}
</style>
