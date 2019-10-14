<template>
  <div id="outerPackage">
    <div class="box">
      <div class="container">
        <ul>
          <li>
            <p class="font16gray">送包单位</p>
            <el-select
              filterable
              v-model="outerPackageVm.SupplierId"
              @change="supplierChange"
              :disabled="$props.mode"
              class="green24x13"
            >
              <el-option
                v-for="(item,index) in SupplierList.Suppliers"
                :key="index"
                :label="item.SupplierName"
                :value="item.SupplierId"
              ></el-option>
            </el-select>
          </li>
          <li>
            <p class="font16gray">送包人</p>
            <el-input v-model.trim="outerPackageVm.DeliveryPerson"></el-input>
          </li>
          <li>
            <p class="font16gray">包名称</p>
            <el-select
              filterable
              v-model="outerPackageVm.ProductId"
              @change="productChange"
              :disabled="$props.mode"
              class="green24x13"
            >
              <el-option
                v-for="(item,index) in SupplierList.Products"
                :key="index"
                :label="item.ProductName"
                :value="item.ProductId"
              ></el-option>
            </el-select>
          </li>
          <li>
            <p class="font16gray">分包数</p>
            <el-input-number
              v-model="outerPackageVm.SplitPackageCount"
              :controls="false"
              :min="1"
              :max="999"
              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'SplitPackageCount')})"
            ></el-input-number>
          </li>
          <li>
            <p class="font16gray">植入物</p>
            <el-select v-model="outerPackageVm.HasImplants" class="green24x13">
              <el-option label="无" :value="false"></el-option>
              <el-option label="有" :value="true"></el-option>
            </el-select>
          </li>
          <li>
            <p class="font16gray">清洗架</p>
            <el-input v-model.trim="outerPackageVm.CarrierName" @blur="getCarrierData(outerPackageVm.CarrierName)"></el-input>
          </li>
          <li>
            <p class="font16gray">器械总数</p>
            <el-input-number
              v-model="outerPackageVm.InstrumentTotalCount"
              :controls="false"
              :min="1"
              :max="999"
              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'InstrumentTotalCount')})"
              ></el-input-number>
          </li>
        </ul>
        <div class="table_unExpand">
          <el-table :data="outerPackageVm.Instruments" height="300">
            <el-table-column prop="Name" label="名称"></el-table-column>
            <el-table-column prop="Specification" label="规格"></el-table-column>
            <el-table-column label="数量" width="140">
              <template slot-scope="props">
                <el-input-number
                  :min="1"
                  :max="999"
                  :controls="false"
                  v-model="props.row.Quantity"
                  size="mini"
                  @change="((newValue,oldValue)=>{handleCountNumberPackage(newValue,oldValue,props.$index)})"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <a @click="deleteThisPackage(props.$index)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button
          v-if="!$props.isBackupPackage"
          type="primary"
          @click="addInstrument"
          class="btn88x32"
          style="margin-top:30px;"
        >新增</el-button>
      </div>
      <h4 style="text-align:center;">
        <el-button @click="cancelAdd" class="btn88x32empty">取消</el-button>
        <el-button type="primary" @click="completeAdd" class="btn88x32">确定</el-button>
      </h4>
    </div>
    <!-- 器械列表 -->
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <InstrumentList v-if="isShowInstrumentList" @to-father="InstrumentList2Father"></InstrumentList>
    </transition>
  </div>
</template>

