<template>
  <div class="cssd_box" id="clinicReserve">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <router-link to="/apply/reserveRecord" tag="li" v-if="!isChangeMode">
          <p>预定记录</p>
        </router-link>
      </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box table_unExpand">
        <ul>
          <li>
            <p class="font16gray">需用日期</p>
            <div class="el_input_box font16blod">
              <el-date-picker
                class="font16blod"
                :editable="false"
                :clearable="false"
                v-model="submitData.BookDateTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
          </li>
          <li>
            <p class="font16gray">供应室</p>
            <div class="el_input_box font16blod">
              <el-select v-model="submitData.BookCssdId" class="green24x13" @change="cssdChange">
                <el-option
                  v-for="(item,index) in cssdList"
                  :key="index"
                  :label="item.BookCssdName"
                  :value="item.BookCssdId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <p class="font16gray">预定科室</p>
            <div class="el_input_box font16blod">
              <el-select v-model="submitData.BookSubClinicId" class="green24x13">
                <el-option
                  v-for="(item,index) in subClinicList"
                  :key="index"
                  :label="item.BookSubClinicName"
                  :value="item.BookSubClinicId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="myTextarea">
            <p class="font16gray">备注</p>
            <div class="el_input_box font16blod">
              <el-input
                class="font16blod"
                v-model.trim="submitData.Remark"
                type="textarea"
                resize="none"
                placeholder="请输入备注"
                maxlength="20"
                show-word-limit
              ></el-input>
            </div>
          </li>
        </ul>
        <h3></h3>
        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="无菌物品" name="0">
            <el-table :data="submitData.Products">
              <el-table-column label="名称" prop="ProductName" width="240"></el-table-column>
              <el-table-column label="数量" width="210">
                <template slot-scope="props">
                  <el-input-number
                    v-model="props.row.ProductQuantity"
                    :min="1"
                    :max="999"
                    :controls="false"
                    @change="handleNumberChange(props.row)"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="210">
                <template slot-scope="props">
                  <a @click="productsDelete(props.$index)">删除</a>
                </template>
              </el-table-column>
              <el-table-column></el-table-column>
            </el-table>
            <el-button class="btn88x32" @click="handleSterileProduct">新增</el-button>
          </el-tab-pane>
          <el-tab-pane label="一次性物品" name="1">
            <el-table :data="submitData.DisposableItems">
              <el-table-column label="名称" prop="ProductName" width="240"></el-table-column>
              <el-table-column label="规格" prop="Specification" width="210"></el-table-column>
              <el-table-column label="数量" width="210">
                <template slot-scope="props">
                  <el-input-number
                    v-model="props.row.ProductQuantity"
                    :min="1"
                    :max="999"
                    :controls="false"
                    @change="handleNumberChange(props.row)"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="210">
                <template slot-scope="props">
                  <a @click="disposableDelete(props.$index)">删除</a>
                </template>
              </el-table-column>
              <el-table-column></el-table-column>
            </el-table>
            <el-button class="btn88x32" @click="handleDisposable">新增</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="cssd_table_bottom">
        <p></p>
        <p>
          <el-button v-if="isChangeMode" @click="cancelChange">取消修改</el-button>
          <el-button type="primary" @click="submitComplete">{{isChangeMode?"修改完成":"预定完成"}}</el-button>
        </p>
      </div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <ReserveProductList
        v-if="isShowProductList"
        @productList-to-father="productListToFather"
        :cssdId="submitData.BookCssdId"
      ></ReserveProductList>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <DisposableList
        v-if="isShowDisposableList"
        @disposableList-to-father="disposableListToFather"
        :cssdId="submitData.BookCssdId"
      ></DisposableList>
    </transition>
  </div>
</template>

