<template>
<!-- 回收
    还包：非计数包
    collapse展开：非计数包，非丢失包
    加急包：所有包都可加急
    通用包：第一次扫描进入待分配通用包,进入待分配区选择回收科室才会录入通用包的信息
    单网篮包：扫入网篮条码，后台通过网篮条码转换为包条码，用包条码获取包数据，返回前台(先请求后验证是否重复)
    回收完成&修改完成：整理成提交接口的数据结构，并发送webSocket
  -->
<div class="cssd_box" id="recoveryRegistration">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="recoveryGoBack">
                <p>返回</p>
            </li>
            <li @click="handleShowManualEnter">
                <p>条码手工录入</p>
            </li>
            <li @click="handelLostBarCode">
                <p>条码丢失登记</p>
            </li>
            <li @click="handleShowCountPackages">
                <p>计数包回收</p>
            </li>
            <router-link :to="{
                path:'/recovery/record',
                query:{
                    sourceRoute: `/recovery/registration`,
                    requestUrl: `/api/Recycle/RecycleRecords/Recycle`
                }
            }" v-if="!recoveryRecordModle" tag="li">
                <p>回收记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p class="commonPackages">
                <span>待分配通用包:</span>
                <b>{{waitToAllocation.length}}</b>
                <a @click="displayAllocatedPackages">编辑</a>
            </p>
            <p class="routeOfStainedCar">
                <span>污车行程</span>
                <el-select v-model="recoveryData.RecycleRouteId">
                    <el-option v-for="(item,index) in routes" :key="index" :label="item.RouteBarCode" :value="item.RecycleRouteId">
                        <el-popover placement="right" title="当前行程详情" width="200" trigger="hover">
                            <div class="popover_div">
                                <h5>司机：</h5>
                                <h6>{{item.Driver}}</h6>
                            </div>
                            <div class="popover_div">
                                <h5>副手：</h5>
                                <h6>{{item.Helper}}</h6>
                            </div>
                            <div class="popover_div">
                                <h5>路线条码：</h5>
                                <h6>{{item.RouteBarCode}}</h6>
                            </div>
                            <div class="popover_div">
                                <h5>结束时间：</h5>
                                <h6>{{item.RouteEndTime}}</h6>
                            </div>
                            <div slot="reference">{{item.RouteBarCode}}</div>
                        </el-popover>
                    </el-option>
                </el-select>
            </p>
            <p class="senderPerson">
                <span>移交人</span>
                <el-input v-model.trim="recoveryData.SenderName" placeholder="填写移交人"></el-input>
            </p>
            <span v-show="recoveryData.CarrierId===0">暂无网篮</span>
            <span class="hasCarrierData" v-show="recoveryData.CarrierId!=0">{{recoveryData.CarrierName}}</span>
        </div>
    </div>
    <div class="cssd_table_center cssd_table_expand tabs_totalBar cssd_totalBar">
        <el-tabs type="border-card" :tab-position="'left'" v-model="activeName">
            <el-tab-pane v-for="(item,index) in recoveryData.Clinics" :key="index" :name="index +''">
                <div slot="label">
                    <h4>{{item.ProvideClinicName}}</h4>
                    <h3>{{item.ProvideSubClinicName}}</h3>
                    <div class="tab_count">
                        <p>
                            <span>总包数:</span>
                            <b>{{countTotalPackageNumber(item.RecycleProducts,index)}}</b>
                        </p>
                        <p>
                            <span>包内器械总数:</span>
                            <b>{{countTotalInstruments(item.RecycleProducts,index)}}</b>
                        </p>
                    </div>
                </div>
                <div class="tab_content table_collapse">
                    <div class="content_title">
                        <p>包名称</p>
                        <p style="width:60px;">包数量</p>
                        <p style="width:100px;">器械总数</p>
                        <p style="width:100px;">剩余还包数</p>
                        <p style="width:100px;">本次还包数</p>
                        <p style="width:60px;">加急包</p>
                    </div>
                    <el-collapse v-model="collapseActiveName" accordion>
                        <el-collapse-item v-for="(value,collapseIndex) in item.RecycleProducts" :key="collapseIndex" :name="collapseIndex+''" :class="value.IsNotPrintBarCode||value.IsLostPackage?'collapseUnExpand':''">
                            <!-- ##根据是否是计数包来判断collapse能不能被展开 -->
                            <div slot="title" class="collapseTh">
                                <div class="collapseTd">
                                    <p>{{value.ProductName}}</p>
                                </div>
                                <!-- 包数量  ##计数包和条码丢失包可以编辑 -->
                                <div class="collapseTd" style="width:100px;">
                                    <p v-if="value.IsNotPrintBarCode||value.IsLostPackage">
                                        <el-input-number v-model="value.ProductQuantity" :min="0" :max="999" :controls="false" size="mini" @change="((newValue,oldValue)=>{handleNumberPackageChange(newValue,oldValue, item.RecycleProducts,collapseIndex,index)})" @click.native.stop="GLOBAL.cancelBubble"></el-input-number>
                                    </p>
                                    <p v-else>{{countPackageNumber(value)}}</p>
                                </div>
                                <!-- 器械总数 -->
                                <div class="collapseTd" style="width:140px;">
                                    <p v-if="value.IsNotPrintBarCode==false&&value.IsLostPackage==false">{{countPackageInstrumentTotalNumber(value)}}</p>
                                    <p v-else>{{"-"}}</p>
                                </div>
                                <!-- 剩余还包数 ##只有非计数包才可还包-->
                                <div class="collapseTd" style="width:140px;">
                                    <p v-if="!value.IsNotPrintBarCode">{{value.NumberOfBorrowedProduct}}</p>
                                    <p v-else>{{"-"}}</p>
                                </div>
                                <!-- 本次还包数 ##只有非计数包才可还包-->
                                <div class="collapseTd" style="width:140px;">
                                    <p v-if="value.IsNotPrintBarCode">{{"-"}}</p>
                                    <p v-else>
                                        <el-input-number v-model="value.NumberOfReturnProduct" :min="0" :max="value.ProductQuantity>value.NumberOfBorrowedProduct?value.NumberOfBorrowedProduct:value.ProductQuantity" :controls="false" @click.stop.native="GLOBAL.cancelBubble"></el-input-number>
                                    </p>
                                </div>
                                <!-- 加急包 ##所有包都可加急-->
                                <div class="collapseTd" style="width:100px;">
                                    <p>
                                        <el-input-number v-model="value.NumberOfExpeditedProduct" :min="0" :max="value.ProductQuantity-value.NumberOfReturnProduct" :controls="false" @change="((newValue)=>{expeditedNumberChange(newValue,item.RecycleProducts,collapseIndex)})" @click.stop.native="GLOBAL.cancelBubble"></el-input-number>
                                    </p>
                                </div>
                            </div>
                            <div class="table_expand">
                                <el-table :data="value.RecyclePackageIds" :default-expand-all="true" v-if="value.IsNotPrintBarCode===false&&value.IsLostPackage===false">
                                    <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                                    <el-table-column label="应回收器械数" prop="ShouldBeRecycledInstrumentTotalQuantity" width="210"></el-table-column>
                                    <el-table-column label="实回收器械数" prop="ActuallyRecycleInstrumentTotalQuantity" width="210"></el-table-column>
                                    <el-table-column label="操作" width="210">
                                        <div slot-scope="scope">
                                            <el-button @click.stop="handleDeletePackage(scope.$index, scope.row,value.RecyclePackageIds,collapseIndex,index)">删除</el-button>
                                        </div>
                                    </el-table-column>
                                    <el-table-column></el-table-column>
                                    <el-table-column type="expand" width="1">
                                        <template slot-scope="props">
                                            <div class="table_detail">
                                                <div class="myTableTitle">
                                                    <p>器械名称</p>
                                                    <p>应回收数</p>
                                                    <p>实回收数</p>
                                                    <div>丢失数</div>
                                                </div>
                                                <ul>
                                                    <li v-for="(selfs,myTableIndex) in props.row.Instruments" :key="myTableIndex">
                                                        <p>
                                                            <span>{{selfs.Name}}</span>
                                                        </p>
                                                        <p>
                                                            <b>{{selfs.ShouldBeRecycledQuantity}}</b>
                                                        </p>
                                                        <p>
                                                            <el-input-number v-model="selfs.ActuallyRecycleQuantity" :min="0" :max="selfs.ShouldBeRecycledQuantity" :controls="false" @change="((newValue,oldValue)=>{actuallyRecycleQuantityChange(newValue,oldValue,props.row,myTableIndex)})"></el-input-number>
                                                        </p>
                                                        <div>{{selfs.LostInstrumentQuantity}}</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="cssd_table_bottom">
            <p>
                共计
                <span>{{countPagePackageNumber(recoveryData.Clinics)}}</span> 包
            </p>
            <p>
                <el-button @click="cancelChange" v-if="recoveryRecordModle">取消修改</el-button>
                <el-button type="primary" @click="recoverySubmit">{{recoveryRecordModle?'修改完成':'回收完成'}}</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :ApiUrl="'/api/Scanner/Recycle'" :BarCodeList="BarCodeList" :firstRequest="true"></ManualEnter>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 计数包回收 -->
        <PackageList v-if="isShowPackageList" @packageList-to-father="packgeList2father" :packageClass="'NotBarCodeProducts'" :requestApi="`type eq '高水平消毒包' or type eq '追溯的无菌包'`" :getApiLimit="'IsNotPrintBarCode'"></PackageList>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 通用包分配科室 -->
        <AllocatedPackages v-if="isShowAllocatedPackages" @allocated-to-father="allocatedToFather" :list="waitToAllocation"></AllocatedPackages>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 丢失包登记 -->
        <SelectSubClinicOfProduct v-if="isShowLostPackageList" @selectSubClinicOfProduct-to-father="lostPackageToFather" :requestApi="`type eq '高水平消毒包' or type eq '追溯的无菌包'`" :getApiLimit="`IsNotPrintBarCode eq false`"></SelectSubClinicOfProduct>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import PackageList from "../common/PackageList";
