<template>
<div class="cssd_box" id="noBarCodeInventory">
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
    <div class="cssd_table_center cssd_totalBar table_collapse">
        <div class="table_box">
            <div class="content_title">
                <p>包名称</p>
                <p>包基数</p>
                <p>库存数</p>
            </div>
            <el-collapse accordion>
                <el-collapse-item v-for="(item,index) in inventoryData.Products" :key="index" :name="index+''" :class="'collapseUnExpand'">
                    <div slot="title" class="collapseTh">
                        <div class="collapseTd">
                            <el-tooltip :content="item.ProductName" placement="top-start" :disabled="item.ProductName.length<10">
                                <p>{{item.ProductName}}</p>
                            </el-tooltip>
                        </div>
                        <div class="collapseTd">
                            <p>{{item.BaseQuantity}}</p>
                        </div>
                        <div class="collapseTd">
                            <p>{{item.InventoryQuantity}}</p>
                        </div>
                    </div>
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
        changeClinicInventory(val) {
            if (val == 0) {
                //主科室接口
                this.getClinicData();
            } else {
                //子科室接口
                axios({
                    url: `/api/Inventory/NotHasBarCode/${val}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.inventoryData.Products = res.data.Data.Products;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                }).catch(err => {})
            }
        },
        //获取登录的主科室库存
        getClinicData() {
            axios({
                url: `/api/Inventory/NotHasBarCodeForClinic/${this.ClinicId}`
            }).then(res => {
                if (res.data.Code == 200) {
                    this.inventoryData = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            }).catch(err => {

            })
        }
    },
    computed: {
        countPackageNumber() {
            let num = 0;
            this.inventoryData.Products.forEach(val => {
                num += val.InventoryQuantity;
            });
            return num;
        }
    },
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableCollapse";

#noBarCodeInventory {
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
        overflow-y: hidden;

        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;

            li {
                height: 50px;
                background: #99f;
                display: flex;
                width: 100%;
                line-height: 25px;
                text-align: center;
                margin: 10px 0;

                p {
                    flex: 1;

                    span {
                        display: block;
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
