<template>
<div class="cssd_box" id="disposableItemInbound">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/inventory/hasBarCode" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>入库科室</span>
                <el-select v-model="submitData.SubClinicId" class="white24x13">
                    <el-option v-for="(item,index) in initialData.SubClinics" :key="index" :label="item.SubClinicName" :value="item.SubClinicId"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <el-table :data="submitData.Products">
                <el-table-column width="240" label="一次性物品名称">
                    <template slot-scope="props">
                        <el-select v-model="props.row.ProductId" class="green18x10">
                            <el-option v-for="(item,index) in initialData.DisposableProducts" :key="index" :label="item.ProductName" :value="item.ProductId"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="批号" prop="BatchNumber">
                    <template slot-scope="props">
                        <el-input v-model.trim="props.row.BatchNumber" @blur="getValidDate(props.$index)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="有效日期" prop="ValidDate">
                    <template slot-scope="props">
                        <el-date-picker v-model="props.row.ValidDate" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="本次入库数" prop="Quantity">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.Quantity" :controls="false" :min="1" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="操作">
                    <template slot-scope="props">
                        <a @click="deleteThisItem(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
            <el-button @click="insertItem" class="btn120x40">新增</el-button>
        </div>
        <div class="cssd_table_bottom">
            <p>共计
                <span>{{submitData.Products.length}}</span> 包</p>
            <p>
                <el-button type="primary" round>入库完成</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            isShowManualEnter: false,
            submitData: {
                SubClinicId: "",
                Products: []
            },
            clinicList: [],
            initialData: {
                CurrentProducts: [],
                DisposableProducts: [],
                SubClinics: [],

            }
        };
    },
    created() {
        axios("/api/Inventory/DisposableProductInitialVm").then(res => {
            if (res.data.Code == 200) {
                Object.assign(this.initialData, res.data.Data);
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg,
                });
            }
        }).catch(err => {});
    },
    mounted() {},
    methods: {
        //删除
        deleteThisItem(index) {
            this.$confirm("确定要删除该项?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.submitData.Products.splice(index, 1);
            }).catch(() => {})
        },
        //新增
        insertItem() {
            this.submitData.Products.push({
                ProductId: "",
                BatchNumber: "",
                ValidDate: "",
                Quantity: 0
            })
        },
        getValidDate(index) {

        },
        //数量change事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.submitData.Products[index].Quantity = 1;
                }, 0);
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#disposableItemInbound {
    .cssd_title_right {
        p {
            .el-select {
                width: 200px;

                .el-input {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(208, 212, 218, 1);

                    input {
                        color: #fff;
                    }
                }
            }
        }
    }

    .cssd_table_center {
        overflow: hidden;

        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;

            .el-table {
                tbody {
                    .cell {
                        font-size: 18px;
                        color: #232e41;
                        font-weight: bold;

                        a {
                            cursor: pointer;
                            color: #F93E3E;
                            font-weight: bold;
                        }

                        .el-select {
                            width: 160px;
                        }

                        .el-date-editor {
                            width: 160px;
                        }

                        .el-input {
                            width: 160px;
                        }

                        .el-input-number {
                            width: 60px;

                            >.el-input {
                                width: 100%;
                            }
                        }

                        input {
                            font-size: 16px;
                            font-weight: bold;
                            color: #232E41;

                        }
                    }
                }
            }
        }

        .el-button {
            margin-top: 20px;
            color: #fff;
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
