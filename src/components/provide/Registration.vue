<template>
<div class="cssd_box tabs_half_bar" id="provideRegistration">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <li @click="handleShowProductList">
                <p>添加任务</p>
            </li>
            <router-link to="/provide/borrowRegistration" tag="li">
                <p>借用</p>
            </router-link>
            <router-link to="/provide/record" tag="li">
                <p>发放记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p class="show_all_task">
                <span>显示所有任务</span>
                <el-switch v-model="showAllTask" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false"></el-switch>
            </p>
            <p class="new_task">
                <span>{{hasNewTask?'有新任务':''}}</span>
                <i @click="refresh"></i>
            </p>
        </div>
    </div>
    <div class="cssd_table_center">
        <div class="cssd_table_left">
            <div class="cssd_talbe_left_menu">
                <el-tabs :tab-position="'left'" v-model="tabActiveName" @tab-click="handleTabClick">
                    <el-tab-pane v-for="(item,index) in provideTaskList" :key="index" :name="index+''">
                        <div slot="label" v-show="showAllTask?true:(GLOBAL.UserInfo.HospitalVersion!='YANCHENGFUBAO'?true:item.RemainInventoryTotalQuantity)" class="el-tabs__item_clinic">
                            <h3>{{item.ClinicName}}</h3>
                            <p>
                                <span v-if="GLOBAL.UserInfo.HospitalVersion=='YANCHENGFUBAO'">
                                    <span>剩余总库存数:</span>
                                    <b>{{countCanBeProvidePackageNumber(index)}}</b>
                                </span>
                                <span v-else>
                                    <span>剩余总发放数:</span>
                                    <b>{{countRemainProvideQuantity(index)}}</b>
                                </span>
                            </p>
                        </div>
                        <div class="tab_content table_collapse table_unExpand" v-show="showAllTask?true:(GLOBAL.UserInfo.HospitalVersion!='YANCHENGFUBAO'?true:item.RemainInventoryTotalQuantity)">
                            <div class="selectSubClinic">
                                <p>本次发放科室</p>
                                <el-select default-first-option v-model="item.SelectedSubClinicId" class="green24x13" @change="((val)=>{provideSubClinicChange(val,index)})" :filterable="true">
                                    <el-option label="全部" :value="0"></el-option>
                                    <el-option v-for="(value,idx) in item.SubClinics" :key="idx" :label="value.SubClinicName" :value="value.SubClinicId"></el-option>
                                </el-select>
                            </div>
                            <div class="content_title">
                                <p>包名称</p>
                                <p>回收时间</p>
                                <p>发放科室</p>
                                <p style="width:90px;" v-if="GLOBAL.UserInfo.HospitalVersion!='YANCHENGFUBAO'">预计发放数</p>
                                <p style="width:80px;">库存数</p>
                                <p style="width:100px;" v-if="GLOBAL.UserInfo.HospitalVersion!='YANCHENGFUBAO'">剩余发放数</p>
                                <p style="width:100px;">本次发放数</p>
                                <p style="width:50px;">操作</p>
                            </div>
                            <el-collapse v-model="activeName" accordion @change="((index)=>{handleCollapseChange(index,item.SubClinicTasks[item.SelectedSubClinicId].ProvideTaskDetails)})">
                                <el-collapse-item v-for="(value,collapseIndex) in item.SubClinicTasks[item.SelectedSubClinicId].ProvideTaskDetails" :key="collapseIndex" :name="collapseIndex+''" :class="value.IsNotPrintBarCode?'collapseUnExpand':''" v-show="showAllTask?true:value.InventoryQuantity!=0">
                                    <div slot="title" class="collapseTh">
                                        <!-- 包名称 -->
                                        <div class="collapseTd">
                                            <p>{{value.ProductName}}</p>
                                        </div>
                                        <!-- 回收时间 -->
                                        <div class="collapseTd">
                                            <p>{{value.RecycleDateTime}}</p>
                                        </div>
                                        <!-- 发放科室 -->
                                        <div class="collapseTd">
                                            <p v-if="GLOBAL.UserInfo.HospitalVersion=='YANCHENGFUBAO'&&value.IsCommonProduct">-</p>
                                            <p v-else>{{value.ProvideSubClinic}}</p>
                                        </div>
                                        <!-- 预计发放数 -->
                                        <div class="collapseTd" style="width:130px;" v-if="GLOBAL.UserInfo.HospitalVersion!='YANCHENGFUBAO'">
                                            <p>{{value.ScheduledQuantity}}</p>
                                        </div>
                                        <!-- 库存数 -->
                                        <div class="collapseTd" style="width:120px;">
                                            <p>{{value.InventoryQuantity}}</p>
                                        </div>
                                        <!-- 剩余发放数 -->
                                        <div class="collapseTd" style="width:140px;" v-if="GLOBAL.UserInfo.HospitalVersion!='YANCHENGFUBAO'">
                                            <p>
                                                {{value.RemainQuantity}}
                                                <span class="expeditedTag" v-if="value.ExpeditedPackageQuantity!=0">加急 : {{value.ExpeditedPackageQuantity}}</span>
                                            </p>
                                        </div>
                                        <!-- 本次发放数 -->
                                        <div class="collapseTd" style="width:140px;">
                                            <!-- 条码包 -->
                                            <p v-if="!value.IsNotPrintBarCode&&!value.IsDisposableProduct">{{countThisProvideNumber(value)}}</p>
                                            <!-- 一次性物品 -->
                                            <p v-if="!value.IsNotPrintBarCode&&value.IsDisposableProduct">{{countDisposableThisProvideNumber(value)}}</p>
                                            <!-- 计数包 -->
                                            <p v-if="value.IsNotPrintBarCode">
                                                <el-input-number v-model="value.ThisTimeProvideQuantity" :min="0" :max="value.MaxLimit=value.InventoryQuantity>value.RemainQuantity?value.RemainQuantity:value.InventoryQuantity" :controls="false" size="mini" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleCountNumberPackage(newValue,oldValue,item.SubClinicTasks[item.SelectedSubClinicId].ProvideTaskDetails,value)})"></el-input-number>
                                            </p>
                                        </div>
                                        <!-- 操作 -->
                                        <div class="collapseTd" style="width:90px;">
                                            <a v-if="value.ProvideTaskGenerateType==3||GLOBAL.UserInfo.JobAndCompetence.includes('000')" @click.stop="deleteThisTask(value.ProvideTaskId)">删除</a>
                                            <p v-else>-</p>
                                        </div>
                                    </div>
                                    <el-table :data="value.ProvidePackages" v-if="!value.IsNotPrintBarCode&&!value.IsDisposableProduct">
                                        <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                                        <el-table-column label="配包日期" prop="PackageDate" width="210"></el-table-column>
                                        <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                                        <el-table-column label="操作" width="210">
                                            <template slot-scope="props">
                                                <el-button @click="deleteProvideProduct(value.ProvidePackages,props.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column></el-table-column>
                                    </el-table>
                                    <el-table :data="value.DisposableProducts" v-if="!value.IsNotPrintBarCode&&value.IsDisposableProduct">
                                        <el-table-column label="批号" width="240">
                                            <template slot-scope="props">
                                                <el-select v-model="props.row.BatchNumber" class="green18x10" @change="((val)=>{handleBatchNumberChange(val,value,props.$index)})">
                                                    <el-option v-for="(batchItem,batchIndex) in value.DisposableBatchNumbers" :key="batchIndex" :label="batchItem.BatchNumber" :value="batchItem.BatchNumber"></el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                                        <el-table-column label="库存数" prop="InventoryQuantity" width="210"></el-table-column>
                                        <el-table-column label="数量" prop="Quantity" width="210">
                                            <template slot-scope="props">
                                                <el-input-number v-model.trim="props.row.Quantity" :controls="false" :min="0" :max="props.row.InventoryQuantity" @change="((newValue,oldValue)=>{handleDisposableNumberChange(newValue,oldValue,value,props.$index,item.SubClinicTasks[item.SelectedSubClinicId].ProvideTaskDetails)})" :disabled="!props.row.BatchNumber"></el-input-number>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="210">
                                            <template slot-scope="props">
                                                <el-button @click="deleteProvideProduct(value.DisposableProducts,props.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column></el-table-column>
                                    </el-table>
                                    <el-button v-if="!value.IsNotPrintBarCode&&value.IsDisposableProduct" class="btn88x32 insertDisposableProduct" @click="insertDisposableProduct(value.DisposableProducts)">新增批次</el-button>
                                </el-collapse-item>
                            </el-collapse>
                            <div class="tab_content_bottom">
                                <p>
                                    共计
                                    <span>{{countPackageNumber(item.SubClinicTasks[item.SelectedSubClinicId])}}</span> 包
                                </p>
                                <p>
                                    <el-button type="primary" @click="provideSubmit(index)" class="btn150x40main">发放完成</el-button>
                                </p>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="cssd_table_right"></div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :BarCodeList="barCodeList" :ApiUrl="'/api/Scanner/IncludePackages/Provide'"></ManualEnter>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 产品列表 -->
        <SelectSubClinicOfProduct v-if="isShowProductList" @selectSubClinicOfProduct-to-father="packgeList2father" :requestApi="`ProvideGenerateType eq '手动生成'`" :getApiLimit="`ProvideGenerateType eq '手动生成'`" :submitApi="`/api/Provide/AddProvideTask`"></SelectSubClinicOfProduct>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import SelectSubClinicOfProduct from "../common/SelectSubClinicOfProduct";
