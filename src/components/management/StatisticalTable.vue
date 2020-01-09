<template>
<div id="statisticalTable">
    <div class="staticstical_container">
        <i class="closeStatisticalTable" @click="closeStatisticalTable"></i>
        <div class="staticstical_title">
            <p></p>
            <el-button>打印预览</el-button>
        </div>
        <el-table :data="tableData.Staffs" border row-key="StaffId" style="width:100%;" :height="tableHeight" fit>
            <el-table-column label="序号" fixed width="80" type="index"></el-table-column>
            <el-table-column label="姓名" prop="StaffName"></el-table-column>
            <el-table-column label="常日班" sortable sort-by="WorkDays" class-name="periodTypeColumn">
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
            <el-table-column label="休假" sortable sort-by="VacationDays" class-name="periodTypeColumn">
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
            <el-table-column label="备班" sortable sort-by="WorkOverTimeDays" class-name="periodTypeColumn">
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
            <el-table-column v-for="(item,index) in tableData.PeriodArray" :key="index" :label="item.name" sortable :sort-by="'DaysCountByPeriodId_'+item.id">
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
</div>
</template>

<script>
export default {
    inject: ['closeStatisticalTable'],
    props: {
        tableData: Object
    },
    data() {
        return {
            tableHeight: window.innerHeight - 200,
        }
    },
    created() {
        this.tableData.Staffs.forEach(element => {
            element.WorkDays = 0;
            element.VacationDays = 0;
            element.WorkOverTimeDays = 0;
            this.tableData.PeriodArray.forEach(item => {
                element['DaysCountByPeriodId_' + item.id] = 0;
            });
        });
    },
    mounted() {

    },
    methods: {
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

                    &.periodTypeColumn {
                        background: lightblue;
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
