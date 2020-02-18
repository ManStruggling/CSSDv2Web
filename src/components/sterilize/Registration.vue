<template>
<!-- 灭菌 -->
<div class="cssd_box tabs_half_bar" id="sterilizeRegistration">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <li v-if="GLOBAL.UserInfo.Configuration.IsActiveNotBarCodeProduct" @click="handleShowCountPackages">
                <p>计数包登记</p>
            </li>
            <li @click="substitution" v-if="!GLOBAL.UserInfo.Configuration.IsProxyProductPrintBarCode">
                <p>代消包登记</p>
            </li>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>待灭菌包</span>:
                <b>{{sterilizeablePackages.length}}</b>
                <a @click="handleShowSterilizeablePackage">查看</a>
            </p>
            <p class="biologicalTest">
                <b>生物检测</b>
                <b>
                    <el-switch v-model="submitData.IsBiologicalTest" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false" :disabled="BiologicalTestForbit"></el-switch>
                </b>
            </p>
            <b>{{submitData.DeviceModelName}}:{{submitData.IsDbTestProgram?`${submitData.DeviceModelProgramName}(BD测试程序)`:submitData.DeviceModelProgramName}}</b>
            <a @click="reSelect">重新选择</a>
        </div>
    </div>
    <div :class="{cssd_table_center:true, cssd_totalBar:true, table_unExpand:true,displayNav:displayNav}">
        <div class="cssd_table_left">
            <div class="cssd_talbe_left_menu">
                <el-tabs :tab-position="'left'" :activeName="activeName" @tab-click="carrierTabClick">
                    <el-tab-pane v-for="(item,index) in submitData.Carriers" :key="index" :name="index+''">
                        <div slot="label" class="tab_title">
                            <p>{{item.Name}}</p>
                            <span @click="deleteThisCarrier(index)"></span>
                        </div>
                        <div class="tab_content">
                            <el-table :data="item.PackageBarCodeDetailList">
                                <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                                <el-table-column label="包名称" prop="ProductName" width="210" show-overflow-tooltip></el-table-column>
                                <el-table-column label="科室" prop="ProvideSubClinicName" width="210" show-overflow-tooltip></el-table-column>
                                <el-table-column label="包数量" prop="ProductQuantity" width="210"></el-table-column>
                                <el-table-column></el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs v-if="submitData.NotInCarrierPackages.length==0?false:true" :tab-position="'left'" :activeName="activeNameNotCarriersPackage" @tab-click="notCarrierTabClick">
                    <el-tab-pane>
                        <div slot="label" class="tab_title">
                            <p>无网篮包</p>
                            <span @click="deleteNotCarrierPackages"></span>
                        </div>
                        <div class="tab_content">
                            <el-table :data="submitData.NotInCarrierPackages" name="0">
                                <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                                <el-table-column label="包名称" prop="ProductName" width="210" show-overflow-tooltip></el-table-column>
                                <el-table-column label="科室" prop="ProvideSubClinicName" width="210" show-overflow-tooltip></el-table-column>
                                <el-table-column label="数量" width="100">
                                    <template slot-scope="props">
                                        <el-input-number v-if="props.row.IsNotPrintBarCode" v-model="props.row.ProductQuantity" size="mini" :min="1" :controls="false" :max="props.row.MaximumQuantity" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"></el-input-number>
                                        <div v-if="!props.row.IsNotPrintBarCode">{{props.row.ProductQuantity}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="props">
                                        <el-button @click="deletepackage(props.$index)" size="mini">删除</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column></el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="shrinkNavBox">
                    <div class="border_div"></div><i @click="displayNav=!displayNav" class="el-icon-d-arrow-left"></i>
                </div>
                <div class="expandNavBox" @click="displayNav=!displayNav"></div>
            </div>
        </div>
        <div class="cssd_table_right"></div>
        <div class="cssd_table_bottom">
            <p>
                共计
                <span>{{countPackageNumber(submitData.Carriers,submitData.NotInCarrierPackages)}}</span> 包
            </p>
            <p>
                <el-button v-if="sterilizeRecordModle" @click="cancelChange">取消修改</el-button>
                <el-button type="primary" @click="sterilizeSubmit">{{sterilizeRecordModle?'修改完成':'开始灭菌'}}</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :ApiUrl="'/api/Scanner/Sterilize'" :BarCodeList="submitData.Carriers.concat(submitData.NotInCarrierPackages)"></ManualEnter>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 重选灭菌程序 -->
        <SterilizeSelectBox v-if="isShowSterilizeSelect" @to-father="deviceProgram2father" :OriginDeviceId="submitData.OriginDeviceId" :mode="sterilizeRecordModle"></SterilizeSelectBox>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 添加计数包 -->
        <CountNumberPackageList v-if="isShowCountNumberPackageList" @countNumber-to-father="countNumberToFather" :getApi="'/odata/CanBeSterilizedNotBarCodeProduct'"></CountNumberPackageList>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 代消包 -->
        <Substitution v-if="isShowSubstitution" @substitution-to-father="substitutionToFather"></Substitution>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 可被灭菌的包 -->
        <SterilizeablePackages v-if="isShowSterilizeablePackage" @sterilizeable-to-father="sterilizeableToFather" :packages="sterilizeablePackages"></SterilizeablePackages>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import SterilizeSelectBox from "./sterilizeSelectBox";
import Substitution from "./Substitution";
import CountNumberPackageList from "../common/CountNumberPackageList";
import SterilizeablePackages from '../common/SterilizeablePackages';
export default {
    data() {
        return {
            displayNav: true,
            sterilizeablePackages: [],
            activeName: "",
            activeNameNotCarriersPackage: "",
            isShowManualEnter: false, //显示手工录入
            isShowCountNumberPackageList: false, //计数包登记
            isShowSterilizeSelect: false, //显示灭菌程序
            isShowSubstitution: false, //显示代消包
            isShowSterilizeablePackage: false, //显示可被灭菌的包
            sterilizeRecordModle: false, //灭菌修改模式
            BiologicalTestForbit: false, //生物检测禁用
            submitData: {
                HelpSterilizeQuantity: 0,
                IsHasSubstitution: false, //是否有代消包
                IsBiologicalTest: false, //是否生物监测
                IsHighTemperatureDevice: this.$route.query.isHighTemperatureDevice,
                DeviceModelName: this.$route.query.deviceName,
                DeviceId: this.$route.query.deviceId - 0,
                OriginDeviceId: 0,
                DeviceModelProgramName: this.$route.query.programName,
                DeviceProgramId: this.$route.query.programId - 0,
                IsDbTestProgram: this.$route.query.isDbTestProgram,
                Carriers: [],
                NotInCarrierPackages: []
            }
        };
    },
    components: {
        ManualEnter,
        SterilizeSelectBox,
        CountNumberPackageList,
        Substitution,
        SterilizeablePackages
    },
    created() {
        CSManager.handleDataThis = this;
        if (this.$route.query.recordId) {
            this.sterilizeRecordModle = true;
            this.activeName = "0";
            this.activeNameNotCarriersPackage = "-1";
            axios({
                    url: `/api/Sterilize/PendingUpdateSterilizeRecord/${this.$route.query.recordId}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        this.submitData = res.data.Data;
                        this.submitData.OriginDeviceId = this.submitData.DeviceId;
                        this.$route.query.deviceId = this.submitData.DeviceId;
                        this.$route.query.programId = this.submitData.DeviceProgramId;
                        if (this.submitData.HelpSterilizeQuantity) {
                            this.submitData.IsHasSubstitution = true;
                            this.submitData.NotInCarrierPackages.push({
                                BarCode: "代消包",
                                IsSubstitution: true,
                                IsNotPrintBarCode: true,
                                MaximumQuantity: 9999,
                                ProductName: "代消包",
                                ProductQuantity: this.submitData.HelpSterilizeQuantity,
                                ProvideSubClinicName: "代消包"
                            });
                        } else {
                            this.submitData.IsHasSubstitution = false;
                        }
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
            url: `/api/Sterilize/CanBeSterilizePackages`
        }).then(res => {
            this.sterilizeablePackages = res.data.Data;
        }).catch(err => {})
    },
    mounted() {},
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        //显示可被灭菌的包
        handleShowSterilizeablePackage() {
            this.isShowSterilizeablePackage = true;
        },
        //可被灭菌的包和父组件通信
        sterilizeableToFather(data) {
            this.isShowSterilizeablePackage = false;
            if (data) {
                data.forEach(element => {
                    this.handleBarCode(element.BarCode);
                });
            }
        },
        //代消包处理
        substitution() {
            this.isShowSubstitution = true;
        },
        //代消包数据传递
        substitutionToFather(data) {
            this.isShowSubstitution = false;
            if (data) {
                if (this.submitData.IsHasSubstitution) {
                    for (
                        let i = 0; i < this.submitData.NotInCarrierPackages.length; i++
                    ) {
                        if (this.submitData.NotInCarrierPackages[i].IsSubstitution) {
                            this.submitData.NotInCarrierPackages[i].ProductQuantity += data;
                            return;
                        }
                    }
                } else {
                    this.submitData.IsHasSubstitution = true;
                    this.submitData.NotInCarrierPackages.push({
                        BarCode: "代消包",
                        IsSubstitution: true,
                        IsNotPrintBarCode: true,
                        MaximumQuantity: 9999,
                        ProductName: "代消包",
                        ProductQuantity: data,
                        ProvideSubClinicName: "代消包"
                    });
                }
            }
        },
        goBack() {
            if (this.sterilizeRecordModle) {
                this.$router.push("/sterilize/record");
            } else {
                this.$router.push("/sterilize/select");
            }
        },
        //el-input-number change 实践
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.submitData.NotInCarrierPackages[index].ProductQuantity = 1;
                }, 0);
            }
        },
        //处理计数包登记
        handleShowCountPackages() {
            this.isShowCountNumberPackageList = true;
        },
        //计数包添加和父组件通信
        countNumberToFather(data) {
            this.isShowCountNumberPackageList = false;
            if (data) {
                //find计数包
                this.activeNameNotCarriersPackage = "0";
                this.activeName = "-1";
                let onOff = true;
                for (let i = 0; i < data.length; i++) {
                    for (
                        let j = 0; j < this.submitData.NotInCarrierPackages.length; j++
                    ) {
                        if (
                            data[i].ProductId ==
                            this.submitData.NotInCarrierPackages[j].ProductId
                        ) {
                            onOff = false;
                            this.submitData.NotInCarrierPackages[j].ProductQuantity +=
                                data[i].ProductQuantity;
                            break;
                        }
                    }
                    if (onOff) {
                        this.submitData.NotInCarrierPackages.push(data[i]);
                    }
                }
            }
        },
        //删除无网篮包
        deleteNotCarrierPackages() {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除包吗?',
                confirmCallBack: () => {
                    this.submitData.NotInCarrierPackages = [];
                    this.submitData.IsHasSubstitution = false;
                },
                cancelCallBack: () => {}
            });
        },
        //删除网篮
        deleteThisCarrier(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除网篮吗?',
                confirmCallBack: () => {
                    this.submitData.Carriers.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //ui样式 tab切换
        notCarrierTabClick(vm) {
            this.activeName = "-1";
            this.activeNameNotCarriersPackage = vm.index;
        },
        //ui样式 tab切换
        carrierTabClick(vm) {
            this.activeNameNotCarriersPackage = "-1";
            this.activeName = vm.index;
        },
        //删除包
        deletepackage(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该包吗?',
                confirmCallBack: () => {
                    if (this.submitData.NotInCarrierPackages[index].IsSubstitution === true) {
                        this.submitData.IsHasSubstitution = false;
                    }
                    this.submitData.NotInCarrierPackages.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //处理手工录入
        handleShowManualEnter() {
            this.isShowManualEnter = true;
        },
        //取消修改
        cancelChange() {
            this.$router.push({
                path: "/sterilize/record"
            });
        },
        //开始灭菌
        sterilizeSubmit() {
            let url = "/api/Sterilize/SterilizeStart";
            let method = "POST";
            if (this.sterilizeRecordModle) {
                url = `/api/Sterilize/SterilizeRecordModify`;
                method = "PUT";
            }
            //非BD测试程序
            if (!this.submitData.IsDbTestProgram) {
                if (
                    this.GLOBAL.VerificationHandle([{
                        val: this.submitData.TotalNumber,
                        type: "NumberNotZero",
                        msg: "您没有添加包或网篮！请至少添加一个包！"
                    }])
                ) {
                    //转换数据格式
                    for (
                        let i = 0; i < this.submitData.NotInCarrierPackages.length; i++
                    ) {
                        if (this.submitData.NotInCarrierPackages[i].IsSubstitution) {
                            this.submitData.HelpSterilizeQuantity = this.submitData.NotInCarrierPackages[
                                i
                            ].ProductQuantity;
                            this.submitData.NotInCarrierPackages.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    return;
                }
            } else {
                //BD测试程序
                if (this.submitData.TotalNumber) {
                    this.showInformation({
                        classify: "message",
                        msg: "BD测试程序不能录入包！请删除！"
                    });
                    return;
                }
            }
            axios({
                    url: url,
                    method: method,
                    data: this.submitData
                })
                .then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        res.data.Data.forEach(element => {
                            CSManager.PrintBarcode(JSON.stringify(element));
                        });
                        if (this.sterilizeRecordModle) {
                            this.$router.push({
                                path: "/sterilize/record"
                            });
                        } else {
                            this.$router.push({
                                path: "/sterilize/select"
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
        },
        //重新选择
        reSelect() {
            this.isShowSterilizeSelect = true;
        },
        //手工录入接收数据
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {
                //扫网篮
                if (data.CarrierBarCodeScannerVm) {
                    if (data.Packages.every(val => {
                            return val.IsHighTemperatureProduct == this.submitData.IsHighTemperatureDevice;
                        })) {
                        data.CarrierBarCodeScannerVm.PackageBarCodeDetailList = data.Packages;
                        this.handleAddData(data);
                        this.activeNameNotCarriersPackage = "-1";
                        this.activeName = `${this.submitData.Carriers.length - 1}`;
                        return;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: "扫入包的灭菌类型和灭菌设备不匹配！",
                            type: "error",
                        })
                    }
                }
                //扫包
                if (data.SinglePackage) {
                    this.activeName = "-1";
                    this.activeNameNotCarriersPackage = "0";
                    if (data.HasImplants) {
                        //有植入物to limit
                        this.submitData.IsBiologicalTest = true;
                        this.BiologicalTestForbit = true;
                    }
                    if (data.SinglePackage.IsHighTemperatureProduct == this.submitData.IsHighTemperatureDevice) {
                        this.submitData.NotInCarrierPackages.push(data.SinglePackage);
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: "扫入包的灭菌类型和灭菌设备不匹配！",
                            type: "error"
                        })
                    }
                }
            }
        },
        //重选设备程序组件接收数据
        deviceProgram2father(data) {
            this.isShowSterilizeSelect = false;
            if (data) {
                this.$route.query.deviceName = data.DeviceName;
                this.submitData.DeviceModelName = data.DeviceName;
                this.$route.query.deviceId = data.DeviceId;
                this.submitData.DeviceId = data.DeviceId;
                this.$route.query.programName = data.ProgramName;
                this.submitData.DeviceModelProgramName = data.ProgramName;
                this.$route.query.programId = data.ProgramId;
                this.submitData.DeviceProgramId = data.ProgramId;
                this.$route.query.isDbTestProgram = data.IsDbTestProgram;
                this.submitData.IsDbTestProgram = data.IsDbTestProgram;
                this.$route.query.isHighTemperatureDevice = data.IsHighTemperatureDevice;
                this.submitData.IsHighTemperatureDevice = data.IsHighTemperatureDevice;
            }
        },
        //处理JSManager传过来的BarCode
        handleBarCode(msg) {
            let BarCodeList = this.submitData.Carriers.concat(
                this.submitData.NotInCarrierPackages
            );
            let onOff = true;
            BarCodeList.forEach(item => {
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
                        url: `/api/Scanner/Sterilize/${msg}`
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
        },
        //添加数据处理
        handleAddData(data) {
            if (data.HasImplants) {
                //有植入物to limit
                this.submitData.IsBiologicalTest = true;
                this.BiologicalTestForbit = true;
            }
            this.submitData.Carriers.push(data.CarrierBarCodeScannerVm);
        }
    },
    computed: {
        countPackageNumber() {
            return (list, noCarrierList) => {
                let num = 0;
                for (let i = 0; i < list.length; i++) {
                    for (let j = 0; j < list[i].PackageBarCodeDetailList.length; j++) {
                        num += list[i].PackageBarCodeDetailList[j].ProductQuantity;
                    }
                }
                noCarrierList.forEach(val => {
                    num += val.ProductQuantity;
                });
                this.submitData.TotalNumber = num;
                return num;
            };
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tabsHalfBar";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#sterilizeRegistration {
    .cssd_title_right {
        p {
            margin-right: 30px;

            &.biologicalTest {
                b {
                    margin-left: 10px;
                }
            }
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

    .cssd_table_center {
        display: flex;
        padding: 0;
        height: 100%;
        padding-bottom: 60px;
        position: relative;
        overflow: hidden;

        .cssd_table_left {
            width: 250px;
            color: #fff;
            box-sizing: border-box;
            height: 100%;

            .cssd_talbe_left_menu {
                overflow-y: scroll;
                background: #182B37;
                width: 100%;
                overflow-x: hidden;
                height: 100%;

                &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 240px;
                    bottom: 60px;
                    width: 10px;
                    background: #fff;
                }

                .shrinkNavBox {
                    position: absolute;
                    left: 0;
                    bottom: 60px;
                }

                .el-tabs {
                    .el-tabs__header {
                        .el-tabs__nav-wrap {

                            .el-tabs__item {

                                &:hover {
                                    .tab_title {
                                        span {
                                            display: block;
                                        }
                                    }
                                }

                                &.is-active {
                                    width: 250px;
                                    background: #00c16b;
                                    border-radius: 0 4px 4px 0;
                                }

                                .tab_title {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    width: 100%;
                                    height: 100%;

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
                        }
                    }

                    .el-tab-pane {
                        height: 100%;

                        .tab_content {
                            padding: 30px 40px 90px;
                            box-sizing: border-box;
                            height: 100%;
                            overflow-y: auto;

                            &::-webkit-scrollbar {
                                width: 10px;
                            }

                            .el-table {
                                tbody {
                                    .cell {
                                        font-size: 18px;
                                        font-family: Microsoft YaHei;
                                        font-weight: bold;
                                        color: rgba(35, 46, 65, 1);

                                        .el-button {
                                            border: 0;
                                            font-size: 18px;
                                            font-family: Microsoft YaHei;
                                            color: rgba(249, 62, 62, 1);

                                            &:hover {
                                                background: none;
                                            }
                                        }

                                        >div {
                                            font-size: 18px;
                                            font-family: Microsoft YaHei;
                                            font-weight: bold;
                                            color: #232e41;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .cssd_table_right {
            flex: 1;
        }

        .cssd_table_bottom {
            z-index: 5;
            background: #fff;
            position: fixed;
        }
    }
}
</style>
