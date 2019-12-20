<template>
<div class="cssd_box" id="putInInventory">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <router-link to="/apply/putInInventoryRecord" tag="li">
                <p>入库记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>入库科室</span>
                <el-select v-model="putInTask.InboundSubClinicId" filterable default-first-option class="white24x13">
                    <el-option v-for="(item,index) in GLOBAL.UserInfo.SubClinics" :key="index" :label="item.SubClinicName" :value="item.SubClinicId"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
        <div class="table_box table_collapse table_unExpand">
            <div class="content_title">
                <p>包名称</p>
                <p>剩余入库数</p>
                <p>本次入库数</p>
            </div>
            <el-collapse accordion v-model="activeName">
                <el-collapse-item v-for="(value,collapseIndex) in putInTask.Products" :key="collapseIndex" :name="collapseIndex+''" :class="value.IsNotPrintBarCode?'collapseUnExpand':''">
                    <div slot="title" class="collapseTh">
                        <div class="collapseTd">
                            <p>{{value.ProductName}}</p>
                        </div>
                        <div class="collapseTd">
                            <p>{{value.RemainInboundCount}}</p>
                        </div>
                        <div class="collapseTd">
                            <p v-if="!value.IsNotPrintBarCode">{{countPackagesNumber(collapseIndex)}}</p>
                            <p v-if="value.IsNotPrintBarCode">
                                <el-input-number v-model="value.ThisTimeInboundCount" :min="0" :max="value.RemainInboundCount" :controls="false" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,collapseIndex)})"></el-input-number>
                            </p>
                        </div>
                    </div>
                    <el-table v-if="!value.IsNotPrintBarCode" :data="value.Packages">
                        <el-table-column label="包名称" prop="ProductName" width="240"></el-table-column>
                        <el-table-column label="包条码" prop="BarCode" width="210"></el-table-column>
                        <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                        <el-table-column v-if="value.IsNumberProduct" label="包内个数" prop="NumberProductQuantity"></el-table-column>
                        <el-table-column label="操作" width="210">
                            <template slot-scope="props">
                                <a @click="deletePackage(value.Packages,props.$index)">删除</a>
                            </template>
                        </el-table-column>
                        <el-table-column></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="cssd_table_bottom">
            <p>
                共计 <span>{{countAllNumber}}</span> 包
            </p>
            <p>
                <el-button type="primary" @click="submitComplete">入库完成</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :BarCodeList="barCodeList" :ApiUrl="'/api/Scanner/Inbound'" :PutInInventory="true"></ManualEnter>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
    inject: ['reload'],
    data() {
        return {
            activeName: '-1',
            isShowManualEnter: false,
            putInTask: {
                ProvideLogisticBarCode: "",
                InboundSubClinicId: "",
                Products: []
            },
            barCodeList: [] //检测重复
        };
    },
    components: {
        ManualEnter
    },
    //路由前置守卫
    beforeRouteEnter(to, from, next) {
        if (sessionStorage.userInfo) {
            if (UserInfo.JobAndCompetence.includes('261') || UserInfo.JobAndCompetence.includes('262') || UserInfo.JobAndCompetence.includes('000') || UserInfo.JobAndCompetence.includes('200') || UserInfo.JobAndCompetence.includes('202')) {
                next();
            } else {
                next(from.path);
                VueVm.$message({
                    type: 'warning',
                    message: '您没有使用模块访问权限！',
                    center: true,
                    duration: 2000,
                    showClose: true
                })
            }
        } else {
            next('/login')
        }
    },
    created() {
        CSManager.handleDataThis = this;
        axios({
            url: `/api/Inbound`
        }).then(res => {
            if (res.data.Code == 200) {
                res.data.Data.InboundSubClinicId = "";
                this.putInTask = res.data.Data;
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                });
            }
        }).catch(err => {})
    },
    mounted() {},
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        deletePackage(list, $index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该包?',
                confirmCallBack: () => {
                    list.splice($index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //入库完成
        submitComplete() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.putInTask.InboundNumber,
                    type: "NumberNotZero",
                    msg: "您还没有添加包，请至少扫入一个包！"
                }, {
                    val: this.putInTask.InboundSubClinicId,
                    type: "StringNotEmpty",
                    msg: "请选择入库科室！"
                }])) {
                axios({
                    url: `/api/Inbound`,
                    method: "POST",
                    data: this.putInTask
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        this.putInTask = res.data.Data;
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
            }
        },
        //计数器change事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.putInTask.Products[index].ThisTimeInboundCount = 0;
                }, 0);
            }
        },
        //处理手工录入
        handleShowManualEnter() {
            this.getBarCodeArray();
            this.isShowManualEnter = true;
        },
        getBarCodeArray() {
            let tempArr = [];
            for (let i = 0; i < this.putInTask.Products.length; i++) {
                if (this.putInTask.Products[i].Packages) {
                    tempArr = tempArr.concat(this.putInTask.Products[i].Packages);
                }
            }
            this.barCodeList = tempArr;
        },
        packageData2father(data, barCode) {
            this.isShowManualEnter = false;
            if (data) {
                if (data.length > 0 && data[0].IsProvideLogisticTask) {
                    this.putInTask.ProvideLogisticBarCode = barCode;
                }
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < this.putInTask.Products.length; j++) {
                        if(data.IsNumberProduct){
                            if(data[i].ProductId === this.putInTask.Products[j].ProductId && this.putInTask.Products[j].ThisTimeInboundCount+data[i].NumberProductQuantity<=this.putInTask.Products[j].RemainInboundCount){
                                this.putInTask.Products[j].Packages.push(data[i]);
                                this.putInTask.Products[j].ThisTimeInboundCount += data[i].NumberProductQuantity;
                                this.activeName = j + '';
                                break;
                            }
                        }else{
                            if (data[i].ProductId === this.putInTask.Products[j].ProductId && this.putInTask.Products[j].ThisTimeInboundCount < this.putInTask.Products[j].RemainInboundCount) {
                                this.putInTask.Products[j].Packages.push(data[i]);
                                this.activeName = j + '';
                                break;
                            }
                        }
                    }
                }
            }
        },
        handleBarCode(msg) {
            this.getBarCodeArray();
            let onOff = true;
            this.barCodeList.forEach(item => {
                //发现已录入
                if (item.BarCode == msg.toUpperCase()) {
                    this.showInformation({
                        classify: "message",
                        msg: "该条码已录入！",
                        type: "warning"
                    });
                    onOff = false;
                    return;
                }
            });
            if (onOff) {
                axios({
                    url: `/api/Scanner/Inbound/${msg}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.packageData2father(res.data.Data, msg);
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                }).catch(err => {})
            }
        }
    },
    computed: {
        countPackagesNumber() {
            return index => {
                if(this.putInTask.Products[index].IsNumberProduct){
                    let num = 0;
                    this.putInTask.Products[index].Packages.forEach(element=>{
                        num += element.NumberProductQuantity;
                    });
                    this.putInTask.Products[index].ThisTimeInboundCount = num;
                    return num;
                }else{
                    this.putInTask.Products[index].ThisTimeInboundCount = this.putInTask.Products[index].Packages == undefined ? 0 : this.putInTask.Products[index].Packages.length;
                    return this.putInTask.Products[index].ThisTimeInboundCount;
                }
            }
        },
        countAllNumber() {
            let num = 0;
            this.putInTask.Products.forEach(element => {
                num += element.ThisTimeInboundCount;
            });
            this.putInTask.InboundNumber = num;
            return num;
        }
    },
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";
@import "../../assets/css/tableTotalBottomBar";

#putInInventory {
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
        .table_box {
            height: 100%;
            padding: 30px 40px;
            box-sizing: border-box;
            overflow-y: scroll;

            .el-table {
                a {
                    cursor: pointer;
                    color: #F93E3E;
                }
            }
        }
    }
}
</style>
