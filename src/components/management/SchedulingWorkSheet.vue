<template>
<div class="schedulingWork cssd_totalBar">
    <div class="container">
        <div class="scheduleMsg">
            <ul>
                <li>
                    <p>班表名称</p>
                    <el-input v-model.trim="submitData.Name" placeholder="班表名称"></el-input>
                </li>
                <li>
                    <p>班表月份</p>
                    <el-date-picker v-model="submitData.YearMonth" type="month" placeholder="请选择年月" :clearable="false" :editable="false" @change="dateChange" :picker-options="{
                            disabledDate:disabledDate
                        }" value-format="yyyy-MM" :disabled="viewModule.id?true:false"></el-date-picker>
                </li>
            </ul>
            <el-button @click="printView">打印班表</el-button>
        </div>
        <div class="workSheetRemark">
            <p>备注</p>
            <el-input type="textarea" placeholder="请填写备注" v-model.trim="submitData.Remark" resize="none"></el-input>
        </div>
        <dl>
            <dt>
                <el-select placeholder="选择字段类别" class="green24x13" v-model="currentSelectPeriodType">
                    <el-option label="常日班" :value="'Work'"></el-option>
                    <el-option label="休假" :value="'Vacation'"></el-option>
                    <el-option label="备班" :value="'WorkOverTime'"></el-option>
                    <el-option label="工作区域" :value="'WorkArea'"></el-option>
                </el-select>
            </dt>
            <dd>
                <el-tag v-for="(item,index) in periodType[currentSelectPeriodType]" :key="index" @click="switchPeriodStatus(item)" :class="{'is-active':item.IsActive}">{{item.name}}</el-tag>
            </dd>
        </dl>
        <el-table :data="submitData.Staffs" border row-key="StaffId" :height="tableHeight" style="width:100%;" @cell-click="cellclick" v-show="submitData.Days!=''" fit>
            <el-table-column label="序号" fixed width="80" class-name="draggable" type="index"></el-table-column>
            <el-table-column :fixed="isNameFixed" class-name="draggable header_name_th">
                <div slot="header" class="header_name"><span>姓名</span><i @click="isNameFixed = !isNameFixed" :class="isNameFixed?'locked':'unclock'"></i></div>
                <template slot-scope="props">
                    <div class="cell_name draggable">{{props.row.StaffName}}</div>
                </template>
            </el-table-column>
            <el-table-column v-for="(item,index) in submitData.Days" :key="index" :label="item.day+'日'" :class-name="item.isWeekend?'is-weekend':''">
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="props.row.Periods[item.day-1].PeriodId==0" trigger="hover" :open-delay="1500" @show="displayPopover(props.row.Periods[item.day-1])" popper-class="schedulePopper">
                        <ol>
                            <li><span>开始时间：</span><b>{{formatTime(displayedPeriodMsg.startTime)}}</b></li>
                            <li><span>结束时间：</span><b>{{formatTime(displayedPeriodMsg.endTime)}}</b></li>
                            <li><span>午餐：</span><b>{{displayedPeriodMsg.isIncludeLunch?'有':'无'}}</b></li>
                        </ol>
                        <div slot="reference" class="periodItem" :class="{'is-cell-active':props.row.Periods[item.day-1].IsCellActive}" @click="tableCellClick(props.row.Periods[item.day-1])" @mousedown="tableCellMousedown(props.row.Periods[item.day-1])" @mouseenter="tableCellMouseenter(props.row.Periods[item.day-1])" @mouseup="tableCellMouseup(props.row.Periods[item.day-1])">{{initCellData(props.row.Periods[item.day-1],props.$index,item.day-1)}}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="工作区域" :width="getMaxLength(submitData.Staffs)">
                <template slot-scope="props">
                    <div class="workAreaItem" @click="workAreaCellClick(props.row)">{{props.row.WorkAreaString}}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="cssd_table_bottom">
        <p></p>
        <p>
            <el-button @click="cancelSubmit">取消</el-button>
            <el-button type="primary" @click="confirmSubmit">保存</el-button>
        </p>
    </div>
    <PrintPreview v-if="isShowPrintView"></PrintPreview>
</div>
</template>

