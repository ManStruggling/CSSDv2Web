<template>
<div class="cssd_box" id="consumableReceive">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <router-link to="/consumable/receiveRecord" tag="li">
                <p>领用记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>领用人</span>
                <el-select v-model="submitData.InboundSubClinicId" filterable class="white24x13">
                    <el-option label="张三" :value="1"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <el-table :data="submitData.Products">
                <el-table-column width="240" label="产品名称">
                    <template slot-scope="props">
                        <el-select v-model="props.row.ProductId" class="green18x10" @change="getValidDate(props.$index)">
                            <el-option v-for="(item,index) in initialData.DisposableProducts" :key="index" :label="item.ProductName" :value="item.ProductId"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="剩余库存数" prop="Quantity"></el-table-column>
                <el-table-column width="210" label="本次领用数" prop="Quantity">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.Quantity" :controls="false" :min="1" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.row)})"></el-input-number>
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
            <p></p>
            <p>
                <el-button type="primary" round @click="submitComplete">领用完成</el-button>
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
                Products: []
            }
        };
    },
    created() {

    },
    mounted() {},
    methods: {
        goBack() {
            if (this.isChangeMode) {

            } else {
                this.$router.push('/');
            }
        },
        //删除
        deleteThisItem(index) {

        },
        //新增
        insertItem() {
            
        },
        //提交
        submitComplete() {

        },
        //数量change事件
        handleNumberChange(newValue, oldValue, rowItem) {
            if (newValue == undefined) {
                setTimeout(() => {
                    rowItem.Quantity = 1;
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

#consumableReceive {
    .cssd_title {
        .cssd_title_right {
            .el-select {
                width: 200px;

                .el-input {
                    input {
                        border: 2px solid #9EA6B2;
                        font-size: 18px;
                        font-weight: bold;
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
                            display: block;

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
