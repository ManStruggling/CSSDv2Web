<template>
<div class="cssd_box" id="disposableProductTrak">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link :to="{path:'/track/package',
                    query:{
                        origin: '/'
                    }
                }" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>产品名称</span>
                <el-select v-model="searchProductId">
                    <el-option v-for="(item,index) in disposableProducts" :key="index" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
            </p>
            <p>
                <el-input placeholder="请输入批号" v-model="searchBatchNumber"></el-input>
                <el-button @click="searchDisposableProduct">查询</el-button>
            </p>
        </div>
    </div>
    <div class="cssd_table_center table_unExpand">
        <ul>
            <li>
                <p class="font16gray">批号</p>
                <span class="font16blod">{{trackMessage.BatchNumber}}</span>
            </li>
            <li>
                <p class="font16gray">一次性物品名称</p>
                <span class="font16blod">{{trackMessage.ProductName}}</span>
            </li>
            <li>
                <p class="font16gray">产品规格</p>
                <span class="font16blod">{{trackMessage.Specification}}</span>
            </li>
            <li>
                <p class="font16gray">有效日期</p>
                <span class="font16blod">{{trackMessage.ValidDate}}</span>
            </li>
        </ul>
        <div class="table_box">
            <el-table :data="trackMessage.FailedPackages">
                <el-table-column label="所在科室" prop="SubClinicName" width="240"></el-table-column>
                <el-table-column label="有效日期" prop="validDate" width="210"></el-table-column>
                <el-table-column label="数量" prop="Quantity" width="210"></el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            searchProductId: '',
            searchBatchNumber: '',
            trackMessage: {
                BatchNumber: '',
                ProductName: '',
                Specification: '',
                ValidDate: '',
                SubClinics: []
            },
            disposableProducts: []
        };
    },
    created() {
        axios({
            url: `/api/Product/ByType/84`
        }).then(res => {
            if (res.data.Code == 200) {
                this.disposableProducts = res.data.Data;
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                });
            }
        }).catch(err => {});
    },
    methods: {
        searchDisposableProduct() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.searchProductId,
                    type: 'StringNotEmpty',
                    msg: '未选择一次性物品！'
                }, {
                    val: this.searchBatchNumber,
                    type: 'StringNotEmpty',
                    msg: '批次不能为空！'
                }])) {
                axios({
                    url: `/api/Tracking/DisposableProduct/${this.searchProductId}/${this.searchBatchNumber}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        Object.assign(this.trackMessage, res.data.Data);
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                }).catch(err => {});
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableUnExpand";

#disposableProductTrak {
    .cssd_title_right {
        p {
            display: flex;
            margin: 0;

            >span {
                width: 100px;
                line-height: 40px;
            }

            .el-input {
                margin-right: 20px;
                width: 180px;
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;

                input {
                    color: #fff;
                    background: #182b37;
                    padding: 0 5px;
                }
            }

            .el-select {
                .el-input {
                    &::after {
                        content: "";
                        background: url(../../assets/images/arrow_white24x13.png) no-repeat;
                        background-size: 24px 13px;
                        position: absolute;
                        height: 13px;
                        width: 24px;
                        right: 11px;
                        top: 14px;
                    }

                    &.is-focus {
                        &::after {
                            transform: rotate(180deg);
                        }
                    }

                    span {
                        display: none;
                    }
                }
            }

            .el-button {
                margin: 0;
                background: #00C16B;
                border: 0;
            }
        }
    }

    .cssd_table_center {
        padding: 30px 40px;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;

        ul {
            display: flex;
            flex-wrap: wrap;
            padding: 0 0 30px 32px;

            li {
                display: flex;
                width: 300px;
                justify-content: space-between;
                margin-right: 50px;

                p {
                    width: 120px;
                    text-align: right;
                }

                span {
                    width: 148px;
                }
            }
        }
    }
}
</style>
