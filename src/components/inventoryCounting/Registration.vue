<template>
<div class="cssd_box" id="inventory_counting">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <router-link to="/inventoryCounting/record" tag="li">
                <p>盘库记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>盘库科室</span>
                <el-select v-model="clinicSelected" class="white24x13">
                    <el-option v-for="(item,index) in clinicList" :key="index"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
        <div class="table_box">

        </div>
        <div class="cssd_table_bottom">
            <p>
                <el-button type="primary" round @click="submitComplete">盘库完成</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :ApiUrl="''" :BarCodeList="submitData.Packages"></ManualEnter>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
    data() {
        return {
            isShowManualEnter: false,
            clinicSelected: "",
            submitData: {
                SubClinicId: "",
                Packages: []
            },
            clinicList: []
        };
    },
    components: {
        ManualEnter
    },
    created() {
        CSManager.handleDataThis = this;
    },
    mounted() {},
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        //提交完成
        submitComplete() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.submitData.SubClinicId,
                    type: "StringNotEmpty",
                    msg: "请选择盘库科室！"
                }, {
                    val: this.submitData.Packages,
                    type: "ArrayNotEmpty",
                    msg: "至少扫入一个包！"
                }])) {
                axios({
                    url: `/api/Inventory/CheckInventory`,
                    method: "POST",
                    data: this.submitData
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                    } else {
                        type = "error";
                    }
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                        type: type
                    })
                }).catch(err => {})
            }
        },
        //处理手工录入
        handleShowManualEnter() {
            this.isShowManualEnter = true;
        },
        //手工录入与父组件的通信
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {

            }
        },
        //处理扫描枪条码
        handleBarCode(msg) {
            for (let i = 0; i < this.submitData.Packages.length; i++) {
                if (this.submitData.Packages.BarCode == msg) {
                    this.showInformation({
                        classify: "message",
                        msg: "该条码已录入！",
                        type: "warning"
                    });
                    return;
                }
            }
            //请求
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";

#inventory_counting {
    .cssd_title_right {
        p {
            .el-select {
                width: 200px;

                .el-input {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(208, 212, 218, 1);

                    input {
                        color: #fff;
                    }
                }
            }
        }
    }

    .cssd_table_center {
        overflow: hidden;

        .table_box {
            padding: 40px 20px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
            flex-direction: row-reverse;
        }
    }
}
</style>