import AllocatedPackages from "./AllocatedPackages";
import SelectSubClinicOfProduct from "../common/SelectSubClinicOfProduct";
export default {
    inject: ['reload'],
    data() {
        return {
            BarCodeList: [], //检测是否录入重复
            waitToAllocation: [], //待分配的条码通用包
            packageClass: "",
            activeName: "0",
            collapseActiveName: "-1",
            isShowManualEnter: false, //手工录入是否挂载
            isShowPackageList: false, //包列表是否挂载
            isShowAllocatedPackages: false, //待分配包是否挂载
            isShowLostPackageList: false, //丢失包登记是否挂载
            recoveryRecordModle: false, //回收记录修改模式
            recoveryData: {
                CarrierId: 0,
                CarrierName: "",
                RecycleRouteId: null,
                SenderName: "",
                Clinics: []
            },
            routes: []
        };
    },
    components: {
        ManualEnter,
        PackageList,
        AllocatedPackages,
        SelectSubClinicOfProduct
    },
    created() {
        CSManager.handleDataThis = this;
        axios({
            url: `/api/Recycle/FinishedRecycleRoute`
        }).then(res => {
            if (res.data.Code == 200) {
                this.routes = res.data.Data;
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                });
            }
        }).catch(err => {})
        if (this.$route.query.recordId) {
            this.recoveryRecordModle = true;
            axios({
                    url: `/api/Recycle/PendingUpdateRecycleRecord/${this.$route.query.recordId}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        // Object.assign(this.submitData, res.data.Data);
                        this.recoveryData = res.data.Data;
                        this.recoveryData.Clinics = [];
                        this.recoveryData.PackageBarCodeScanners.forEach(item => {
                            this.handleAddData(item);
                        });
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
    mounted() {
        this.GLOBAL.useWebsocketOrNot(this);
    },
    beforeDestroy() {
        if (this.connection) {
            this.connection.stop();
        }
        CSManager.handleDataThis = null;
    },
    methods: {
        //goBack
        recoveryGoBack() {
            if (this.recoveryRecordModle) {
                this.$router.push({
                    path: "/recovery/record",
                    query: {
                        source: `source eq '回收'`
                    }
                });
            } else {
                this.$router.push("/");
            }
        },
        //删除包
        handleDeletePackage($index, row, RecyclePackageIds, collapseIndex, index) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该包?',
                confirmCallBack: () => {
                    RecyclePackageIds.splice($index, 1);
                    this.recoveryData.Clinics[index].RecycleProducts[collapseIndex].NumberOfReturnProduct = 0;
                    this.recoveryData.Clinics[index].RecycleProducts[collapseIndex].NumberOfExpeditedProduct = 0;
                    //包类型的包数组为空 清除结构 改变ui
                    if (RecyclePackageIds.length == 0) {
                        this.recoveryData.Clinics[index].RecycleProducts.splice(collapseIndex, 1);
                    }
                    if (this.recoveryData.Clinics[index].RecycleProducts.length == 0) {
                        this.recoveryData.Clinics.splice(index, 1);
                    }
                    this.$forceUpdate();
                },
                cancelCallBack: () => {}
            });
        },
        //处理手工录入
        handleShowManualEnter() {
            this.getBarCodeArray();
            this.isShowManualEnter = true;
        },
        getBarCodeArray() {
            this.BarCodeList = [];
            for (let i = 0; i < this.recoveryData.Clinics.length; i++) {
                for (
                    let j = 0; j < this.recoveryData.Clinics[i].RecycleProducts.length; j++
                ) {
                    if (
                        this.recoveryData.Clinics[i].RecycleProducts[j].RecyclePackageIds
                    ) {
                        this.BarCodeList = this.BarCodeList.concat(
                            this.recoveryData.Clinics[i].RecycleProducts[j].RecyclePackageIds
                        );
                    }
                }
            }
            this.BarCodeList = this.BarCodeList.concat(this.waitToAllocation);
        },
        //处理计数包登记
        handleShowCountPackages() {
            this.isShowPackageList = true;
        },
        //处理条码丢失
        handelLostBarCode() {
            this.isShowLostPackageList = true;
        },
        actuallyRecycleQuantityChange(newValue, oldValue, row, index) {
            if (newValue === undefined) {
                setTimeout(() => {
                    row.Instruments[index].ActuallyRecycleQuantity = oldValue;
                }, 0);
            } else {
                //计算丢失器械 LostInstrumentQuantity
                row.Instruments[index].LostInstrumentQuantity =
                    row.Instruments[index].ShouldBeRecycledQuantity -
                    row.Instruments[index].ActuallyRecycleQuantity;
                //计算包实际回收数
                row.ActuallyRecycleInstrumentTotalQuantity = 0;
                row.Instruments.forEach(val => {
                    row.ActuallyRecycleInstrumentTotalQuantity +=
                        val.ActuallyRecycleQuantity;
                });
            }
        },
        //计数包改变数量
        handleNumberPackageChange(
            newValue,
            oldValue,
            RecycleProducts,
            collapseIndex,
            index
        ) {
            //do things
            RecycleProducts[collapseIndex].NumberOfExpeditedProduct = 0;
            if (newValue == 0 || newValue == undefined) {
                this.showInformation({
                    classify: 'confirm',
                    msg: '确定要删除该计数包?',
                    confirmCallBack: () => {
                        RecycleProducts.splice(collapseIndex, 1);
                        if (this.recoveryData.Clinics[index].RecycleProducts.length == 0) {
                            this.recoveryData.Clinics.splice(index, 1);
                        }
                        this.$forceUpdate();
                    },
                    cancelCallBack: () => {
                        RecycleProducts[collapseIndex].ProductQuantity = oldValue;
                    }
                });
            }
        },
        //加急包处理
        expeditedNumberChange(newValue, RecycleProducts, collapseIndex) {
            if (newValue == undefined) {
                setTimeout(() => {
                    RecycleProducts[collapseIndex].NumberOfExpeditedProduct = 0;
                }, 0);
            }
        },
        //取消修改
        cancelChange() {
            this.$router.push({
                path: "/recovery/record",
                query: {
                    source: `source eq '回收'`
                }
            });
        },
        //回收完成or修改完成
        recoverySubmit() {
            let url = "";
            let method = "";
            if (this.recoveryRecordModle) {
                url = "/api/Recycle/RecycleRecordModify";
                method = "PUT";
            } else {
                url = "/api/Recycle/RecycleComplete";
                method = "POST";
            }
            this.recoveryData.RecycleProducts = [];
            for (let i = 0; i < this.recoveryData.Clinics.length; i++) {
                this.recoveryData.RecycleProducts = this.recoveryData.RecycleProducts.concat(
                    this.recoveryData.Clinics[i].RecycleProducts
                );
            }
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.recoveryData.CarrierId,
                        type: "NumberNotZero",
                        msg: "网篮不能为空！"
                    },
                    {
                        val: this.recoveryData.RecycleProducts,
                        type: "ArrayNotEmpty",
                        msg: "网篮至少回收一个包！"
                    }
                ])
            ) {
                if (this.waitToAllocation.length > 0) {
                    this.showInformation({
                        classify: "message",
                        msg: "待分配通用包还未分配回收回收科室！"
                    });
                    return;
                }
                axios({
                        url: url,
                        method: method,
                        data: this.recoveryData
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            //socket发送信息
                            if (this.connection) {
                                let sendData = {
                                    CssdId: this.GLOBAL.UserInfo.ClinicId,
                                    ReserveCheckState: false,
                                    PackageState: true,
                                    ProvideState: true
                                };
                                this.connection
                                    .invoke("TaskUpdateNotification", sendData).catch(function (err) {
                                        return console.error(err);
                                    });
                            }
                            if (this.recoveryRecordModle) {
                                this.$router.push({
                                    path: "/recovery/record",
                                    query: {
                                        source: `source eq '回收'`
                                    }
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
        //待分配组件与父组件通信
        allocatedToFather(data) {
            this.isShowAllocatedPackages = false;
            if (data) {
                this.waitToAllocation.forEach(element => {
                    this.handleAddData(element);
                });
                this.waitToAllocation = [];
            }
        },
        //显示待分配组件
        displayAllocatedPackages() {
            this.isShowAllocatedPackages = true;
        },
        //手工输入组件与父组件通信
        packageData2father(data) {
            this.isShowManualEnter = false;
            //扫包
            if (data.PackageBarCodeScannerVm) {
                // if(SingleCarrierId){
                //   data.PackageBarCodeScannerVm.SingleCarrierId = SingleCarrierId;
                // }
                this.handleAddData(data.PackageBarCodeScannerVm);
                return;
            }
            //扫网篮
            if (data.CarrierBarCodeScannerVm) {
                if (this.recoveryData.CarrierId == 0) {
                    this.recoveryData.CarrierId = data.CarrierBarCodeScannerVm.Id;
                    this.recoveryData.CarrierName = data.CarrierBarCodeScannerVm.Name;
                } else {
                    this.showInformation({
                        classify: 'confirm',
                        msg: '已录入网篮,是否需要替换该网篮?',
                        confirmCallBack: () => {
                            this.recoveryData.CarrierId = data.CarrierBarCodeScannerVm.Id;
                            this.recoveryData.CarrierName = data.CarrierBarCodeScannerVm.Name;
                        },
                        cancelCallBack: () => {}
                    });
                }
                return;
            }
        },
        //PackageList组件与父组件通信
        packgeList2father(data) {
            this.isShowPackageList = false;
            if (data) {
                //数量包处理
                for (let i = 0; i < data.length; i++) {
                    this.handleAddData(data[i]);
                }
            }
        },
        //lostPackageList组件与父组件通信
        lostPackageToFather(data) {
            this.isShowLostPackageList = false;
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    this.handleAddData(data[i]);
                }
            }
        },
        //添加数据处理RecyclePackageIds
        handleAddData(data) {
            //有条码的通用包第一次添加会被添加到待分配通用包
            if (data.PackageBarCodeId && data.IsCommonProduct && !data.SelectAgain) {
                this.waitToAllocation.push(data);
                return;
            }
            let ClinicList = this.recoveryData.Clinics;
            let NoClinic = true; // find clinic   true 没有找到 false 找到了
            let NoPackageClass = true; // find 包类型  true 没有找到 false 找到了
            for (let i = 0; i < ClinicList.length; i++) {
                if (ClinicList[i].ProvideSubClinicId === data.ProvideSubClinicId) {
                    //finded clinic
                    this.activeName = i + "";
                    NoClinic = false;
                    //find 包类型
                    for (let j = 0; j < ClinicList[i].RecycleProducts.length; j++) {
                        if (
                            ClinicList[i].RecycleProducts[j].ProductId == data.ProductId &&
                            data.IsLostPackage === false &&
                            data.PackageBarCodeId != 0
                        ) {
                            //条码包 finded 包类型  ##扫描枪
                            this.collapseActiveName = j + "";
                            NoPackageClass = false;
                            this.recoveryData.Clinics[i].RecycleProducts[j].RecyclePackageIds.push(data);
                            this.recoveryData.Clinics[i].RecycleProducts[j].NumberOfExpeditedProduct = data.NumberOfExpeditedProduct;
                            return;
                        }
                        //计数包
                        if (
                            ClinicList[i].RecycleProducts[j].ProductId == data.ProductId &&
                            data.IsNotPrintBarCode && ClinicList[i].RecycleProducts[j].IsNotPrintBarCode
                        ) {
                            //计数包 finded 包类型
                            NoPackageClass = false;
                            this.recoveryData.Clinics[i].RecycleProducts[j].ProductQuantity +=
                                data.ProductQuantity;
                            this.recoveryData.Clinics[i].RecycleProducts[j].NumberOfExpeditedProduct = data.NumberOfExpeditedProduct;
                            return;
                        }
                        //丢失包
                        if (
                            ClinicList[i].RecycleProducts[j].ProductId == data.ProductId &&
                            data.IsLostPackage &&
                            ClinicList[i].RecycleProducts[j].IsLostPackage
                        ) {
                            //丢失包 finded 包类型
                            NoPackageClass = false;
                            this.recoveryData.Clinics[i].RecycleProducts[j].ProductQuantity +=
                                data.ProductQuantity;
                            return;
                        }
                    }
                    //没有找到包类型
                    if (NoPackageClass) {
                        let noPackageClassObj;
                        if (data.IsNotPrintBarCode || data.IsLostPackage) {
                            //计数包 or 丢失包
                            noPackageClassObj = data;
                        } else {
                            //条码包 ##扫描枪
                            noPackageClassObj = {
                                ProductName: data.ProductName,
                                IsLostPackage: false,
                                IsNotPrintBarCode: false,
                                ProductId: data.ProductId,
                                ProvideSubClinicId: data.ProvideSubClinicId,
                                NumberOfBorrowedProduct: data.NumberOfBorrowedProduct, //借包数
                                NumberOfExpeditedProduct: data.NumberOfExpeditedProduct, //加急数
                                NumberOfReturnProduct: data.NumberOfReturnProduct, //还包数
                                IsSingleCarrierProduct: data.IsSingleCarrierProduct,
                                RecyclePackageIds: [data]
                            };
                        }
                        this.recoveryData.Clinics[i].RecycleProducts.push(
                            noPackageClassObj
                        );
                        this.collapseActiveName =
                            this.recoveryData.Clinics[i].RecycleProducts.length - 1 + "";
                        return;
                    }
                }
            }
            //未存在科室
            if (NoClinic) {
                let obj = {};
                if (data.IsNotPrintBarCode || data.IsLostPackage) {
                    //计数包 or 丢失包
                    obj = data;
                } else {
                    //条码包 ##扫描枪
                    obj = {
                        ProductName: data.ProductName,
                        IsLostPackage: false,
                        IsNotPrintBarCode: false,
                        ProductId: data.ProductId,
                        ProvideSubClinicId: data.ProvideSubClinicId,
                        NumberOfBorrowedProduct: data.NumberOfBorrowedProduct, //借包数
                        NumberOfExpeditedProduct: data.NumberOfExpeditedProduct, //加急数
                        NumberOfReturnProduct: data.NumberOfReturnProduct, //还包数 NumberOfReturnProduct
                        IsSingleCarrierProduct: data.IsSingleCarrierProduct,
                        RecyclePackageIds: [data]
                    };
                }
                this.recoveryData.Clinics.push({
                    ProvideClinicName: data.ProvideClinicName,
                    ProvideSubClinicName: data.ProvideSubClinicName,
                    ProvideSubClinicId: data.ProvideSubClinicId,
                    RecycleProducts: [obj]
                });
                this.activeName = this.recoveryData.Clinics.length - 1 + "";
                this.collapseActiveName = "0";
            }
        },
        handleBarCode(msg) {
            this.getBarCodeArray();
            axios({
                    url: `/api/Scanner/Recycle/${msg}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        if (res.data.Data.PackageBarCodeScannerVm) {
                            for (let i = 0; i < this.BarCodeList.length; i++) {
                                if (
                                    this.BarCodeList[i].BarCode ==
                                    res.data.Data.PackageBarCodeScannerVm.BarCode
                                ) {
                                    this.showInformation({
                                        classify: "message",
                                        msg: "该条码已录入！",
                                        type: "warning"
                                    });
                                    return;
                                }
                            }
                        }
                        this.packageData2father(res.data.Data, msg);
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
    computed: {
        //计算条码包collapse内的包数量
        countPackageNumber() {
            return list => {
                list.ProductQuantity = list.RecyclePackageIds.length;
                return list.RecyclePackageIds.length;
            };
        },
        //计算条码包collapse内实际回收器械总数
        countPackageInstrumentTotalNumber() {
            return list => {
                let packageInstrumentTotalNumber = 0;
                list.RecyclePackageIds.forEach(val => {
                    packageInstrumentTotalNumber +=
                        val.ActuallyRecycleInstrumentTotalQuantity;
                });
                return packageInstrumentTotalNumber;
            };
        },
        //计算科室回收的包总数
        countTotalPackageNumber() {
            return (list, index) => {
                let num = 0;
                list.forEach(val => {
                    if (val.IsNotPrintBarCode || val.IsLostPackage) {
                        if (val.ProductQuantity != undefined) {
                            num += val.ProductQuantity;
                        }
                    } else {
                        num += val.RecyclePackageIds.length;
                    }
                    this.recoveryData.Clinics[index].TotalPackageNumberInClinic = num;
                });
                return num;
            };
        },
        //计算科室实际回收的总器械数
        countTotalInstruments() {
            return (list, index) => {
                let num = 0;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].RecyclePackageIds) {
                        for (let j = 0; j < list[i].RecyclePackageIds.length; j++) {
                            num +=
                                list[i].RecyclePackageIds[j]
                                .ActuallyRecycleInstrumentTotalQuantity;
                        }
                    }
                }
                return num;
            };
        },
        //计算本次回收的总包数
        countPagePackageNumber() {
            return list => {
                let num = 0;
                list.forEach(val => {
                    num += val.TotalPackageNumberInClinic;
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
@import "../../assets/css/tabsTotalBar";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableExpand";

.popover_div {
    display: flex;

    h5 {
        width: 80px;
        text-align: right;
    }
}

#recoveryRegistration {
    .cssd_title_right {
        p {
            &.commonPackages {
                line-height: 40px;

                b {
                    margin-right: 10px;
                    font-weight: bold;
                }

                a {
                    cursor: pointer;
                    color: #00c16b;
                }
            }

            &.senderPerson,
            &.routeOfStainedCar {
                display: flex;
                margin: 0 10px;

                span {
                    line-height: 40px;
                }

                .el-input {
                    width: 200px;

                    input {
                        background: #182b37;
                        border-width: 2px;
                        color: #fff;
                        font-size: 18px;
                        font-weight: bold;
                    }
                }
            }

            &.routeOfStainedCar {
                .el-input {
                    &::after {
                        content: "";
                        background: url(../../assets/images/arrow_white24x13.png) no-repeat;
                        background-size: 24px 13px;
                        position: absolute;
                        height: 13px;
                        width: 24px;
                        right: 11px;
                        top: 14px;
                    }

                    &.is-focus {
                        &::after {
                            transform: rotate(180deg);
                        }
                    }

                    span {
                        display: none;
                    }
                }
            }
        }
    }

    .cssd_table_expand {
        padding-bottom: 60px;
        display: flex;
        position: relative;

        ol {
            text-align: center;
            line-height: 24px;

            li {
                background: #99f;
                display: flex;

                p {
                    flex: 1;

                    span {
                        display: block;
                    }
                }
            }
        }
    }

    .el-tabs__content {
        .el-button {
            border: 0;
            font-size: 18px;
            font-family: Microsoft YaHei;
            color: rgba(249, 62, 62, 1);

            &:hover {
                background-color: transparent;
            }
        }

        .el-table {
            th {
                background: transparent;
            }

            tbody {
                tr:hover {
                    td {
                        background: transparent;
                    }
                }

                .el-input-number {
                    width: 40px;
                    height: 24px;
                    line-height: 24px;

                    .el-input {
                        width: 100%;
                        height: 100%;

                        input {
                            width: 100%;
                            height: 100%;
                            line-height: 24px;
                            background: #f7f8fa;
                        }
                    }
                }

                .table_detail {
                    li {

                        span,
                        b {
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            color: rgba(35, 46, 65, 1);
                        }
                    }
                }
            }
        }
    }

    .cssd_title_right {
        >span {
            text-align: right;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(208, 212, 218, 1);
            line-height: 40px;
            margin-left: 30px;
            width: 100px;
        }

        .hasCarrierData {
            color: #fff;
        }

        .el-select {
            width: 200px;

            .el-input {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #fff;
            }
        }
    }
}
</style>
