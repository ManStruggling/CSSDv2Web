<template>
<div class="cssd_box" id="borrowPackageRegistration">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/provide/registration" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="handleShowManualEnter">
                <p>手工录入</p>
            </li>
            <!-- <li @click="handleShowCountPackages">
          <p>计数包借用</p>
        </li>-->
            <router-link to="/provide/borrowRecord" tag="li">
                <p>借包记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>借包科室</span>
                <el-select v-model="submitData.BorrowedSubClinicId" filterable default-first-option placeholder="选择科室" class="white24x13">
                    <el-option v-for="item in clinicList" :key="item.ProvideSubClinicId" :label="item.ProvideSubClinicName" :value="item.ProvideSubClinicId"></el-option>
                </el-select>
            </p>
            <p>
                <span>借包人</span>
                <el-select v-model="submitData.Borrower" filterable allow-create default-first-option placeholder="选择人员" class="white24x13">
                    <el-option v-for="(item,index) in staffList" :key="index" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <el-table :data="submitData.Packages">
                <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                <el-table-column label="包名称" prop="ProductName" width="210" show-overflow-tooltip></el-table-column>
                <el-table-column label="配包日期" prop="PackageDate" width="210"></el-table-column>
                <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                <!-- <el-table-column label="灭菌设备名称" prop="SterilizeDevice" width="210"></el-table-column>
              <el-table-column label="当日锅次" prop="SterilizeTodayBatch" width="120"></el-table-column>
          <el-table-column label="总锅次" prop="SterilizeTotalBatch" width="120"></el-table-column>-->
                <el-table-column label="操作" width="60">
                    <template slot-scope="props">
                        <a @click="deleteProvidePackage(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p>
                共计
                <span>{{submitData.Packages.length}}</span> 包
            </p>
            <p>
                <el-button type="primary" @click="submitComplete">借包完成</el-button>
            </p>
        </div>
    </div>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 手工录入 -->
        <ManualEnter v-if="isShowManualEnter" @to-father="packageData2father" :BarCodeList="submitData.Packages" :ApiUrl="'/api/Scanner/IncludePackages/Provide'"></ManualEnter>
    </transition>
    <!-- 计数包发放 -->
    <!-- <CountNumberPackageList
      v-if="isShowCountNumberPackageList"
      @countNumber-to-father="countNumberToFather"
      :getApi="''"
    ></CountNumberPackageList>-->
</div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
// import CountNumberPackageList from "../common/CountNumberPackageList";
export default {
    inject: ['reload'],
    data() {
        return {
            isShowManualEnter: false,
            // isShowCountNumberPackageList: false,
            clinicList: [],
            staffList: [],
            submitData: {
                Borrower: "",
                BorrowedSubClinicId: "",
                Packages: []
            }
        };
    },
    components: {
        ManualEnter
        // CountNumberPackageList
    },
    created() {
        CSManager.handleDataThis = this;
        axios({
                url: `/api/Clinic/SubClinic`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.clinicList = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                    });
                }
            })
            .catch(err => {});
        axios({
            url: `/odata/Staffs?$select=id,name`
        }).then(res=>{
            this.staffList = res.data.value;
        })
    },
    mounted() {},
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        //提交完成
        submitComplete() {
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.submitData.BorrowedSubClinicId,
                        type: "StringNotEmpty",
                        msg: "请选择借包科室"
                    },
                    {
                        val: this.submitData.Borrower,
                        type: "stringNotEmpty",
                        msg: "请选择借包人！"
                    },
                    {
                        val: this.submitData.Packages,
                        type: "ArrayNotEmpty",
                        msg: "请至少录入一个包！"
                    }
                ])
            ) {
                axios({
                    url: `/api/Provide/BorrowedPackageComplete`,
                    method: "POST",
                    data: this.submitData
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        this.reload();
                    } else {
                        type = "error";
                    }
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                        type: type
                    });
                }).catch(err => {})
            }
        },
        //删除包
        deleteProvidePackage(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该包?',
                confirmCallBack: () => {
                    this.submitData.Packages.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //手工录入与父组件通信
        packageData2father(data) {
            this.isShowManualEnter = false;
            if (data) {
                data.forEach(element => {
                    this.submitData.Packages.push(element);
                });
            }
        },
        handleBarCode(msg) {
            let onOff = true;
            this.submitData.Packages.forEach(item => {
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
                    url: `/api/Scanner/IncludePackages/Provide/${msg}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.packageData2father(res.data.Data);
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                }).catch(err => {})
            }
        },
        // //计数包与父组件通信
        // countNumberToFather(data) {
        //   this.isShowCountNumberPackageList = false;
        //   if (data) {
        //     console.log(data)
        //   }
        // },
        //处理手工录入
        handleShowManualEnter() {
            this.isShowManualEnter = true;
        }
        // //处理计数包
        // handleShowCountPackages() {
        //   this.isShowCountNumberPackageList = true;
        // }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#borrowPackageRegistration {
    .cssd_title_right {
        p {
            span {
                text-align: right;
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(208, 212, 218, 1);
                line-height: 40px;
                margin-left: 30px;
                width: 100px;
            }

            .el-select {
                width: 200px;

                .el-input {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #fff;
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

            .el-table {
                a {
                    cursor: pointer;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(249, 62, 62, 1);
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
