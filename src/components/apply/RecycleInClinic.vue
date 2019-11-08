<template>
<div class="cssd_box" id="recycleInClinic">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <li>
                <p>一键通知回收</p>
            </li>
        </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <ul>
                <li>
                    <p class="font16gray">待回收包数</p>
                    <div class="el_input_box font16blod">
                        <el-input-number v-model="submitData.PendingRecycleQuantity" :controls="false" placeholder="填写包数量"></el-input-number>
                    </div>
                </li>
            </ul>
            <el-table :data="submitData.ExpeditedProducts">
                <el-table-column label="名称" prop="ProductName" width="240"></el-table-column>
                <el-table-column label="数量" width="210">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.ProductQuantity" :controls="false" placeholder="填写包数量"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="props">
                        <a @click.stop="deleteProduct(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button type="primary">登记完成</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            submitData: {
                PendingRecycleQuantity: 0,
                ExpeditedProducts: []
            }
        };
    },
    created() {},
    mounted() {},
    methods: {
        deleteProduct(index){
            this.submitData.ExpeditedProducts.splice(index,1);
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#recycleInClinic {
    .cssd_table_center {
        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;

            ul {
                display: flex;
                flex-wrap: wrap;
                padding-bottom: 10px;
                border-bottom: 1px solid #F2F4F7;
                margin-bottom: 30px;

                li {
                    width: 234px;
                    display: flex;
                    justify-content: space-between;
                    margin: 0 120px 20px 0;

                    p {
                        width: 96px;
                        line-height: 40px;
                        text-align: right;
                    }

                    .el_input_box {
                        width: 128px;
                        line-height: 40px;

                        .el-input-number {
                            width: 100%;

                            .el-input {
                                font-size: 16px;
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                color: rgba(51, 51, 51, 1);
                            }
                        }

                        .el-date-editor {
                            width: 100%;
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
