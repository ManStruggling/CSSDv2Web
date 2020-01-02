<template>
<div class="cssd_box">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/sterilize/select" tag="li">
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
            <p>灭菌日期</p>
            <p>灭菌编号</p>
            <p>操作人</p>
            <p>包数量</p>
            <p>操作</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.SterilizeDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.SterilizeBarCode}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Sterilizer}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.SterilizePackageQuantity}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <el-button size="mini" @click.stop="changeRecord(collapseIndex)" :disabled="(GLOBAL.UserInfo.JobAndCompetence.includes('141')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('100'))&&!item.CanNotBeModified?false:true">修改</el-button>
                        </p>
                    </div>
                </div>
                <ul class="record_detail clear_float">
                    <li>
                        <p>灭菌设备</p>
                        <span>{{item.SterilizeDeviceName}}</span>
                    </li>
                    <li>
                        <p>灭菌程序</p>
                        <span>{{item.SterilizeProgramName}}</span>
                    </li>
                    <li>
                        <p>代消包数量</p>
                        <span>{{item.HelpSterilizeQuantity}}</span>
                    </li>
                    <li>
                        <p>当日锅次</p>
                        <span>{{item.SterilizeTodayBatch}}</span>
                    </li>
                    <li>
                        <p>总锅次</p>
                        <span>{{item.SterilizeTotalBatch}}</span>
                    </li>
                </ul>
                <el-table :data="item.Carriers" :default-expand-all="true" @row-click="tableRowClick">
                    <el-table-column label="网篮条码" prop="CarrierBarCode" width="240"></el-table-column>
                    <el-table-column label="网篮名称" prop="CarrierName" width="210"></el-table-column>
                    <el-table-column label="包数量" prop="PackageInCarrierQuantity" width="210"></el-table-column>
                    <el-table-column></el-table-column>
                    <el-table-column type="expand" width="1">
                        <template slot-scope="props">
                            <div class="table_detail">
                                <div class="myTableTitle">
                                    <p>包条码</p>
                                    <p>包名称</p>
                                    <p>所属科室</p>
                                    <p>包数量</p>
                                </div>
                                <ul v-if="props.row.Packages">
                                    <li v-for="(selfs,myTableIndex) in props.row.Packages" :key="myTableIndex">
                                        <p>{{selfs.PackageBarCode}}</p>
                                        <p>
                                            <el-tooltip :content="selfs.ProductName" placement="top-start" :disabled="selfs.ProductName.length<10">
                                                <div>{{selfs.ProductName}}</div>
                                            </el-tooltip>
                                        </p>
                                        <p>{{selfs.ProvideSubClinic}}</p>
                                        <p>{{selfs.ProductQuantity}}</p>
                                    </li>
                                </ul>
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
        //修改灭菌记录
        changeRecord(index) {
            this.$router.push({
                path: "/sterilize/registration",
                query: {
                    recordId: this.recordList[index].Id
                }
            });
        },
        //折叠面板切换
        collapseChange(index) {
            if (index != "" && this.recordList[index].Carriers == "") {
                axios({
                    url: `/api/Sterilize/CarrierForSterilizeRecordBy/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].Carriers = res.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //table row click
        tableRowClick(row, column, event, collapseIndex) {
            if (!row.Packages) {
                axios({
                        url: `/api/Sterilize/PackageForSterilizeRecordBy/${row.SterilizeTaskId}/${row.CarrierId}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            row.Packages = res.data.Data;
                        } else {
                            this.$message({
                                type: "error",
                                center: true,
                                duration: 2000,
                                message: res.data.Msg
                            });
                        }
                    })
                    .catch(err => {});
            }
        },
        //查询
        searchRecordsData() {
            this.GLOBAL.searchRecord(`/api/Sterilize/SterilizeRecords/${this.search_date[0]}/${this.search_date[1]}`, this);
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableExpand";
</style>
