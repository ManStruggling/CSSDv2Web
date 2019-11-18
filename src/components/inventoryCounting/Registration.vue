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
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>盘库科室</span>
                <el-select v-model="clinicSelected" class="white24x13">
                    <el-option label="供应室" value="1"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
        <div class="table_box"></div>
        <div class="cssd_table_bottom">
            <p>
                <el-button type="primary" round @click="submitComplete">盘库完成</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :ApiUrl="'/api/Scanner/Recycle'" :BarCodeList="[]" :firstRequest="true"></ManualEnter>
    </transition>
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
    data() {
        return {
            isShowManualEnter: false,
            clinicSelected: ""
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
        submitComplete() {},
        //处理手工录入
        handleShowManualEnter() {
            this.isShowManualEnter = true;
        },
        //手工录入与父组件的通信
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {

            }
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
