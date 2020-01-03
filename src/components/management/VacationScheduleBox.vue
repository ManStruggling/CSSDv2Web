<template>
<div id="vacationScheduleBox">
    <div class="container">
        <div class="content">
            <ul>
                <li>
                    <p>班表名称</p>
                    <el-input v-model.trim="submitData.Name" placeholder="请填写班表名称"></el-input>
                </li>
                <li>
                    <p>备注</p>
                    <el-input type="textarea" v-model.trim="submitData.Remark" placeholder="请填写备注" resize="none"></el-input>
                </li>
            </ul>
            <div class="selectedDate">
                <el-date-picker v-model="submitData.StartEndDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" @change="startEndDateChange" :picker-options="{
                        disabledDate:disabledDate
                    }">
                </el-date-picker>
            </div>
            <el-transfer v-model="submitData.Filters" :props="{
                key: 'id',
                label: 'name'
                }" :data="vacationPeriods" :titles="['未选班表参数', '已选班表参数']"></el-transfer>
        </div>
        <div class="opration">
            <p></p>
            <p>
                <el-button @click="cancelSubmit">取消</el-button>
                <el-button type="primary" @click="submitConfirm">保存</el-button>
            </p>
        </div>
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
    props: {
        viewModule: Object
    },
    data() {
        return {
            submitData: {
                Name: '',
                StartEndDate: '',
                Remark: '',
                Filters: []
            },
            vacationPeriods: [],
            schedules: []
        }
    },
    created() {
        axios({
            url: '/schedule',
            method: 'POST',
            data: {
                query: `query getVacationPeriods{ 
                    period(periodType:1){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    schedule(locationId:${this.GLOBAL.UserInfo.ClinicId}){
                        id,name,yearMonth
                    }
                }`
            }
        }).then(res => {
            this.vacationPeriods = res.data.data.period;
            this.schedules = res.data.data.schedule;
        }).catch(err => {})
        //update
        if (this.viewModule.id) {
            this.submitData = JSON.parse(decode(this.viewModule.commandViewData));
            this.submitData.Id = this.viewModule.id;
            this.submitData.StartEndDate = this.submitData.StartEndDate.split('~');
        } else {
            //insert
        }
    },
    mounted() {

    },
    methods: {
        //确认提交
        submitConfirm() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.submitData.Name,
                    type: 'StringNotEmpty',
                    msg: '班表名称不能为空！'
                }, {
                    val: this.submitData.StartEndDate,
                    type: 'StringNotEmpty',
                    msg: '起止日期不能为空！'
                }])) {
                this.submitData.StartEndDate = `${this.submitData.StartEndDate[0]}~${this.submitData.StartEndDate[1]}`;
                let method = 'POST';
                if (this.viewModule.id) {
                    method = 'PUT';
                }
                axios({
                    url: `/api/VacationSchedule`,
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
                }).catch(err => {})
            }
        },
        //取消提交
        cancelSubmit() {
            this.$emit('to-father');
        },
        //起止日期change事件
        startEndDateChange(val) {
            let startDate = new Date(val[0]);
            let endDate = new Date(val[1]);
            let startDateYear = startDate.getFullYear();
            let startDateMonth = startDate.getMonth();
            let endDateYear = endDate.getFullYear();
            let endDateMonth = endDate.getMonth();
            if (new Date(startDateYear, startDateMonth, 1).getMonth() != new Date(endDateYear, endDateMonth, 1).getMonth() && new Date(startDateYear, startDateMonth + 1, 1).getMonth() != new Date(endDateYear, endDateMonth, 1).getMonth()) {
                this.submitData.StartEndDate = '';
                this.showInformation({
                    classify: 'message',
                    msg: '起止日期最多跨一个月份！'
                })
            }
        },
        disabledDate(time) {
            for (let i = 0; i < this.schedules.length; i++) {
                if (new Date(time.getTime() + 24 * 3600 * 1000).toJSON().substring(0, 7) == this.schedules[i].yearMonth) {
                    return true;
                }
            }
        },
    }
}
</script>

<style lang="scss">
#vacationScheduleBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    z-index: 10;
    background: rgba(51, 51, 51, 0.6);

    .container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 60px;
        top: 40px;
        margin: auto;
        width: 772px;
        background: #fff;
        border-radius: 8px;
        padding-bottom: 60px;
        box-sizing: border-box;

        .content {
            height: 100%;
            overflow-y: auto;

            ul {
                padding: 20px 30px 0;

                li {
                    display: flex;
                    margin-bottom: 20px;

                    p {
                        font-size: 16px;
                        color: #878D9F;
                        line-height: 40px;
                        width: 64px;
                        text-align: right;
                        margin-right: 10px;
                    }

                    .el-input {
                        width: 226px;
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }

                    .el-textarea {
                        width: 638px;
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
            }

            .selectedDate {
                border-top: 1px solid #F2F4F7;
                padding: 20px 0 20px 30px;

                .el-date-editor {
                    input {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }

                    .el-range-separator {
                        font-size: 16px;
                        color: #878D9F;
                    }
                }
            }

            .el-transfer {
                padding: 0 30px 20px;

                .el-transfer-panel {
                    width: 300px;
                    height: 400px;

                    .el-transfer-panel__header {
                        .el-checkbox__label {
                            font-size: 16px;
                            color: #878D9F;

                            span {
                                font-size: 16px;
                            }
                        }
                    }

                    .el-transfer-panel__body {
                        .el-checkbox__label {
                            span {
                                font-size: 18px;
                                font-weight: bold;
                                color: #232E41;
                            }
                        }

                        .el-transfer-panel__empty {
                            font-size: 16px;
                            color: #878D9F;
                        }
                    }

                    .el-checkbox__inner {
                        height: 16px;
                        width: 16px;
                    }
                }

                .el-transfer__buttons {

                    .el-transfer__button {
                        border: 0;
                        width: 32px;
                        height: 32px;
                        background-color: #00C16B;
                        background-size: 10px 20px;
                        background-repeat: no-repeat;

                        &.is-disabled {
                            background-color: #ccc;
                        }

                        i {
                            display: none;
                        }

                        &:nth-child(1) {
                            background-image: url(../../assets/images/arrow_white_left.png);
                            background-position: 9px center;
                        }

                        &:nth-child(2) {
                            background-image: url(../../assets/images/arrow_white_right.png);
                            background-position: 12px center;
                        }
                    }
                }
            }
        }

        .opration {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            height: 60px;
            box-shadow: 0px 0px 20px 0px rgba(0, 54, 125, 0.2);
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 0 0 8px 8px;

            .el-button {
                font-size: 20px;
                font-weight: bold;
                border: 0;
            }

            .el-button--default {
                background: #fff;
                color: #00C16B;
            }

            .el-button--primary {
                width: 150px;
                height: 40px;
                background: #00C16B;
                color: #fff;
                margin: 0 40px;
            }
        }

    }
}
</style>
