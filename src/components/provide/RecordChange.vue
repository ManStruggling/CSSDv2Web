<template>
  <div class="cssd_box provideRecordChange">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li>
          <router-link to="/provide/record" tag="p">返回</router-link>
        </li>
        <li>
          <p @click="handleShowManualEnter">手工录入</p>
        </li>
        <li>
          <p>计数包发放</p>
        </li>
      </ul>
    </div>
    <div class="cssd_table_center">
      <div class="table_box">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            v-for="(value,collapseIndex) in provideTaskList.ProvideTaskDetails"
            :key="collapseIndex"
            :name="collapseIndex"
          >
            <div slot="title" class="collapseTh">
              <div class="collapseTd">
                <p>包名称</p>
                <p>{{value.ProductName}}</p>
              </div>
              <div class="collapseTd">
                <p>预计发放数</p>
                <p>{{value.ScheduledQuantity}}</p>
              </div>
              <div class="collapseTd">
                <p>回收时间</p>
                <p>{{value.RecycleDate}}</p>
              </div>
              <div class="collapseTd">
                <p>库存数</p>
                <p>{{value.InventoryQuantity}}</p>
              </div>
              <div class="collapseTd">
                <p>剩余发放数</p>
                <p>{{value.RemainQuantity}}</p>
              </div>
              <div class="collapseTd">
                <p>本次发放数</p>
                <p
                  v-if="!value.IsNotPrintBarCode"
                >{{countThisProvideNumber(value.ProvidePackages,collapseIndex)}}</p>
                <p v-if="value.IsNotPrintBarCode">
                  <el-input-number
                    v-model="value.ThisTimeProvideQuantity"
                    :min='0'
                    :max="value.MaxLimit=value.InventoryQuantity>value.RemainQuantity?value.RemainQuantity:value.InventoryQuantity"
                    size="mini"
                    @click.native.stop="GLOBAL.cancelBubble"
                    @change="((newValue,oldValue)=>{handleCountNumberPackage(newValue,oldValue,provideTaskList.ProvideTaskDetails,value)})"
                  ></el-input-number>
                </p>
              </div>
            </div>
            <el-table stripe highlight-current-row :data="value.ProvidePackages" style="text-align:center;">
              <el-table-column label="包条码" prop="BarCode"></el-table-column>
              <el-table-column label="配包日期" prop="PackageDate"></el-table-column>
              <el-table-column label="有效日期" prop="ValidDate"></el-table-column>
              <el-table-column label="灭菌设备名称" prop="SterilizeDevice"></el-table-column>
              <el-table-column label="当日锅次" prop="SterilizeTodayBatch"></el-table-column>
              <el-table-column label="总锅次" prop="SterilizeTotalBatch"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="props">
                  <el-button @click="deleteProvidePackage(collapseIndex,props.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="cssd_table_bottom">
        <p>
          共计
          <span>{{countPackageNumber(provideTaskList.ProvideTaskDetails)}}</span> 包
        </p>
        <p>
          <el-button @click="cancelChange">取消修改</el-button>
          <el-button type="primary" @click="changeSubmit">修改完成</el-button>
        </p>
      </div>
    </div>
     <!-- 手工录入 -->
    <ManualEnter
      v-if="isShowManualEnter"
      @to-father="packageData2father"
      :BarCodeList="barCodeList"
      :ApiUrl="'/api/Scanner/IncludePackages/Provide'"
    ></ManualEnter>
  </div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
  data() {
    return {
      isShowManualEnter:false,
      activeName: "0",
      provideTaskList: [],
      barCodeList:[],
      ThisClinicProvideNumber:0,
    };
  },
  components:{
    ManualEnter
  },
  created() {
    if (this.$route.query.recordId) {
      axios({
        url: `/api/Provide/PendingUpdateLogistics/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.provideTaskList = res.data.Data;
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        })
        .catch(err => {});
    }
  },
  methods: {
    //取消修改
    cancelChange() {
      this.$router.push({ path: "/provide/record" });
    },
    //修改完成
    changeSubmit() {
      if(this.GLOBAL.VerificationHandle([{val:this.ThisClinicProvideNumber,type:'NumberNotZero',msg:'您还没有发放包，请至少添加一个包！'}])){
        axios({url:`/api/Provide/ProvideModify`,method:'PUT',data:this.provideTaskList}).then(res=>{
          let type;
          if(res.data.Code == 200){
            type='success';
            this.$router.push({path:'/provide/record'});
          }else{
            type='error';
          }
          this.showInformation({classify:"message",msg:res.data.Msg,type: type});
        }).catch(err=>{
  
        })
      }
    },
    //删除包
    deleteProvidePackage(collapseIndex, $index) {
      this.provideTaskList.ProvideTaskDetails[collapseIndex].ProvidePackages.splice($index,1);
    },
    //接收手工录入数据
    packageData2father(data){
      this.isShowManualEnter = false;
      if (data) {
        data.forEach(val => {
          this.handleAddData(val);
        });
      }
    },
    //处理手工录入
    handleShowManualEnter() {
      let tempArr = [];
      for (let i = 0; i < this.provideTaskList.ProvideTaskDetails.length; i++) {
        for (let j = 0;j < this.provideTaskList.ProvideTaskDetails[i].ProvidePackages.length;j++) {
          tempArr.push(this.provideTaskList.ProvideTaskDetails[i].ProvidePackages[j]);
        }
      }
      this.barCodeList = tempArr;
      this.isShowManualEnter = true;
    },
    //数据添加处理 data一个package model
    handleAddData(data) {
      for (let i = 0;i < this.provideTaskList.ProvideTaskDetails.length;i++) {
        //find包 并且本次发放数小于剩余发放数才添加
        if (this.provideTaskList.ProvideTaskDetails[i].ProductId ==data.ProductId &&this.provideTaskList.ProvideTaskDetails[i].ThisTimeProvideQuantity <this.provideTaskList.ProvideTaskDetails[i].ScheduledQuantity) {
          this.provideTaskList.ProvideTaskDetails[i].ProvidePackages.push(data);
          return;
        }
      }
    },
     //计数包数量修改
    handleCountNumberPackage(newValue, oldValue, list, value) {
      //计算该类包的已选数量value
      setTimeout(() => {
        if(newValue==undefined){
          value.ThisTimeProvideQuantity = 0;
        }else{ 
          let num = 0;//统计页面目前已录该包的数量
          list.forEach(val => {
            if(value.ProductId == val.ProductId){
              num += val.ThisTimeProvideQuantity;
            }
          });
          if (num > value.InventoryQuantity) {
            value.ThisTimeProvideQuantity = oldValue;
            this.showInformation({classify:"message",msg:"您所选的数量大于库存数！",type: "warning"});
          }
        }
      }, 0);
    },
  },
  computed: {
    //计算本次发放数
    countThisProvideNumber() {
      return (list, collapseIndex) => {
        this.provideTaskList.ProvideTaskDetails[collapseIndex].ThisTimeProvideQuantity = list.length;
        return list.length;
      };
    },
    //计算总发放数
    countPackageNumber() {
      return list => {
        let num = 0;
        if (list) {
          list.forEach(val => {
            num += val.ProvidePackages.length;
          });
          this.ThisClinicProvideNumber = num;
        }
        return num;
      };
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
.provideRecordChange {
  .cssd_table_center {
    .table_box {
      padding: 40px 20px 0;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;
      th,td{
        text-align: center;
      }
      .el-collapse{
        .el-collapse-item{
          .el-collapse-item__header{
            background: #99f;
            i{
              display: none;
            }
            .collapseTh{
              width: 100%;
              height: 100%;
              display: flex;
              line-height: 24px;
              text-align:center;
              .collapseTd{
                flex: 1;
              }
            }
          }
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