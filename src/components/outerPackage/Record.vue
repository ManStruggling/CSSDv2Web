<template>
<div class="cssd_box outerPackageRegistrationRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li>
                <router-link to="/outerPackage/Registration" tag="p">返回</router-link>
            </li>
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
    <div class="cssd_table_center cssd_record_ui table_expand">
        <div class="content_title">
            <p>登记日期</p>
            <p>登记人</p>
            <p>住院号</p>
            <p>病人姓名</p>
            <p>使用科室</p>
            <p>操作</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh" v-if="item.IsBackupPackage">
                    <div class="collapseTd">
                        <p>{{item.RegisterDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.RegisterPerson}}</p>
                    </div>
                    <div class="collapseTd">
                        <p></p>
                    </div>
                    <div class="collapseTd">
                        <p></p>
                    </div>
                    <div class="collapseTd">
                        <p></p>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <el-button size="mini" @click.stop="changeRecord(collapseIndex)">修改</el-button>
                        </p>
                    </div>
                </div>
                <div slot="title" class="collapseTh" v-if="!item.IsBackupPackage">
                    <div class="collapseTd">
                        <p>{{item.RegisterDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.RegisterPerson}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Patient.HospitalId}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Patient.PatientName}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Patient.Clinic}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <el-button size="mini" @click.stop="changeRecord(collapseIndex)" :disabled="GLOBAL.UserInfo.JobAndCompetence.includes('111')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('100')?false:true">修改</el-button>
                        </p>
                    </div>
                </div>
                <ul class="record_detail clear_float" v-if="!item.IsBackupPackage">
                    <li>
                        <p>医生姓名：</p>
                        <span>{{item.Patient.SurgicalDoctor}}</span>
                    </li>
                    <li>
                        <p>床号：</p>
                        <span>{{item.Patient.BedId}}</span>
                    </li>
                    <li>
                        <p>性别：</p>
                        <span>{{item.Patient.Age}}</span>
                    </li>
                    <li>
                        <p>入院时间：</p>
                        <span>{{item.Patient.AdmissionDate}}</span>
                    </li>
                    <li>
                        <p>病区：</p>
                        <span>{{item.Patient.SubClinic}}</span>
                    </li>
                    <li>
                        <p>挂号科室：</p>
                        <span>{{item.Patient.RegisteredClinic}}</span>
                    </li>
                    <li>
                        <p>挂号科室：</p>
                        <span>{{item.Patient.RegisteredClinic}}</span>
                    </li>
                    <li>
                        <p>挂号时间：</p>
                        <span>{{item.Patient.RegisteredDate}}</span>
                    </li>
                    <li>
                        <p>门诊类型：</p>
                        <span>{{item.Patient.OutpatientType}}</span>
                    </li>
                    <li>
                        <p>手术名称：</p>
                        <span>{{item.Patient.SurgicalName}}</span>
                    </li>
                    <li>
                        <p>手术间：</p>
                        <span>{{item.Patient.SurgicalRoom}}</span>
                    </li>
                    <li>
                        <p>手术部位：</p>
                        <span>{{item.Patient.SurgicalSite}}</span>
                    </li>
                    <li>
                        <p>手术时间：</p>
                        <span>{{item.Patient.SurgicalDate}}</span>
                    </li>
                    <li>
                        <p>台次：</p>
                        <span>{{item.Patient.Stage}}</span>
                    </li>
                </ul>
                <el-table :data="item.OuterPackages" :default-expand-all="true">
                    <el-table-column label="包名称" prop="PackageName" width="240"></el-table-column>
                    <el-table-column label="分包数" prop="SplitPackageCount" width="210"></el-table-column>
                    <el-table-column label="有无植入物" width="210">
                        <template slot-scope="props">{{props.row.HasImplants?"有":"无"}}</template>
                    </el-table-column>
                    <el-table-column label="关联网篮" prop="CarrierName" width="210"></el-table-column>
                    <el-table-column label="送包单位" prop="SupplierName" width="210"></el-table-column>
                    <el-table-column label="送包人" prop="SupplierPerson" width="210"></el-table-column>
                    <el-table-column></el-table-column>
                    <el-table-column width="1" type="expand">
                        <template slot-scope="props" v-if="props.row.Instruments==''?false:true">
                            <div class="table_detail">
                                <div class="myTableTitle">
                                    <p>器械名称</p>
                                    <p>规格</p>
                                    <p>数量</p>
                                </div>
                                <ul>
                                    <li v-for="(val,idx) in props.row.Instruments" :key="idx">
                                        <p>{{val.Name}}</p>
                                        <p>{{val.Specification}}</p>
                                        <p>{{val.Quantity}}</p>
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
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.recordList[index].OuterPackages == '' || this.recordList[index].OuterPackages === null)) {
                axios({
                    url: `/api/Recycle/OuterProductRecordDetail/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].OuterPackages = res.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //修改记录
        changeRecord(index) {
            this.$router.push({
                path: "/outerPackage/Registration",
                query: {
                    recordId: this.recordList[index].Id
                }
            });
        },
        //查询
        searchRecordsData() {
            this.GLOBAL.searchRecord(`/api/Recycle/OuterProductRegisterRecords/${this.search_date[0]}/${this.search_date[1]}`, this);
        },
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableExpand";
</style>
