<template>
<div class="cssd_box" id="missingPackageAdd">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/sterilize/record" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
        </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <ul>
                <li>
                    <p>灭菌编号</p>
                    <span>{{sterilizeBarCode}}</span>
                </li>
            </ul>
            <el-table :data="submitData.NotInCarrierPackageBarCodes">
                <el-table-column width="240" label="包名称" prop="ProductName"></el-table-column>
                <el-table-column width="210" label="包条码" prop="BarCode"></el-table-column>
                <el-table-column width="210" label="操作">
                    <template slot-scope="props">
                        <a @click="deletePackage(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button type="primary" round @click="submitComplete">添加完成</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :ApiUrl="'/api/Scanner/Sterilize'" :BarCodeList="submitData.NotInCarrierPackageBarCodes"></ManualEnter>
    </transition>
</div>
</template>

<script>
import ManualEnter from "@/components/common/ManualEnter";
export default {
    inject: ['reload'],
    data() {
        return {
            isShowManualEnter: false,
            sterilizeBarCode: this.$route.query.sterilizeBarCode,
            submitData: {
                SterilizeId: +this.$route.query.recordId,
                NotInCarrierPackageBarCodes: []
            }
        };
    },
    components: {
        ManualEnter
    },
    created() {

    },
    mounted() {},
    methods: {
        //提交完成
        submitComplete() {
            if(this.GLOBAL.VerificationHandle([{
                val: this.submitData.NotInCarrierPackageBarCodes,
                type: "ArrayNotEmpty",
                msg: "至少添加一个包！"
            }])){
                axios({
                    url: "/api/Sterilize/SterilizeAppendPackages",
                    method: "POST",
                    data: this.submitData
                }).then(res=>{
                    if(res.data.Code==200){
                        this.$router.push("/sterilize/record");
                    }else{
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg                        })
                    }
                }).catch(err=>{})
            }
        },
        //手工录入数据传输
        packageData2father(data){
            this.isShowManualEnter = false;
            if(data){
                this.submitData.NotInCarrierPackageBarCodes.push(data.SinglePackage);
            }
        },
        //手工录入处理
        handleShowManualEnter(){
            this.isShowManualEnter = true;
        },
        //扫描枪
        handleBarCode(msg) {
            if(this.submitData.NotInCarrierPackageBarCodes.some(item => item == msg.toUpperCase())){
                this.showInformation({
                    classify: "message",
                    msg: "该条码已录入！",
                });
                return;
            }
            axios({
                    url: `/api/Scanner/Sterilize/${msg}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        this.packageData2father(res.data.Data);
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                })
                .catch(err => {});
            
        },
        //删除包
        deletePackage(index){
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该包吗?',
                confirmCallBack: () => {
                    this.submitData.NotInCarrierPackageBarCodes.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#missingPackageAdd {

    .cssd_table_center {
        overflow: hidden;

        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;
            
            ul{
                margin-bottom: 30px;
                li{
                    display: flex;
                    p{
                        color: #878D9F;
                        font-size: 16px;
                        width: 64px;
                        text-align: right;
                    }
                    span{
                        margin-left: 10px;
                        font-weight: bold;
                        color: #333;
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
                        a{
                            color: #F93E3E;
                        }
                    }
                }
            }
        }

    }
}
</style>
