<template>
<div class="cssd_box" id="hasBarCodeInventory">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <router-link to="/inventory/disposableItemInbound" tag="li">
                <p>一次性物品入库</p>
            </router-link>
            <router-link to="/inventory/inboundRecord" tag="li">
                <p>入库记录</p>
            </router-link>
            <router-link to="/inventory/outboundRecord" tag="li">
                <p>出库记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>科室</span>
                <el-select v-model="SubClinicId" filterable @change="changeClinicInventory" class="white24x13">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option v-for="(item,index) in inventoryData.SubClinics" :key="index" :label="item.SubClinicName" :value="item.SubClinicId"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_collapse table_unExpand">
        <div class="table_box">
            <div class="content_title">
                <p>包名称</p>
                <p>包基数</p>
                <p>库存数</p>
            </div>
            <el-collapse accordion @change="collapseChange">
                <el-collapse-item v-for="(item,index) in inventoryData.Products" :key="index" :name="index+''" :class="item.IsNotPrintBarCode?'collapseUnExpand':''">
                    <div slot="title" class="collapseTh">
                        <div class="collapseTd">
                            <p>{{item.ProductName}}</p>
                        </div>
                        <div class="collapseTd">
                            <p>{{item.BaseQuantity}}</p>
                        </div>
                        <div class="collapseTd">
                            <p>{{item.InventoryQuantity}}</p>
                        </div>
                    </div>
                    <el-table v-if="!item.IsNotPrintBarCode&&!item.IsDisposableProduct" :data="item.Packages">
                        <el-table-column label="包条码" prop="BarCode" width="300">
                            <template slot-scope="props">
                                <span>{{props.row.BarCode}}</span>
                                <b class="isExpireSoon" v-if="!props.row.IsExpired&&props.row.IsExpireSoon">即将过期</b>
                                <b class="isExpired" v-if="props.row.IsExpired">已过期</b>
                            </template>
                        </el-table-column>
                        <el-table-column label="配包日期" prop="PackageDate" width="210"></el-table-column>
                        <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                    <el-table v-if="!item.IsNotPrintBarCode&&item.IsDisposableProduct" :data="item.Packages">
                        <el-table-column label="批号" prop="BatchNumber" width="300">
                            <template slot-scope="props">
                                <span>{{props.row.BatchNumber}}</span>
                                <b class="isExpireSoon" v-if="!props.row.IsExpired&&props.row.IsExpireSoon">即将过期</b>
                                <b class="isExpired" v-if="props.row.IsExpired">已过期</b>
                            </template>
                        </el-table-column>
                        <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                        <el-table-column label="数量" prop="Quantity" width="210"></el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="cssd_table_bottom">
            <p>
                共计
                <span>{{countPackageNumber}}</span> 包
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            SubClinicId: 0,
            ClinicId: 0,
            inventoryData: {
                SubClinics: [],
                Products: []
            }
        };
    },
    created() {
        //登录主科室id
        this.ClinicId = UserInfo.ClinicId;
        this.getClinicData();
    },
    methods: {
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.inventoryData.Products[index].Packages == '' || this.inventoryData.Products[index].Packages === null) && !this.inventoryData.Products[index].IsNotPrintBarCode) {
                axios({
                        url: `/api/Inventory/HasBarCodePackages/${this.inventoryData.Products[index].SubClinicId}/${this.inventoryData.Products[index].ProductId}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            this.inventoryData.Products[index].Packages = res.data.Data;
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
        //修改子科室 获取该主科室下的子科室库存
        changeClinicInventory(val) {
            if (val == 0) {
                //主科室接口
                this.getClinicData();
            } else {
                //子科室接口
                axios({
                        url: `/api/Inventory/HasBarCode/${val}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            this.inventoryData.Products = res.data.Data.Products;
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
        //获取登录的主科室库存
        getClinicData() {
            axios({
                    url: `/api/Inventory/HasBarCodeForClinic/${this.ClinicId}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        this.inventoryData = res.data.Data;
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
    computed: {
        countPackageNumber() {
            let num = 0;
            if (this.inventoryData.Products) {
                this.inventoryData.Products.forEach(val => {
                    num += val.InventoryQuantity;
                });
            }
            return num;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";

#hasBarCodeInventory {
    .cssd_title_right {
        .el-select {
            width: 200px;

            .el-input {
                input {
                    font-size: 18px;
                    color: #fff;
                    font-weight: bold;

                    &::-webkit-input-placeholder {
                        font-weight: normal;
                    }
                }
            }
        }
    }

    .cssd_table_center {
        height: 100%;
        overflow: hidden;

        .table_box {
            padding: 30px 40px;
            box-sizing: border-box;
            height: 100%;
            overflow-y: scroll;

            .el-table {
                .isExpireSoon {
                    border: 1px solid #ff9a00;
                    border-radius: 4px;
                    color: #ff9a00;
                    margin-left: 15px;
                    display: inline-block;
                    font-size: 14px;
                    width: 80px;
                    text-align: center;
                }

                .isExpired {
                    border: 1px solid #F93E3E;
                    border-radius: 4px;
                    color: #F93E3E;
                    margin-left: 15px;
                    display: inline-block;
                    font-size: 14px;
                    width: 80px;
                    text-align: center;
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
