<template>
<div class="cssd_box" id="reserveCheckRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/provide/reserveCheck" tag="li">
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
    <div class="cssd_table_center cssd_table_expand cssd_record_ui table_expand">
        <div class="content_title">
            <p>预定审核日期</p>
            <p>审核人</p>
            <p>审核状态</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.CreatedTime}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Reviewer}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Status}}</p>
                    </div>
                </div>
                <el-table :data="item.BookTasks" :default-expand-all="true">
                    <el-table-column label="科室名称" prop="SubClinicName" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column label="预定条码" prop="BarCode" width="210"></el-table-column>
                    <el-table-column label="需用日期" prop="BookDate" width="210"></el-table-column>
                    <el-table-column label="预定日期" prop="CreatedDate" width="210"></el-table-column>
                    <el-table-column label="备注" width="210">
                        <template slot-scope="props">
                            <div class="column_remark">{{props.row.Remark}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column></el-table-column>
                    <el-table-column type="expand" width="1">
                        <template slot-scope="props">
                            <div class="table_detail">
                                <el-tabs type="card">
                                    <el-tab-pane label="无菌物品" v-if="props.row.Products==''?false:true">
                                        <div class="table_detail_box">
                                            <div class="myTableTitle">
                                                <p>名称</p>
                                                <p>数量</p>
                                            </div>
                                            <ul>
                                                <li v-for="(selfs,myTableIndex) in props.row.Products" :key="myTableIndex">
                                                    <el-tooltip :content="selfs.Name" placement="top-start" :disabled="selfs.Name.length<10">
                                                        <p>{{selfs.Name}}</p>
                                                    </el-tooltip>
                                                    <p>{{selfs.Quantity}}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="一次性物品" v-if="props.row.DisposableItems==''?false:true">
                                        <div class="table_detail_box">
                                            <div class="myTableTitle">
                                                <p>名称</p>
                                                <p>规格</p>
                                                <p>数量</p>
                                            </div>
                                            <ul>
                                                <li v-for="(selfs,myTableIndex) in props.row.DisposableItems" :key="myTableIndex">
                                                    <el-tooltip :content="selfs.Name" placement="top-start" :disabled="selfs.Name.length<10">
                                                        <p>{{selfs.Name}}</p>
                                                    </el-tooltip>
                                                    <p>{{selfs.Specification}}</p>
                                                    <p>{{selfs.Quantity}}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
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
    mounted() {},
    methods: {
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.recordList[index].BookTasks == '' || this.recordList[index].BookTasks === null)) {
                axios({
                    url: `/api/Book/BookReviewRecordDetail/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].BookTasks = res.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //查询
        searchRecordsData() {
            axios({
                    url: `/api/Book/BookReviewRecord/${this.search_date[0]}/${
          this.search_date[1]
        }`
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
@import "../../assets/css/tableExpand";

#reserveCheckRecord {
    .el-collapse-item__content {
        .el-table {
            tbody {
                tr {
                    &:hover {
                        >td {
                            background-color: transparent;
                        }
                    }
                }

                .cell {
                    overflow: visible;

                    .column_remark {
                        white-space: nowrap;
                    }
                }
            }
        }

        .el-tabs__header {
            border-bottom-color: #C4C9D1;

            .el-tabs__nav {
                border-radius: 0;
                border-left: 0;
                border-top: 0;
                border-right-color: #C4C9D1;

                .el-tabs__item {
                    height: 56px;
                    line-height: 56px;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(135, 141, 159, 1);
                    border-left-color: #C4C9D1;

                    &.is-active {
                        font-size: 18px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(35, 46, 65, 1);
                        border-bottom-color: #f7f8fa;
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
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
