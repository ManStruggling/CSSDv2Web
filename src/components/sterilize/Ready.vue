<template>
  <div class="cssd_box" id="sterilizeReady">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <li @click="handleShowManualEnter">
          <p>手工录入</p>
        </li>
        <li
          v-if="UserInfo.Configuration.IsActiveNotBarCodeProduct"
          @click="handleShowCountPackages"
        >
          <p>计数包登记</p>
        </li>
        <router-link to="/sterilize/readyRecord" tag="li" v-if="!sterilizeReadyChangeMode">
          <p>灭菌准备记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>待灭菌包</span>:
          <b>{{sterilizeablePackages.length}}</b>
          <a @click="handleShowSterilizeablePackage">查看</a>
        </p>
        <p>
          <span v-show="submitData.CarrierId===0">暂无网篮</span>
          <span class="hasCarrierData" v-show="submitData.CarrierId!=0">{{submitData.CarrierName}}</span>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box table_unExpand">
        <el-table :data="submitData.PackageBarCodes">
          <el-table-column label="包名称" prop="ProductName" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column label="包条码" prop="BarCode" width="210"></el-table-column>
          <el-table-column label="科室" prop="ProvideSubClinicName" width="210" show-overflow-tooltip></el-table-column>
          <el-table-column label="包数量" width="210">
            <template slot-scope="props">
              <el-input-number
                v-if="props.row.IsNotPrintBarCode"
                v-model="props.row.ProductQuantity"
                :min="1"
                :max="props.row.MaximumQuantity"
                size="mini"
                :controls="false"
                @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"
              ></el-input-number>
              <div v-if="!props.row.IsNotPrintBarCode">{{props.row.ProductQuantity}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210">
            <template slot-scope="props">
              <el-button @click="deletePackage(props.$index,props.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          <s>共计</s>
          <b>{{countPackageNumber(submitData.PackageBarCodes)}}</b>
          <span>包</span>
        </p>
        <p>
          <el-button v-if="sterilizeReadyChangeMode" @click="cancelChange">取消修改</el-button>
          <el-button
            type="primary"
            @click="sterilizeReadyComplete"
          >{{sterilizeReadyChangeMode?'修改完成':'摆放完成'}}</el-button>
        </p>
      </div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 添加计数包 -->
      <CountNumberPackageList
        v-if="isShowCountNumberPackageList"
        @countNumber-to-father="countNumberToFather"
        :getApi="'/odata/CanBeSterilizedNotBarCodeProduct'"
      ></CountNumberPackageList>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 手工录入 -->
      <ManualEnter
        v-if="isShowManualEnter"
        @to-father="packageData2father"
        :ApiUrl="'/api/Scanner/SterilizeReady'"
        :BarCodeList="submitData.PackageBarCodes"
      ></ManualEnter>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 可被灭菌的包 -->
      <SterilizeablePackages
        v-if="isShowSterilizeablePackage"
        @sterilizeable-to-father="sterilizeableToFather"
        :packages="sterilizeablePackages"
      ></SterilizeablePackages>
    </transition>
  </div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import CountNumberPackageList from "../common/CountNumberPackageList";
import SterilizeablePackages from "../common/SterilizeablePackages";
export default {
  inject: ["reload"],
  props: {
    UserInfo: Object
  },
  data() {
    return {
      sterilizeablePackages: [],
      sterilizeReadyChangeMode: false,
      isShowManualEnter: false,
      isShowSterilizeablePackage: false,
      isShowCountNumberPackageList: false,
      submitData: {
        CarrierId: 0,
        CarrierName: "",
        DeviceType: 5, //2高温高压  3低温等离子 4环氧乙烷 5不限制
        PackageBarCodes: []
      }
    };
  },
  components: {
    ManualEnter,
    CountNumberPackageList,
    SterilizeablePackages
  },
  created() {
    CSManager.handleDataThis = this;
    if (this.$route.query.recordId) {
      this.sterilizeReadyChangeMode = true;
      axios({
        url: `/api/Sterilize/PendingUpdateSterilizeReadyRecord/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.submitData = res.data.Data;
          } else {
            this.showInformation({
              classify: "message",
              msg: res.data.Msg
            });
          }
        })
        .catch(err => {});
    }
    axios({
      url: `/api/Sterilize/CanBeSterilizePackages`
    })
      .then(res => {
        this.sterilizeablePackages = res.data.Data;
      })
      .catch(err => {});
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    //显示可被灭菌的包
    handleShowSterilizeablePackage() {
      this.isShowSterilizeablePackage = true;
    },
    //可被灭菌的包和父组件通信
    sterilizeableToFather(data) {
      this.isShowSterilizeablePackage = false;
      if (data) {
        data.forEach(element => {
          this.handleBarCode(element.BarCode);
        });
      }
    },
    //el-input-number change 事件
    handleNumberChange(newValue, oldValue, index) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.submitData.PackageBarCodes[index].ProductQuantity = 1;
        }, 0);
      }
    },
    //返回
    goBack() {
      if (this.sterilizeReadyChangeMode) {
        this.$router.push("/sterilize/readyRecord");
      } else {
        this.$router.push("/sterilize/select");
      }
    },
    //处理计数包登记
    handleShowCountPackages() {
      this.isShowCountNumberPackageList = true;
    },
    //计数包添加 包列表和父组件通信
    countNumberToFather(data) {
      this.isShowCountNumberPackageList = false;
      if (data) {
        //find计数包
        let onOff = true;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.submitData.PackageBarCodes.length; j++) {
            if (
              data[i].ProductId ==
                this.submitData.PackageBarCodes[j].ProductId &&
              this.submitData.PackageBarCodes[j].PackageBarCodeId == 0
            ) {
              onOff = false;
              this.submitData.PackageBarCodes[j].ProductQuantity +=
                data[i].ProductQuantity;
              break;
            }
          }
          if (onOff) {
            this.submitData.PackageBarCodes.push(data[i]);
          }
        }
      }
    },
    //取消修改
    cancelChange() {
      this.$router.push({
        path: "/sterilize/readyRecord"
      });
    },
    //删除包
    deletePackage(index, row) {
      this.showInformation({
        classify: "confirm",
        msg: "确定要删除该包吗?",
        confirmCallBack: () => {
          this.submitData.PackageBarCodes.splice(index, 1);
          if(this.submitData.PackageBarCodes.every(item=>item.DeviceType===5)){
            this.submitData.DeviceType = 5;
          }
        },
        cancelCallBack: () => {}
      });
    },
    //灭菌准备完成
    sterilizeReadyComplete() {
      let url = "/api/Sterilize/SterilizeReadyComplete";
      let method = "POST";
      if (this.sterilizeReadyChangeMode) {
        url = "/api/Sterilize/SterilizeReadyRecordModify";
        method = "PUT";
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.submitData.CarrierId,
            type: "NumberNotZero",
            msg: "您还没有关联网篮，请关联网篮！"
          },
          {
            val: this.submitData.PackageBarCodes,
            type: "ArrayNotEmpty",
            msg: "网篮至少关联一个包！"
          }
        ])
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
              if (this.sterilizeReadyChangeMode) {
                this.$router.push({
                  path: "/sterilize/readyRecord"
                });
              } else {
                this.reload();
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
      }
    },
    //处理手工录入
    handleShowManualEnter() {
      this.isShowManualEnter = true;
    },
    //手工录入数据接收
    packageData2father(data) {
      this.isShowManualEnter = false;
      if (data) {
        //扫包
        if (data.PackageBarCodeScannerVm) {
          if (
            data.PackageBarCodeScannerVm.DeviceType === 5 ||
            this.submitData.DeviceType === 5 ||
            data.PackageBarCodeScannerVm.DeviceType ==
              this.submitData.DeviceType
          ) {
            //insert data
            if (data.PackageBarCodeScannerVm.DeviceType != 5) {
              this.submitData.DeviceType = data.PackageBarCodeScannerVm.DeviceType;
            }
            this.submitData.PackageBarCodes.push(data.PackageBarCodeScannerVm);
          } else {
            //error
            this.showInformation({
              classify: "message",
              msg: "扫入的包和网篮内的包灭菌类型不匹配！"
            });
          }
          return;
        }
        //扫网篮
        if (data.CarrierBarCodeScannerVm) {
          if (this.submitData.CarrierId == 0) {
            this.submitData.CarrierId = data.CarrierBarCodeScannerVm.Id;
            this.submitData.CarrierName = data.CarrierBarCodeScannerVm.Name;
          } else {
            this.showInformation({
              classify: "confirm",
              msg: "已录入网篮,是否需要替换该网篮?",
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
    //添加数据处理
    handleBarCode(msg) {
      let onOff = true;
      this.submitData.PackageBarCodes.forEach(item => {
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
          url: `/api/Scanner/SterilizeReady/${msg}`
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
      }
    }
  },
  computed: {
    //计算包数量
    countPackageNumber() {
      return list => {
        let num = 0;
        list.forEach(val => {
          num += val.ProductQuantity;
        });
        return num;
      };
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#sterilizeReady {
  .cssd_title_right {
    p {
      display: flex;
      margin-left: 30px;
      span {
        text-align: right;
        width: 100px;
      }
      a {
        font-size: 14px;
        color: #00c16b;
        line-height: 24px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }

  .cssd_table_center {
    .table_box {
      padding: 30px 40px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;

      .el-table {
        tbody {
          .cell {
            font-weight: bold;

            > div {
              font: inherit;
            }
          }
        }

        .el-button {
          border: 0;
          font-size: 18px;
          font-family: Microsoft YaHei;
          color: rgba(249, 62, 62, 1);

          &:hover {
            background: none;
          }
        }
      }
    }
  }
}
</style>