<script>
import ReserveProductList from "./ReserveProductList";
import DisposableList from "./DisposableList";
export default {
  data() {
    return {
      tabActiveName: "0",
      isShowProductList: false, //显示预定无菌物品列表
      isShowDisposableList: false, //显示预定一次性物品列表
      isChangeMode: false,
      submitData: {
        BookDateTime: "",
        BookCssdId: "",
        BookSubClinicId: "",
        Remark: "",
        Products: [],
        DisposableItems: []
      },
      cssdList: [],
      subClinicList: []
    };
  },
  components: {
    ReserveProductList,
    DisposableList
  },
  created() {
    if (this.$route.query.recordId) {
      this.isChangeMode = true;
      axios({
        url: `/api/Book/PendingUpdateBookTask/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.submitData = res.data.Data;
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    }else{
      this.submitData.BookDateTime = this.GLOBAL.GetNowDate();
    }
    axios({ url: `/api/Book/InitialData` })
      .then(res => {
        if (res.data.Code == 200) {
          this.cssdList = res.data.Data.Cssds;
          this.subClinicList = res.data.Data.SubClinics;
          this.submitData.BookCssdId = this.cssdList[0].BookCssdId;
          this.submitData.BookSubClinicId = this.subClinicList[0].BookSubClinicId;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  mounted() {
    this.GLOBAL.initWebSorcket(this);
  },
  methods: {
    handleNumberChange(row){
      if(row.ProductQuantity==undefined){
        setTimeout(() => {
          row.ProductQuantity = 1;
        }, 0);
      }
    },
    //供应室change
    cssdChange(){
      this.submitData.Products = [];
      this.submitData.DisposableItems = [];
    },
    //取消修改
    cancelChange() {
      this.goBack();
    },
    goBack() {
      if (this.isChangeMode) {
        this.$router.push(`/apply/reserveRecord`);
      } else {
        this.$router.push(`/`);
      }
    },
    //预定完成
    submitComplete() {
      let method = "POST";
      if (this.$route.query.recordId) {
        method = "PUT";
      }
      let arr = [];
      arr = arr.concat(this.submitData.Products);
      arr = arr.concat(this.submitData.DisposableItems);
      this.submitData.Products = arr;
      if(this.GLOBAL.VerificationHandle([{val:this.submitData.Products,type:"ArrayNotEmpty",msg:"请至少预定一个无菌物品或一次性物品！"}])){
        axios({ url: `/api/Book`, method: method, data: this.submitData })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              type = "success";
              //socket发送信息
              this.websocket.send(JSON.stringify({
                CssdId: this.submitData.BookCssdId,
                ReserveCheckState: true,
                PackageState:false,
                ProvideState:false
              }));
              if(this.isChangeMode){
                this.$router.push(`/apply/reserveRecord`);
              }else{
                this.$router.go(0);
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
    //删除无菌物品
    productsDelete(index) {
      this.$confirm("您确定要删除该物品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitData.Products.splice(index, 1);
        })
        .catch(() => {});
    },
    //删除一次性物品
    disposableDelete(index) {
      this.$confirm("您确定要删除该物品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitData.DisposableItems.splice(index, 1);
        })
        .catch(() => {});
    },
    //处理无菌物品
    handleSterileProduct() {
      this.isShowProductList = true;
    },
    //处理一次性物品
    handleDisposable() {
      this.isShowDisposableList = true;
    },
    //无菌物品与父组件通信
    productListToFather(data) {
      this.isShowProductList = false;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let hasProduct = true; //true 未找到产品 false找到产品
          for (let j = 0; j < this.submitData.Products.length; j++) {
            if (data[i].ProductId === this.submitData.Products[j].ProductId) {
              hasProduct = false;
              this.submitData.Products[j].ProductQuantity +=
                data[i].ProductQuantity;
              break;
            }
          }
          //没有该产品
          if (hasProduct) {
            this.submitData.Products.push(data[i]);
          }
        }
      }
    },
    //一次性物品与父组件通信
    disposableListToFather(data) {
      this.isShowDisposableList = false;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let hasDisposable = true; //true 未找到一次性物品 false找到一次性物品
          for (let j = 0; j < this.submitData.DisposableItems.length; j++) {
            if (data[i].ProductId === this.submitData.DisposableItems[j].ProductId) {
              hasDisposable = false;
              this.submitData.DisposableItems[j].ProductQuantity += data[i].ProductQuantity;
              break;
            }
          }
          //没有该一次性物品
          if (hasDisposable) {
            this.submitData.DisposableItems.push(data[i]);
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";
#clinicReserve {
  .cssd_table_center {
    .table_box {
      height: 100%;
      padding: 30px 40px;
      box-sizing: border-box;
      overflow-y: scroll;
      ul {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 10px;
        max-width: 1400px;
        justify-content: space-between;
        li {
          width: 234px;
          display: flex;
          justify-content: space-between;
          margin: 0 0 20px 0;
          &.myTextarea {
            width: 444px;
            .el_input_box {
              width: 370px;
            }
          }
          p {
            width: 64px;
            line-height: 40px;
            text-align: right;
          }
          .el_input_box {
            width: 160px;
            line-height: 40px;
            .el-textarea {
              width: 370px;
              textarea {
                padding: 0;
                height: 40px;
                line-height: 40px;
                padding: 0 10px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                &::-webkit-input-placeholder {
                  font-weight: normal;
                }
              }
            }
            .el-date-editor {
              width: 100%;
              input {
                font-size: 16px;
              }
            }
            .el-select {
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
        }
      }
      h3 {
        height: 1px;
        background: #f2f4f7;
      }
      .el-tabs--top {
        padding: 20px 30px;
        margin-top: 15px;
        .el-tabs__header {
          height: 50px;
          margin: 0;
          .el-tabs__nav-wrap {
            &::after {
              height: 0;
            }
            .el-tabs__active-bar {
              height: 0;
            }
            .el-tabs__item {
              height: 32px;
              font-size: 18px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(35, 46, 65, 1);
              transition: 0.3s;
              &.is-active {
                font-size: 24px;
                color: rgba(35, 46, 65, 1);
              }
            }
          }
        }
        .el-tabs__content {
          .el-table {
            tbody {
              .el-input-number {
                width: 50px;
                margin-bottom: 16px;
                .el-input {
                  input {
                    height: 24px;
                  }
                }
              }
              a {
                cursor: pointer;
                color: #f93e3e;
              }
            }
          }
          .btn88x32 {
            color: #fff;
            margin-top: 30px;
          }
        }
      }
    }
  }
}
</style>