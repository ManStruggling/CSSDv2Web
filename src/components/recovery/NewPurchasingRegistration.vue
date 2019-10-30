<template>
  <!-- 新购入包
    单网篮包&单网篮Id：必须一一对应且不能重复,添加绑定单包网篮会被push进deleteTheIdOfAlreadyEnteredSingleCarrierIds,删除则被splice
    产品手动添加字段(key)： handleAddData函数 -- SingleCarrierId
                          inputBlur函数 -- SingleCarrierName
    修改完成&回收完成：整理成api所需的数据结构之前会检测单包网篮录入是否重复。提交成功发送webSocket消息推送
  -->
  <div class="cssd_box newPurchasingRegistration">
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
            path:'/recovery/record',
            query:{
              source:`source eq '新购入'`
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
    <div class="cssd_table_center tabs_totalBar cssd_totalBar">
      <el-tabs type="border-card" :tab-position="'left'">
        <el-tab-pane v-for="(item,index) in newPurchasingData" :key="index">
          <div slot="label">
            <h4>{{item.ProvideClinicName}}</h4>
            <h3>{{item.ProvideSubClinicName}}</h3>
            <div class="tab_count">
              <p>
                <span>总包数:</span>
                <b>{{countClinicPackageNum(item.Packages)}}</b>
              </p>
            </div>
          </div>
          <div class="tab_content">
            <div class="content_title">
              <p>包名称</p>
              <p>包数量</p>
              <p>单包网篮</p>
              <p>单包网篮名称</p>
            </div>
            <ol>
              <li v-for="(val,idx) in item.Packages" :key="idx">
                <p>
                  <b class="beyondHiding">{{val.ProductName}}</b>
                </p>
                <p>
                  <el-input-number
                    v-model="val.ProductQuantity"
                    :min="0"
                    :max="val.IsSingleCarrierProduct?1:999"
                    size="mini"
                    :controls="false"
                    @change="((newValue,oldValue)=>{packageNumberChange(newValue,oldValue,index,idx)})"
                  ></el-input-number>
                </p>
                <p class="singleCarrierBox">
                  <template v-if="val.IsSingleCarrierProduct">
                    <el-input
                      type="text"
                      v-model.trim="val.SingleCarrierBarCode"
                      placeholder="输入单包网篮(必填)"
                      @blur="inputBlur(val)"
                      :disabled="val.SingleCarrierId===0?false:true"
                    ></el-input>
                    <i
                      class="deleteSingleCarrier el-icon-error"
                      @click="deleteTheIdOfAlreadyEnteredSingleCarrierIds(val)"
                      v-show="val.SingleCarrierId!=0"
                    ></i>
                  </template>
                  <template v-else>{{"-"}}</template>
                </p>
                <p>
                  <template v-if="val.IsSingleCarrierProduct">{{val.SingleCarrierName}}</template>
                  <template v-else>{{"-"}}</template>
                </p>
              </li>
            </ol>
          </div>
        </el-tab-pane>
      </el-tabs>
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
      <!-- 数量包登记   控制是否挂载   数据通信   类型 -->
      <PackageList
        v-if="isShowPackageList"
        @packageList-to-father="packgeList2father"
        :packageClass="'NewPurchasing'"
      ></PackageList>
    </transition>
  </div>
</template>

<script>
import PackageList from "../common/PackageList";
import ManualEnter from "../common/ManualEnter";
export default {
  data() {
    return {
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
    PackageList,
    ManualEnter
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
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.GLOBAL.useWebsocketOrNot(this);
  },
  beforeDestroy() {
    if(this.websocket){
      this.websocket.close();
    }
    CSManager.handleDataThis = null;
  },
  methods: {
    //删除已录入的单包网篮Id并取消绑定
    deleteTheIdOfAlreadyEnteredSingleCarrierIds(val) {
      this.alreadyEnteredSingleCarrierIds = this.alreadyEnteredSingleCarrierIds.filter(value => {
        return value != val.SingleCarrierId;
      });
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
                this.alreadyEnteredSingleCarrierIds.includes(res.data.Data.SingleCarrierId)
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
              this.alreadyEnteredSingleCarrierIds.push(res.data.Data.SingleCarrierId);
              val.Forbid = true;
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
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
            source: `source eq '新购入'`
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
          source: `source eq '新购入'`
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
          axios({ url: url, method: method, data: this.submitData })
            .then(res => {
              let type;
              if (res.data.Code == 200) {
                type = "success";
                //socket发送信息
                if(this.websocket){
                  let sendData = {
                    CssdId: this.GLOBAL.UserInfo.ClinicId,
                    ReserveCheckState: false,
                    PackageState: true
                  };
                  if (this.GLOBAL.UserInfo.CssdProvideType === 0) {
                    //回收生成发放
                    sendData.ProvideState = true;
                  } else if (this.GLOBAL.UserInfo.CssdProvideType === 1) {
                    //预定生成发放
                    sendData.ProvideState = false;
                  }
                  this.websocket.send(JSON.stringify(sendData));
                }

                if (method == "POST") {
                  this.$router.go(0);
                } else {
                  this.$router.push({
                    path: "/recovery/record",
                    query: {
                      source: `source eq '新购入'`
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
            this.$confirm("您已录入网篮,是否需要替换该网篮?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.submitData.CarrierId = data.CarrierBarCodeScannerVm.Id;
                this.submitData.CarrierName = data.CarrierBarCodeScannerVm.Name;
              })
              .catch(() => {});
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
        this.$confirm("您确定要删除该包?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteTheIdOfAlreadyEnteredSingleCarrierIds(this.newPurchasingData[index].Packages[idx]);
            this.newPurchasingData[index].Packages.splice(idx, 1);
          })
          .catch(() => {
            this.newPurchasingData[index].Packages[
              idx
            ].ProductQuantity = oldValue;
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
        axios({ url: `/api/Scanner/Recycle/${msg}` })
          .then(res => {
            if (res.data.Code == 200) {
              this.carrierData2father(res.data.Data);
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
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
.newPurchasingRegistration {
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
    .content_title {
      display: flex;
      height: 60px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      color: rgba(135, 141, 159, 1);
      line-height: 60px;
      padding-left: 40px;
      background: rgba(247, 248, 250, 1);
      p {
        width: 200px;
        margin-right: 10px;
      }
    }
    ol {
      li {
        display: flex;
        padding-left: 40px;
        height: 65px;
        border: 1px solid #fff;
        border-bottom: 1px solid #f2f4f7;
        box-sizing: border-box;
        &:hover {
          border-color: rgba(0, 193, 107, 1);
          border-radius: 4px;
        }
        p {
          width: 200px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(35, 46, 65, 1);
          white-space: nowrap;
          &.singleCarrierBox {
            position: relative;
            i {
              position: absolute;
              right: 10px;
              top: 24px;
              color: rgba(0, 0, 0, 0.3);
              cursor: pointer;
            }
          }
          span {
            display: block;
          }
          b {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(35, 46, 65, 1);
            line-height: 65px;
          }
          .el-input-number {
            height: 24px;
            margin: 20px 0;
            .el-input {
              height: 100%;
              input {
                height: 100%;
                padding: 0;
                width: 40px;
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
</style>