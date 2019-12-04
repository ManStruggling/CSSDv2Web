<template>
<div class="cssd_box" id="substitutionPackagePrint">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/sterilize/select" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right"></div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
        <div class="table_box table_unExpand">
            <el-table :data="submitData.ViewList">
                <el-table-column label="包名称" width="240">
                    <template slot-scope="props">
                        <el-select v-model="props.row.ProductId" class="green18x10" @change="((val)=>{productChange(val,props.row)})">
                            <el-option v-for="(item,index) in proxySterilizeProducts" :key="index" :label="item.ProductName" :value="item.ProductId"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="包数量" width="210">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.Quantity" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
            <el-button class="btn88x32" @click="insertSubstitutionPackage">新增</el-button>
        </div>
        <div class="cssd_table_bottom">
            <p>
                <s>共计</s>
                <!-- <b>{{countPackageNumber(submitData.PackageBarCodes)}}</b> -->
                <b>3</b>
                <span>包</span>
            </p>
            <p>
                <el-button type="primary" @click="printBarCode">开始打印</el-button>
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
                Products: [],
                ViewList: []
            },
            proxySterilizeProducts: []
        };
    },
    created() {
        axios({
                url: `/odata/AllProducts?$filter=type eq '代消包'`
            })
            .then(res => {
                this.proxySterilizeProducts = res.data.value;
            })
            .catch(err => {});
    },
    methods: {
        //产品change事件
        productChange(val, row) {
            row.ProvideSubClinicId = this.proxySterilizeProducts.filter(element => {
                return element.ProductId === val;
            })[0].ProvideSubClinicId;
        },
        //打印条码
        printBarCode() {
            let verificationArr = [];
            this.submitData.ViewList.forEach(element => {
                verificationArr.push(element.ProductId);
            });
            if (
                this.GLOBAL.VerificationHandle([{
                    val: verificationArr,
                    type: "StringAllNotEmpty",
                    msg: "请选择产品！"
                }])
            ) {
                //to submit
                let temporaryObj = {};
                this.submitData.ViewList.forEach(element => {
                    if (temporaryObj[element.ProductId] == undefined) {
                        temporaryObj[element.ProductId] = Object.assign({}, element);
                    } else {
                        let temporaryNum =
                            temporaryObj[element.ProductId].Quantity + element.Quantity;
                        temporaryObj[element.ProductId].Quantity = temporaryNum;
                    }
                });
                this.submitData.Products = [];
                for (const key in temporaryObj) {
                    this.submitData.Products.push(temporaryObj[key]);
                }
                axios({
                        url: `/api/Package/PrintProxySterilizeProducts`,
                        method: "POST",
                        data: this.submitData
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            res.data.Data.forEach(element => {
                                CSManager.PrintBarcode(JSON.stringify(element));
                            });
                            this.reload();
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
            }
        },
        //新增数据
        insertSubstitutionPackage() {
            this.submitData.ViewList.push({
                ProductId: "",
                Quantity: 1
            });
        },
        //input-number change事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue === 0 || newValue === undefined) {
                this.showInformation({
                    classify: 'confirm',
                    msg: '确定要删除该包吗?',
                    confirmCallBack: () => {
                        this.submitData.ViewList.splice(index, 1);
                    },
                    cancelCallBack: () => {
                        this.submitData.ViewList[index].Quantity = oldValue;
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#substitutionPackagePrint {
    .cssd_table_center {
        .table_box {
            height: 100%;
            padding: 30px 40px;
            box-sizing: border-box;
            overflow-y: scroll;

            .el-table {
                .el-input-number {
                    width: 40px;
                    height: 24px;

                    .el-input {
                        height: 100%;

                        input {
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                    }
                }

                .el-select {
                    width: 160px;

                    .el-input {
                        input {
                            color: #232e41;
                            font-size: 16px;
                            font-weight: bold;
                        }
                    }
                }
            }

            >.el-button {
                color: #fff;
                margin-top: 30px;
            }
        }
    }
}
</style>
