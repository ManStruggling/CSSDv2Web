<template>
<div class="cssd_box" id="sterilizeReady">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <li @click="handleShowCountPackages">
                <p>计数包登记</p>
            </li>
            <router-link to="/sterilize/readyRecord" tag="li" v-if="!sterilizeReadyChangeMode">
                <p>灭菌准备记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span v-show="submitData.CarrierId===0">暂无网篮</span>
                <span class="hasCarrierData" v-show="submitData.CarrierId!=0">{{submitData.CarrierName}}</span>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
        <div class="table_box table_unExpand">
            <el-table :data="submitData.PackageBarCodes">
                <el-table-column label="包名称" prop="ProductName" width="240"></el-table-column>
                <el-table-column label="包条码" prop="BarCode" width="210"></el-table-column>
                <el-table-column label="科室" prop="ProvideSubClinicName" width="210"></el-table-column>
                <el-table-column label="包数量" width="210">
                    <template slot-scope="props">
                        <el-input-number v-if="props.row.IsNotPrintBarCode" v-model="props.row.ProductQuantity" :min="1" :max="props.row.MaximumQuantity" size="mini" :controls="false" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"></el-input-number>
                        <div v-if="!props.row.IsNotPrintBarCode">{{props.row.ProductQuantity}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="props">
                        <el-button @click="deletePackage(props.$index,props.row)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p>
                <s>共计</s>
                <b>{{countPackageNumber(submitData.PackageBarCodes)}}</b>
                <span>包</span>
            </p>
            <p>
                <el-button v-if="sterilizeReadyChangeMode" @click="cancelChange">取消修改</el-button>
                <el-button type="primary" @click="sterilizeReadyComplete">{{sterilizeReadyChangeMode?'修改完成':'摆放完成'}}</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 添加计数包 -->
        <CountNumberPackageList v-if="isShowCountNumberPackageList" @countNumber-to-father="countNumberToFather" :getApi="'/odata/CanBeSterilizedNotBarCodeProduct'"></CountNumberPackageList>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :ApiUrl="'/api/Scanner/SterilizeReady'" :BarCodeList="submitData.PackageBarCodes"></ManualEnter>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import CountNumberPackageList from "../common/CountNumberPackageList";
export default {
    inject: ['reload'],
    data() {
        return {
            sterilizeReadyChangeMode: false,
            isShowManualEnter: false,
            isShowCountNumberPackageList: false,
            submitData: {
                CarrierId: 0,
                CarrierName: "",
                PackageBarCodes: []
            }
        };
    },
    components: {
        ManualEnter,
        CountNumberPackageList
    },
    created() {
        CSManager.handleDataThis = this;
        if (this.$route.query.recordId) {
            this.sterilizeReadyChangeMode = true;
            axios({
                    url: `/api/Sterilize/PendingUpdateSterilizeReadyRecord/${this.$route.query.recordId}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        this.submitData = res.data.Data;
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
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        //el-input-number change 事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.submitData.PackageBarCodes[index].ProductQuantity = 1;
                }, 0);
            }
        },
        //返回
        goBack() {
            if (this.sterilizeReadyChangeMode) {
                this.$router.push("/sterilize/readyRecord");
            } else {
                this.$router.push("/sterilize/select");
            }
        },
        //处理计数包登记
        handleShowCountPackages() {
            this.isShowCountNumberPackageList = true;
        },
        //计数包添加 包列表和父组件通信
        countNumberToFather(data) {
            this.isShowCountNumberPackageList = false;
            if (data) {
                //find计数包
                let onOff = true;
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < this.submitData.PackageBarCodes.length; j++) {
                        if (
                            data[i].ProductId ==
                            this.submitData.PackageBarCodes[j].ProductId &&
                            this.submitData.PackageBarCodes[j].PackageBarCodeId == 0
                        ) {
                            onOff = false;
                            this.submitData.PackageBarCodes[j].ProductQuantity +=
                                data[i].ProductQuantity;
                            break;
                        }
                    }
                    if (onOff) {
                        this.submitData.PackageBarCodes.push(data[i]);
                    }
                }
            }
        },
        //取消修改
        cancelChange() {
            this.$router.push({
                path: "/sterilize/readyRecord"
            });
        },
        //删除包
        deletePackage(index, row) {
            this.$confirm("您确定要删除该包吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.submitData.PackageBarCodes.splice(index, 1);
                })
                .catch(() => {});
        },
        //灭菌准备完成
        sterilizeReadyComplete() {
            let url = "/api/Sterilize/SterilizeReadyComplete";
            let method = "POST";
            if (this.sterilizeReadyChangeMode) {
                url = "/api/Sterilize/SterilizeReadyRecordModify";
                method = "PUT";
            }
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.submitData.CarrierId,
                        type: "NumberNotZero",
                        msg: "您还没有关联网篮，请关联网篮！"
                    },
                    {
                        val: this.submitData.PackageBarCodes,
                        type: "ArrayNotEmpty",
                        msg: "网篮至少关联一个包！"
                    }
                ])
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
                            if (this.sterilizeReadyChangeMode) {
                                this.$router.push({
                                    path: "/sterilize/readyRecord"
                                });
                            } else {
                                this.reload();
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
        //处理手工录入
        handleShowManualEnter() {
            this.isShowManualEnter = true;
        },
        //手工录入数据接收
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {
                //扫包
                if (data.PackageBarCodeScannerVm) {
                    this.submitData.PackageBarCodes.push(data.PackageBarCodeScannerVm);
                    return;
                }
                //扫网篮
                if (data.CarrierBarCodeScannerVm) {
                    if (this.submitData.CarrierId == 0) {
                        this.submitData.CarrierId = data.CarrierBarCodeScannerVm.Id;
                        this.submitData.CarrierName = data.CarrierBarCodeScannerVm.Name;
                    } else {
                        this.$confirm("您已录入网篮,是否需要替换该网篮?", "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            })
                            .then(() => {
                                this.submitData.CarrierId = data.CarrierBarCodeScannerVm.Id;
                                this.submitData.CarrierName = data.CarrierBarCodeScannerVm.Name;
                            })
                            .catch(() => {});
                    }
                }
            }
        },
        //添加数据处理
        handleBarCode(msg) {
            let onOff = true;
            this.submitData.PackageBarCodes.forEach(item => {
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
                        url: `/api/Scanner/SterilizeReady/${msg}`
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
        //计算包数量
        countPackageNumber() {
            return list => {
                let num = 0;
                list.forEach(val => {
                    num += val.ProductQuantity;
                });
                return num;
            };
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#sterilizeReady {
    .cssd_title_right {
        p {
            display: flex;

            span {
                text-align: right;
                width: 100px;
            }
        }
    }

    .cssd_table_center {
        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;

            .el-table {
                .cell {
                    font-weight: bold;

                    >div {
                        font: inherit;
                    }
                }

                .el-button {
                    border: 0;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(249, 62, 62, 1);

                    &:hover {
                        background: none;
                    }
                }
            }
        }
    }
}
</style>
