<template>
<div class="cssd_box" id="RecallPackages">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/sterilize/check" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
    </div>
    <div :class="{cssd_table_center:true, cssd_totalBar:true, tabs_totalBar:true,displayNav:displayNav}">
        <el-tabs type="border-card" :tab-position="'left'" :activeName="'0'">
            <el-tab-pane v-for="(item,index) in submitData.SterilizeTaskForRecall" :key="index" :name="index+''">
                <div slot="label">{{item.SterilizeBarCode}}</div>
                <div class="tab_content table_unExpand">
                    <ul class="clear_float">
                        <li>
                            <p>灭菌设备</p>
                            <span>{{item.DeviceName}}</span>
                        </li>
                        <li>
                            <p>灭菌程序</p>
                            <span>{{item.ProgramName}}</span>
                        </li>
                        <li>
                            <p>灭菌人</p>
                            <span>{{item.Sterilizer}}</span>
                        </li>
                        <li>
                            <p>灭菌日期</p>
                            <span>{{item.SterilizeDate}}</span>
                        </li>
                        <li>
                            <p>化学灭菌状态</p>
                            <span>{{item.ChemicalStatus}}</span>
                        </li>
                        <li>
                            <p>化学审核人</p>
                            <span>{{item.ChemicalReviewer}}</span>
                        </li>
                        <li>
                            <p>化学审核日期</p>
                            <span>{{item.ChemicalReviewDate}}</span>
                        </li>
                    </ul>
                    <h5></h5>
                    <el-table :data="item.Packages">
                        <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                        <el-table-column label="包名称" prop="Name" width="210" show-overflow-tooltip></el-table-column>
                        <el-table-column label="包状态" prop="Status" width="210"></el-table-column>
                        <el-table-column label="所在科室" prop="Location" width="210"></el-table-column>
                        <el-table-column label="住院号" prop="PatientId" width="210"></el-table-column>
                        <el-table-column label="病人姓名" prop="PatientName" width="210"></el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="shrinkNavBox">
            <div class="border_div"></div><i @click="displayNav=!displayNav" class="el-icon-d-arrow-left"></i>
        </div>
        <div class="expandNavBox" @click="displayNav=!displayNav"></div>
        <div class="cssd_table_bottom">
            <p>
                <el-button @click="cancelRecall">重新审核</el-button>
                <el-button type="primary" @click="submitRecall">一键召回</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            displayNav:true,
            submitData: {}
        };
    },
    created() {
        if (this.$route.query.sterilizeTaskId) {
            axios({
                    url: `/api/Sterilize/PackageOfBiologicalReviewFailed/${this.$route.query.sterilizeTaskId}`
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
    mounted() {},
    methods: {
        //一键召回
        submitRecall() {
            this.showInformation({
                classify: 'confirm',
                msg: '确认一键召回所有包吗?',
                confirmCallBack: () => {
                    axios({
                            url: `/api/Sterilize/RecallPackageOfBiologicalReviewFailed`,
                            method: "POST",
                            data: this.submitData
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = "success";
                                this.$router.push({
                                    path: "/sterilize/check"
                                });
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
                cancelCallBack: () => {}
            });
        },
        //重新审核
        cancelRecall() {
            this.$router.push("/sterilize/check");
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tabsTotalBar";
@import "../../assets/css/tableUnExpand";

#RecallPackages {
    .cssd_table_center {
        padding-bottom: 60px;

        .el-tabs {
            .el-tabs__header {
                .el-tabs__item {
                    height: 40px;
                    padding-top: 0;
                    text-align: left;

                    >div {
                        font-size: 20px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #fff;
                    }
                }
            }

            .el-tabs__content {
                padding: 30px 40px 30px 20px;

                .tab_content {
                    >ul {
                        li {
                            float: left;
                            line-height: 40px;
                            margin: 30px 94px 0 0;

                            p {
                                float: left;
                                text-align: right;
                                width: 96px;
                                font-size: 16px;
                                font-family: Microsoft YaHei;
                                color: rgba(135, 141, 159, 1);
                                margin-right: 16px;
                            }

                            span {
                                float: left;
                                width: 160px;
                                font-size: 16px;
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                color: rgba(51, 51, 51, 1);
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }

                            .el-select {
                                width: 160px;
                                font-size: 16px;
                                font-family: Microsoft YaHei;
                                color: rgba(196, 201, 209, 1);

                                .el-input {
                                    font: inherit;

                                    input {
                                        font: inherit;
                                    }
                                }
                            }
                        }
                    }

                    h5 {
                        height: 30px;
                        border-bottom: 1px solid #F2F4F7;
                    }

                    .el-table {
                        margin-top: 30px;

                        tbody {
                            tr:hover {
                                td {
                                    background: transparent;
                                }
                            }
                        }
                    }
                }
            }
        }

        .cssd_table_bottom {
            justify-content: flex-end;
        }
    }
}
</style>
