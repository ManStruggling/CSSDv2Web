<template>
<div class="cssd_box" id="reserveProductRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/apply/reserve" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p class="search_date">
                <el-date-picker v-model="search_date" type="daterange" align="right" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="GLOBAL.pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </p>
            <p>
                <el-button type="primary" @click="searchRecordsData">查询</el-button>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_record_ui">
        <div class="content_title">
            <p>预定日期</p>
            <p>预定编号</p>
            <p>需用日期</p>
            <p>预定供应室</p>
            <p>预定子科室</p>
            <p>操作人</p>
            <p>备注</p>
            <p>操作</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.CreatedDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.BarCode}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.BookDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.BookCssd}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.BookSubClinic}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Operator}}</p>
                    </div>
                    <div class="collapseTd">
                        <el-popover placement="top-start" title="备注" width="200" trigger="hover" :content="item.Remark">
                            <p slot="reference">{{item.Remark}}</p>
                        </el-popover>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <el-button size="mini" @click.stop="changeRecord(collapseIndex)" :disabled="(GLOBAL.UserInfo.JobAndCompetence.includes('271')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('200'))&&!item.CanNotBeModified?false:true">修改</el-button>
                            <el-button size="mini" @click.stop="cancelReserve(collapseIndex)" :disabled="(GLOBAL.UserInfo.JobAndCompetence.includes('271')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('200'))&&!item.CanNotBeModified?false:true">{{item.IsCanceled?'已取消':'取消'}}</el-button>
                        </p>
                    </div>
                </div>
                <el-tabs type="card" v-model="activeName">
                    <el-tab-pane label="无菌物品" v-if="item.Products==''?false:true">
                        <div class="table_detail">
                            <div class="myTableTitle">
                                <p>名称</p>
                                <p>数量</p>
                            </div>
                            <ul>
                                <li v-for="(selfs,myTableIndex) in item.Products" :key="myTableIndex">
                                    <p>{{selfs.ProductName}}</p>
                                    <p>{{selfs.ProductQuantity}}</p>
                                </li>
                            </ul>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="一次性物品" v-if="item.DisposableItems==''?false:true">
                        <div class="table_detail">
                            <div class="myTableTitle">
                                <p>名称</p>
                                <p>规格</p>
                                <p>数量</p>
                            </div>
                            <ul>
                                <li v-for="(selfs,myTableIndex) in item.DisposableItems" :key="myTableIndex">
                                    <p>{{selfs.ProductName}}</p>
                                    <p>{{selfs.Specification}}</p>
                                    <p>{{selfs.ProductQuantity}}</p>
                                </li>
                            </ul>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-collapse-item>
        </el-collapse>
        <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
</div>
</template>

<script>
export default {
    inject: ['reload'],
    data() {
        return {
            activeName: "0",
            search_date: [],
            endDateLimit: {},
            recordList: []
        };
    },
    created() {
        let date = this.GLOBAL.GetNowDate();
        this.search_date = [date, date];
        this.searchRecordsData();
    },
    mounted() {
        this.GLOBAL.useWebsocketOrNot(this);
    },
    beforeDestroy() {
        if (this.connection) {
            this.connection.stop();
        }
    },
    methods: {
        //二次请求
        collapseChange(index) {
            if (
                index != "" &&
                this.recordList[index].Products == null &&
                this.recordList[index].DisposableItems == null
            ) {
                axios({
                    url: `/api/Book/BookRecord/Detail/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].Products = res.data.Data.Products;
                        this.recordList[index].DisposableItems =
                            res.data.Data.DisposableItems;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //取消预订
        cancelReserve(index) {
            axios({
                url: `/api/Book/${this.recordList[index].Id}`,
                method: "DELETE"
            }).then(res => {
                let type;
                if (res.data.Code == 200) {
                    type = "success";
                    //socket发送信息
                    if (this.connection) {
                        this.connection
                            .invoke("TaskUpdateNotification", {
                                CssdId: this.recordList[index].BookCssdId,
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
                    msg: res.data.Msg,
                    type: type
                });
            }).catch(err => {})
        },
        //修改记录
        changeRecord(index) {
            this.$router.push({
                path: "/apply/reserve",
                query: {
                    recordId: this.recordList[index].Id
                }
            });
        },
        //查询
        searchRecordsData() {
            axios({
                    url: `/api/Book/BookRecord/${this.search_date[0]}/${this.search_date[1]}`
                })
                .then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        this.recordList = res.data.Data;
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
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";

#reserveProductRecord {
    .cssd_table_center {
        .el-collapse {
            .el-collapse-item {
                &.is-active {
                    .el-popover__reference {
                        color: #fff;
                    }
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
        }
    }

    .el-collapse-item__content {
        .el-tabs__header {
            border-bottom-color: #f2f4f7;

            .el-tabs__nav {
                border-radius: 0;
                border-left: 0;
                border-top: 0;
                border-right-color: #f2f4f7;

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

        .myTableTitle {
            display: flex;
            padding: 0 0 0 40px;

            p {
                width: 160px;
                margin-right: 50px;
                font-size: 18px;
                font-family: Microsoft YaHei;
                color: rgba(135, 141, 159, 1);
                line-height: 24px;
            }
        }

        ul {
            li {
                display: flex;
                margin: 20px 0 20px 40px;

                p {
                    width: 160px;
                    margin-right: 50px;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(35, 46, 65, 1);
                    line-height: 24px;
                }
            }
        }
    }
}
</style>
