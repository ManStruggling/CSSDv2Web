<template>
<div class="cssd_box" id="clinicApply">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <router-link to="/apply/record" tag="li" v-if="!isChangeMode">
                <p>使用记录</p>
            </router-link>
        </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <ol class="search_box" v-if="!isChangeMode">
                <li>
                    <span class="font16gray">住院号</span>
                    <p>
                        <el-input v-model.trim="search_HospitalId" @keyup.enter.native="searchOuterPackage"></el-input>
                    </p>
                </li>
                <li>
                    <el-button type="primary" @click="searchOuterPackage" class="btn120x40">查询</el-button>
                </li>
            </ol>
            <!-- 同济版本 -->
            <ul v-if="GLOBAL.UserInfo.HospitalVersion=='TONGJI'">
                <li>
                    <p class="font16gray">住院号</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model="submitData.Patient.HospitalId" :disabled="true"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">床号</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.BedId" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">病人姓名</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.PatientName" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">病区</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SubClinic" :disabled="forbid"></el-input>
                    </div>
                </li>
                <!-- <li>
                    <p class="font16gray">手术名称</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalName" :disabled="forbid"></el-input>
                    </div>
                </li> -->
                <li>
                    <p class="font16gray">手术时间</p>
                    <div class="el_input_box font16blod">
                        <el-date-picker :editable="false" :clearable="false" v-model="submitData.Patient.SurgicalDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="forbid"></el-date-picker>
                    </div>
                </li>
                <li>
                    <p class="font16gray">手术医生</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalDoctor" :disabled="forbid"></el-input>
                    </div>
                </li>
                <!-- <li>
                    <p class="font16gray">手术间</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalRoom" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li class="font16gray">
                    <p>台次</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.Stage" :disabled="forbid"></el-input>
                    </div>
                </li> -->
            </ul>
            <!-- 非同济版本 -->
            <ul v-if="GLOBAL.UserInfo.HospitalVersion!='TONGJI'">
                <li>
                    <p class="font16gray">住院号</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model="submitData.Patient.HospitalId" :disabled="true"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">床号</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.BedId" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">病人姓名</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.PatientName" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">病区</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SubClinic" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">性别</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.Gender" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">年龄</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.Age" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">入院时间</p>
                    <div class="el_input_box font16blod">
                        <el-date-picker :editable="false" :clearable="false" v-model="submitData.Patient.AdmissionDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="forbid"></el-date-picker>
                    </div>
                </li>
                <li>
                    <p class="font16gray">手术时间</p>
                    <div class="el_input_box font16blod">
                        <el-date-picker :editable="false" :clearable="false" v-model="submitData.Patient.SurgicalDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="forbid"></el-date-picker>
                    </div>
                </li>
                <li>
                    <p class="font16gray">手术名称</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalName" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">手术间</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalRoom" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li class="font16gray">
                    <p>台次</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.Stage" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">科室</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.Clinic" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">手术医生</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalDoctor" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">手术部位</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.SurgicalSite" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li>
                    <p class="font16gray">挂号科室</p>
                    <div class="el_input_box font16blod">
                        <el-input v-model.trim="submitData.Patient.RegisteredClinic" :disabled="forbid"></el-input>
                    </div>
                </li>
                <li class="font16gray">
                    <p>挂号时间</p>
                    <div class="el_input_box font16blod">
                        <el-date-picker :editable="false" :clearable="false" v-model="submitData.Patient.RegisteredDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="forbid"></el-date-picker>
                    </div>
                </li>
            </ul>
            <el-table :data="submitData.Packages.concat(submitData.OlderSystemPackages)">
                <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                <el-table-column label="包名称" width="210"  show-overflow-tooltip>
                    <template slot-scope="props">{{props.row.ProductName?props.row.ProductName:"-"}}</template>
                </el-table-column>
                <el-table-column label="有效日期" width="210">
                    <template slot-scope="props">{{props.row.ValidDate?props.row.ValidDate:"-"}}</template>
                </el-table-column>
                <el-table-column label="原住院号" width="210">
                    <template slot-scope="props">{{props.row.PatientHospitalId?props.row.PatientHospitalId:"-"}}</template>
                </el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="props">
                        <a @click.stop="deletePackage(props.row)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p>
                共计
                <span>{{countPackageNumber(submitData.Packages.concat(submitData.OlderSystemPackages))}}</span> 包
            </p>
            <p>
                <el-button @click="cancelChange" v-if="isChangeMode">取消修改</el-button>
                <el-button type="primary" @click="applySubmit">{{isChangeMode?'修改完成':'确认使用'}}</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :BarCodeList="submitData.Packages.concat(submitData.OlderSystemPackages)" :ApiUrl="'/api/Scanner/Apply'" :CustomBarcode="true"></ManualEnter>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
    inject: ['reload'],
    data() {
        return {
            forbid: true, //禁用文本框
            search_HospitalId: "", //搜索住院号
            isShowManualEnter: false,
            isChangeMode: false, //记录修改
            isHasPakcageOfDifferentHospitalId: false,
            submitData: {
                Patient: {
                    HospitalId: "",
                    PatientName: "",
                    Gender: "",
                    Age: "",
                    AdmissionDate: "",
                    Clinic: "",
                    SubClinic: "",
                    BedId: "",
                    SurgicalName: "",
                    SurgicalDoctor: "",
                    RegisteredClinic: "",
                    RegisteredDate: "",
                    SurgicalRoom: "",
                    SurgicalSite: "",
                    SurgicalDate: "",
                    Stage: ""
                },
                Packages: [],
                OlderSystemPackages: []
            }
        };
    },
    components: {
        ManualEnter
    },
    //路由前置守卫
    beforeRouteEnter(to, from, next) {
        if (sessionStorage.userInfo) {
            if (
                UserInfo.JobAndCompetence.includes("271") ||
                UserInfo.JobAndCompetence.includes("272") ||
                UserInfo.JobAndCompetence.includes("000") ||
                UserInfo.JobAndCompetence.includes("200") ||
                UserInfo.JobAndCompetence.includes("202")
            ) {
                next();
            } else {
                next(from.path);
                VueVm.$message({
                    type: "warning",
                    message: "您没有使用模块访问权限！",
                    center: true,
                    duration: 2000,
                    showClose: true
                });
            }
        } else {
            next("/login");
        }
    },
    created() {
        CSManager.handleDataThis = this;
        //修改
        if (this.$route.query.recordId) {
            this.isChangeMode = true;
            axios({
                    url: `/api/Apply/PendingUpdateApplyingRecord/${this.$route.query.recordId}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        this.submitData = res.data.Data;
                        this.collapseChange("0");
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
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        goBack(){
            if(this.isChangeMode){
                this.cancelChange();
            }else{
                this.$router.push('/');
            }
        },
        //住院号查询
        searchOuterPackage() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.search_HospitalId,
                    type: "StringNotEmpty",
                    msg: "查询的住院号不能为空！"
                }])
            ) {
                axios({
                        url: `/api/Apply/MessageOfPatient/${this.search_HospitalId}`
                    })
                    .then(res => {
                        let type;
                        this.forbid = false;
                        this.submitData.Packages = [];
                        this.submitData.OlderSystemPackages = [];
                        this.isHasPakcageOfDifferentHospitalId = false;
                        if (res.data.Code == 200) {
                            type = "success";
                            this.submitData.Patient = res.data.Data.Patient;
                        } else {
                            type = "error";
                            this.submitData.Patient = {
                                HospitalId: this.search_HospitalId,
                                PatientName: "",
                                Gender: "",
                                Age: "",
                                AdmissionDate: "",
                                Clinic: "",
                                SubClinic: "",
                                BedId: "",
                                SurgicalName: "",
                                SurgicalDoctor: "",
                                RegisteredClinic: "",
                                RegisteredDate: "",
                                SurgicalRoom: "",
                                SurgicalSite: "",
                                SurgicalDate: "",
                                Stage: ""
                            };
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        });
                    })
                    .then(err => {});
            }
        },
        //取消修改
        cancelChange() {
            this.$router.push({
                path: "/apply/record"
            });
        },
        //确认使用
        applySubmit() {
            let url = "/api/Apply/ApplyCheck";
            let method = "POST";
            if (this.isChangeMode) {
                method = "PUT";
                url = "/api/Apply/ApplyModify";
            }
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.submitData.Patient.HospitalId,
                        type: "StringNotEmpty",
                        msg: "住院号不能为空！"
                    },
                    {
                        val: this.submitData.Patient.BedId,
                        type: "StringNotEmpty",
                        msg: "床号不能为空！"
                    },
                    {
                        val: this.submitData.Patient.PatientName,
                        type: "StringNotEmpty",
                        msg: "病人姓名不能为空！"
                    },
                    {
                        val: this.submitData.Packages.concat(this.submitData.OlderSystemPackages),
                        type: "ArrayNotEmpty",
                        msg: "您还没有录入包，请至少录入一个包！"
                    }
                ])
            ) {
                if (this.isHasPakcageOfDifferentHospitalId) {
                    this.showInformation({
                        classify: 'confirm',
                        msg: '外来器械包绑定的住院号与本次使用的病人住院号不同，确定要使用包吗？',
                        confirmCallBack: () => {
                            if (this.GLOBAL.UserInfo.HospitalVersion == 'TONGJI') {
                                if (this.GLOBAL.UserInfo.JobAndCompetence.includes('000') || this.GLOBAL.UserInfo.JobAndCompetence.includes('200')||this.GLOBAL.UserInfo.JobAndCompetence.includes('271')) {
                                    this.submitRequest(url, method);
                                } else {
                                    this.showInformation({
                                        classify: 'message',
                                        msg: '暂无权限使用住院号不同的包！'
                                    });
                                }
                            } else {
                                this.submitRequest(url, method);
                            }
                        },
                        cancelCallBack: () => {}
                    });
                } else {
                    this.submitRequest(url, method);
                }

            }
        },
        //使用提交请求
        submitRequest(url, method) {
            axios({
                    url: url,
                    method: method,
                    data: this.submitData
                })
                .then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        if (this.isChangeMode) {
                            this.$router.push({
                                path: "/apply/record"
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
        },
        //删除包
        deletePackage(row) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该包吗?',
                confirmCallBack: () => {
                    if (row.ProductName) {
                        this.submitData.Packages.forEach((element, index) => {
                            if (element.BarCode === row.BarCode) {
                                this.submitData.Packages.splice(index, 1);
                                return;
                            }
                        })
                    } else {
                        this.submitData.OlderSystemPackages.forEach((element, index) => {
                            if (element.BarCode === row.BarCode) {
                                this.submitData.OlderSystemPackages.splice(index, 1);
                                return;
                            }
                        })
                    }
                },
                cancelCallBack: () => {}
            });
        },
        //处理手工录入
        handleShowManualEnter() {
            if (this.isChangeMode || this.submitData.Patient.HospitalId) {
                this.isShowManualEnter = true;
            } else {
                this.showInformation({
                    classify: "message",
                    msg: "您还没有查询住院号！请查询住院号再录入包！"
                });
            }
        },
        //手工录入数据传递
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {
                //存在住院号
                if (data.PatientHospitalId) {
                    if (data.PatientHospitalId != this.submitData.Patient.HospitalId) {
                        this.showInformation({
                            classify: 'confirm',
                            msg: '该外来器械包绑定的住院号与本次使用的病人住院号不同，您确定要使用该包吗?',
                            confirmCallBack: () => {
                                this.submitData.Packages.push(data);
                                this.isHasPakcageOfDifferentHospitalId = true;
                                this.showInformation({
                                    classify: "notify",
                                    msg: `您使用的外来器械包${data.BarCode}和该病人的住院号不同，请重打包条码！`,
                                    type: "warning",
                                    duration: 0
                                });
                            },
                            cancelCallBack: () => {}
                        });
                    } else {
                        this.submitData.Packages.push(data);
                    }
                } else {
                    if (data.IsOldPackageBarCode) {
                        this.submitData.OlderSystemPackages.push(data);
                    } else {
                        this.submitData.Packages.push(data);
                    }
                }
            }
        },
        handleBarCode(msg) {
            if (this.submitData.Patient.HospitalId) {
                let onOff = true;
                this.submitData.Packages.concat(this.submitData.OlderSystemPackages).forEach(item => {
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
                            url: `/api/Scanner/Apply/${msg}`
                        }).then(res => {
                            if (res.data.Code == 200) {
                                this.packageData2father(res.data.Data);
                            } else if (res.data.Code == 404) {
                                this.packageData2father({
                                    BarCode: this.input_str,
                                    IsOldPackageBarCode: true
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
            } else {
                this.showInformation({
                    classify: "message",
                    msg: "您还没有查询住院号，请查询住院号再扫描包条码！",
                    type: "warning"
                });
            }
        }
    },
    computed: {
        countPackageNumber() {
            return list => {
                return list.length;
            };
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#clinicApply {
    .cssd_table_center {
        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;

            .search_box {
                display: flex;
                justify-content: space-around;
                width: 450px;
                margin-bottom: 20px;

                >li {
                    width: 234px;
                    display: flex;
                    justify-content: space-between;
                    margin-right: 20px;

                    >span {
                        width: 64px;
                        line-height: 40px;
                        margin-right: 10px;
                        text-align: right;
                    }

                    >p {
                        .el-input {
                            width: 160px;
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                    }
                }
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                padding-bottom: 10px;
                border-bottom: 1px solid #f2f4f7;
                margin-bottom: 30px;

                li {
                    width: 234px;
                    display: flex;
                    justify-content: space-between;
                    margin: 0 120px 20px 0;

                    p {
                        width: 64px;
                        line-height: 40px;
                        text-align: right;
                    }

                    .el_input_box {
                        width: 160px;
                        line-height: 40px;

                        .el-input {
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }

                        .el-date-editor {
                            width: 100%;
                        }
                    }
                }
            }

            .el-table {
                tbody {
                    .cell {
                        font-size: 18px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(35, 46, 65, 1);

                        a {
                            color: #F93E3E;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
