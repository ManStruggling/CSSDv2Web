<template>
<div class="cssd_box" id="deviceRegistration">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <li @click="handleShowManualEnter">
                <p>条码手工录入</p>
            </li>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>待清洗网篮</span>:
                <b>{{cleanableCarriers.length}}</b>
                <a @click="handleShowCleanableCarriers">查看</a>
            </p>
            <p class="photoEdit">
                <span>照片</span>:
                <b>{{computedPhotoNumber}}</b>
                <a @click="handleShowPhotos">编辑</a>
            </p>
            <b>{{submitData.DeviceModelName}}:{{submitData.DeviceModelProgramName}}</b>
            <a @click="reSelect">重新选择</a>
        </div>
    </div>
    <div class="cssd_table_center deviceRegistrationCenter tabs_totalBar cssd_totalBar">
        <el-tabs type="border-card" :tab-position="'left'" v-model="activeName">
            <el-tab-pane v-for="(item,index) in submitData.Carriers" :key="index" :name="index+''">
                <div slot="label" class="tab_title">
                    <p>{{item.Name}}</p>
                    <span @click="deleteThisCarrier(index)"></span>
                </div>
                <div class="tab_content table_unExpand">
                    <el-table :data="item.PackageBarCodeDetailList">
                        <el-table-column label="包名称" prop="Name" width="240"></el-table-column>
                        <el-table-column label="回收科室" prop="ProvideSubClinicName" width="210"></el-table-column>
                        <el-table-column label="数量" prop="Quantity" width="100"></el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="cssd_table_bottom">
            <p>
                共计
                <span>{{countPackageNumber(submitData.Carriers)}}</span> 包
            </p>
            <p>
                <el-button @click="cancelChange" v-if="cleanRecordModle">取消修改</el-button>
                <el-button type="primary" @click="cleanSubmit">{{cleanRecordModle?'修改完成':'开始清洗'}}</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :BarCodeList="submitData.Carriers" :ApiUrl="'/api/Scanner/Clean'"></ManualEnter>
    </transition>
    <!-- 重选清洗程序 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <CleanSelectBox v-if="isShowCleanSelect" @to-father="deviceProgram2father" :mode="cleanRecordModle" :OriginDeviceId="submitData.OriginDeviceId"></CleanSelectBox>
    </transition>
    <!-- 照片 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="submitData.Pictures"></PhotoView>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 可清洗网篮 -->
        <CleanableCarriers v-if="isShowCleanableCarriers" @cleanFailed-to-father="viewCleanableCarriers" :data="cleanableCarriers"></CleanableCarriers>
    </transition>
</div>
</template>

