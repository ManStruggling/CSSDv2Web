<template>
<!-- 包装弹窗 -->
<div id="editBox" class="staffBox">
    <div class="editContainer">
        <div class="editContent">
            <ul class="clear_float">
                <li>
                    <p>员工姓名</p>
                    <el-input type="text" placeholder="员工姓名(必填)" v-model.trim="editBoxData.Name"></el-input>
                </li>
                <li>
                    <p>员工工号</p>
                    <el-input placeholder="员工工号(必填)" v-model.trim="editBoxData.JobNumber"></el-input>
                </li>
                <li>
                    <p>员工条码编号</p>
                    <el-input type="text" v-model="editBoxData.BarCode" :disabled="true"></el-input>
                </li>
                <li>
                    <p>登录密码</p>
                    <el-input placeholder="登录密码(必填)" v-model.trim="editBoxData.Password"></el-input>
                </li>
                <li>
                    <p>所属科室</p>
                    <el-select v-model="editBoxData.ClinicId" class="green24x13">
                        <el-option v-for="(item,index) in clinics" :key="index" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </li>
            </ul>
            <el-tabs v-model="tabActiveName" closable addable type="card" @edit="handleTabsEdit">
                <el-tab-pane v-for="(item,index) in editBoxData.RolesForStaff" :key="index" :label="item.ClinicName" :name="index+''">
                    <div class="powerDetail">
                        <el-table :data="item.JobAndCompetence">
                            <el-table-column label="岗位">
                                <template slot-scope="props">
                                    <el-select v-model="props.row.RoleJob" filterable default-first-option @change="((val)=>{forbidOption(val,index,props.row)})" :disabled="props.row.Forbid" class="green18x10" placeholder="请选择(必填)">
                                        <el-option v-for="(val,idx) in item.Roles" :key="idx" :label="val.Item1" :value="val.Item2" :disabled="val.Forbid"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="职位">
                                <template slot-scope="props">
                                    <el-select v-model="props.row.Competence" filterable default-first-option class="green18x10" placeholder="请选择(必填)">
                                        <el-option v-for="(val,idx) in item.RoleCompetence" :key="idx" :label="val.Item1" :value="val.Item2" :disabled="val.Forbid"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="60">
                                <template slot-scope="props">
                                    <a @click="deleteCompetence(index,props.$index)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="switchBox">
                            <p>
                                <span>护士长</span>
                                <el-switch v-model="item.IsMatron" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false" @change="((val)=>{matronSwitchChange(val,item)})"></el-switch>
                            </p>
                            <p>
                                <span>预设权限</span>
                                <el-switch v-model="item.IsDefaultNurse" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false" @change="((val)=>{defaultSwitchChange(val,item)})"></el-switch>
                            </p>
                        </div>
                        <el-button size="mini" type="primary" @click="addCompetence(index)" :disabled="item.AddRoleForbid" class="btn88x32">新增权限</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="editBoxOption">
            <el-button @click="editBoxCancelSave">取消</el-button>
            <el-button type="primary" @click="editBoxSave">完成</el-button>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <div class="clinic_select_box" v-show="isShowClinicSelect">
            <dl>
                <dt>
                    <el-select filterable default-first-option v-model="clinicSelect" class="green18x10">
                        <el-option v-for="(item,index) in powersAndRoles.Clinics" :key="index" :label="item.ClinicName" :value="item.ClinicId"></el-option>
                    </el-select>
                </dt>
                <dd>
                    <el-button @click="cancelAdd" class="btn88x32empty">取消</el-button>
                    <el-button type="primary" @click="addComplete" class="btn88x32">确定</el-button>
                </dd>
            </dl>
        </div>
    </transition>
