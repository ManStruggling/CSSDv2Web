<template>
<div class="cssd_box" id="instrumentReplenishment">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <router-link to="/publicModule/instrumentReplenishmentRecord" tag="li">
                <p>登记记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <el-input v-model.trim="searchBarCode" placeholder="请输入包条码" @keyup.enter.native="searchMessage"></el-input>
            <el-button @click="searchMessage" class="btn120x40">查询</el-button>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <ul>
                <li>
                    <p>包名称</p>
                    <span>骨穿包</span>
                </li>
                <li>
                    <p>包条码</p>
                    <span>WJsdf213112</span>
                </li>
            </ul>
            <el-table :data="submitData.Products">
                <el-table-column width="240" label="器械名称" prop="InstrumentName"></el-table-column>
                <el-table-column width="210" label="丢失数" prop="Quantity"></el-table-column>
                <el-table-column width="210" label="本次补货数">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.ThisTimeRequestCount" :controls="false" :min="0" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.row)})"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button type="primary" round @click="submitComplete">登记完成</el-button>
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
            searchBarCode: "",
            isChangeMode: false,
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
        //提交完成
        submitComplete() {

        },
        //查询包信息
        searchMessage() {

        },
        handleNumberChange(newValue, oldValue, row) {
            if (newValue === undefined) {
                setTimeout(() => {
                    row.Quantity = 0;
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

#instrumentReplenishment {
    .cssd_title {
        .cssd_title_right {
            display: flex;

            .el-input {
                width: 180px;

                input {
                    font-size: 18px;
                    font-weight: bold;
                    color: #fff;
                    font-family: Microsoft Yahei;
                    background: #182B37;
                    padding: 0 0 0 10px;
                }
            }

            .el-button {
                color: #fff;
                margin-left: 20px;
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

            ul {
                display: flex;
                line-height: 40px;
                margin-bottom: 20px;

                li {
                    display: flex;

                    p {
                        width: 64px;
                        text-align: right;
                        color: #878D9F;
                        font-size: 16px;
                    }

                    span {
                        color: #333;
                        font-weight: bold;
                        width: 160px;
                        margin-left: 20px;
                    }
                }
            }

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
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