<script>
import {
    MessagePack
} from 'assert';
import {
    decode
} from '@msgpack/msgpack';
import Sortable from "sortablejs";
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
    inject: ['managementReload'],
    props: {
        viewModule: Object,
        scheduledWorks: Array
    },
    data() {
        let {
            year,
            month
        } = this.getNewDate(new Date());
        return {
            //表格高度
            tableHeight: window.innerHeight - 180,
            //鼠标按下位置
            keyDownPosition: [],
            //当前激活的班种
            activePeriod: {},
            //当前激活的工作区域
            activeWorkArea: {},
            //提交数据模型
            submitData: {
                Id: 0,
                Name: '',
                YearMonth: '',
                Remark: '',
                Staffs: [],
                Days: []
            },
            //当前选择的年月
            currentSelectMonth: {
                year,
                month
            },
            //当前选择的班种类别
            currentSelectPeriodType: 'Work',
            //人员表
            periodType: {
                Work: [],
                Vacation: [],
                WorkOverTime: [],
                WorkArea: []
            },
            //班种显示的数据
            displayedPeriodMsg: {
                startTime: '',
                endTime: '',
                isIncludeLunch: false,
            },
            isNameFixed: true, //name是否固定
            isShowPrintView: false, //是否显示打印预览
            hiprintTemplate: null, //打印实例
            //打印模板
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
                            "top": 20,
                            "height": 44,
                            "width": 825,
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
            //打印数据
            printData: {
                table: []
            },
        }
    },
    components: {
        PrintPreview
    },
    created() {
        axios({
            url: `/schedule`,
            method: 'POST',
            data: {
                operationName: "getPeriods",
                query: ` query getPeriods{ 
                    Work:period(periodType:0){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    Vacation:period(periodType:1){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    WorkOverTime:period(periodType:2){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    WorkArea:workArea{
                        id,name
                    }
                }`,
                variables: {}
            }
        }).then(res => {
            for (const key in res.data.data) {
                res.data.data[key].forEach(element => {
                    element.IsActive = false;
                    if (key == 'WorkArea') {
                        element.IsPeriod = false;
                    } else {
                        element.IsPeriod = true;
                    }
                });
            }
            Object.assign(this.periodType, res.data.data);
        }).catch(err => {})
        //update
        if (this.viewModule.id) {
            this.submitData = JSON.parse(decode(this.viewModule.commandViewData));
            this.submitData.Id = this.viewModule.id;
            this.currentSelectMonth.month = this.submitData.YearMonth.split('-')[1] - 1;
            this.currentSelectMonth.year = this.submitData.YearMonth.split('-')[0];
        } else {
            //insert
            axios({
                url: `/basic`,
                method: 'POST',
                data: {
                    query: `query getStaffs{
                        staff(clinicId:${this.GLOBAL.UserInfo.ClinicId}){
                            id,name,clinicId
                        }
                    }`
                }

            }).then(res => {
                res.data.data.staff.forEach(element => {
                    element.Periods = [];
                    element.StaffId = element.id;
                    element.StaffName = element.name;
                    element.WorkAreas = [];
                    element.WorkAreaString = '';
                });
                this.submitData.Staffs = res.data.data.staff;
            }).catch(err => {})
        }
    },
    mounted() {
        this.rowDrop();
        $(document).keydown(event => {
            if (event.keyCode == 46 || event.keyCode == 8) {
                this.deleteSelectedAreaPeriods();
            }
        })
    },
    provide() {
        return {
            closePrintView: this.closePrintView,
            startPrinting: this.startPrinting,
            printDesign: this.printDesign,
            rotatePrintPaper: this.rotatePrintPaper
        }
    },
    methods: {
        //显示popover详情
        displayPopover(obj) {
            if (obj.PeriodId) {
                let periods = this.periodType.Vacation.concat(this.periodType.Work, this.periodType.WorkOverTime);
                Object.assign(this.displayedPeriodMsg, periods.filter(element => {
                    return element.id === obj.PeriodId
                })[0]);
            }
        },
        //确认提交
        confirmSubmit() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.submitData.Name,
                    type: 'StringNotEmpty',
                    msg: '班表名称不能为空！'
                }, {
                    val: this.submitData.YearMonth,
                    type: 'StringNotEmpty',
                    msg: '排班月份不能为空！'
                }])) {
                let method = 'POST';
                if (this.viewModule.id) {
                    method = 'PUT';
                }
                axios({
                    url: `/api/PlanDailySchedule`,
                    method: method,
                    data: this.submitData
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = 'success';
                        this.managementReload();
                    } else {
                        type = 'error';
                    }
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                        type: type
                    });
                })
            }
        },
        cellclick(row, column, cell, event) {
            // console.log(row, column, cell, event)
        },
        //cell 点击事件
        tableCellClick(obj) {
            if (this.activePeriod.id) {
                obj.PeriodId = this.activePeriod.id;
                obj.PeriodName = this.activePeriod.name;
                obj.IsIncludeLunch = this.activePeriod.IsIncludeLunch;
            }
            this.resetCellStatus(obj.RowIndex, obj.ColumnIndex);
            obj.IsCellActive = !obj.IsCellActive;
            this.$forceUpdate();
        },
        //工作区域点击事件
        workAreaCellClick(obj) {
            if (this.activeWorkArea.id && !obj.WorkAreas.includes(this.activeWorkArea.id)) {
                obj.WorkAreas.push(this.activeWorkArea.id);
                if (obj.WorkAreaString) {
                    obj.WorkAreaString += ',' + this.activeWorkArea.name;
                } else {
                    obj.WorkAreaString += this.activeWorkArea.name;
                }
            }
        },
        //删除选中的排班
        deleteSelectedAreaPeriods() {
            for (let i = 0; i < this.submitData.Staffs.length; i++) {
                for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
                    if (this.submitData.Staffs[i].Periods[j].IsCellActive) {
                        this.submitData.Staffs[i].Periods[j].PeriodId = 0;
                        this.submitData.Staffs[i].Periods[j].PeriodName = '';
                        this.submitData.Staffs[i].Periods[j].IsIncludeLunch = false;
                    }
                }
            }
        },
        //cell 鼠标按下事件
        tableCellMousedown(obj) {
            this.keyDownPosition[0] = obj.RowIndex;
            this.keyDownPosition[1] = obj.ColumnIndex;
        },
        //cell 鼠标进入事件
        tableCellMouseenter(obj) {
            if (this.keyDownPosition.length > 0) {
                let minRowIndex = Math.min(obj.RowIndex, this.keyDownPosition[0]);
                let maxRowIndex = Math.max(obj.RowIndex, this.keyDownPosition[0]);;
                let minColumnIndex = Math.min(obj.ColumnIndex, this.keyDownPosition[1]);
                let maxColumnIndex = Math.max(obj.ColumnIndex, this.keyDownPosition[1]);
                for (let i = 0; i < this.submitData.Staffs.length; i++) {
                    for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
                        if (this.submitData.Staffs[i].Periods[j].RowIndex >= minRowIndex && this.submitData.Staffs[i].Periods[j].RowIndex <= maxRowIndex && this.submitData.Staffs[i].Periods[j].ColumnIndex <= maxColumnIndex && this.submitData.Staffs[i].Periods[j].ColumnIndex >= minColumnIndex) {
                            this.submitData.Staffs[i].Periods[j].IsCellActive = true;
                        } else {
                            this.submitData.Staffs[i].Periods[j].IsCellActive = false;
                        }
                    }
                }
            }
        },
        //cell 鼠标抬起事件
        tableCellMouseup(obj) {
            if (this.keyDownPosition.length > 0) {
                let minRowIndex = Math.min(obj.RowIndex, this.keyDownPosition[0]);
                let maxRowIndex = Math.max(obj.RowIndex, this.keyDownPosition[0]);;
                let minColumnIndex = Math.min(obj.ColumnIndex, this.keyDownPosition[1]);
                let maxColumnIndex = Math.max(obj.ColumnIndex, this.keyDownPosition[1]);
                for (let i = 0; i < this.submitData.Staffs.length; i++) {
                    for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
                        if (this.submitData.Staffs[i].Periods[j].RowIndex >= minRowIndex && this.submitData.Staffs[i].Periods[j].RowIndex <= maxRowIndex && this.submitData.Staffs[i].Periods[j].ColumnIndex <= maxColumnIndex && this.submitData.Staffs[i].Periods[j].ColumnIndex >= minColumnIndex) {
                            if (this.activePeriod.id) {
                                this.submitData.Staffs[i].Periods[j].PeriodId = this.activePeriod.id;
                                this.submitData.Staffs[i].Periods[j].PeriodName = this.activePeriod.name;
                                this.submitData.Staffs[i].Periods[j].IsIncludeLunch = this.activePeriod.IsIncludeLunch;
                            }
                        }
                    }
                }
            }
            this.keyDownPosition = [];
            this.$forceUpdate();
        },
        //重置班种激活状态
        resetPeriodStatus(obj) {
            for (const key in this.periodType) {
                this.periodType[key].forEach(element => {
                    if (element.id === obj.id && obj.IsPeriod === element.IsPeriod) {
                        return;
                    }
                    element.IsActive = false;
                });
            }
        },
        //重置cell激活状态
        resetCellStatus(RowIndex, ColumnIndex) {
            for (let i = 0; i < this.submitData.Staffs.length; i++) {
                for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
                    if (this.submitData.Staffs[i].Periods[j].RowIndex === RowIndex && this.submitData.Staffs[i].Periods[j].ColumnIndex === ColumnIndex) {
                        continue;
                    }
                    this.submitData.Staffs[i].Periods[j].IsCellActive = false;
                }
            }
        },
        //切换班种激活状态
        switchPeriodStatus(obj) {
            this.resetPeriodStatus(obj);
            obj.IsActive = !obj.IsActive;
            if (obj.IsActive) {
                if (obj.IsPeriod) {
                    Object.assign(this.activePeriod, obj);
                    this.activeWorkArea = {};
                } else {
                    Object.assign(this.activeWorkArea, obj);
                    this.activePeriod = {};
                }
            } else {
                this.activePeriod = {};
                this.activeWorkArea = {};
            }
        },
        //年月change事件
        dateChange(val) {
            let {
                year,
                month
            } = this.getNewDate(new Date(val + '-01'));
            this.currentSelectMonth.year = year;
            this.currentSelectMonth.month = month;
            this.setCalendarDate();
        },
        //设置日期
        setCalendarDate() {
            this.submitData.Days = [];
            //当月一号的时间
            let currentFirstDayStamp = new Date(
                this.currentSelectMonth.year,
                this.currentSelectMonth.month,
                1
            ).getTime();
            for (let i = 1; i < 32; i++) {
                if (i <= 28) {
                    this.submitData.Days.push({
                        day: i + '',
                        isWeekend: this.isWeekend(new Date(this.currentSelectMonth.year, this.currentSelectMonth.month, i))
                    });
                } else {
                    if (this.isCurrentMonth(new Date(this.currentSelectMonth.year, this.currentSelectMonth.month, i))) {
                        this.submitData.Days.push({
                            day: i + '',
                            isWeekend: this.isWeekend(new Date(this.currentSelectMonth.year, this.currentSelectMonth.month, i))
                        });
                    } else {
                        break;
                    }
                }
            }
            this.initData();
        },
        //初始化数据
        initData() {
            for (let i = 0; i < this.submitData.Staffs.length; i++) {
                this.submitData.Staffs[i].Periods = [];
                for (let j = 0; j < this.submitData.Days.length; j++) {
                    this.submitData.Staffs[i].Periods.push({
                        Day: this.submitData.Days[j].day,
                        PeriodId: 0,
                        PeriodName: '',
                        IsIncludeLunch: false,
                        IsWeekend: this.submitData.Days[j].isWeekend,
                        IsCellActive: false,
                        IsCheckIn: false
                    });
                }
            }
        },
        //行拖拽
        rowDrop() {
            const tbody = document.querySelector(
                ".schedulingWork .el-table__body-wrapper tbody"
            );
            var sortable = new Sortable(tbody, {
                handle: '.draggable',
                animation: 180,
                delay: 0,
                onEnd: ({
                    newIndex,
                    oldIndex
                }) => {
                    const currRow = this.submitData.Staffs.splice(oldIndex, 1)[0];
                    this.submitData.Staffs.splice(newIndex, 0, currRow);
                }
            });
        },
        //获取年月日
        getNewDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth();
            return {
                year,
                month,
            };
        },
        //禁用日期
        disabledDate(time) {
            for (let i = 0; i < this.scheduledWorks.length; i++) {
                if (new Date(time.getTime() + 24 * 3600 * 1000).toJSON().substring(0, 7) == this.scheduledWorks[i].yearMonth) {
                    return true;
                }
            }
        },
        //旋转打印纸张
        rotatePrintPaper() {
            this.hiprintTemplate.rotatePaper();
        },
        //打印预览
        printView() {
            if (this.submitData.Days != '') {
                let printTablefields = [{
                    "title": "序号",
                    "field": "Index",
                    "width": 120,
                    "colspan": 1,
                    "align": "center",
                    "rowspan": 1
                }, {
                    "title": "姓名",
                    "field": "StaffName",
                    "width": 200,
                    "colspan": 1,
                    "align": "center",
                    "rowspan": 1
                }];
                this.submitData.Days.forEach(element => {
                    printTablefields.push({
                        "title": element.day + '日',
                        "field": "Day" + element.day,
                        "width": 120,
                        "colspan": 1,
                        "align": "center",
                        "rowspan": 1
                    });
                });
                printTablefields.push({
                    "title": "工作区域",
                    "field": "WorkAreaString",
                    "width": 400,
                    "colspan": 1,
                    "align": "center",
                    "rowspan": 1
                });
                this.customPrintJson.panels[0].printElements[0].options.columns[0] = printTablefields;
                this.hiprintTemplate = new hiprint.PrintTemplate({
                    template: this.customPrintJson,
                    settingContainer: '#PrintElementOptionSetting',
                    paginationContainer: '.hiprint-printPagination'
                });
                this.isShowPrintView = true;
            } else {
                this.showInformation({
                    classify: 'message',
                    msg: '请先选择月份！'
                });
            }
        },
        //打印设计
        printDesign() {
            this.hiprintTemplate.design('#hiprint-printTemplate');
            if(this.hiprintTemplate.getOrient()===1){
                this.rotatePrintPaper();
            }
        },
        //开始打印
        startPrinting() {
            let printArr = [];
            for (let i = 0; i < this.submitData.Staffs.length; i++) {
                let obj = {};
                obj['Index'] = i + 1;
                Object.assign(obj, this.submitData.Staffs[i]);
                for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
                    obj['Day' + this.submitData.Staffs[i].Periods[j].Day] = this.submitData.Staffs[i].Periods[j].PeriodName;
                }
                printArr.push(obj);
            }
            this.printData.table = printArr;
            this.hiprintTemplate.print(this.printData);
        },
        //关闭预览
        closePrintView() {
            this.isShowPrintView = false;
        },
        // 是否是当前月
        isCurrentMonth(date) {
            let {
                year,
                month
            } = this.getNewDate(date);
            return (
                this.currentSelectMonth.year == year &&
                this.currentSelectMonth.month == month
            );
        },
        //是否是周末
        isWeekend(date) {
            if (date.getDay() === 6 || date.getDay() === 0) {
                return true;
            } else {
                return false;
            }
        },
        //取消提交
        cancelSubmit() {
            this.$emit('to-father');
        },
        //时间格式化
        formatTime(time) {
            let hour = Math.floor(time / 3600);
            let minute = (time % 3600) / 60;
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            return `${hour}:${minute}`;
        },
        getMaxLength(arr) {
            let maxNumber = arr.reduce((acc, item) => {
                if (item) {
                    const str = item.WorkAreaString.toString();
                    const char = str.match(/[\u2E80-\u9FFF]/g)
                    const charLen = char ? char.length : 0
                    const num = str.match(/\d|\./g)
                    const numLen = num ? num.length : 0
                    const otherLen = str.length - charLen - numLen
                    let calcLen = charLen * 1.1 + numLen * 0.65 + otherLen * 0.5

                    if (acc < calcLen) {
                        acc = calcLen
                    }
                }
                return acc;
            }, 0);
            return maxNumber * 18 > 100 ? maxNumber * 18 : 100;
        }
    },
    computed: {
        initCellData() {
            return (periodObj, rowIndex, columnIndex) => {
                periodObj.RowIndex = rowIndex;
                periodObj.ColumnIndex = columnIndex;
                return periodObj.PeriodName;
            }
        }
    },
}
</script>

