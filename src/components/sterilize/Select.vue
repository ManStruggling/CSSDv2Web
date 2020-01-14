<template>
<div class="cssd_box deviceSelect">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <router-link to="/sterilize/ready" tag="li">
                <p>灭菌准备</p>
            </router-link>
            <router-link to="/sterilize/check" tag="li">
                <p>灭菌审核</p>
            </router-link>
            <router-link to="/sterilize/substitutionPackage" tag="li" v-if="GLOBAL.UserInfo.Configuration.IsProxyProductPrintBarCode">
                <p>代消包打印</p>
            </router-link>
            <router-link to="/sterilize/record" tag="li">
                <p>灭菌记录</p>
            </router-link>
        </ul>
        <span></span>
    </div>
    <div class="device_select_container">
        <ul>
            <li v-for="(item,index) in deviceList" :key="index">
                <div class="device_box">
                    <dl class="clear_float">
                        <dt>
                            <h3>{{item.SterilizeDeviceName}}</h3>
                            <div class="devicePot clear_float">
                                <p>
                                    <span>总锅次:</span>
                                    <u>{{item.SterilizeTotalBatch}}</u>
                                </p>
                                <p>
                                    <span>当日锅次:</span>
                                    <u>{{item.SterilizeTodayBatch}}</u>
                                </p>
                            </div>
                        </dt>
                        <dd v-if="item.Status!=2?true:false">
                            <div class="deviceTimebox clear_float">
                                <b>{{GLOBAL.timeFormatDuring(item.CurrentTime)}}</b>
                                <el-button @click="resetDeviceTime(index)" :disabled="item.Status==0?true:false" class="resetTImeBtn"></el-button>
                            </div>
                        </dd>
                        <dd class="clear_float" v-if="item.Status==2?true:false">
                            <div class="deviceTimebox clear_float" style="float:right;">
                                <b class="progError">程序出错</b>
                                <el-button @click="resetDeviceStatus(index)" class="resetTImeBtn"></el-button>
                            </div>
                        </dd>
                    </dl>
                    <ol class="clear_float">
                        <li v-for="(val,idx) in item.SterilizePrograms" :key="idx">
                            <el-button :disabled="item.Status==0?false:true" @click="selectProgram(index,idx)">{{val.IsDbTestProgram?`${val.ProgramName}(BD测试程序)`:val.ProgramName}}</el-button>
                        </li>
                    </ol>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    inject: ['reload'],
    data() {
        return {
            deviceList: []
        };
    },
    created() {
        axios({
                url: `/api/Sterilize/SterilizeDevices`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.deviceList = res.data.Data;
                    //开启计时器do countdown
                    this.deviceList.forEach((val, index) => {
                        if (val.CurrentTime > 0) {
                            val['Countdown' + index] = setInterval(() => {
                                val.CurrentTime--
                                if (val.CurrentTime <= 0) {
                                    clearInterval(val['Countdown' + index]);
                                    this.reload();
                                }
                            }, 1000);
                        }
                    });
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
    },
    mounted() {},
    beforeDestroy() {
        //清除计时器
        this.deviceList.forEach((val, index) => {
            clearInterval(val['Countdown' + index]);
        })
    },
    methods: {
        //选择程序
        selectProgram(index, idx) {
            this.$router.push({
                path: "/sterilize/registration",
                query: {
                    deviceName: this.deviceList[index].SterilizeDeviceName,
                    deviceId: this.deviceList[index].SterilizeDeviceId,
                    programName: this.deviceList[index].SterilizePrograms[idx].ProgramName,
                    programId: this.deviceList[index].SterilizePrograms[idx].ProgramId,
                    isDbTestProgram: this.deviceList[index].SterilizePrograms[idx].IsDbTestProgram
                }
            });
        },
        //重置设备状态
        resetDeviceStatus(index) {
            this.deviceList[index].Status = 0;
        },
        //归零
        resetDeviceTime(index) {
            axios({
                url: `/api/Sterilize/ReturnDeviceTimeToZero/${this.deviceList[index].SterilizeDeviceId}`
            }).then(res => {
                let type;
                if (res.data.Code == 200) {
                    type = 'success';
                    this.reload();
                } else {
                    type = 'error';
                }
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg,
                    type: type
                });
            }).catch(err => {

            })
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdDeviceSelect";
</style>