<script>
import InstrumentList from "../common/InstrumentList";
export default {
  data() {
    return {
      isShowInstrumentList: false,
      input2: "",
      SupplierList: {
        Suppliers: [],
        Products: []
      },
      outerPackageVm: {}
    };
  },
  components: {
    InstrumentList
  },
  props: ["data", "index", "mode", "isBackupPackage"],
  created() {
    CSManager.handleDataThis = this;
    this.outerPackageVm = this.$props.data;
    axios({ url: `/api/Recycle/OuterProduct/Suppliers` })
      .then(res => {
        if (res.data.Code == 200) {
          this.SupplierList.Suppliers = res.data.Data;
          if (this.$props.index != -1) {
            this.SupplierList.Suppliers.forEach(element => {
              if (element.SupplierId == this.outerPackageVm.SupplierId) {
                this.outerPackageVm.SupplierName = element.SupplierName;
                this.SupplierList.Products = element.Products;
                return;
              }
            });
          }
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  mounted() {
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    handleCountNumberPackage(newValue, oldValue, index) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.outerPackageVm.Instruments[index].Quantity = 1;
        }, 0);
      }
    },
    handleNumberChange(newValue,oldValue,origin){
      if(newValue==undefined){
        setTimeout(() => {
          this.outerPackageVm[origin]=1;
        }, 0);
      }
    },
    //获取清洗架信息
    getCarrierData(BarCode) {
      if (BarCode) {
        if (/^QXW/.test(BarCode.toUpperCase())) {
          axios({
            url: `/api/Scanner/Recycle/${BarCode}`
          })
            .then(res => {
              let type;
              if (res.data.Code == 200) {
                type = "success";
                this.outerPackageVm.CarrierId =
                  res.data.Data.CarrierBarCodeScannerVm.Id;
                this.outerPackageVm.CarrierName =
                  res.data.Data.CarrierBarCodeScannerVm.Name;
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
            msg: "请输入清洗架条码！"
          });
        }
      }
    },
    //添加完成
    completeAdd() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.outerPackageVm.SupplierId,
            type: "StringNotEmpty",
            msg: "您没有选择送包单位！请选择送包单位！"
          },
          {
            val: this.outerPackageVm.DeliveryPerson,
            type: "StringNotEmpty",
            msg: "送包人不能为空！"
          },
          {
            val: this.outerPackageVm.ProductId,
            type: "StringNotEmpty",
            msg: "您没有选择包名称！请选择包名称！"
          },
          {
            val: this.outerPackageVm.CarrierId,
            type: "NumberNotZero",
            msg: "清洗架输入有误！请重扫清洗架条码或重新输入清洗架条码！"
          }
        ])
      ) {
        this.$emit("addPackage-father", {
          data: this.outerPackageVm,
          index: this.$props.index
        });
      }
    },
    //送包单位change事件
    supplierChange(val) {
      this.outerPackageVm.ProductId = "";
      this.outerPackageVm.ProductName = "";
      this.SupplierList.Suppliers.forEach(element => {
        if (element.SupplierId == val) {
          this.outerPackageVm.SupplierName = element.SupplierName;
          this.SupplierList.Products = element.Products;
          return;
        }
      });
    },
    //产品change事件
    productChange(val) {
      this.SupplierList.Products.forEach(element => {
        if (element.ProductId == val) {
          this.outerPackageVm.ProductName = element.ProductName;
          this.outerPackageVm.ProvideSubClinicId = element.ProvideSubClinicId;
          return;
        }
      });
    },
    //删除包
    deleteThisPackage(index) {
      this.outerPackageVm.Instruments.splice(index, 1);
    },
    //新增器械
    addInstrument() {
      this.isShowInstrumentList = true;
    },
    //取消添加
    cancelAdd() {
      this.$emit("addPackage-father", "");
    },
    //器械列表组件通信
    InstrumentList2Father(data) {
      this.isShowInstrumentList = false;
      if (data) {
        if (this.outerPackageVm.Instruments == "") {
          this.outerPackageVm.Instruments = data;
        } else {
          for (let i = 0; i < data.length; i++) {
            var onOff = false; //判断是否存在 true为存在 false不存在
            for (let j = 0; j < this.outerPackageVm.Instruments.length; j++) {
              if (data[i].Id == this.outerPackageVm.Instruments[j].Id) {
                //已存在
                onOff = true;
                this.outerPackageVm.Instruments[j].Quantity += data[i].Quantity;
              }
            }
            //不存在
            if (!onOff) {
              this.outerPackageVm.Instruments.push(data[i]);
            }
          }
        }
      }
    },
    handleBarCode(msg){
      this.getCarrierData(msg);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableUnExpand";
#outerPackage {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 5;
  .box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 787px;
    height: 660px;
    background: #fff;
    border-radius: 8px;
    padding-bottom: 60px;
    box-sizing: border-box;
    .container {
      overflow-y: scroll;
      height: 100%;
      padding: 20px 20px 30px;
      box-sizing: border-box;
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        height: 180px;
        border-bottom: 1px solid rgba(242, 244, 247, 1);
        li {
          display: flex;
          width: 234px;
          justify-content: space-between;
          > p {
            width: 64px;
            line-height: 40px;
            text-align: right;
          }
          > div {
            width: 160px;
          }
          .el-input {
            input {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }
          }
        }
      }
      .el-table {
        a {
          color: #f93e3e;
          cursor: pointer;
          font-weight:bold;
        }
        tbody {
          .cell {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(35, 46, 65, 1);
          }
        }
      }
    }
    h4 {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 30px 0;
    }
  }
}
</style>