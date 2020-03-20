<template>
<div class="cssd_box" id="recycleInClinic">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="toNotificationRecycling">
                <p>一键通知回收</p>
            </li>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>回收供应室</span>
                <el-select v-model="selectedCssdId">
                    <el-option v-for="(item,index) in cssdList" :key="index" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <ul>
                <li>
                    <p class="font16gray">待回收包数</p>
                    <div class="el_input_box font16blod">
                        <el-input-number v-model="submitData.PendingRecycleQuantity" :min="0" :max="999" :controls="false" placeholder="填写包数量"></el-input-number>
                    </div>
                </li>
            </ul>
            <el-table :data="submitData.ExpeditedProducts">
                <el-table-column label="名称" prop="ProductName" width="240"  show-overflow-tooltip></el-table-column>
                <el-table-column label="加急数量" width="210">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.ProductQuantity" :controls="false" :min="1" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="props">
                        <a @click.stop="deleteProduct(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
            <el-button type="primary" @click="insertProduct">新增加急包</el-button>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button type="primary" @click="submitComplete">登记完成</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 数量包登记   控制是否挂载   数据通信   类型 -->
        <PackageList v-if="isShowPackageList" @packageList-to-father="packgeList2father" :requestApi="`type eq '高水平消毒包' or type eq '追溯的无菌包'`" :getApiLimit="`ProvideClinicId eq ${UserInfo.ClinicId} and IsCommonProduct eq false`" :headers="{LocationId:selectedCssdId}" :packageClass="'NewPurchasing'"></PackageList>
    </transition>
</div>
</template>

<script>
import {mapState} from "vuex";
import PackageList from "../common/PackageList";
export default {
    inject: ['reload'],
    data() {
        return {
            isShowPackageList: false,
            submitData: {
                PendingRecycleQuantity: 0,
                ExpeditedProducts: []
            },
            cssdList: [],
            selectedCssdId: ""
        };
    },
    components: {
        PackageList
    },
    created() {
        axios("/api/Clinic").then(res => {
            if (res.data.Code == 200) {
                this.cssdList = res.data.Data.filter(element => {
                    return element.ClinicType === 1;
                });
                if (this.cssdList.length == 1) {
                    this.selectedCssdId = this.cssdList[0].Id;
                }
            } else {
                this.showInformation({
                    classify: "message",
                    msg: acct.data.Msg
                });
            }
        }).catch(err => {})
    },
    mounted() {
        this.GLOBAL.notificationRecycling(this);
    },
    methods: {
        //一键通知回收
        toNotificationRecycling() {
            this.connection
                .invoke("CallRecycleNotification", JSON.stringify({
                    Title: "回收通知",
                    Content: `${this.UserInfo.ClinicName}有包要回收了！`
                })).catch(function (err) {
                    return console.error(err);
                });
        },
        //删除加急产品
        deleteProduct(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该产品?',
                confirmCallBack: () => {
                    this.submitData.ExpeditedProducts.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //提交完成
        submitComplete() {
            let recycleNumber = 0;
            recycleNumber = this.submitData.PendingRecycleQuantity + this.submitData.ExpeditedProducts.length;
            if (this.GLOBAL.VerificationHandle([{
                    val: recycleNumber,
                    type: "NumberNotZero",
                    msg: "至少回收一个包！"
                }])) {
                axios({
                    url: `/api/PendingRecycleRegister/FailedPackageRegister`,
                    method: "POST",
                    data: this.submitData
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = 'success';
                        this.reload();
                    } else {
                        type = 'error';
                    }
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                        type: type
                    });
                }).catch(err => {})
            }
        },
        //加急产品列表与父组件的通信
        packgeList2father(data) {
            this.isShowPackageList = false;
            if (data) {
                data.forEach(element => {
                    this.insertData(element);
                });
            }
        },
        insertData(obj) {
            let filteredArr = this.submitData.ExpeditedProducts.filter(element => {
                if (element.ProductId === obj.ProductId) {
                    element.ProductQuantity += obj.ProductQuantity;
                    return true;
                }
            });
            if (filteredArr.length == 0) {
                this.submitData.ExpeditedProducts.push(obj);
            }
        },
        //新增产品
        insertProduct() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.selectedCssdId,
                    type: "StringNotEmpty",
                    msg: "请选择回收供应室！"
                }])) {
                this.isShowPackageList = true;
            }
        },
        //加急数量change
        handleNumberChange(newValue, oldValue, $index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.submitData.ExpeditedProducts[$index].ProductQuantity = oldValue;
                }, 0);
            }
        }
    },
  computed: {
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#recycleInClinic {
    .cssd_title_right {
        p {
            span {
                line-height: 40px;
                color: #D0D4DA;
            }

            .el-select {
                width: 200px;

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

                    input {
                        border-width: 2px;
                        font-size: 18px;
                        color: #fff;
                        font-weight: bold;
                    }
                }

            }
        }
    }

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

            .el-table {
                a {
                    color: #F93E3E;
                    cursor: pointer;
                }

                .el-input-number {
                    height: 24px;
                    line-height: 24px;

                    input {
                        height: 100%;
                    }
                }
            }

            .el-button {
                width: 120px;
                height: 32px;
                background: #00C16B;
                border: 0;
                line-height: 32px;
                font-size: 18px;
                margin-top: 30px;
            }
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
