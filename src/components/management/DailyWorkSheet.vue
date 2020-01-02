<template>
<div class="basic_main" id="dailyWorkSheet">
    <div class="content">
        <div class="title">
            <p>
                <el-select class="green24x13" v-model="selectedSchedule" @change="scheduleChange">
                    <el-option v-for="(item,index) in schedules" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </p>
            <p>
                <span>签到</span>
                <el-switch v-model="isCheckInMode" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false"></el-switch>
            </p>
        </div>
        <el-table :data="submitData.Staffs" border :height="tableHeight" style="width:100%;" v-show="submitData.Days!=''">
            <el-table-column label="序号" fixed width="80">
                <template slot-scope="props">{{props.$index+1}}</template>
            </el-table-column>
            <el-table-column label="姓名" prop="StaffName" fixed></el-table-column>
            <el-table-column v-for="(item,index) in submitData.Days" :key="index" :label="item.day+'日'" :class-name="item.isWeekend?'is-weekend':''">
                <template slot-scope="props">
                    <el-popover placement="right" :disabled="props.row.Periods[index].PeriodId==0" trigger="hover" :open-delay="1500" @show="displayPopover(props.row.Periods[index])" popper-class="schedulePopper">
                        <ol>
                            <li><span>开始时间：</span><b>{{formatTime(displayedPeriodMsg.startTime)}}</b></li>
                            <li><span>结束时间：</span><b>{{formatTime(displayedPeriodMsg.endTime)}}</b></li>
                            <li><span>午餐：</span><b>{{displayedPeriodMsg.isIncludeLunch?'有':'无'}}</b></li>
                        </ol>
                        <div slot="reference" class="periodItem" :class="{'is-cell-active':props.row.Periods[index].IsCellActive,'is-checked':props.row.Periods[index].IsCheckIn}" @click="tableCellClick(props.row.Periods[index])">{{matchingPeriodName(props.row.Periods[index])}}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="工作区域" :width="getMaxLength(submitData.Staffs)">
                <template slot-scope="props">
                    <div class="workAreaItem">{{props.row.WorkAreaString}}</div>
                </template>
            </el-table-column>
        </el-table>
        <p class="remark" v-show="submitData.Days!=''">注：{{submitData.Remark}}</p>
    </div>
    <div class="bottom_option">
        <p></p>
        <p>
            <el-button type="primary" @click="checkInSubmit">签到</el-button>
        </p>
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
    data() {
        return {
            tableHeight: window.innerHeight - 240,
            selectedSchedule: '',
            isCheckInMode: false, //签到模式
            submitData: {
                Staffs: [],
                Days: [],
                Remark: '',
            },
            periods: [],
            schedules: [], //班表列表
            displayedPeriodMsg: {
                startTime: '',
                endTime: '',
                isIncludeLunch: false,
            }
        }
    },
    created() {
        axios({
            url: `/schedule`,
            method: 'POST',
            data: {
                query: `
                    query getInitData{ 
                        Periods:period{
                            id,name,color,startTime,endTime,isIncludeLunch
                        }
                    }`
            }
        }).then(res => {
            this.periods = res.data.data.Periods;
        }).catch(err => {});
        axios({
            url: `/schedule`,
            method: 'POST',
            data: {
                query: `query getSchedules{ 
                schedule(locationId:${this.GLOBAL.UserInfo.ClinicId}){
                    id,name,yearMonth
                }
            }`
            }
        }).then(res => {
            this.schedules = res.data.data.schedule;
        }).catch(err => {});
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
                    query: ` query storedEvent{ 
                                storedEvent(aggregateId:${val},aggregate:"Schedule",getLast:1){
                                    id,commandViewData
                                }
                            }`,
                }
            }).then(res => {
                this.submitData = JSON.parse(decode(res.data.data.storedEvent[0].commandViewData));
                this.submitData.Id = val;
            }).catch(err => {});
        },
        //cell click事件
        tableCellClick(obj) {
            if (this.isCheckInMode && obj.PeriodId) {
                obj.IsCheckIn = !obj.IsCheckIn;
            }
        },
        //签到提交
        checkInSubmit() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.selectedSchedule,
                    type: 'StringNotEmpty',
                    msg: '还未选择班表，请选择班表！'
                }])) {
                axios({
                    url: `/api/PlanDailySchedule`,
                    method: 'PUT',
                    data: this.submitData
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = 'success';
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
        //匹配班种显示的名称
        matchingPeriodName(periodObj) {
            let filteredArray = this.periods.filter(element => {
                return element.id === periodObj.PeriodId;
            });
            return filteredArray.length > 0 ? filteredArray[0].name : '';
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

#dailyWorkSheet {
    position: relative;
    padding: 30px 0 70px;
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
                    text-align: center;
                    font-size: 18px;
                    color: #878D9F;

                    &.is-weekend {
                        background: #E0FFF1;
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

                                &.is-checked {
                                    background-image: url('../../assets/images/isChecked.png');
                                    background-size: 30px 30px;
                                    background-repeat: no-repeat;
                                    background-position: 40px center;
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

        p.remark {
            font-size: 14px;
            color: #878D9F;
            padding: 10px 0;
            line-height: 20px;
        }

    }

    .bottom_option {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 60px;
        box-shadow: 0px 0px 20px 0px rgba(0, 54, 125, 0.2);
        padding: 0 40px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        z-index: 4;

        .el-button--primary {
            background: #00C16B;
            line-height: 40px;
            color: #fff;
            border: 0;
            width: 150px;
            font-size: 20px;
            font-weight: bold;
        }
    }
}
</style>
