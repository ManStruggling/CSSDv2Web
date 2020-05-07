<template>
  <!-- 新购入包
    单网篮包&单网篮Id：必须一一对应且不能重复,添加绑定单包网篮会被push进deleteTheIdOfAlreadyEnteredSingleCarrierIds,删除则被splice
    产品手动添加字段(key)： handleAddData函数 -- SingleCarrierId
                          inputBlur函数 -- SingleCarrierName
    修改完成&回收完成：整理成api所需的数据结构之前会检测单包网篮录入是否重复。提交成功发送webSocket消息推送
  -->
  <div class="cssd_box" id="newPurchasingRegistration">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="newPurchasingGoBack">
          <p>返回</p>
        </li>
        <li @click="handleManualEnter">
          <p>手工录入</p>
        </li>
        <li @click="handleShowPackageList">
          <p>新购入包录入</p>
        </li>
        <router-link
          :to="{
                path: '/recovery/record',
                query: {
                    sourceRoute: `/recovery/newPurchasing`,
                    requestUrl: `/api/Recycle/RecycleRecords/NewPurchasing`
                }
            }"
          tag="li"
          v-if="!isNewpurchasingChangeMode"
        >
          <p>录入记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <span v-show="submitData.CarrierId===0">暂无网篮</span>
        <span class="hasCarrierData" v-show="submitData.CarrierId!=0">{{submitData.CarrierName}}</span>
      </div>
    </div>
    <div
      :class="{cssd_table_center:true, tabs_totalBar:true, cssd_totalBar:true,displayNav:displayNav}"
    >
      <el-tabs type="border-card" :tab-position="'left'">
        <el-tab-pane v-for="(item,index) in newPurchasingData" :key="index">
          <div slot="label">
            <el-tooltip
              :content="item.ProvideClinicName"
              placement="right"
              :disabled="item.ProvideClinicName?item.ProvideClinicName.length<14:true"
            >
              <h4 class="beyondHiding">{{item.ProvideClinicName}}</h4>
            </el-tooltip>
            <el-tooltip
              :content="item.ProvideSubClinicName"
              placement="right"
              :disabled="item.ProvideSubClinicName?item.ProvideSubClinicName.length<12:true"
            >
              <h3 class="beyondHiding">{{item.ProvideSubClinicName}}</h3>
            </el-tooltip>
            <div class="tab_count">
              <p>
                <span>总包数:</span>
                <b>{{countClinicPackageNum(item.Packages)}}</b>
              </p>
            </div>
          </div>
          <div class="tab_content table_unExpand">
            <el-table :data="item.Packages">
              <el-table-column label="包名称" prop="ProductName" show-overflow-tooltip width="240"></el-table-column>
              <el-table-column label="包数量" prop="ProductName" width="210">
                <template slot-scope="props">
                  <el-input-number
                    v-model="props.row.ProductQuantity"
                    :min="0"
                    :max="props.row.IsSingleCarrierProduct?1:999"
                    size="mini"
                    :controls="false"
                    @change="((newValue,oldValue)=>{packageNumberChange(newValue,oldValue,index,props.$index)})"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="单包网篮" width="210" class-name="singleCarrierBox">
                <template slot-scope="props">
                  <template v-if="props.row.IsSingleCarrierProduct">
                    <el-input
                      type="text"
                      v-model.trim="props.row.SingleCarrierBarCode"
                      placeholder="输入单包网篮(必填)"
                      @blur="inputBlur(props.row)"
                      :disabled="props.row.SingleCarrierId===0?false:true"
                    ></el-input>
                    <i
                      class="deleteSingleCarrier el-icon-error"
                      @click="deleteTheIdOfAlreadyEnteredSingleCarrierIds(props.row)"
                      v-show="props.row.SingleCarrierId!=0"
                    ></i>
                  </template>
                  <template v-else>{{"-"}}</template>
                </template>
              </el-table-column>
              <el-table-column label="单包网篮名称" width="210">
                <template slot-scope="props">
                  <template v-if="props.row.IsSingleCarrierProduct">{{props.row.SingleCarrierName}}</template>
                  <template v-else>{{"-"}}</template>
                </template>
              </el-table-column>
              <el-table-column></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="shrinkNavBox">
        <div class="border_div"></div>
        <i @click="displayNav=!displayNav" class="el-icon-d-arrow-left"></i>
      </div>
      <div class="expandNavBox" @click="displayNav=!displayNav"></div>
      <div class="cssd_table_bottom">
        <p>
          共计
          <span>{{countTotalPackageNum(newPurchasingData)}}</span> 包
        </p>
        <p>
          <el-button @click="cancelChange" v-if="isNewpurchasingChangeMode">取消修改</el-button>
          <el-button
            type="primary"
            @click="submitComplete"
          >{{isNewpurchasingChangeMode?'修改完成':'录入完成'}}</el-button>
        </p>
      </div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 手工录入 -->
      <ManualEnter
        v-if="isShowManualEnter"
        @to-father="carrierData2father"
        :BarCodeList="[]"
        :ApiUrl="'/api/Scanner/Recycle'"
        :OnlyQXW="true"
      ></ManualEnter>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 新购入包登记 -->
      <SelectSubClinicOfProduct
        v-if="isShowPackageList"
        @selectSubClinicOfProduct-to-father="packgeList2father"
        :requestApi="`type eq '高水平消毒包' or type eq '追溯的无菌包'`"
      ></SelectSubClinicOfProduct>
    </transition>
  </div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import SelectSubClinicOfProduct from "../common/SelectSubClinicOfProduct";
