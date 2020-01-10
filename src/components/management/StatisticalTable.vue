<template>
<div id="statisticalTable">
    <div class="staticstical_container">
        <i class="closeStatisticalTable" @click="closeStatisticalTable"></i>
        <div class="staticstical_title">
            <p></p>
            <el-button @click="printView">打印预览</el-button>
        </div>
        <el-table ref="statisticalTable" :data="tableData.Staffs" border row-key="StaffId" style="width:100%;" :height="tableHeight" fit>
            <el-table-column label="序号" fixed width="60" type="index"></el-table-column>
            <el-table-column :fixed="true" width="100" prop="StaffName">
                <template slot="header">
                    <div class="cell_th">姓名</div>
                </template>
            </el-table-column>
            <el-table-column width="90" sortable sort-by="WorkDays" class-name="periodTypeColumn">
                <template slot="header">
                    <div class="cell_th">常日班</div>
                </template>
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="props.row.WorkDays==0" trigger="hover" :open-delay="1000" popper-class="schedulePopper">
                        <ol>
                            <li v-for="(val,idx) in countDaysByPeriodType(props.row,0,'WorkDays')" :key="idx">
                                <span class="popover_day">{{val.Day+'日：'}}</span>
                                <b>{{val.PeriodName}}</b>
                            </li>
                        </ol>
                        <div slot="reference">{{countDaysByPeriodType(props.row,0,'WorkDays').length}}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column sortable sort-by="VacationDays" class-name="periodTypeColumn">
                <template slot="header">
                    <div class="cell_th">休假</div>
                </template>
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="props.row.VacationDays==0" trigger="hover" :open-delay="1000" popper-class="schedulePopper">
                        <ol>
                            <li v-for="(val,idx) in countDaysByPeriodType(props.row,1,'VacationDays')" :key="idx">
                                <span class="popover_day">{{val.Day+'日：'}}</span>
                                <b>{{val.PeriodName}}</b>
                            </li>
                        </ol>
                        <div slot="reference">{{countDaysByPeriodType(props.row,1,'VacationDays').length}}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column sortable sort-by="WorkOverTimeDays" class-name="periodTypeColumn">
                <template slot="header">
                    <div class="cell_th">备班</div>
                </template>
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="props.row.WorkOverTimeDays==0" trigger="hover" :open-delay="1000" popper-class="schedulePopper">
                        <ol>
                            <li v-for="(val,idx) in countDaysByPeriodType(props.row,2,'WorkOverTimeDays')" :key="idx">
                                <span class="popover_day">{{val.Day+'日：'}}</span>
                                <b>{{val.PeriodName}}</b>
                            </li>
                        </ol>
                        <div slot="reference">{{countDaysByPeriodType(props.row,2,'WorkOverTimeDays').length}}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column v-for="(item,index) in tableData.PeriodArray" :key="index" width="108" sortable :sort-by="'DaysCountByPeriodId_'+item.id" :class-name="item.IsDisplay?'isPrint':''">
                <template slot="header">
                    <div class="cell_th" @click.stop="switchDisplay(item)">{{item.name}}</div>
                </template>
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="props.row['DaysCountByPeriodId_'+item.id]==0" trigger="hover" :open-delay="1000" popper-class="schedulePopper">
                        <ol>
                            <li v-for="(val,idx) in countDaysByPeriodId(props.row,item.id)" :key="idx">
                                <span class="popover_day">{{val.Day+'日：'}}</span>
                                <b>{{val.PeriodName}}</b>
                            </li>
                        </ol>
                        <div slot="reference">{{countDaysByPeriodId(props.row,item.id).length}}</div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 打印预览 -->
        <PrintPreview v-if="isShowPrintView"></PrintPreview>
    </transition>
</div>
</template>

