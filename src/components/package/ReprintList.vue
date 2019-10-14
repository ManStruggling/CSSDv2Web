<template>
  <div id="reprintList">
    <div class="print_box table_unExpand">
      <div class="search_box">
        <p>包条码</p>
        <el-input v-model.trim="search_str" placeholder="请输入包条码" v-focus></el-input>
        <el-button @click="searchBarCode">查询</el-button>
      </div>
      <div class="container">
        <ul>
          <li>
            <p>包条码</p>
            <span>{{packageMsg.ProductName}}</span>
          </li>
          <li>
            <p>包名称</p>
            <span>{{packageMsg.ProductName}}</span>
          </li>
          <li>
            <p>外包装</p>
            <span>{{packageMsg.ExternalPackage}}</span>
          </li>
          <li>
            <p>配包人</p>
            <span>{{packageMsg.PackagePerson}}</span>
          </li>
          <li>
            <p>审核人</p>
            <span>{{packageMsg.PackageReviewer}}</span>
          </li>
          <li>
            <p>所属科室</p>
            <span>{{packageMsg.SubClinicName}}</span>
          </li>
          <li>
            <p>包状态</p>
            <span>{{packageMsg.Status}}</span>
          </li>
          <li>
            <p>灭菌日期</p>
            <span>{{packageMsg.SterilizeDate}}</span>
          </li>
          <li>
            <p>有效日期</p>
            <span>{{packageMsg.ValidDate}}</span>
          </li>
          <li>
            <p>打印份数</p>
            <el-input-number v-model="packageMsg.PrintCount" :min="1" :max="999" :controls="false" @change="inputNumberChange"></el-input-number>
          </li>
        </ul>
        <el-table :data="packageMsg.Instruments">
          <el-table-column label="器械名称" prop="InstrumentName" width="210"></el-table-column>
          <el-table-column label="规格" prop="Specification" width="150"></el-table-column>
          <el-table-column label="数量" prop="Quantity" width="100"></el-table-column>
        </el-table>
      </div>
      <div class="option">
        <el-button class="btn88x32empty" @click="cancelPrint">取消</el-button>
        <el-button type="primary" class="btn88x32" @click="confirmPrint">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_str: "",
      packageMsg:{

      },
      data: [{}, {}, {}]
    };
  },
  methods: {
    //input number change
    inputNumberChange(newValue){
      if(newValue==undefined){
        setTimeout(() => {
          this.packageMsg.PrintCount = 1;
        }, 0);
      }
    },
    //确认打印
    confirmPrint(){
      if(this.packageMsg.BarCode){
        axios({url:`/api/Package/RePrintInstrumentList`,method:"POST",data:this.packageMsg}).then(res=>{
          let type;
          if(res.data.Code==200){
            type="success";
            res.data.Data.forEach(element => {
              CSManager.PrintBarcode(JSON.stringify(element));
            });
            this.$emit("reprintList-to-father");
          }else{
            type="error";
          }
          this.showInformation({classify: "message", msg: res.data.Msg,type:type});
        }).catch(err=>{})
      }else{
        this.showInformation({classify: "message", msg: "请查询条码！"});
      }
    },
    //取消
    cancelPrint() {
      this.$emit("reprintList-to-father");
    },
    //查询条码
    searchBarCode() {
      if (
        this.GLOBAL.VerificationHandle({
          val: this.search_str,
          type: "StringNotEmpty",
          msg: "搜索的条码不能为空！"
        })
      ) {
        axios({ url: `/api/Package/RePrintInstrumentList/${this.search_str}` })
          .then(res => {
            if (res.data.Code == 200) {
              res.data.Data.BarCode = this.search_str;
              res.data.Data.PrintCount = 1;
              this.packageMsg = res.data.Data;
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
            }
          })
          .catch(err => {});
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableUnExpand";
#reprintList {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 5;
  background: rgba(51, 51, 51, 0.6);
  .container {
    height: 100%;
    overflow-y: scroll;
    padding:40px 0 70px;
    box-sizing: border-box;
  }
  .search_box {
    display: flex;
    position: absolute;
    left: 30px;
    right: 30px;
    top: 20px;
    margin: auto;
    background: #fff;
    padding-bottom: 10px;
    z-index: 3;
    .el-input {
      width: 160px;
      margin: 0 20px 0 10px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .el-button {
      width: 120px;
      border: 0;
      background: #00c16b;
      color: #fff;
      font-size: 18px;
      font-family: Microsoft YaHei;
    }
  }
  .print_box {
    width: 520px;
    height: 532px;
    background: #fff;
    border-radius: 8px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    padding: 20px 30px 30px;
    box-sizing: border-box;
    line-height: 40px;
    p {
      width: 64px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: rgba(135, 141, 159, 1);
      text-align: right;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 220px;
        display: flex;
        justify-content: space-between;
        span {
          width: 142px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
        .el-input-number{
          width: 140px;
          .el-input{
            input{
              font-size:16px;
              font-family:Microsoft YaHei;
              font-weight:bold;
              color:rgba(51,51,51,1);
            }
          }
        }
      }
    }
    .el-table {
      margin-top: 20px;
    }
    .option {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 3;
      text-align: center;
      background: #fff;
      .el-button--primary {
        font-family: Microsoft YaHei;
        margin-left: 15px;
      }
      .el-button--default {
        margin-right: 15px;
      }
    }
  }
}
</style>