<script>
import PhotoView from "../common/PhotoView";
import ManualEnter from "../common/ManualEnter";
import CleanSelectBox from "./CleanSelectBox";
import CleanableCarriers from "./CleanableCarriers";
export default {
    data() {
        return {
            cleanableCarriers: [], //清洗失败的网篮
            activeName: "0",
            isShowPhoto: false, //显示照片
            isShowManualEnter: false, //显示手工录入
            isShowCleanSelect: false, //显示清洗程序
            isShowCleanableCarriers: false, //显示可清洗网篮
            cleanRecordModle: false, //清洗修改模式
            submitData: {
                OriginDeviceId: 0,
                DeviceModelName: this.$route.query.deviceName,
                DeviceModelId: this.$route.query.deviceId - 0,
                DeviceModelProgramName: this.$route.query.programName,
                DeviceModelProgramId: this.$route.query.programId - 0,
                Carriers: [],
                Pictures: []
            }
        };
    },
    components: {
        ManualEnter,
        CleanSelectBox,
        PhotoView,
        CleanableCarriers
    },
    created() {
        CSManager.handleDataThis = this;
        if (this.$route.query.recordId) {
            this.cleanRecordModle = true;
            axios({
                    url: `/api/Clean/PendingUpdateCleanRecord/${this.$route.query.recordId}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        let data = res.data.Data;
                        this.submitData.DeviceModelName = data.DeviceModelName;
                        this.submitData.DeviceModelId = data.DeviceModelId;
                        this.submitData.OriginDeviceId = data.DeviceModelId;
                        this.$route.query.deviceId = data.DeviceModelId;
                        this.submitData.DeviceModelProgramName = data.DeviceModelProgramName;
                        this.submitData.DeviceModelProgramId = data.DeviceModelProgramId;
                        this.$route.query.programId = data.DeviceModelProgramId;
                        this.submitData.CleanTaskId = data.CleanTaskId;
                        this.submitData.Carriers = data.CarrierForCleanVms;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                })
                .catch(err => {});
        }
        axios({
                url: `/api/Clean/CleanableCarriers`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.cleanableCarriers = res.data.Data;
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
        CSManager.handleDataThis = null;
    },
    methods: {
        //挂载可清洗网篮
        handleShowCleanableCarriers() {
            this.isShowCleanableCarriers = true;
        },
        //查看可被清洗的网篮
        viewCleanableCarriers(data) {
            this.isShowCleanableCarriers = false;
            if (data) {
                data.forEach(element => {
                    this.handleBarCode(element);
                });
            }
        },
        //处理显示图片
        handleShowPhotos(index) {
            this.isShowPhoto = true;
        },
        //照片数据通信
        viewPhotoToFather() {
            this.isShowPhoto = false;
        },
        //返回
        goBack() {
            if (this.cleanRecordModle) {
                this.$router.push("/clean/record");
            } else {
                this.$router.push("/clean/select");
            }
        },
        //取消修改
        cancelChange() {
            this.$router.push(`/clean/record`);
        },
        //处理手工录入
        handleShowManualEnter() {
            this.isShowManualEnter = true;
        },
        //开始清洗
        cleanSubmit() {
            let url = "";
            let method = "";
            if (this.cleanRecordModle) {
                url = `/api/Clean/CleanRecordModify`;
                method = "PUT";
            } else {
                url = "/api/Clean/CleanComplete";
                method = "POST";
            }
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.submitData.Carriers,
                    type: "ArrayNotEmpty",
                    msg: "请至少清洗一个网篮！"
                }])
            ) {
                axios({
                        url: url,
                        method: method,
                        data: this.submitData
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            if (method == "POST") {
                                this.$router.push({
                                    path: "/clean/select"
                                });
                            } else if (method == "PUT") {
                                this.$router.push({
                                    path: "/clean/record"
                                });
                            }
                        } else {
                            type = "error";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        });
                    })
                    .catch(err => {});
            }
        },
        //重新选择
        reSelect() {
            this.isShowCleanSelect = true;
        },
        //手工录入接收数据
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {
                data.CarrierBarCodeScannerVm.PackageBarCodeDetailList = data.Packages;
                this.submitData.Carriers.push(data.CarrierBarCodeScannerVm);
                this.activeName = this.submitData.Carriers.length - 1 + "";
            }
        },
        //重选设备程序组件接收数据
        deviceProgram2father(data) {
            this.isShowCleanSelect = false;
            if (data) {
                this.submitData.DeviceModelName = data.DeviceName;
                this.$route.query.deviceName = data.DeviceName;
                this.submitData.DeviceModelId = data.DeviceId;
                this.$route.query.deviceId = data.DeviceId;
                this.submitData.DeviceModelProgramName = data.ProgramName;
                this.$route.query.programName = data.ProgramName;
                this.submitData.DeviceModelProgramId = data.ProgramId;
                this.$route.query.programId = data.ProgramId;
            }
        },
        //删除网篮
        deleteThisCarrier(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该网篮?',
                confirmCallBack: () => {
                    this.submitData.Carriers.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //添加数据处理
        handleBarCode(msg) {
            let onOff = true;
            this.submitData.Carriers.forEach(item => {
                //发现已录入
                if (item.BarCode == msg.toUpperCase()) {
                    this.showInformation({
                        classify: "message",
                        msg: "该条码已录入！",
                        type: "warning"
                    });
                    onOff = false;
                    return;
                }
            });
            if (onOff) {
                axios({
                        url: `/api/Scanner/Clean/${msg}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            this.packageData2father(res.data.Data);
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    })
                    .catch(err => {});
            }
        }
    },
    computed: {
        //计算本次清洗总包数量
        countPackageNumber() {
            return list => {
                let num = 0;
                for (let i = 0; i < list.length; i++) {
                    for (let j = 0; j < list[i].PackageBarCodeDetailList.length; j++) {
                        num += list[i].PackageBarCodeDetailList[j].Quantity;
                    }
                }
                this.submitData.CleanQuantity = num;
                return num;
            };
        },
        //计算照片数量
        computedPhotoNumber() {
            return this.submitData.Pictures == null ?
                0 :
                this.submitData.Pictures.length;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tabsTotalBar";
@import "../../assets/css/tableUnExpand";

#deviceRegistration {
    .el-tabs__item {
        height: 80px;
        padding: 0 10px 0 20px;

        &:hover {
            .tab_title {
                span {
                    display: block;
                }
            }
        }

        .tab_title {
            display: flex;
            justify-content: space-between;
            align-items: center;

            p {
                font-size: 20px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(255, 255, 255, 1);
                line-height: 80px;
            }

            span {
                width: 16px;
                height: 16px;
                background: url("../../assets/images/close.png");
                display: none;
            }
        }
    }

    .el-table {
        tbody {
            .cell {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(35, 46, 65, 1);
            }
        }
    }

    .cssd_title_right {
        p {
            margin-right: 40px;
        }

        b {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(208, 212, 218, 1);
            line-height: 24px;
        }

        a {
            cursor: pointer;
            margin-left: 10px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: rgba(0, 193, 107, 1);
            line-height: 24px;
        }
    }
}
</style>
