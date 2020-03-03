<template>
<!-- 编辑弹出框 -->
<div id="editBox" class="clinicBox">
    <div class="editContainer">
        <div class="editContent table_unExpand">
            <ul class="clear_float">
                <li>
                    <p>科室名称</p>
                    <el-input type="text" placeholder="科室名称(必填)" v-model.trim="editBoxData.Name"></el-input>
                </li>
                <li>
                    <p>科室简码</p>
                    <el-input type="text" v-model="editBoxData.ShortCode" :disabled="editBoxData.Id==0"></el-input>
                </li>
                <li>
                    <p>科室电话</p>
                    <el-input type="text" placeholder="科室电话" v-model.trim="editBoxData.Telephone"></el-input>
                </li>
                <li>
                    <p>科室类型</p>
                    <el-select v-model="editBoxData.ClinicType" class="green24x13" :disabled="clinicTypeForbit" placeholder="请选择(必填)">
                        <el-option label="供应室" :value="1"></el-option>
                        <el-option label="科室" :value="2"></el-option>
                        <!-- <el-option label="手术室" :value="3"></el-option> -->
                        <el-option label="医院" :value="4"></el-option>
                    </el-select>
                </li>
            </ul>
            <el-table :data="editBoxData.SubClinics">
                <el-table-column label="子科室名称" width="240">
                    <template slot-scope="props">
                        <el-input v-model.trim="props.row.Name" placeholder="子科室名称(必填)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="科室简码" prop="ShortCode" width="210"></el-table-column>
                <el-table-column label="科室电话" width="210">
                    <template slot-scope="props">
                        <el-input v-model.trim="props.row.Telephone"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')" label="Id" prop="Id" width="210"></el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="props">
                        <a class="delete_this_tr" @click.stop="deleteThisEditBoxTr(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
            <div class="addSubClinics">
                <el-button type="primary" @click="addEditBoxTr" class="btn120x40" :disabled="editBoxData.ClinicType===1&&editBoxData.SubClinics.length===1?true:false">新增子科室</el-button>
            </div>
        </div>
        <div class="editBoxOption">
            <el-button @click="editBoxCancelSave">取消</el-button>
            <el-button type="primary" @click="editBoxSave">完成</el-button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            clinicTypeForbit: false,
            editBoxData: {}
        };
    },
    created() {
        this.editBoxData = this.$props.data;
        if (this.editBoxData.Id != 0) {
            //update不允许更改科室类型
            this.clinicTypeForbit = true;
        }
    },
    methods: {
        //取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //保存编辑
        editBoxSave() {
            //before submit must to do： 数据转换 表单验证;
            let axiosMethod = "";
            let arr = [{
                    val: [this.editBoxData.Name, this.editBoxData.ClinicType],
                    type: "StringAllNotEmpty",
                    msg: ["科室名称不能为空！", "科室类型必选！"]
                },
                {
                    val: this.editBoxData.SubClinics,
                    type: "ArrayNotEmpty",
                    msg: "您还没有添加子科室！请至少添加一个子科室！"
                }
            ];
            if (this.editBoxData.Id == 0) {
                //新增模式
                axiosMethod = "post";
            } else {
                //更新模式
                axiosMethod = "put";
                arr.push({
                    val: this.editBoxData.ShortCode,
                    type: "ValueNotEmptyAndNotNull",
                    msg: "简码不能为空！"
                });
            }
            if (this.GLOBAL.VerificationHandle(arr)) {
                let val_arr = [];
                let msg_arr = [];
                this.editBoxData.SubClinics.forEach(element => {
                    val_arr.push(element.Name);
                    msg_arr.push("子科室名称不能为空！");
                });
                if (this.GLOBAL.VerificationHandle([{
                        val: val_arr,
                        type: "StringAllNotEmpty",
                        msg: msg_arr
                    }])) {
                    axios({
                            url: "/api/Clinic",
                            method: axiosMethod,
                            data: this.editBoxData
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                //请求成功
                                type = "success";
                                this.$emit("to-father", res.data.Data);
                            } else {
                                //其他状态码
                                type = "error";
                            }
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg,
                                type: type
                            });
                        })
                        .catch(error => {
                            //请求失败
                        });
                }
            }
        },
        //删除this editBox tr
        deleteThisEditBoxTr(index) {
            //更新模式下追加删除的子科室id
            if (this.editBoxData.Id > 0) {
                if(!this.editBoxData.DeletedSubClinics){
                    this.editBoxData.DeletedSubClinics = [];
                }
                this.editBoxData.DeletedSubClinics.push(this.editBoxData.SubClinics[index].Id);
            }
            this.editBoxData.SubClinics.splice(index, 1);
        },
        //新增editBox tr
        addEditBoxTr() {
            this.editBoxData.SubClinics.push({
                Id: 0,
                Name: "",
                ShortCode: "",
                Telephone: ""
            });
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableUnExpand";

#editBox.clinicBox {
    .editContent {
        >ul {
            border-bottom: 1px solid #f2f4f7;
        }

        .el-table {
            &::before {
                height: 0;
            }

            th {
                background: #fff;
                border: 0;
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
                        padding: 10px 0;

                        .el-input {
                            width: 160px;

                            input {
                                font-size: 16px;
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                color: rgba(51, 51, 51, 1);
                            }
                        }

                        a {
                            cursor: pointer;
                            color: #F93E3E;
                        }
                    }
                }
            }
        }

        .addSubClinics {
            text-align: left;
            padding-left: 40px;

            .el-button {
                &.is-disabled {
                    background: #ccc;
                }
            }
        }
    }
}
</style>
