<template>
<div class="cssd_box" id="disposableProductCounting">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/inventoryCounting/registration" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>盘库科室</span>
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
                        <el-select v-model="props.row.ProductId" class="green18x10" @change="getValidDate(props.$index)">
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
                        <el-date-picker v-model="props.row.ValidDate" type="date" placeholder="选择日期" :clearable="false" value-format="yyyy-MM-dd" :disabled="props.row.Forbid"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="数量" prop="BarCode">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.Quantity" :controls="false" :min="1" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.row)})"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="操作">
                    <template slot-scope="props">
                        <a @click="deletePackage(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
            <el-button @click="insertItem" class="btn120x40">新增</el-button>
        </div>
        <div class="cssd_table_bottom">
            <p>共计
                <span>{{countNumber}}</span> 包</p>
            <p>
                <el-button type="primary" round @click="submitComplete">盘库完成</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    inject: ['reload'],
    data() {
        return {
            submitData: {
                SubClinicId: "",
                Products: []
            },
            initialData: {
                CurrentProducts: [],
                DisposableProducts: [],
                SubClinics: [],

            }
        };
    },
    created() {
        axios('/api/Inventory/DisposableCheckInventoryInitial').then(res => {
            Object.assign(this.submitData, res.data.Data);
        }).catch(err => {});
        axios("/api/Inventory/DisposableProductInitialVm").then(res => {
            if (res.data.Code == 200) {
                Object.assign(this.initialData, res.data.Data);
                if (this.initialData.SubClinics.length == 1) {
                    this.submitData.SubClinicId = this.initialData.SubClinics[0].SubClinicId;
                }
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
        deletePackage(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该项?',
                confirmCallBack: () => {
                    this.submitData.Products.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //新增
        insertItem() {
            this.submitData.Products.push({
                ProductId: "",
                BatchNumber: "",
                ValidDate: "",
                Forbid: false,
                Quantity: 0
            });
        },
        //批号失焦事件 获取已存在库存的产品以及批号，相同则自动取得有效日期
        getValidDate(index) {
            // 在录入array里search
            for (let i = 0; i < this.submitData.Products.length; i++) {
                if (i == index) {
                    continue;
                }
                if (this.submitData.Products[index].ProductId && this.submitData.Products[index].BatchNumber && this.submitData.Products[i].ProductId == this.submitData.Products[index].ProductId && this.submitData.Products[i].BatchNumber == this.submitData.Products[index].BatchNumber) {
                    this.submitData.Products[index].BatchNumber = "";
                    this.showInformation({
                        classify: "message",
                        type: "warning",
                        msg: "禁止录入相同产品相同批号！"
                    });
                    break;
                }
            }
            //在现有库存里search
            for (let i = 0; i < this.initialData.CurrentProducts.length; i++) {
                if (this.initialData.CurrentProducts[i].ProductId == this.submitData.Products[index].ProductId && this.initialData.CurrentProducts[i].BatchNumber == this.submitData.Products[index].BatchNumber) {
                    this.submitData.Products[index].ValidDate = this.initialData.CurrentProducts[i].ValidDate;
                    this.submitData.Products[index].Forbid = true;
                    return;
                }
            }
            this.submitData.Products[index].Forbid = false;
        },
        //提交完成
        submitComplete() {
            let verifyEmptyArr = [];
            this.submitData.Products.forEach(item => {
                verifyEmptyArr.push(item.ProductId);
                verifyEmptyArr.push(item.BatchNumber);
                verifyEmptyArr.push(item.ValidDate);
            });
            if (this.GLOBAL.VerificationHandle([{
                    val: this.submitData.SubClinicId,
                    type: "StringNotEmpty",
                    msg: "入库科室不能为空！"
                }, {
                    val: this.submitData.Products,
                    type: "ArrayNotEmpty",
                    msg: "至少入库一个产品！"
                }, {
                    val: verifyEmptyArr,
                    type: "StringAllNotEmpty",
                    msg: "产品、批号或有效日期不能为空！"
                }])) {
                axios({
                    url: "/api/Inventory/DisposableProductCheckInventory",
                    data: this.submitData,
                    method: 'POST'
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.reload();
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                }).catch(err => {})
            }
        },
        //数量change事件
        handleNumberChange(newValue, oldValue, rowItem) {
            if (newValue == undefined) {
                setTimeout(() => {
                    rowItem.Quantity = 1;
                }, 0);
            }
        }
    },
    computed: {
        countNumber() {
            let num = 0;
            this.submitData.Products.forEach(element => {
                if(element.Quantity) {
                    num += element.Quantity;
                }
            });
            return num;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#disposableProductCounting {
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
                            height: 40px;
                            >.el-input {
                                width: 100%;
                                height: 100%;
                                input{
                                    height: 100%;
                                }
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
            .el-button {
                margin-top: 20px;
                color: #fff;
            }
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
