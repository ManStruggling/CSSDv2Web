<template>
<!-- 编辑弹出框 -->
<div id="editBox" class="producerBox">
    <div class="editContainer">
        <div class="editContent">
            <ul class="clear_float">
                <li>
                    <p>生产商名称</p>
                    <el-input type="text" placeholder="生产商名称(必填)" v-model.trim="editBoxData.Name"></el-input>
                </li>
                <li>
                    <p>传真</p>
                    <el-input type="text" placeholder="传真" v-model.trim="editBoxData.FaxNumber"></el-input>
                </li>
                <li>
                    <p>公司电话</p>
                    <el-input type="text" placeholder="单位电话" v-model.trim="editBoxData.PhoneNumber"></el-input>
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
                    <p>生产商地址</p>
                    <el-input type="text" placeholder="生产商地址" v-model.trim="editBoxData.Address"></el-input>
                </li>
                <li class="textareaBox">
                    <p>备注</p>
                    <el-input type="textarea" placeholder="备注" v-model.trim="editBoxData.Remark"></el-input>
                </li>
            </ul>
            <div class="RelationBox table_collapse table_unExpand" v-if="editBoxData.Type == 0?true:false">
                <div class="content_title">
                    <p>设备型号</p>
                    <p>操作</p>
                </div>
                <el-collapse accordion v-model="activeName">
                    <el-collapse-item v-for="(item,index) in editBoxData.DeviceModel" :key="index" :name="index+''">
                        <div slot="title" class="collapseTh">
                            <div class="collapseTd">
                                <p>
                                    <el-input v-model.trim="item.Name" @click.native.stop="GLOBAL.cancelBubble" placeholder="型号名称(必填)"></el-input>
                                </p>
                            </div>
                            <div class="collapseTd">
                                <p>
                                    <a class="delete_this_tr" @click.stop="deleteThisEditBoxTr(index)">删除</a>
                                </p>
                            </div>
                        </div>
                        <el-table :data="item.DevicePrograms">
                            <el-table-column label="程序名称" width="240">
                                <template slot-scope="props">
                                    <el-input type="text" v-model.trim="props.row.Name" placeholder="程序名称(必填)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="程序运作时长（分钟）" width="210">
                                <template slot-scope="props">
                                    <el-input-number v-model="props.row.Duration" :min="0" :max="300" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,index,props.$index)})"></el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column label="BD测试程序">
                                <template slot-scope="props">
                                    <el-select v-model="props.row.IsDbTestProgram" class="green18x10">
                                        <el-option label="否" :value="false"></el-option>
                                        <el-option label="是" :value="true"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="210">
                                <template slot-scope="props">
                                    <a class="deleteThisProg" @click="editBoxDeleteThisProgm(index,props.$index)">删除</a>
                                </template>
                            </el-table-column>
                            <el-table-column></el-table-column>
                        </el-table>
                        <div class="addThisProg">
                            <el-button type="primary" @click="editBoxAddProgm(index)" :size="'mini'" class="btn88x32">新增程序</el-button>
                            <div style="height:10px;"></div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div class="addDeviceModel">
                    <el-button type="primary" @click="addEditBoxTr" class="btn120x40">新增设备型号</el-button>
                </div>
                <!-- <div class="basic_table">
            <ul>
              <li>设备型号</li>
              <li>操作</li>
            </ul>
            <div class="basic_table_tb">
              <div
                class="basic_table_tb_tr"
                v-for="(item,index) in editBoxData.DeviceModel"
                :key="index"
              >
                <div class="basic_table_tb_tr_box">
                  <div class="basic_tb_tr_td">{{item.Name}}</div>
                  <div class="basic_tb_tr_td">
                    <a class="delete_this_tr" @click.stop="deleteThisEditBoxTr(index)">删除</a>
                  </div>
                </div>
                <div class="basic_table_tb_tr_detail">
                  <ul class="clear_float">
                    <li>
                      <el-input v-model.trim="item.Name"></el-input>
                    </li>
                  </ul>
                  <dl>
                    <dt>
                      <p>程序名称</p>
                      <p>程序运作时长（分钟）</p>
                      <p>操作</p>
                    </dt>
                    <dd v-for="(val,idx) in item.DevicePrograms" :key="idx">
                      <p>
                        <el-input type="text" v-model.trim="val.Name" placeholder="程序名称"></el-input>
                      </p>
                      <p>
                        <el-input-number v-model="val.Duration" :min="1" :max="300" :controls="false" label="程序时长" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,index,idx)})"></el-input-number>
                      </p>
                      <p>
                        <a class="deleteThisProg" @click="editBoxDeleteThisProgm(index,idx)">删除</a>
                      </p>
                    </dd>
                  </dl>
                  <div class="addThisProg">
                    <el-button type="primary" round @click="editBoxAddProgm(index)" :size="'mini'">新增程序</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>-->
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
            activeName: "0",
            editBoxData: {}
        };
    },
    created() {
        this.editBoxData = this.$props.data;
    },
    methods: {
        //el-input-number change事件
        numberChange(newValue, oldValue, index, idx) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.editBoxData.DeviceModel[index].DevicePrograms[idx].Duration = 1;
                }, 0);
            }
        },
        //取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //保存编辑
        editBoxSave() {
            let axiosMethod = "";
            if (this.editBoxData.Id == 0) {
                //新增模式
                axiosMethod = "post";
            } else {
                //更新模式
                axiosMethod = "put";
            }
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.editBoxData.Name,
                        type: "StringNotEmpty",
                        msg: "生产商名称不能为空！"
                    },
                    {
                        val: this.editBoxData.DeviceModel,
                        type: "ArrayNotEmpty",
                        msg: "您还没有添加设备型号！请至少添加一个设备型号！"
                    }
                ])
            ) {
                let val_arr1 = [];
                let msg_arr1 = [];
                let val_arr2 = [];
                let msg_arr2 = [];
                this.editBoxData.DeviceModel.forEach(element => {
                    val_arr1.push(element.Name);
                    msg_arr1.push("设备型号名称不能为空！");
                    val_arr2.push(element.DevicePrograms);
                    msg_arr2.push(
                        "您还没有为添加的设备型号添加程序！请至少添加一个设备型号程序！"
                    );
                });
                if (
                    this.GLOBAL.VerificationHandle([{
                            val: val_arr1,
                            type: "StringAllNotEmpty",
                            msg: msg_arr1
                        },
                        {
                            val: val_arr2,
                            type: "ArrayAllNotEmpty",
                            msg: msg_arr2
                        }
                    ])
                ) {
                    let val_arr3 = [];
                    let msg_arr3 = [];
                    for (let i = 0; i < this.editBoxData.DeviceModel.length; i++) {
                        for (
                            let j = 0; j < this.editBoxData.DeviceModel[i].DevicePrograms.length; j++
                        ) {
                            val_arr3.push(
                                this.editBoxData.DeviceModel[i].DevicePrograms[j].Name
                            );
                            msg_arr3.push("设备型号的程序名称不能为空！");
                        }
                    }
                    if (
                        this.GLOBAL.VerificationHandle([{
                            val: val_arr3,
                            type: "StringAllNotEmpty",
                            msg: msg_arr3
                        }])
                    ) {
                        axios({
                                url: "/api/Manufacturer",
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
        },
        //editBox 添加程序
        editBoxAddProgm(index) {
            this.editBoxData.DeviceModel[index].DevicePrograms.push({
                Name: "",
                Duration: 0,
                IsDbTestProgram: false
            });
        },
        //editBox 删除程序
        editBoxDeleteThisProgm(index, idx) {
            //更新模式下追加删除的程序id
            if (this.editBoxData.Id > 0) {
                var arr = [];
                arr.push(this.editBoxData.DeviceModel[index].DevicePrograms[idx].Id);
                this.editBoxData.DeletedDevicePrograms = arr;
            }
            //删除对应程序
            this.editBoxData.DeviceModel[index].DevicePrograms.splice(idx, 1);
        },
        //删除this editBox tr
        deleteThisEditBoxTr(index) {
            //更新模式下追加删除的设备型号id
            if (this.editBoxData.Id > 0) {
                var arr = [];
                arr.push(this.editBoxData.DeviceModel[index].Id);
                this.editBoxData.DeletedDeviceModels = arr;
            }
            this.editBoxData.DeviceModel.splice(index, 1);
        },
        //新增editBox tr
        addEditBoxTr() {
            this.editBoxData.DeviceModel.push({
                Name: "",
                DevicePrograms: []
            });
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";

#editBox.producerBox {
    .editContent {
        >ul {
            border-bottom: 1px solid #f2f4f7;
        }

        .RelationBox {
            padding: 20px 30px;

            .el-collapse-item__header {
                &.is-active {
                    .collapseTh {
                        .el-input {
                            input {
                                background: #00c16b;
                                color: #fff;

                                &:focus {
                                    border-color: #fff;
                                }
                            }
                        }

                        a {
                            color: #fff;
                        }
                    }
                }
            }

            .collapseTh {
                .el-input {
                    input {
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(51, 51, 51, 1);
                    }
                }
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
                            padding: 5px 0;
                        }

                        .el-input {
                            width: 160px;
                        }

                        .el-input-number {
                            width: 160px;

                            input {
                                text-indent: 15px;
                            }
                        }

                        input {
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                    }
                }
            }

            .addThisProg {
                margin: 20px 0 2px 40px;
            }

            .addDeviceModel {
                margin-top: 20px;
                text-align: left;
            }

            a {
                cursor: pointer;
                color: #f93e3e;
                font-weight: bold;
            }
        }
    }
}
</style>
