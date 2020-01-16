<template>
<!-- 编辑弹出框 -->
<div id="editBox" class="supplierBox">
    <div class="editContainer">
        <div class="editContent">
            <ul class="clear_float">
                <li>
                    <p>供应商名称</p>
                    <el-input type="text" placeholder="供应商名称(必填)" v-model.trim="editBoxData.Name"></el-input>
                </li>
                <li>
                    <p>传真</p>
                    <el-input type="text" placeholder="传真" v-model.trim="editBoxData.FaxNumber"></el-input>
                </li>
                <li>
                    <p>公司电话</p>
                    <el-input type="text" placeholder="公司电话" v-model.trim="editBoxData.PhoneNumber"></el-input>
                </li>
                <li>
                    <p>联系人</p>
                    <el-input type="text" placeholder="联系人" v-model.trim="editBoxData.ContactPerson"></el-input>
                </li>
                <li>
                    <p>联系人号码</p>
                    <el-input type="text" placeholder="联系人号码" v-model.trim="editBoxData.ContactNumber"></el-input>
                </li>
                <li>
                    <p>供应商地址</p>
                    <el-input type="text" placeholder="供应商地址" v-model.trim="editBoxData.Address"></el-input>
                </li>
                <li class="textareaBox">
                    <p>备注</p>
                    <el-input type="textarea" placeholder="备注" v-model.trim="editBoxData.Remark"></el-input>
                </li>
            </ul>
            <div class="multiSelectBox" v-if="editBoxData.Type==1?false:true">
                <h3>
                    <el-select v-model="editBoxData.RelatedManufacturerIds" multiple class="green18x10" placeholder="请选择(必填)">
                        <el-option v-for="item in supplierList" :key="item.Id" :label="item.Name" :value="item.Id">
                            <el-tooltip :content="item.Name" placement="right" :disabled="item.Name.length<9">
                                <p class="beyondHiding">{{item.Name}}</p>
                            </el-tooltip>
                        </el-option>
                    </el-select>
                </h3>
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
    props: ["data", "Type"],
    data() {
        return {
            editBoxData: {},
            supplierList: []
        };
    },
    created() {
        this.editBoxData = this.$props.data;
        axios(`/api/Manufacturer/NameByType/${this.$props.Type}`)
            .then(res => {
                if (res.data.Code == 200) {
                    this.supplierList = res.data.Data;
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
        $("#editBox.supplierBox h3 .el-select .el-input__inner").val(
            "生产商(必填)"
        );
    },
    methods: {
        //editBox取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //editBox保存编辑
        editBoxSave() {
            let axiosMethod = ""; //请求方式
            if (this.editBoxData.SupplierId == 0) {
                //新增模式
                axiosMethod = "post";
            } else {
                //更新模式
                axiosMethod = "put";
            }
            // RelatedManufacturerIds
            let arr = [{
                val: this.editBoxData.Name,
                type: "StringNotEmpty",
                msg: "供应商名称不能为空！"
            }];
            if (this.editBoxData.Type == 0) {
                arr.push({
                    val: this.editBoxData.RelatedManufacturerIds,
                    type: "ArrayNotEmpty",
                    msg: "您还没有关联生产商！请至少关联一个生产商！"
                });
            }
            if (this.GLOBAL.VerificationHandle(arr)) {
                axios({
                        url: "/api/Supplier",
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
                    .catch(error => {});
            }
        }
    }
};
</script>

<style lang="scss">
#editBox.supplierBox {
    .editContent {
        >ul {
            border-bottom: 1px solid #f2f4f7;
        }

        .multiSelectBox {
            display: flex;

            h3 {
                padding: 20px 0 0 30px;

                .el-select {
                    width: 160px;
                    height: 40px;
                    position: static;

                    .el-select__tags {
                        top: 95px;
                        position: static;

                        >span {
                            display: -webkit-box;
                            position: absolute;
                            left: 175px;
                            top: 0;
                            width: 1000px;
                            height: 150px;
                            overflow-y: scroll;
                            overflow-x: hidden;

                            .el-tag {
                                margin: 0;
                                height: 40px;
                                background: #fff;
                                box-shadow: 0px 0px 10px 0px rgba(51, 62, 80, 0.1);
                                border-radius: 4px;
                                margin-right: 20px;
                                margin-bottom: 20px;

                                >span {
                                    font-size: 18px;
                                    font-family: Microsoft YaHei;
                                    font-weight: bold;
                                    color: rgba(35, 46, 65, 1);
                                    line-height: 40px;
                                }

                                i {
                                    background: #fff;
                                    border-radius: 0;
                                    width: 18px;
                                    height: 18px;
                                    background: url("../../assets/images/close_gray.png") no-repeat;

                                    &::before {
                                        content: "";
                                    }
                                }
                            }
                        }
                    }

                    .el-input {
                        input {
                            width: 160px;
                            height: 40px !important;
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            color: rgba(196, 201, 209, 1);
                        }
                    }
                }
            }
        }
    }
}
</style>
