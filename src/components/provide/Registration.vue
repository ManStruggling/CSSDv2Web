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
            <li @click="handleShowPackgeList">
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
                            <el-collapse v-model="activeName" accordion>
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
                                            <p>{{value.ProvideSubClinic}}</p>
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
                                            <p v-if="!value.IsNotPrintBarCode">{{countThisProvideNumber(value.ProvidePackages,value)}}</p>
                                            <p v-if="value.IsNotPrintBarCode">
                                                <el-input-number v-model="value.ThisTimeProvideQuantity" :min="0" :max="value.MaxLimit=value.InventoryQuantity>value.RemainQuantity?value.RemainQuantity:value.InventoryQuantity" :controls="false" size="mini" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleCountNumberPackage(newValue,oldValue,item.SubClinicTasks[item.SelectedSubClinicId].ProvideTaskDetails,value)})"></el-input-number>
                                            </p>
                                        </div>
                                        <!-- 操作 -->
                                        <div class="collapseTd" style="width:90px;">
                                            <a v-if="value.ProvideTaskGenerateType==3||GLOBAL.UserInfo.JobAndCompetence.includes('000')" @click.stop="deleteThisTask(value.ProvideTaskId)">删除</a>
                                            <p v-else>-</p>
                                        </div>
                                        <div class="collapseTd" style="width:90px;">{{value.IsCommonProduct}}</div>
                                    </div>
                                    <el-table :data="value.ProvidePackages" v-if="!value.IsNotPrintBarCode">
                                        <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                                        <el-table-column label="配包日期" prop="PackageDate" width="210"></el-table-column>
                                        <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                                        <el-table-column label="操作" width="210">
                                            <template slot-scope="props">
                                                <el-button @click="deleteProvidePackage(value.ProvidePackages,props.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column></el-table-column>
                                    </el-table>
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
        <SelectSubClinicOfProduct v-if="isShowPackageList" @selectSubClinicOfProduct-to-father="packgeList2father" :requestApi="`ProvideGenerateType eq '手动生成'`" :getApiLimit="`ProvideGenerateType eq '手动生成'`" :submitApi="`/api/Provide/AddProvideTask`"></SelectSubClinicOfProduct>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import SelectSubClinicOfProduct from "../common/SelectSubClinicOfProduct";
export default {
    data() {
        return {
            isShowPackageList: false,
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
                // if (this.GLOBAL.UserInfo.HospitalVersion == "YANCHENGFUBAO") {
                //     let commonProductTaskList = [];
                //     let commonProductItems = {
                //         ClinicName: "通用包",
                //         RemainInventoryTotalQuantity: 0,
                //         SelectedSubClinicId: 0,
                //         ProvideTasks: commonProductTaskList,
                //         SubClinicTasks: {
                //             0: {
                //                 ProvideSubClinicId: 0,
                //                 ThisClinicProvideNumber: 0,
                //                 ProvideTaskDetails: commonProductTaskList
                //             }
                //         },
                //         SubClinics: []
                //     };
                //     for (let i = 0; i < res.data.Data.length; i++) {
                //         for (let j = 0; j < res.data.Data[i].ProvideTasks.length; j++) {
                //             if (res.data.Data[i].ProvideTasks[j].IsCommonProduct) {
                //                 commonProductTaskList.push(res.data.Data[i].ProvideTasks.splice(j, 1)[0]);
                //             }
                //         }
                //     }
                //     let Data = res.data.Data;
                //     axios("/api/Clinic/SubClinic").then(res => {
                //         if (res.data.Code == 200) {
                //             res.data.Data.forEach(element => {
                //                 element.SubClinicId = element.ProvideSubClinicId;
                //                 element.SubClinicName = element.ProvideSubClinicName;
                //             });
                //             commonProductItems.SubClinics = res.data.Data;
                //             Data.unshift(commonProductItems);
                //             this.provideTaskList = Data;
                //             if (this.provideTaskList.length > 0) {
                //                 this.handleTabClick({
                //                     index: '0'
                //                 });
                //             }
                //         } else {
                //             this.showInformation({
                //                 classify: "message",
                //                 msg: res.data.Msg
                //             });
                //         }
                //     }).catch(err => {})
                // } else {
                //     this.provideTaskList = res.data.Data;
                //     if (this.provideTaskList.length > 0) {
                //         this.handleTabClick({
                //             index: '0'
                //         });
                //     }
                // }
                this.provideTaskList = res.data.Data;
                if (this.provideTaskList.length > 0) {
                    this.handleTabClick({
                        index: '0'
                    });
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
            window.location.reload();
        },
        handleShowPackgeList() {
            this.isShowPackageList = true;
        },
        //产品列表与父组件通信
        packgeList2father(data) {
            this.isShowPackageList = false;
            if (data === null) {
                this.$router.go(0);
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
                for (let k = 0; k < this.provideTaskList[index].ProvideTasks.length; k++) {
                    if (this.provideTaskList[index].SubClinics[j].SubClinicId === this.provideTaskList[index].ProvideTasks[k].ProvideSubClinicId) {
                        this.provideTaskList[index].SubClinicTasks[this.provideTaskList[index].SubClinics[j].SubClinicId].ProvideTaskDetails.push(this.provideTaskList[index].ProvideTasks[k]);
                    }
                }

            }
            if (this.provideTaskList[index].SubClinics.length === 1) {
                this.provideTaskList[index].SelectedSubClinicId = this.provideTaskList[
                    index
                ].SubClinics[0].SubClinicId;
            }
            this.$forceUpdate();
        },
        //计数包数量修改
        handleCountNumberPackage(newValue, oldValue, list, value) {
            //计算该类包的已选数量value
            if (newValue == undefined) {
                setTimeout(() => {
                    value.ThisTimeProvideQuantity = 0;
                }, 0);
            } else {
                let num = 0; //统计页面目前已录该包的数量
                list.forEach(val => {
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
                        msg: "您所选的数量大于库存数！",
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
                            this.$router.go(0);
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
        //删除包
        deleteProvidePackage(ProvidePackages, $index) {
            ProvidePackages.splice($index, 1);
        },
        //删除任务
        deleteThisTask(ProvideTaskId) {
            this.$confirm("您确定要删除该任务?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    axios({
                            url: `/api/Provide/RemoveProvideTask/${ProvideTaskId}`,
                            method: "delete"
                        })
                        .then(res => {
                            if (res.data.Code == 200) {
                                this.$router.go(0);
                            } else {
                                this.showInformation({
                                    classify: "message",
                                    msg: res.data.Msg
                                });
                            }
                        })
                        .catch(err => {});
                })
                .catch(() => {});
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
                obj.ProvideTaskDetails.forEach(val => {
                    num += val.ThisTimeProvideQuantity;
                });
                obj.ThisClinicProvideNumber = num;
                return num;
            };
        },
        //计算本次发放数
        countThisProvideNumber() {
            return (list, value) => {
                value.ThisTimeProvideQuantity = list.length;
                return list.length;
            };
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
            }
        }
    }
}
</style>
