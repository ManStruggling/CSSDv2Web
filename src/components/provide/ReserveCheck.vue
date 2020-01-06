<template>
<div class="cssd_box" id="reserveCheck">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <router-link to="/provide/reserveCheckRecord" tag="li">
                <p>预定审核记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span v-show="hasNewTask">有新任务</span>
                <i @click="refresh"></i>
            </p>
        </div>
    </div>
    <div class="cssd_table_center tabs_totalBar cssd_totalBar">
        <el-tabs type="border-card" :tab-position="'left'" v-model="tabsActiveName">
            <el-tab-pane v-for="(item,index) in subClinics" :key="index" :name="index+''">
                <div slot="label">
                    <h3>{{item.ClinicName}}</h3>
                    <h4>{{item.SubClinicName}}</h4>
                </div>
                <div class="tab_content">
                    <div class="container table_collapse">
                        <div class="content_title">
                            <p style="width:50px;">
                                <el-checkbox :indeterminate="item.IsIndeterminate" v-model="item.CheckAll" @change="handleCheckAllChange"></el-checkbox>
                            </p>
                            <p>预定条码</p>
                            <p>需用日期</p>
                            <p>预定日期</p>
                            <p>备注</p>
                            <p>操作</p>
                        </div>
                        <el-checkbox-group v-model="item.CheckList" @change="handleCheckedChange">
                            <el-collapse accordion>
                                <el-collapse-item v-for="(value,collapseIndex) in item.BookTasks" :key="collapseIndex" :name="collapseIndex+''">
                                    <div slot="title" class="collapseTh">
                                        <div class="collapseTd" style="width:90px;">
                                            <div class="checkDiv">
                                                <el-checkbox :label="value">{{""}}</el-checkbox>
                                            </div>
                                        </div>
                                        <div class="collapseTd">
                                            <p>{{value.BarCode}}</p>
                                        </div>
                                        <div class="collapseTd">
                                            <p>{{value.BookDate}}</p>
                                        </div>
                                        <div class="collapseTd">
                                            <p>{{value.CreatedDate}}</p>
                                        </div>
                                        <div class="collapseTd">
                                            <el-popover placement="top-start" title="备注" width="200" trigger="hover" :content="value.Remark">
                                                <p slot="reference">{{value.Remark}}</p>
                                            </el-popover>
                                        </div>
                                        <div class="collapseTd">
                                            <p>
                                                <a @click.stop="editBookTask(value.BookTaskId,item.SubClinicId,item.SubClinicName)">编辑</a>
                                                <a @click.stop="printBookList(value.BookTaskId)">打印</a>
                                            </p>
                                        </div>
                                    </div>
                                    <el-tabs type="card">
                                        <el-tab-pane label="无菌物品" v-if="value.Products==''?false:true" class="table_unExpand">
                                            <el-table :data="value.Products">
                                                <el-table-column label="名称" prop="Name" width="240" show-overflow-tooltip></el-table-column>
                                                <el-table-column label="数量" prop="Quantity" width="210"></el-table-column>
                                                <el-table-column></el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane label="一次性物品" v-if="value.DisposableItems==''?false:true" class="table_unExpand">
                                            <el-table :data="value.DisposableItems">
                                                <el-table-column label="名称" prop="Name" width="240" show-overflow-tooltip></el-table-column>
                                                <el-table-column label="规格" prop="Specification" width="210"></el-table-column>
                                                <el-table-column label="数量" prop="Quantity" width="210"></el-table-column>
                                                <el-table-column></el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-collapse-item>
                            </el-collapse>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button @click="submitNotPass">审核不通过</el-button>
                <el-button type="primary" @click="submitComplete">审核通过</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    inject: ['reload'],
    data() {
        return {
            hasNewTask: false,
            tabsActiveName: "0",
            subClinics: [],
            checkList: [],
            checkAll: false,
            isIndeterminate: false
        };
    },
    created() {
        axios({
                url: `/api/Book/BookReview`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    res.data.Data.SubClinics.forEach(element => {
                        element.CheckList = [];
                        element.CheckAll = false;
                        element.IsIndeterminate = false;
                    });
                    this.subClinics = res.data.Data.SubClinics;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
    },
    mounted() {
        this.GLOBAL.useWebsocketOrNot(this, "ReserveCheckState");
    },
    beforeDestroy() {
        if (this.connection) {
            this.connection.stop();
        }
    },
    methods: {
        //刷新
        refresh() {
            this.reload();
        },
        // 编辑
        editBookTask(val, SubClinicId, SubClinicName) {
            //edit
            this.$router.replace({
                path: "/provide/reserveChange",
                query: {
                    recordId: val,
                    subClinicId: SubClinicId,
                    subClinicName: SubClinicName,
                    originRoute: '/provide/reserveCheck'
                }
            });
        },
        //打印预订单
        printBookList(id) {
            axios({
                url: '/api/Book/PrintBookList',
                method: "POST",
                data: {
                    BookTaskId: [id]
                }
            }).then(res => {
                let type;
                if (res.data.Code == 200) {
                    type = "success";
                    res.data.Data.forEach(element => {
                        CSManager.PrintBarcode(JSON.stringify(element));
                    });
                } else {
                    type = "error";
                }
                this.showInformation({
                    classify: "message",
                    type: type,
                    msg: res.data.Msg
                });
            }).catch(err => {})
        },
        //审核不通过
        submitNotPass() {
            let data = [];
            this.subClinics.forEach(element => {
                data = data.concat(element.CheckList);
            });
            if (
                this.GLOBAL.VerificationHandle([{
                    val: data.length,
                    type: "NumberNotZero",
                    msg: "请至少选择一个审核任务！"
                }])
            ) {
                axios({
                        url: `/api/Book/BookReview/Failed`,
                        method: "POST",
                        data: {
                            BookTasks: data
                        }
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            //socket消息推送
                            if (this.connection) {
                                this.connection
                                    .invoke("TaskUpdateNotification", {
                                        CssdId: this.GLOBAL.UserInfo.ClinicId,
                                        ReserveCheckState: true,
                                        PackageState: false,
                                        ProvideState: false
                                    }).catch(function (err) {
                                        return console.error(err);
                                    });
                            }
                            this.reload();
                        } else {
                            type = "error";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    })
                    .catch(err => {});
            }
        },
        //审核通过
        submitComplete() {
            let data = [];
            this.subClinics.forEach(element => {
                data = data.concat(element.CheckList);
            });
            if (
                this.GLOBAL.VerificationHandle([{
                    val: data.length,
                    type: "NumberNotZero",
                    msg: "请至少选择一个审核任务！"
                }])
            ) {
                axios({
                        url: `/api/Book/BookReview/Success`,
                        method: "POST",
                        data: {
                            BookTasks: data
                        }
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            //socket推送消息
                            if (this.connection) {
                                this.connection
                                    .invoke("TaskUpdateNotification", {
                                        CssdId: this.GLOBAL.UserInfo.ClinicId,
                                        ReserveCheckState: true,
                                        PackageState: false,
                                        ProvideState: true
                                    }).catch(function (err) {
                                        return console.error(err);
                                    });
                            }
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
        },
        //全选
        handleCheckAllChange(val) {
            if (val) {
                this.subClinics[this.tabsActiveName].CheckList = [];
                this.subClinics[this.tabsActiveName].BookTasks.forEach(element => {
                    this.subClinics[this.tabsActiveName].CheckList.push(element);
                });
            } else {
                this.subClinics[this.tabsActiveName].CheckList = [];
            }
            this.subClinics[this.tabsActiveName].IsIndeterminate = false;
        },
        //选择
        handleCheckedChange(val) {
            let checkedCount = val.length;
            this.subClinics[this.tabsActiveName].CheckAll =
                checkedCount === this.subClinics[this.tabsActiveName].BookTasks.length;
            this.subClinics[this.tabsActiveName].IsIndeterminate =
                checkedCount > 0 &&
                checkedCount < this.subClinics[this.tabsActiveName].BookTasks.length;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tabsTotalBar";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";

#reserveCheck {
    .cssd_title_right {
        p {
            display: flex;
            align-items: center;

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
        .el-collapse {
            .el-collapse-item {
                &.is-active {
                    .el-checkbox {
                        .el-checkbox__input.is-checked {
                            .el-checkbox__inner {
                                background: #fff;

                                &::after {
                                    border-color: #00c16b;
                                }
                            }
                        }
                    }

                    a {
                        color: #fff;
                    }

                    .el-popover__reference {
                        color: #fff;
                    }
                }

                a {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #00c16b;
                    margin-right: 10px;
                }

                .el-popover__reference {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(35, 46, 65, 1);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .checkDiv {
                line-height: 64px;
            }

            .el-collapse-item__content {
                .el-tabs--top {
                    .el-tabs__header {
                        border-bottom-color: #f2f4f7;
                        margin: 0;

                        .el-tabs__nav {
                            border-right-color: #f2f4f7;
                            border-radius: 0;
                            border-left: 0;
                            border-top: 0;

                            .el-tabs__item {
                                height: 56px;
                                line-height: 56px;
                                font-size: 18px;
                                font-family: Microsoft YaHei;
                                color: rgba(135, 141, 159, 1);
                                border-left-color: #f2f4f7;

                                &.is-active {
                                    font-size: 18px;
                                    font-family: Microsoft YaHei;
                                    font-weight: bold;
                                    color: rgba(35, 46, 65, 1);
                                }
                            }
                        }
                    }

                    .el-tabs__content {
                        position: static;
                        padding: 0;

                        .el-table {
                            thead {
                                th {
                                    background: transparent;
                                }
                            }

                            tbody {
                                .cell {
                                    color: #232E41;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
