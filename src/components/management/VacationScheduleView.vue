<template>
<div class="basic_main" id="vacationScheduleView">
    <div class="content">
        <div class="title">
            <p>
                <el-select class="green24x13" v-model="selectedVacationSchedule" @change="scheduleChange">
                    <el-option v-for="(item,index) in vacationSchedules" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </p>
        </div>
        <el-table :data="displayData" border :height="tableHeight" style="width:100%;" v-show="submitData.Days!=''">
            <el-table-column label="序号" fixed width="80">
                <template slot-scope="props">{{props.$index+1}}</template>
            </el-table-column>
            <el-table-column label="姓名" prop="StaffName" fixed></el-table-column>
            <el-table-column v-for="(item,index) in submitData.Days" :key="index" :label="item.day+'日'" :class-name="item.isWeekend?'is-weekend':''">
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="!props.row.Periods[index]||props.row.Periods[index].PeriodId==0?true:false" trigger="hover" :open-delay="1500" @show="displayPopover(props.row.Periods[index])" popper-class="schedulePopper">
                        <ol>
                            <li><span>开始时间：</span><b>{{formatTime(displayedPeriodMsg.startTime)}}</b></li>
                            <li><span>结束时间：</span><b>{{formatTime(displayedPeriodMsg.endTime)}}</b></li>
                            <li><span>午餐：</span><b>{{displayedPeriodMsg.isIncludeLunch?'有':'无'}}</b></li>
                        </ol>
                        <div slot="reference" class="periodItem">{{matchingPeriodName(props.row.Periods[index])}}</div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <p class="remark" v-show="submitData.Days!=''">注：{{submitData.Remark}}</p>
    </div>
</div>
</template>