export default {
    inject: ['reload'],
    data() {
        return {
            isShowProductList: false,
            showAllTask: false,
            hasNewTask: false,
            activeName: "-1",
            tabActiveName: "0",
            isShowManualEnter: false,
            provideTaskList: [],
            barCodeList: [], //已录入包的列表  用于检测是否重复
            subClinics: [] //用于存储通用包可发的所有子科室
        };
    },
    components: {
        ManualEnter,
        SelectSubClinicOfProduct
    },
    created() {
        CSManager.handleDataThis = this;
        axios("/api/Provide/ProvideTasks").then(res => {
            if (res.data.Code == 200) {
                //处理数据 循环接口数据
                res.data.Data.forEach(element => {
                    element.SelectedSubClinicId = 0;
                    element.RemainInventoryTotalQuantity = 0;
                    element.SubClinicTasks = {
                        0: {
                            ProvideSubClinicId: 0,
                            ThisClinicProvideNumber: 0,
                            ProvideTaskDetails: element.ProvideTasks
                        }
                    }
                });
                if (this.GLOBAL.UserInfo.HospitalVersion == "YANCHENGFUBAO") {
                    let commonProductTaskList = []; //获取所有通用包的任务数组
                    let commonProductItems = {
                        ClinicName: "通用包",
                        RemainInventoryTotalQuantity: 0,
                        SelectedSubClinicId: 0,
                        ProvideTasks: commonProductTaskList,
                        SubClinicTasks: {
                            0: {
                                ProvideSubClinicId: 0,
                                ThisClinicProvideNumber: 0,
                                ProvideTaskDetails: commonProductTaskList
                            }
                        },
                        SubClinics: []
                    };
                    for (let i = 0; i < res.data.Data.length; i++) {
                        for (let j = 0; j < res.data.Data[i].ProvideTasks.length; j++) {
                            if (res.data.Data[i].ProvideTasks[j].IsCommonProduct) {
                                let commonProductTask = res.data.Data[i].ProvideTasks.splice(j, 1)[0]; //该次通用包任务
                                j -= 1;
                                //检查commonProductTaskList是否已存在该产品的任务
                                let checkRepeat = commonProductTaskList.filter(item => {
                                    return item.ProductId == commonProductTask.ProductId;
                                });
                                if (checkRepeat == '') {
                                    //不存在
                                    commonProductTaskList.push(commonProductTask);
                                } else {
                                    //存在
                                    checkRepeat[0].RemainQuantity += commonProductTask.RemainQuantity;
                                }
                            }
                        }
                        if (res.data.Data[i].ProvideTasks == '') {
                            res.data.Data.splice(i, 1);
                            i -= 1;
                        }
                    }
                    let Data = res.data.Data;
                    axios("/api/Clinic/SubClinic").then(res => {
                        if (res.data.Code == 200) {
                            res.data.Data.forEach(element => {
                                element.SubClinicId = element.ProvideSubClinicId;
                                element.SubClinicName = element.ProvideSubClinicName;
                            });
                            commonProductItems.SubClinics = res.data.Data;
                            Data.unshift(commonProductItems);
                            this.provideTaskList = Data;
                            if (this.provideTaskList.length > 0) {
                                this.getSubClinicTasks('0');
                                this.taskSortByRecycleTime(0, '0');
                            }
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    }).catch(err => {})
                } else {
                    this.provideTaskList = res.data.Data;
                    if (this.provideTaskList.length > 0) {
                        this.handleTabClick({
                            index: '0'
                        });
                    }
                }
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                });
            }
        }).catch(err => {});

    },
    mounted() {
        this.GLOBAL.useWebsocketOrNot(this, "ProvideState");
    },
    beforeDestroy() {
        if (this.connection) {
            this.connection.stop();
        }
        CSManager.handleDataThis = null;
    },
    methods: {
        //刷新
        refresh() {
            this.reload();
        },
        //显示包列表
        handleShowProductList() {
            this.isShowProductList = true;
        },
        //产品列表与父组件通信
        packgeList2father(data) {
            this.isShowProductList = false;
            if (data === null) {
                this.reload();
            }
        },
        //发放子科室change
        provideSubClinicChange(val, index) {
            this.provideTaskList[index].ProvideTasks.forEach(
                element => {
                    if (element.IsNotPrintBarCode) {
                        element.ThisTimeProvideQuantity = 0;
                    } else {
                        element.ProvidePackages = [];
                    }
                }
            );
            this.activeName = "-1";
            //按照回收时间升序排列
            this.taskSortByRecycleTime(val, index);
        },
        //任务根据回收时间排序
        taskSortByRecycleTime(val, index) {
            this.provideTaskList[index].SubClinicTasks[val].ProvideTaskDetails.sort((a, b) => {
                return a.RecycleDateTime > b.RecycleDateTime ? 1 : -1;
            });
        },
        //tab click 事件
        handleTabClick(vm) {
            this.activeName = "-1";
            this.tabActiveName = vm.index;
            this.getSubClinics(vm.index);
        },
        //获取子科室
        getSubClinics(index) {
            if (!this.provideTaskList[index].SubClinics) {
                axios({
                    url: `/api/Clinic/SubClinicsBy/${this.provideTaskList[index].ClinicId}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.provideTaskList[index].SubClinics = res.data.Data;
                        this.getSubClinicTasks(index);
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                }).catch(err => {})

            }
        },
        //为子科室分配任务
        getSubClinicTasks(index) {
            for (let j = 0; j < this.provideTaskList[index].SubClinics.length; j++) {
                //循环子科室
                this.provideTaskList[index].SubClinicTasks[this.provideTaskList[index].SubClinics[j].SubClinicId] = {
                    ProvideSubClinicId: this.provideTaskList[index].SubClinics[j].SubClinicId,
                    ThisClinicProvideNumber: 0,
                    ProvideTaskDetails: []
                };
                if (this.GLOBAL.UserInfo.HospitalVersion == 'YANCHENGFUBAO' && index == '0') {
                    this.provideTaskList[index].SubClinicTasks[this.provideTaskList[index].SubClinics[j].SubClinicId].ProvideTaskDetails = this.provideTaskList[index].ProvideTasks;
                } else {
                    for (let k = 0; k < this.provideTaskList[index].ProvideTasks.length; k++) {
                        if (this.provideTaskList[index].SubClinics[j].SubClinicId === this.provideTaskList[index].ProvideTasks[k].ProvideSubClinicId) {
                            this.provideTaskList[index].SubClinicTasks[this.provideTaskList[index].SubClinics[j].SubClinicId].ProvideTaskDetails.push(this.provideTaskList[index].ProvideTasks[k]);
                        }
                    }
                }

            }
            if (this.provideTaskList[index].SubClinics.length === 1) {
                this.provideTaskList[index].SelectedSubClinicId = this.provideTaskList[index].SubClinics[0].SubClinicId;
            }
            this.$forceUpdate();
        },
        //新增批次
        insertDisposableProduct(DisposableProducts) {
            DisposableProducts.push({
                BatchNumber: "",
                ValidDate: "",
                Quantity: 0,
            });
        },
        //一次性物品批号change
        handleBatchNumberChange(val, value, index) {
            value.DisposableProducts[index].Quantity = 0;
            for (let i = 0; i < value.DisposableProducts.length; i++) {
                if (i == index) {
                    continue;
                }
                if (value.DisposableProducts[i].BatchNumber && value.DisposableProducts[index].BatchNumber && value.DisposableProducts[i].BatchNumber == value.DisposableProducts[index].BatchNumber) {
                    value.DisposableProducts[index].BatchNumber = "";
                    this.showInformation({
                        classify: "message",
                        msg: "批号不能重复！"
                    });
                    return;
                }
            }
            value.DisposableBatchNumbers.forEach(item => {
                if (item.BatchNumber == val) {
                    value.DisposableProducts[index].ValidDate = item.ValidDate;
                    value.DisposableProducts[index].InventoryQuantity = item.InventoryQuantity;
                    return;
                }
            })
        },
        //collapse 展开闭合改变的事件
        handleCollapseChange(index, tasks) {
            if (index) {
                let disposableTaskItem = tasks[index];
                if (disposableTaskItem.IsDisposableProduct && !disposableTaskItem.Requested) {
                    axios({
                        url: `/api/Provide/DisposableProductBatchNumber/${disposableTaskItem.ProductId}`
                    }).then(res => {
                        if (res.data.Code == 200) {
                            disposableTaskItem.DisposableBatchNumbers = res.data.Data;
                            disposableTaskItem.Requested = true;
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    }).catch(err => {});
                }
            }
        },
        //一次性物品数量chagne
        handleDisposableNumberChange(newValue, oldValue, value, index, tasks) {
            if (newValue == undefined) {
                setTimeout(() => {
                    value.DisposableProducts[index].Quantity = 0;
                }, 0);
            } else {
                let num = 0; //统计页面目前已录入该产品该批号的一次性物品数量
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].ProductId == value.ProductId) {
                        for (let j = 0; j < tasks[i].DisposableProducts.length; j++) {
                            if (tasks[i].DisposableProducts[j].BatchNumber == value.DisposableProducts[index].BatchNumber) {
                                num += tasks[i].DisposableProducts[j].Quantity;
                            }
                        }
                    }
                }
                if (num > value.DisposableProducts[index].InventoryQuantity) {
                    setTimeout(() => {
                        value.DisposableProducts[index].Quantity = oldValue;
                    }, 0);
                    this.showInformation({
                        classify: "message",
                        msg: "所选的发放总数量大于库存数！",
                        type: "warning"
                    });
                }

                let thisTimeTotalProvideNumber = 0; //统计该一次性物品总计发放数量
                value.DisposableProducts.forEach(item => {
                    thisTimeTotalProvideNumber += item.Quantity;
                });
                if (thisTimeTotalProvideNumber > value.RemainQuantity) {
                    setTimeout(() => {
                        value.DisposableProducts[index].Quantity = oldValue;
                    }, 0);
                    this.showInformation({
                        classify: "message",
                        msg: "所选的发放数量大于剩余发放数！",
                        type: "warning"
                    });
                }
            }
        },
        //计数包数量修改
        handleCountNumberPackage(newValue, oldValue, tasks, value) {
            //计算该类包的已选数量value
            if (newValue == undefined) {
                setTimeout(() => {
                    value.ThisTimeProvideQuantity = 0;
                }, 0);
            } else {
                let num = 0; //统计页面目前已录该包的数量
                tasks.forEach(val => {
                    if (value.ProductId == val.ProductId) {
                        num += val.ThisTimeProvideQuantity;
                    }
                });
                if (num > value.InventoryQuantity) {
                    setTimeout(() => {
                        value.ThisTimeProvideQuantity = oldValue;
                    }, 0);
                    this.showInformation({
                        classify: "message",
                        msg: "您所选的发放总数量大于库存数！",
                        type: "warning"
                    });
                }
            }
        },

        //处理手工录入
        handleShowManualEnter() {
            if (this.getBarCodeArray()) {
                this.isShowManualEnter = true;
            }
        },
        getBarCodeArray() {
            if (this.provideTaskList.length > 0) {
                if (
                    this.provideTaskList[this.tabActiveName].SelectedSubClinicId === 0
                ) {
                    this.showInformation({
                        classify: "message",
                        msg: "请选择发放子科室"
                    });
                    return false;
                }
                let tempArr = [];
                let currentTaskList = this.provideTaskList[this.tabActiveName]
                    .SubClinicTasks[
                        this.provideTaskList[this.tabActiveName].SelectedSubClinicId
                    ].ProvideTaskDetails;
                for (let i = 0; i < currentTaskList.length; i++) {
                    if (currentTaskList[i].ProvidePackages) {
                        for (
                            let j = 0; j < currentTaskList[i].ProvidePackages.length; j++
                        ) {
                            tempArr.push(currentTaskList[i].ProvidePackages[j]);
                        }
                    }
                }
                this.barCodeList = tempArr;
                return true;
            }
        },
        //发放完成
        provideSubmit(index) {
            if (this.provideTaskList[this.tabActiveName].SelectedSubClinicId === 0) {
                this.showInformation({
                    classify: "message",
                    msg: "请选择发放子科室"
                });
                return;
            }
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.provideTaskList[this.tabActiveName].SubClinicTasks[
                        this.provideTaskList[this.tabActiveName].SelectedSubClinicId
                    ].ThisClinicProvideNumber,
                    type: "NumberNotZero",
                    msg: "您还没有发放包，请至少添加一个包！"
                }])
            ) {
                //一次性物品发放数量不能为0
                let numberCanNotBeZeroOfVerify = [];
                //一次性物品批号不能为空
                let verifyArr = [];
                let tasks = this.provideTaskList[this.tabActiveName].SubClinicTasks[
                    this.provideTaskList[this.tabActiveName].SelectedSubClinicId
                ].ProvideTaskDetails;
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].IsDisposableProduct) {
                        for (let j = 0; j < tasks[i].DisposableProducts.length; j++) {
                            numberCanNotBeZeroOfVerify.push(tasks[i].DisposableProducts[j].Quantity);
                            verifyArr.push(tasks[i].DisposableProducts[j].BatchNumber);
                        }
                    }
                }
                if (this.GLOBAL.VerificationHandle([{
                        val: verifyArr,
                        type: "StringAllNotEmpty",
                        msg: "一次性物品批号不能为空！"
                    }, {
                        val: numberCanNotBeZeroOfVerify,
                        type: "NumberAllCannotBeZero",
                        msg: "一次性物品数量不能为0！"
                    }])) {
                    axios({
                            url: `/api/Provide/ProvideComplete`,
                            method: "POST",
                            data: this.provideTaskList[this.tabActiveName].SubClinicTasks[
                                this.provideTaskList[this.tabActiveName].SelectedSubClinicId
                            ]
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = "success";
                                if (this.connection) {
                                    this.connection
                                        .invoke("TaskUpdateNotification", {
                                            CssdId: this.GLOBAL.UserInfo.ClinicId,
                                            ReserveCheckState: false,
                                            PackageState: false,
                                            ProvideState: true
                                        }).catch(function (err) {
                                            return console.error(err);
                                        });
                                }
                                res.data.Data.forEach(element => {
                                    CSManager.PrintBarcode(JSON.stringify(element));
                                });
                                this.reload();
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
            }
        },
        //删除包
        deleteProvideProduct(ProvideProducts, $index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该项?',
                confirmCallBack: () => {
                    ProvideProducts.splice($index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //删除任务
        deleteThisTask(ProvideTaskId) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该任务?',
                confirmCallBack: () => {
                    axios({
                            url: `/api/Provide/RemoveProvideTask/${ProvideTaskId}`,
                            method: "delete"
                        })
                        .then(res => {
                            if (res.data.Code == 200) {
                                this.reload();
                            } else {
                                this.showInformation({
                                    classify: "message",
                                    msg: res.data.Msg
                                });
                            }
                        })
                        .catch(err => {});
                },
                cancelCallBack: () => {}
            });
        },
        //手工录入信息传递
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {
                data.forEach(val => {
                    this.handleAddData(val);
                });
            }
        },
        //数据添加处理 data一个package model
        handleAddData(data) {
            if (this.provideTaskList[this.tabActiveName].SelectedSubClinicId === 0) {
                this.showInformation({
                    classify: "message",
                    msg: "请选择发放子科室"
                });
                return;
            }
            let currentTaskList = this.provideTaskList[this.tabActiveName]
                .SubClinicTasks[
                    this.provideTaskList[this.tabActiveName].SelectedSubClinicId
                ].ProvideTaskDetails;
            for (let j = 0; j < currentTaskList.length; j++) {
                //find包 并且本次发放数小于剩余发放数才添加
                if (
                    currentTaskList[j].ProductId == data.ProductId &&
                    currentTaskList[j].ThisTimeProvideQuantity <
                    currentTaskList[j].RemainQuantity
                ) {
                    currentTaskList[j].ProvidePackages.push(data);
                    currentTaskList[j].ThisTimeProvideQuantity += 1;
                    let newItem = currentTaskList.splice(j, 1)[0];
                    currentTaskList.unshift(newItem);
                    this.activeName = "0";
                    return;
                }
            }
            this.showInformation({
                classify: "message",
                msg: "扫入的包与该科室不匹配！或者发放已经到达最大数！"
            });
        },
        handleBarCode(msg) {
            this.getBarCodeArray();
            let onOff = true;
            this.barCodeList.forEach(item => {
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
                        url: `/api/Scanner/IncludePackages/Provide/${msg}`
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
        //计算本次科室发放包数量
        countPackageNumber() {
            return (obj, index) => {
                let num = 0;
                for (let i = 0; i < obj.ProvideTaskDetails.length; i++) {
                    if (obj.ProvideTaskDetails[i].IsDisposableProduct) {
                        for (let j = 0; j < obj.ProvideTaskDetails[i].DisposableProducts.length; j++) {
                            num += obj.ProvideTaskDetails[i].DisposableProducts[j].Quantity;
                        }
                    } else {
                        num += obj.ProvideTaskDetails[i].ThisTimeProvideQuantity;
                    }
                }
                obj.ThisClinicProvideNumber = num;
                return num;
            };
        },
        //计算本次发放数
        countThisProvideNumber() {
            return (value) => {
                value.ThisTimeProvideQuantity = value.ProvidePackages.length;
                return value.ProvidePackages.length;
            };
        },
        //一次性物品本次发放数
        countDisposableThisProvideNumber() {
            return (value) => {
                let num = 0;
                value.DisposableProducts.forEach(item => {
                    num += item.Quantity;
                });
                value.ThisTimeProvideQuantity = num;
                return num;
            }
        },
        //科室剩余发放总数
        countRemainProvideQuantity() {
            return index => {
                let num = 0;
                //this.provideTaskList[index].SubClinicTasks[0] 此处0代表主科室全部任务
                this.provideTaskList[
                    index
                ].SubClinicTasks[0].ProvideTaskDetails.forEach(element => {
                    if (this.showAllTask) {
                        num += element.RemainQuantity;
                    } else {
                        if (element.InventoryQuantity) {
                            num += element.RemainQuantity;
                        }
                    }
                });
                return num;
            };
        },
        countCanBeProvidePackageNumber() {
            return index => {
                let num = 0;
                let productList = [];
                this.provideTaskList[index].ProvideTasks.forEach(item => {
                    if (!productList.includes(item.ProductId)) {
                        productList.push(item.ProductId);
                        num += item.InventoryQuantity;
                    }
                });
                this.provideTaskList[index].RemainInventoryTotalQuantity = num;
                return num;
            }
        },
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tabsHalfBar";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";

#provideRegistration {
    .cssd_title_right {
        p {
            display: flex;
            align-items: center;

            &.show_all_task {}

            &.new_task {
                width: 115px;

                span {
                    width: 72px;
                }
            }

            span {
                margin-right: 20px;
            }

            i {
                width: 22px;
                height: 20px;
                background: url("../../assets/images/refresh.png") no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
        }
    }

    .cssd_table_center {
        .el-tabs {
            .el-tabs__item {
                padding: 0;
                height: auto;

                &.is-active {
                    p {
                        color: #c6f3df;
                    }
                }

                .el-tabs__item_clinic {
                    padding: 24px 20px;
                }

                h4 {
                    text-align: left;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 1);
                    line-height: 21px;
                }

                h3 {
                    text-align: left;
                    font-size: 20px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 1);
                    line-height: 26px;
                }

                p {
                    line-height: 20px;
                    text-align: left;
                    color: #d0d4da;
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    display: flex;

                    >span {
                        &:first-child {
                            margin-right: 10px;
                        }

                        width: 100px;
                    }
                }
            }

            .el-tabs__content {
                .tab_content {
                    .selectSubClinic {
                        display: flex;
                        color: #878d9f;
                        line-height: 40px;
                        padding-bottom: 20px;

                        p {
                            font-size: 16px;
                            margin-right: 10px;
                        }

                        .el-select {
                            width: 160px;

                            .el-input {
                                input {
                                    font-size: 16px;
                                    color: #333;
                                    font-weight: bold;
                                }
                            }
                        }
                    }

                    .el-collapse {
                        .el-collapse-item__header {
                            &.is-active {
                                .collapseTd {
                                    a {
                                        color: #fff;
                                    }
                                }
                            }

                            .collapseTd {
                                a {
                                    color: #f93e3e;
                                    line-height: 65px;
                                    font-size: 18px;
                                    font-weight: bold;
                                }
                            }
                        }
                    }

                    .insertDisposableProduct {
                        margin: 20px 0 20px 40px;
                        color: #fff;
                    }

                    .tab_content_bottom {
                        p {
                            &:first-child {
                                color: #232e41;
                                font-size: 20px;
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                margin-left: 40px;
                            }
                        }
                    }
                }
            }
        }

        .el-table {
            .cell {
                .el-button {
                    border: 0;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(249, 62, 62, 1);

                    &:hover {
                        background: none;
                    }
                }

                .el-select {
                    width: 160px;

                    input {
                        font-size: 16px;
                        font-weight: bold;
                    }
                }

                .el-input-number {
                    width: 50px;
                    height: 24px;

                    input {
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