export default {
  inject: ["reload"],
  props: {
    UserInfo: Object
  },
  data() {
    return {
      displayNav: true,
      isShowPackageList: false,
      isShowManualEnter: false,
      isNewpurchasingChangeMode: false,
      newPurchasingData: [],
      alreadyEnteredSingleCarrierIds: [],
      submitData: {
        CarrierId: 0,
        CarrierName: "",
        Products: []
      }
    };
  },
  components: {
    ManualEnter,
    SelectSubClinicOfProduct
  },
  beforeRouteEnter(to, from, next) {
    if (
      UserInfo.JobAndCompetence.includes("111") ||
      UserInfo.JobAndCompetence.includes("000") ||
      UserInfo.JobAndCompetence.includes("100")
    ) {
      next();
    } else {
      next(from.path);
      VueVm.$message({
        type: "warning",
        message: "您没有新购入包模块访问权限！",
        center: true,
        duration: 2000,
        showClose: true
      });
    }
  },
  created() {
    CSManager.handleDataThis = this;
    if (this.$route.query.recordId) {
      this.isNewpurchasingChangeMode = true;
      axios(
        `/api/Recycle/PendingUpdateNewPurchasingProduct/${this.$route.query.recordId}`
      )
        .then(res => {
          if (res.data.Code == 200) {
            this.newPurchasingData = JSON.parse(
              JSON.stringify(res.data.Data.Products)
            );
            this.submitData.CarrierId = res.data.Data.CarrierId;
            this.submitData.CarrierName = res.data.Data.CarrierName;
            this.submitData.RecycleTaskId = res.data.Data.RecycleTaskId;
          } else {
            this.showInformation({
              classify: "message",
              msg: res.data.Msg
            });
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.GLOBAL.useWebsocketOrNot(this);
  },
  beforeDestroy() {
    if (this.connection) {
      this.connection.stop();
    }
    CSManager.handleDataThis = null;
  },
  methods: {
    //删除已录入的单包网篮Id并取消绑定
    deleteTheIdOfAlreadyEnteredSingleCarrierIds(val) {
      this.alreadyEnteredSingleCarrierIds = this.alreadyEnteredSingleCarrierIds.filter(
        value => {
          return value != val.SingleCarrierId;
        }
      );
      val.SingleCarrierId = 0;
      val.SingleCarrierBarCode = "";
      val.SingleCarrierName = "";
    },
    // 单包网篮输入框失焦
    inputBlur(val) {
      if (val.SingleCarrierBarCode) {
        axios({
          url: `/api/Scanner/NewPurchasing/SingleProductCarrier/${val.SingleCarrierBarCode}`
        })
          .then(res => {
            if (res.data.Code == 200) {
              if (
                this.alreadyEnteredSingleCarrierIds.includes(
                  res.data.Data.SingleCarrierId
                )
              ) {
                val.SingleCarrierBarCode = "";
                this.showInformation({
                  classify: "message",
                  msg: "录入的网篮重复！"
                });
                return;
              }
              val.SingleCarrierId = res.data.Data.SingleCarrierId;
              val.SingleCarrierName = res.data.Data.SingleCarrierName;
              this.alreadyEnteredSingleCarrierIds.push(
                res.data.Data.SingleCarrierId
              );
              val.Forbid = true;
            } else {
              this.showInformation({
                classify: "message",
                msg: res.data.Msg
              });
            }
          })
          .catch(err => {});
      }
    },
    //新购入包 返回 编程式路由
    newPurchasingGoBack() {
      if (this.isNewpurchasingChangeMode) {
        this.$router.push({
          path: "/recovery/record",
          query: {
            sourceRoute: `/recovery/newPurchasing`,
            requestUrl: `/api/Recycle/RecycleRecords/NewPurchasing`
          }
        });
      } else {
        this.$router.push("/");
      }
    },
    //取消修改
    cancelChange() {
      this.$router.push({
        path: "/recovery/record",
        query: {
          sourceRoute: `/recovery/newPurchasing`,
          requestUrl: `/api/Recycle/RecycleRecords/NewPurchasing`
        }
      });
    },
    //录入完成
    submitComplete() {
      let url = "/api/Recycle/NewPurchasingProductRegister";
      let method = "POST";
      if (this.isNewpurchasingChangeMode) {
        url = "/api/Recycle/NewPurchasingProductModify";
        method = "PUT";
      }

      //获取本次回收的所有单网篮包产品绑定的单包网篮Id
      let testOfSingleCarrierIds = [];
      for (let i = 0; i < this.newPurchasingData.length; i++) {
        for (let j = 0; j < this.newPurchasingData[i].Packages.length; j++) {
          if (this.newPurchasingData[i].Packages[j].IsSingleCarrierProduct) {
            testOfSingleCarrierIds.push(
              this.newPurchasingData[i].Packages[j].SingleCarrierId
            );
          }
        }
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.submitData.CarrierId,
            type: "NumberNotZero",
            msg: "您还没有关联网篮！请关联网篮！"
          },
          {
            val: this.submitData.TotalNumber,
            type: "NumberNotZero",
            msg: "您的网篮里没有关联包，请至少选择一个包！"
          },
          {
            val: testOfSingleCarrierIds,
            type: "NumberAllCannotBeZero",
            msg: "单网篮包必须绑定网篮！"
          }
        ])
      ) {
        //处理成接口需要的数据结构
        this.submitData.Products = [];
        for (let i = 0; i < this.newPurchasingData.length; i++) {
          this.submitData.Products = this.submitData.Products.concat(
            this.newPurchasingData[i].Packages
          );
        }
        //判断是否有录入重复的单包网篮Id
        if (
          testOfSingleCarrierIds.length ===
          Array.from(new Set(testOfSingleCarrierIds)).length
        ) {
          axios({
            url: url,
            method: method,
            data: this.submitData
          })
            .then(res => {
              let type;
              if (res.data.Code == 200) {
                type = "success";
                //socket发送信息
                if (this.connection) {
                  let sendData = {
                    CssdId: this.UserInfo.ClinicId,
                    ReserveCheckState: false,
                    PackageState: true,
                    ProvideState: true
                  };
                  this.connection
                    .invoke("TaskUpdateNotification", sendData)
                    .catch(function(err) {
                      return console.error(err);
                    });
                }

                if (method == "POST") {
                  this.reload();
                } else {
                  this.$router.push({
                    path: "/recovery/record",
                    query: {
                      sourceRoute: `/recovery/newPurchasing`,
                      requestUrl: `/api/Recycle/RecycleRecords/NewPurchasing`
                    }
                  });
                }
              } else {
                type = "error";
              }
              this.showInformation({
                classify: "message",
                msg: res.data.Msg,
                type: type
              });
            })
            .catch(err => {});
        } else {
          this.showInformation({
            classify: "message",
            msg: "扫入的单包网篮不能重复！"
          });
        }
      }
    },
    //处理手工录入
    handleManualEnter() {
      this.isShowManualEnter = true;
    },
    //手工录入和父组件的通信
    carrierData2father(data) {
      this.isShowManualEnter = false;
      if (data) {
        if (data.CarrierBarCodeScannerVm) {
          if (this.submitData.CarrierId == 0) {
            this.submitData.CarrierId = data.CarrierBarCodeScannerVm.Id;
            this.submitData.CarrierName = data.CarrierBarCodeScannerVm.Name;
          } else {
            this.showInformation({
              classify: "confirm",
              msg: "确定要删您已录入网篮,是否需要替换该网篮除该包?",
              confirmCallBack: () => {
                this.submitData.CarrierId = data.CarrierBarCodeScannerVm.Id;
                this.submitData.CarrierName = data.CarrierBarCodeScannerVm.Name;
              },
              cancelCallBack: () => {}
            });
          }
        }
      }
    },
    //新购入包处理
    handleShowPackageList() {
      this.isShowPackageList = true;
    },
    //包列表和父组件通信
    packgeList2father(data) {
      this.isShowPackageList = false;
      if (data) {
        data.forEach(val => {
          this.handleAddData(val);
        });
      }
    },
    //包数量改变
    packageNumberChange(newValue, oldValue, index, idx) {
      if (newValue == 0 || newValue == undefined) {
        this.showInformation({
          classify: "confirm",
          msg: "确定要删除该包?",
          confirmCallBack: () => {
            this.deleteTheIdOfAlreadyEnteredSingleCarrierIds(
              this.newPurchasingData[index].Packages[idx]
            );
            this.newPurchasingData[index].Packages.splice(idx, 1);
          },
          cancelCallBack: () => {
            this.newPurchasingData[index].Packages[
              idx
            ].ProductQuantity = oldValue;
          }
        });
      }
    },
    //处理添加数据
    handleAddData(data) {
      let NoClinic = true; // 找科室   true 没有找到 false 找到了
      let NoPackageClass = true; // 找包类型  true 没有找到 false 找到了
      for (let i = 0; i < this.newPurchasingData.length; i++) {
        if (
          this.newPurchasingData[i].ProvideSubClinicId ==
          data.ProvideSubClinicId
        ) {
          //找到科室
          NoClinic = false;
          if (data.IsSingleCarrierProduct) {
            //单网篮包
            data.SingleCarrierId = 0;
            for (let k = 0; k < data.ProductQuantity; k++) {
              this.newPurchasingData[i].Packages.push(Object.assign({}, data));
            }
            return;
          } else {
            // 一般包
            for (
              let j = 0;
              j < this.newPurchasingData[i].Packages.length;
              j++
            ) {
              if (
                this.newPurchasingData[i].Packages[j].ProductId ==
                data.ProductId
              ) {
                //找到包类型
                NoPackageClass = false;
                this.newPurchasingData[i].Packages[j].ProductQuantity +=
                  data.ProductQuantity;
                return;
              }
            }
            if (NoPackageClass) {
              //没找到包类型
              this.newPurchasingData[i].Packages.push(data);
              return;
            }
          }
        }
      }
      if (NoClinic) {
        //没找到科室
        let arr = [];
        if (data.IsSingleCarrierProduct) {
          //单网篮包
          data.SingleCarrierId = 0;
          for (let k = 0; k < data.ProductQuantity; k++) {
            arr.push(Object.assign({}, data));
          }
        } else {
          //一般包
          arr.push(data);
        }
        this.newPurchasingData.push({
          ProvideClinicName: data.ProvideClinicName,
          ProvideSubClinicName: data.ProvideSubClinicName,
          ProvideSubClinicId: data.ProvideSubClinicId,
          Packages: arr
        });
        
      }
    },
    //处理扫描枪条码
    handleBarCode(msg) {
      if (/^QXW/.test(msg.toUpperCase())) {
        axios({
          url: `/api/Scanner/Recycle/${msg}`
        })
          .then(res => {
            if (res.data.Code == 200) {
              this.carrierData2father(res.data.Data);
            } else {
              this.showInformation({
                classify: "message",
                msg: res.data.Msg
              });
            }
          })
          .catch(err => {});
      }
    }
  },

  computed: {
    //计算科室包数量
    countClinicPackageNum() {
      return list => {
        let num = 0;
        list.forEach(val => {
          if (val.ProductQuantity != undefined) {
            num += val.ProductQuantity;
          }
        });
        return num;
      };
    },
    countTotalPackageNum() {
      return list => {
        let num = 0;
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].Packages.length; j++) {
            if (list[i].Packages[j].ProductQuantity != undefined) {
              num += list[i].Packages[j].ProductQuantity;
            }
          }
        }
        this.submitData.TotalNumber = num;
        return num;
      };
    }
  },
  watch: {
    newPurchasingData: {
      handler(newVal) {
        newVal.forEach((item, index) => {
          if (item.Packages == "") {
            newVal.splice(index, 1);
          }
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tabsTotalBar";
@import "../../assets/css/tableUnExpand";

#newPurchasingRegistration {
  font-family: Microsoft YaHei;
  font-weight: bold;

  .cssd_title_right {
    display: flex;

    span {
      width: 100px;
      text-align: right;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #d0d4da;
    }

    .hasCarrierData {
      color: #fff;
    }
  }

  .cssd_table_center {
    display: flex;
    position: relative;

    // &.displayNav{
    //     .el-tabs__header{
    //         margin-left: 0;
    //     }
    //     .shrinkNavBox{
    //         left: 0;
    //     }
    //     .expandNavBox{
    //         left: -20px;
    //     }
    //     .el-tabs__content{
    //         left: 250px;
    //     }
    // }
    // .el-tabs__header{
    //     margin-left: -250px;
    //     transition-duration: 1s;
    // }
    // .el-tabs__content{
    //     transition-duration: 1s;
    //     left: 0;
    // }
    // .shrinkNavBox{
    //     transition-duration: 1s;
    //     position: absolute;
    //     left: -250px;
    //     bottom: 60px;
    // }
    // .expandNavBox{
    //     transition-duration: 1s;
    //     position: absolute;
    //     left: 0;
    //     bottom: 0;
    //     top: 0;
    //     width: 20px;
    //     z-index: 1;
    // }
    .el-table {
      tbody {
        td {
          padding: 0;

          &.singleCarrierBox {
            position: relative;

            i {
              position: absolute;
              right: 20px;
              top: 24px;
              color: rgba(0, 0, 0, 0.3);
              cursor: pointer;
            }
          }

          .cell {
            overflow: hidden;
            font-size: 18px;
            font-weight: bold;
            color: rgba(35, 46, 65, 1);

            .el-input-number {
              height: 24px;
              margin: 20px 0;

              .el-input {
                height: 100%;

                input {
                  height: 100%;
                  padding: 0;
                  width: 50px;
                  font-size: 18px;
                  font-family: Microsoft YaHei;
                  font-weight: bold;
                  color: rgba(35, 46, 65, 1);

                  &:focus {
                    border-color: rgba(0, 193, 107, 1);
                  }
                }
              }
            }

            > .el-input {
              input {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #232e41;
              }
            }
          }
        }
      }
    }
  }
}
</style>