<script>
import {
    MessagePack
} from 'assert';
import {
    decode
} from '@msgpack/msgpack';
export default {
    inject: ['managementReload'],
    data() {
        return {
            tableHeight: window.innerHeight - 180,
            selectedVacationSchedule: '',
            submitData: {
                Staffs: [],
                Days: [],
                Remark: '',
            },
            periods: [],
            vacationSchedules: [], //班表列表
            displayedPeriodMsg: {
                startTime: '',
                endTime: '',
                isIncludeLunch: false,
            },
            filters: []
        }
    },
    created() {
        axios({
            url: `/schedule`,
            method: 'POST',
            data: {
                query: `
                    query TestQuery{ 
                        period{
                            id,name,color,startTime,endTime,isIncludeLunch
                        }
                    }`
            }
        }).then(res => {
            this.periods = res.data.data.period;
        }).catch(err => {});
        axios({
            url: `/schedule`,
            method: 'POST',
            data: {
                query: `query getVacationSchedules{
                    vacationSchedule(locationId:${this.GLOBAL.UserInfo.ClinicId}){
                        id,name,startEndDate,remark
                    }
                }`
            }
        }).then(res => {
            this.vacationSchedules = res.data.data.vacationSchedule;
        }).catch(err => {})
    },
    methods: {
        //显示popover详情
        displayPopover(obj) {
            if (obj.PeriodId) {
                Object.assign(this.displayedPeriodMsg, this.periods.filter(element => {
                    return element.id === obj.PeriodId
                })[0]);
            }
        },
        //schedule change事件
        scheduleChange(val) {
            axios({
                url: `/system`,
                method: 'POST',
                data: {
                    query: `query storedEvent{ 
                                storedEvent(aggregateId:${val},aggregate:"VacationSchedule",getLast:1){
                                    id,commandViewData
                                }
                            }`,
                }
            }).then(res => {
                let vacationViewData = JSON.parse(decode(res.data.data.storedEvent[0].commandViewData));
                this.filters = vacationViewData.Filters;
                let startDate = vacationViewData.StartEndDate.split('~')[0];
                let endDate = vacationViewData.StartEndDate.split('~')[1];
                if (new Date(startDate).getMonth() == new Date(endDate).getMonth()) {
                    this.requestDateAccordingToSameDate(startDate.split('-')[0], startDate.split('-')[1], startDate.split('-')[2], endDate.split('-')[2])
                } else {
                    this.requestDataAccordingToDifferentDate(startDate.split('-'), endDate.split('-'));
                }
            }).catch(err => {});
        },
        //按同月份日期请求数据
        requestDateAccordingToSameDate(year, month, startDay, endDay) {
            axios({
                url: '/schedule',
                method: 'POST',
                data: {
                    query: `query getSchedule{
                            schedule(locationId:${this.GLOBAL.UserInfo.ClinicId},yearMonth:"${year}-${month}"){
                                id
                            }
                        }`
                }
            }).then(res => {
                let aggregateId = res.data.data.schedule[0].id;
                axios({
                    url: '/system',
                    method: 'POST',
                    data: {
                        query: `query getViewData{
                                storedEvent(aggregateId:${aggregateId},aggregate:"schedule",getLast:1){
                                    id,commandViewData
                                }
                            }`
                    }
                }).then(res => {
                    let viewData = JSON.parse(decode(res.data.data.storedEvent[0].commandViewData));
                    viewData.Days.splice(endDay);
                    viewData.Days.splice(0, startDay - 1);
                    viewData.Days.forEach(element => {
                        element.day = `${month}.${element.day}`;
                    });
                    viewData.Staffs.forEach(element => {
                        element.Periods.splice(endDay);
                        element.Periods.splice(0, startDay - 1);
                    });
                    this.submitData = viewData;
                    this.submitData.Remark = this.vacationSchedules.filter(element => element.id == this.selectedVacationSchedule)[0].remark;
                })
            }).catch(() => {})
        },
        //按不同月份日期请求数据
        requestDataAccordingToDifferentDate([startYear, startMonth, startDay], [endYear, endMonth, endDay]) {
            let that = this;
            this.$http.all([
                axios({
                    url: '/schedule',
                    method: 'POST',
                    data: {
                        query: `query getSchedule{
                                schedule(locationId:${this.GLOBAL.UserInfo.ClinicId},yearMonth:"${startYear}-${startMonth}"){
                                    id
                                }
                            }`
                    }
                }),
                axios({
                    url: '/schedule',
                    method: 'POST',
                    data: {
                        query: `query getSchedule{
                                schedule(locationId:${this.GLOBAL.UserInfo.ClinicId},yearMonth:"${endYear}-${endMonth}"){
                                    id
                                }
                            }`
                    }
                })
            ]).then(this.$http.spread((acct, perms) => {
                let startDateAggregateId = acct.data.data.schedule[0].id;
                let endDateAggregateId = perms.data.data.schedule[0].id;
                this.$http.all([
                    axios({
                        url: '/system',
                        method: 'POST',
                        data: {
                            query: `query getViewData{
                                storedEvent(aggregateId:${startDateAggregateId},aggregate:"schedule",getLast:1){
                                    id,commandViewData
                                }
                            }`
                        }
                    }),
                    axios({
                        url: '/system',
                        method: 'POST',
                        data: {
                            query: `query getViewData{
                                storedEvent(aggregateId:${endDateAggregateId},aggregate:"schedule",getLast:1){
                                    id,commandViewData
                                }
                            }`
                        }
                    })
                ]).then(this.$http.spread((acct2, perms2) => {
                    let startDateViewData = JSON.parse(decode(acct2.data.data.storedEvent[0].commandViewData));
                    startDateViewData.Days.splice(0, startDay - 1);
                    startDateViewData.Days.forEach(element => {
                        element.day = `${startMonth}.${element.day}`;
                    });
                    let endDateViewData = JSON.parse(decode(perms2.data.data.storedEvent[0].commandViewData));
                    endDateViewData.Days.splice(endDay);
                    endDateViewData.Days.forEach(element => {
                        element.day = `${endMonth}.${element.day}`;
                    });
                    startDateViewData.Days.push(...endDateViewData.Days);
                    startDateViewData.Staffs.sort((a, b) => {
                        return a.StaffId - b.StaffId
                    });
                    endDateViewData.Staffs.sort((a, b) => {
                        return a.StaffId - b.StaffId
                    });
                    for (let i = 0; i < startDateViewData.Staffs.length; i++) {
                        startDateViewData.Staffs[i].Periods.splice(0, startDay - 1);
                        for (let j = 0; j < endDateViewData.Staffs.length; j++) {
                            endDateViewData.Staffs[j].Periods.splice(endDay);
                            if (startDateViewData.Staffs[i].StaffId === endDateViewData.Staffs[j].StaffId) {
                                startDateViewData.Staffs[i].Periods.push(...endDateViewData.Staffs[j].Periods);
                            }
                        }
                    }
                    that.submitData = startDateViewData;
                    that.submitData.Remark = that.vacationSchedules.filter(element => element.id == that.selectedVacationSchedule)[0].remark;
                }))
            }));
        },
        getViewData() {

        },
        //cell click事件
        tableCellClick(obj) {

        },
        //匹配班种显示的名称
        matchingPeriodName(periodObj) {
            if (periodObj) {
                for (let i = 0; i < this.periods.length; i++) {
                    if (this.periods[i].id == periodObj.PeriodId) {
                        return this.periods[i].name;
                    }
                }
            }
            return '';
        },
        //时间格式化
        formatTime(time) {
            let hour = Math.floor(time / 3600);
            let minute = (time % 3600) / 60;
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            return `${hour}:${minute}`;
        },
        //计算相隔整月的数量
        countIntervalFullMonthNumber(startDate, endDate) {
            //获取年,月数
            let startYear = startDate.split('-')[0] - 0;
            let startMonth = startDate.split('-')[1] - 0;
            let endYear = endDate.split('-')[0] - 0;
            let endMonth = endDate.split('-')[1] - 0;
            //通过年,月差计算月份差
            return (endYear - startYear) * 12 + (endMonth - startMonth) - 1;
        }
    },
    computed: {
        displayData() {
            if (this.filters == '') {
                return this.submitData.Staffs;
            } else {
                let arr = [];
                for (let i = 0; i < this.submitData.Staffs.length; i++) {
                    for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
                        if (this.filters.includes(this.submitData.Staffs[i].Periods[j].PeriodId)) {
                            arr.push(this.submitData.Staffs[i]);
                            break;
                        }
                    }
                }
                return arr;
            }
        }
    },
}
</script>

<style lang="scss">
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

#vacationScheduleView {
    position: relative;
    padding: 30px 0;
    overflow-y: hidden;

    .content {
        overflow-y: auto;
        height: 100%;
        padding: 0 40px;

        .title {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .el-select {
                width: 160px;

                input {
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                }
            }

            p {
                >span {
                    font-size: 18px;
                    color: #878D9F;
                    line-height: 40px;
                    margin-right: 10px;
                }

            }
        }

        .el-table {
            cursor: pointer;

            thead {
                th {
                    font-size: 18px;
                    color: #878D9F;

                    &.is-weekend {
                        background: #E0FFF1;
                    }

                    text-align: center;
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

                                &.is-checked {
                                    background-image: url('../../assets/images/isChecked.png');
                                    background-size: 30px 30px;
                                    background-repeat: no-repeat;
                                    background-position: 40px center;
                                }
                            }
                        }
                    }
                }
            }
        }

        p.remark {
            font-size: 14px;
            color: #878D9F;
            padding: 10px 0;
            line-height: 20px;
        }

    }
}
</style>