<script>
import '@/plugins/hiprint/jquery.min.js';
import '@/plugins/hiprint/jquery.minicolors.min.js';
import {
    hiprint
} from '@/plugins/hiprint/hiprint.bundle.js';
import '@/plugins/hiprint/jquery.hiwprint.js';
import PrintPreview from '@/components/common/PrintPreview';
export default {
    inject: ['closeStatisticalTable'],
    props: {
        tableData: Object,
    },
    data() {
        return {
            tableHeight: window.innerHeight - 200,
            isShowPrintView: false,
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
                            "top": 35,
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
        PrintPreview,
    },
    provide() {
        return {
            closePrintView: this.closePrintView,
            startPrinting: this.startPrinting,
            printDesign: this.printDesign,
            rotatePrintPaper: this.rotatePrintPaper,
        }
    },
    created() {
        this.tableData.Staffs.forEach(element => {
            element.WorkDays = 0;
            element.VacationDays = 0;
            element.WorkOverTimeDays = 0;
            this.tableData.PeriodArray.forEach(item => {
                element['DaysCountByPeriodId_' + item.id] = 0;
                item.IsDisplay = true;
            });
        });
    },
    mounted() {

    },
    methods: {
        //切换是否打印
        switchDisplay(item) {
            item.IsDisplay = !item.IsDisplay;
            this.$forceUpdate()

        },
        //打印预览
        printView() {
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
            }, {
                "title": "常日班",
                "field": "WorkDays",
                "width": 200,
                "colspan": 1,
                "align": "center",
                "rowspan": 1
            }, {
                "title": "休假",
                "field": "VacationDays",
                "width": 200,
                "colspan": 1,
                "align": "center",
                "rowspan": 1
            }, {
                "title": "备班",
                "field": "WorkOverTimeDays",
                "width": 200,
                "colspan": 1,
                "align": "center",
                "rowspan": 1
            }];
            this.tableData.PeriodArray.forEach(element => {
                if (element.IsDisplay) {
                    printTablefields.push({
                        "title": element.name,
                        "field": "DaysCountByPeriodId_" + element.id,
                        "width": 200,
                        "colspan": 1,
                        "align": "center",
                        "rowspan": 1
                    })
                }
            });
            this.customPrintJson.panels[0].printElements[0].options.columns[0] = printTablefields;
            this.customPrintJson.panels[0].printElements.push({
                "options": {
                    "left": 10,
                    "top": 5,
                    "height": 25,
                    "width": 259,
                    "title": `${this.tableData.Name}         ${this.tableData.YearMonth}统计表`,
                    "fontSize": 19,
                    "fontWeight": "600",
                    "textAlign": "center",
                    "lineHeight": 26
                },
                "printElementType": {
                    "title": "自定义文本",
                    "type": "text"
                }
            });
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
            if (this.hiprintTemplate.getOrient() === 1) {
                this.rotatePrintPaper();
            }
        },
        //关闭预览
        closePrintView() {
            this.isShowPrintView = false;
        },
        //旋转打印纸张
        rotatePrintPaper() {
            this.hiprintTemplate.rotatePaper();
        },
        //开始打印
        startPrinting() {
            this.$refs.statisticalTable.tableData.forEach((element, index) => {
                element.Index = index + 1;
            });
            this.printData.table = this.$refs.statisticalTable.tableData;
            this.hiprintTemplate.print(this.printData);
        },
        //通过PeriodType计算天数
        countDaysByPeriodType(row, val, type) {
            let filteredArr = row.Periods.filter(element => {
                return element.PeriodType == val
            });
            row[type] = filteredArr.length;
            return filteredArr;
        },
        //通过PeriodId计算天数
        countDaysByPeriodId(row, id) {
            let filteredArr = row.Periods.filter(element => {
                return element.PeriodId == id;
            });
            row['DaysCountByPeriodId_' + id] = filteredArr.length;
            return filteredArr;
        }
    },
}
</script>

<style lang="scss">
#statisticalTable {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 10;

    .staticstical_container {
        position: absolute;
        top: 50px;
        bottom: 50px;
        left: 0;
        right: 0;
        margin: auto;
        width: 1200px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
        border: 1px solid rgba(0, 0, 0, .2);

        .closeStatisticalTable {
            position: absolute;
            right: -13px;
            top: -15px;
            width: 30px;
            height: 30px;
            background: url("../../assets/images/close_green.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
        }

        .staticstical_title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .el-button {
                line-height: 40px;
                width: 120px;
                font-size: 18px;
                background: #fff;
                color: #00C16B;
                border-color: #00C16B;
            }
        }

        .el-table {
            cursor: pointer;

            thead {
                th {
                    text-align: center;
                    font-size: 18px;
                    color: #878D9F;
                    line-height: 34px;
                    position: relative;
                    padding: 0;

                    &.periodTypeColumn {
                        background: lightblue;
                    }

                    &.isPrint {
                        .cell {
                            &::after {
                                content: '';
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 40px;
                                height: 20px;
                                background: url(../../assets/images/cellHead.png);
                                background-size: 100% 100%;
                            }
                        }
                    }

                    .cell {
                        padding: 5px 0;
                        display: flex;
                        white-space: nowrap;
                        align-items: center;
                        justify-content: center;
                        padding: 0;

                        .cell_th {
                            padding: 0 0 0 10px;
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

                        &.periodTypeColumn {
                            background: lightblue;
                        }

                        .cell {
                            text-align: center;
                            padding: 0;
                            user-select: none;
                            white-space: nowrap;
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
</style>