<style lang="scss">
@import "../../assets/css/tableTotalBottomBar";

.schedulePopper {
    ol {
        li {
            display: flex;

            span {
                width: 90px;
                font-size: 16px;
                color: #878D9F;
                text-align: right;
            }

            b {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
        }
    }
}

.schedulingWork {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
    z-index: 9;
    box-sizing: border-box;

    .container {
        height: 100%;
        padding: 30px 40px;
        box-sizing: border-box;
        overflow-y: auto;

        .scheduleMsg {
            display: flex;
            justify-content: space-between;

            >ul {
                display: flex;
                line-height: 40px;

                li {
                    display: flex;
                    justify-content: space-between;
                    width: 240px;
                    margin-right: 100px;

                    p {
                        width: 70px;
                        font-size: 16px;
                        color: #878D9F;
                        text-align: right;
                    }

                    .el-input {
                        width: 160px;
                    }

                    .el-input__inner {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }
                }
            }

            .el-button {
                border: 1px solid #00C16B;
                background: #fff;
                color: #00C16B;
                width: 120px;
                height: 40px;
                box-sizing: border-box;
                font-size: 18px;
            }
        }

        .workSheetRemark {
            border-bottom: 1px solid #F2F4F7;
            display: flex;
            padding: 20px 0;

            p {
                width: 70px;
                font-size: 16px;
                color: #878D9F;
                text-align: right;
            }

            .el-textarea {
                width: 520px;
                margin-left: 10px;
                height: 100px;

                textarea {
                    height: 100%;
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                    font-family: Microsoft YaHei;

                    &::-webkit-input-placeholder {
                        font-weight: normal;
                    }
                }
            }
        }

        dl {
            margin: 20px 0;
            display: flex;

            dt {
                .el-select {
                    width: 160px;

                    .el-input__inner {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }
                }
            }

            dd {
                display: flex;

                .el-tag {
                    height: 40px;
                    line-height: 40px;
                    box-sizing: border-box;
                    margin-left: 40px;
                    font-size: 18px;
                    cursor: pointer;
                    color: #232E41;
                    border-color: #232E41;
                    background: #fff;
                    user-select: none;

                    &.is-active {
                        border-color: #00C16B;
                        background: #E0FFF1;
                        color: #00C16B;
                    }
                }
            }
        }

        .el-table {
            cursor: pointer;

            thead {
                th {
                    text-align: center;
                    font-size: 18px;
                    color: #878D9F;

                    &.is-weekend {
                        background: #E0FFF1;
                    }

                    &.header_name_th {
                        .cell {
                            line-height: 23px;
                            height: 23px;

                            .header_name {
                                display: flex;
                                line-height: 23px;
                                padding: 0;

                                i {
                                    width: 14px;
                                    height: 20px;
                                    margin-left: 4px;

                                    &.locked {
                                        background: url(../../assets/images/locked.png) center no-repeat;
                                        background-size: 14px 20px;
                                    }

                                    &.unclock {
                                        background: url(../../assets/images/unclock.png) center no-repeat;
                                        background-size: 14px 20px;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            tbody {
                tr {
                    &:hover {
                        td {
                            background-color: transparent;
                        }
                    }

                    &.hover-row>td {
                        background-color: transparent;
                    }

                    td {
                        padding: 0;

                        &.is-weekend {
                            background: #E0FFF1;
                        }

                        .cell {
                            text-align: center;
                            padding: 0;
                            user-select: none;
                            white-space: nowrap;

                            .periodItem {
                                user-select: none;
                                height: 40px;
                                line-height: 40px;
                                color: #232E41;
                                font-size: 18px;
                                font-weight: bold;

                                &.is-cell-active {
                                    background: rgba(153, 153, 255, .5)
                                }
                            }

                            .workAreaItem {
                                height: 40px;
                                line-height: 40px;
                                color: #232E41;
                                font-size: 18px;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