</div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            powersAndRoles: {},
            clinicSelect: "",
            isShowClinicSelect: false,
            tabActiveName: "0",
            editBoxData: {
                ClinicId: "",
                Id: 0,
                Name: "",
                JobNumber: "",
                BarCode: "",
                Password: "",
                RolesForStaff: []
            },
            clinics: []
        };
    },
    created() {
        this.editBoxData = this.$props.data;
        axios({
                url: "/api/Staff/ClinicsAndOwnerRoles"
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.powersAndRoles = res.data.Data;
                    if (this.editBoxData.RoleJsonData) {
                        this.editBoxData.RolesForStaff = JSON.parse(this.editBoxData.RoleJsonData).RolesForStaff;
                        if (JSON.parse(this.editBoxData.RoleJsonData).IsImport) {
                            //批量导入的数据添加权限列表
                            this.editBoxData.RolesForStaff;
                            for (let i = 0; i < this.editBoxData.RolesForStaff.length; i++) {
                                this.editBoxData.RolesForStaff[i].RoleCompetence = this.powersAndRoles.RoleCompetence;
                                for (let j = 0; i < this.powersAndRoles.Clinics.length; j++) {
                                    if (this.editBoxData.RolesForStaff[i].ClinicId === this.powersAndRoles.Clinics[j].ClinicId) {
                                        if (this.powersAndRoles.Clinics[j].ClinicType === 1) {
                                            this.editBoxData.RolesForStaff[i].Roles = this.powersAndRoles.RoleJobCssd;
                                        } else {
                                            this.editBoxData.RolesForStaff[i].Roles = this.powersAndRoles.RoleJobClinic;
                                        }
                                        this.editBoxData.RolesForStaff[i].ClinicName = this.powersAndRoles.Clinics[j].ClinicName;
                                        this.editBoxData.RolesForStaff[i].JobAndCompetence = [];
                                        this.editBoxData.RolesForStaff[i].AddRoleForbid = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
        axios({url:`/api/Clinic`}).then(res=>{
            if(res.data.Code==200){
                this.clinics = res.data.Data;
            }else{
                this.showInformation({classify:'message',msg:res.data.Msg});
            }
        })
    },
    methods: {
        //默认权限开关
        defaultSwitchChange(val, item) {
            if (val) {
                item.IsMatron = false;
                item.AddRoleForbid = true;
                item.JobAndCompetence = [];
                item.Roles.forEach(element => {
                    element.Forbid = false;
                })
            } else {
                item.AddRoleForbid = false;
            }
            this.$forceUpdate();
        },
        //护士长开关
        matronSwitchChange(val, item) {
            if (val) {
                item.AddRoleForbid = true;
                item.IsDefaultNurse = false;
                item.JobAndCompetence = [];
                item.Roles.forEach(element => {
                    element.Forbid = false;
                })
            } else {
                item.AddRoleForbid = false;
            }
            this.$forceUpdate();
        },
        //禁用验证
        forbidOption(val, index, row) {
            row.Forbid = true;
            this.editBoxData.RolesForStaff[index].Roles.forEach(element => {
                if (element.Item2 == val) {
                    element.Forbid = true;
                    return;
                }
            });
        },
        //新增权限
        addCompetence(index) {
            this.editBoxData.RolesForStaff[index].JobAndCompetence.push({
                RoleJob: "",
                Competence: ""
            });
        },
        //删除角色 RoleJob
        deleteCompetence(index, $index) {
            this.editBoxData.RolesForStaff[index].Roles.forEach(element => {
                if (
                    element.Item2 ==
                    this.editBoxData.RolesForStaff[index].JobAndCompetence[$index].RoleJob
                ) {
                    element.Forbid = false;
                }
            });
            this.editBoxData.RolesForStaff[index].JobAndCompetence.splice($index, 1);
        },
        //新增科室 取消
        cancelAdd() {
            this.isShowClinicSelect = false;
            this.clinicSelect = "";
        },
        //新增科室 确定
        addComplete() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.clinicSelect,
                    type: "StringNotEmpty",
                    msg: "您还没有选择科室！请选择科室！"
                }])
            ) {
                this.clinicSelect = this.powersAndRoles.Clinics.filter(val => {
                    return val.ClinicId == this.clinicSelect;
                })[0];
                //查重该科室有没有添加权限
                if (
                    this.editBoxData.RolesForStaff.filter(val => {
                        return val.ClinicId == this.clinicSelect.ClinicId;
                    }).length == 0
                ) {
                    //该科室没有添加添加权限，所以可以添加
                    this.editBoxData.RolesForStaff.push({
                        ClinicId: this.clinicSelect.ClinicId,
                        ClinicName: this.clinicSelect.ClinicName,
                        ClinicType: this.clinicSelect.ClinicType,
                        IsMatron: false,
                        IsDefaultNurse: false,
                        JobAndCompetence: [],
                        Roles: this.clinicSelect.ClinicType == 1 ?
                            this.powersAndRoles.RoleJobCssd :
                            this.powersAndRoles.RoleJobClinic,
                        RoleCompetence: this.powersAndRoles.RoleCompetence
                    });
                    this.clinicSelect = "";
                    this.isShowClinicSelect = false;
                } else {
                    //该科室添加过了
                    this.clinicSelect = "";
                    this.showInformation({
                        classify: "message",
                        msg: "该科室已经添加了!请重新选择科室!",
                        type: "warning"
                    });
                }
            }
        },
        //处理标签编辑事件
        handleTabsEdit(targetName, action) {
            //新增科室权限
            if (action === "add") {
                this.isShowClinicSelect = true;
            }
            //删除科室权限
            if (action === "remove") {
                this.showInformation({
                    classify: 'confirm',
                    msg: '您确定要删除该科室的权限?',
                    confirmCallBack: () => {
                        this.editBoxData.RolesForStaff.splice(targetName, 1);
                        this.$forceUpdate();
                    },
                    cancelCallBack: () => {}
                });
            }
        },
        //取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //保存编辑
        editBoxSave() {
            //before submit must to do： 数据转换 表单验证;
            let axiosMethod = "";
            if (this.editBoxData.Id == 0) {
                //新增模式
                axiosMethod = "post";
            } else {
                //更新模式 this.editBoxData.RolesForStaff==""
                axiosMethod = "put";
            }
            //员工姓名、工号、密码、权限验证 this.editBoxData.Password
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.editBoxData.Name,
                        type: "StringNotEmpty",
                        msg: "员工名字不能为空！"
                    },
                    {
                        val: this.editBoxData.JobNumber,
                        type: "AccountOrPassword",
                        msg: "账号不符合规范！账号必须为字母、数字、下划线。"
                    },
                    {
                        val: this.editBoxData.Password,
                        type: "AccountOrPassword",
                        msg: "密码不符合规范！密码必须为字母、数字、下划线。"
                    },
                    {
                        val: this.editBoxData.ClinicId,
                        type: "StringNotEmpty",
                        msg: "人员所属科室不能为空！"
                    },
                    {
                        val: this.editBoxData.RolesForStaff,
                        type: "ArrayNotEmpty",
                        msg: "您还没有为员工配权限！"
                    }
                ])
            ) {
                let val_arr1 = [];
                let msg_arr1 = [];
                this.editBoxData.RolesForStaff.forEach(element => {
                    if (element.IsMatron === false && element.IsDefaultNurse === false) {
                        val_arr1.push(element.JobAndCompetence);
                        msg_arr1.push("您配置的科室还没有添加权限！请至少配置一个权限！");
                    }
                });
                // 科室至少配置一条权限
                if (
                    this.GLOBAL.VerificationHandle([{
                        val: val_arr1,
                        type: "ArrayAllNotEmpty",
                        msg: msg_arr1
                    }])
                ) {
                    let val_arr2 = [];
                    let val_arr3 = [];
                    let msg_arr2 = [];
                    let msg_arr3 = [];
                    for (let i = 0; i < this.editBoxData.RolesForStaff.length; i++) {
                        for (
                            let j = 0; j < this.editBoxData.RolesForStaff[i].JobAndCompetence.length; j++
                        ) {
                            val_arr2.push(
                                this.editBoxData.RolesForStaff[i].JobAndCompetence[j].RoleJob
                            );
                            val_arr3.push(
                                this.editBoxData.RolesForStaff[i].JobAndCompetence[j].Competence
                            );
                            msg_arr2.push("科室权限组的岗位不能为空！");
                            msg_arr3.push("科室权限组的职位不能为空！");
                        }
                    }
                    //科室权限必须配置完整
                    if (
                        this.GLOBAL.VerificationHandle([{
                                val: val_arr2,
                                type: "StringAllNotEmpty",
                                msg: msg_arr2
                            },
                            {
                                val: val_arr3,
                                type: "StringAllNotEmpty",
                                msg: msg_arr3
                            }
                        ])
                    ) {
                        axios({
                                url: "/api/Staff",
                                method: axiosMethod,
                                data: this.editBoxData
                            })
                            .then(res => {
                                let type;
                                if (res.data.Code == 200) {
                                    //请求成功
                                    type = "success";
                                    this.$emit("to-father", res.data.Data);
                                } else if (res.data.Code == 300) {
                                    //其他状态码
                                    type = "warning";
                                } else {
                                    type = "error";
                                }
                                this.showInformation({
                                    classify: "message",
                                    msg: res.data.Msg,
                                    type: type
                                });
                            })
                            .catch(error => {});
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss">
#editBox.staffBox {
    .editContainer {
        .editContent {
            >ul {
                border-bottom: 1px solid #f2f4f7;
            }

            .el-tabs {
                width: 100%;

                .el-tabs__header {
                    height: 40px;
                    display: flex;
                    justify-content: flex-end;
                    flex-flow: row-reverse;
                    border-bottom: 1px solid #f7f8fa;

                    .el-tabs__new-tab {
                        margin: 5px 0 5px 10px;
                        width: 50px;
                        height: 30px;
                        background: #00c16b url("../../assets/images/add.png") no-repeat center;
                        background-size: 20px 20px;
                        border: 0;

                        >i {
                            display: none;
                        }
                    }

                    .el-tabs__nav {
                        .el-tabs__item {
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            color: rgba(135, 141, 159, 1);

                            &:focus.is-active.is-focus:not(:active) {
                                box-shadow: 0 0 2px 2px #00c16b inset;
                            }

                            .el-icon-close {
                                font-size: 17px;
                                color: #d6d8dc;

                                &:hover {
                                    background-color: transparent;
                                }
                            }

                            &.is-active {
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                color: rgba(35, 46, 65, 1);
                            }
                        }
                    }
                }

                .el-tabs__content {
                    .powerDetail {
                        padding-bottom: 40px;
                        position: relative;

                        .el-table {
                            width: 430px;
                            margin-left: 20px;

                            &::before {
                                height: 0;
                            }

                            thead {
                                tr {
                                    th {
                                        border: 0;
                                        width: 190px;

                                        .cell {
                                            font-size: 18px;
                                            font-family: Microsoft YaHei;
                                            color: rgba(135, 141, 159, 1);
                                        }
                                    }
                                }
                            }

                            tbody {
                                tr {
                                    &:hover {
                                        td {
                                            background: transparent;
                                        }
                                    }

                                    td {
                                        border: 0;

                                        .el-select {
                                            width: 140px;

                                            input {
                                                font-size: 16px;
                                                font-family: Microsoft YaHei;
                                                font-weight: bold;
                                                color: rgba(51, 51, 51, 1);
                                            }
                                        }

                                        a {
                                            color: #f93e3e;
                                            cursor: pointer;
                                            font-size: 18px;
                                            font-family: Microsoft YaHei;
                                            font-weight: bold;
                                        }
                                    }
                                }
                            }
                        }

                        .el-button {
                            margin: 10px 0 0 30px;

                            &.is-disabled {
                                background: #ccc;
                            }
                        }

                        .switchBox {
                            position: absolute;
                            right: 30px;
                            top: 20px;

                            p {
                                display: flex;
                                margin-bottom: 10px;

                                >span {
                                    font-size: 18px;
                                    font-family: Microsoft YaHei;
                                    color: rgba(135, 141, 159, 1);
                                    margin-right: 10px;
                                    width: 72px;
                                    text-align: right;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .clinic_select_box {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background: rgba(51, 51, 51, 0.6);
        z-index: 2;

        dl {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            width: 220px;
            height: 135px;
            background: #fff;
            z-index: 2;
            padding: 20px 30px;
            box-sizing: border-box;
            border-radius: 8px;

            dt {
                display: flex;
                justify-content: center;

                .el-select {
                    width: 160px;

                    input {
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(51, 51, 51, 1);
                    }
                }
            }

            dd {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;

                .el-button {
                    width: 70px;
                }
            }
        }
    }
}
</style>
