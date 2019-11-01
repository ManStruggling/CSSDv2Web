<template>
  <div id="reprint">
    <div class="print_box">
      <div class="search_box">
        <p>包条码</p>
        <el-input v-model.trim="search_str" placeholder="请输入包条码" v-focus></el-input>
        <el-button @click="searchBarCode">查询</el-button>
      </div>
      <ul>
        <li>
          <p>包条码</p>
          <span>{{packageMsg.BarCode}}</span>
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
      </ul>
      <dl
        v-show="packageMsg.IsOuterProduct"
      >
        <dt>
          <p>打印第</p>
          <el-select
            v-model="packageMsg.SplitCount"
            multiple
            class="green18x10"
          >
            <el-option
              v-for="item in packageMsg.SplitPackageCount"
              :key="item"
              :label="item+''"
              :value="item+''"
            ></el-option>
          </el-select>
          <span>张</span>
        </dt>
        <dd>
          <p>分包数</p>
          <div>{{packageMsg.SplitPackageCount}}</div>
        </dd>
      </dl>
      <div class="print_number">
        <p>打印份数</p>
        <el-input-number v-model="packageMsg.PrintCount" :controls="false" :min="1" :max="999" placeholder="打印份数" @change="inputNumberChange"></el-input-number>
        <span>共 {{countPrintNumber}} 张</span>
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
      packageMsg: {
        PrintCount:0,
        SplitCount:[],
        Instruments: [],
      },
      
    };
  },
  watch: {
    "packageMsg.SplitCount":{
      handler: function(newValue) {
        if(newValue.length>0){
          setTimeout(() => {
            $("#reprint .el-select .el-input__inner").attr({placeholder:newValue.join()})
          }, 0);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //number change
    inputNumberChange(newValue){
      if(newValue==undefined){
        setTimeout(() => {
          this.packageMsg.PrintCount = 1;
        }, 0);
      }
    },
    //取消打印
    cancelPrint() {
      this.$emit("reprint-to-father");
    },
    //查询条码
    searchBarCode() {
      if(this.GLOBAL.VerificationHandle([{val:this.search_str,type:"StringNotEmpty",msg:"搜索的条码不能为空！"}])){
        axios({ url: `/api/Package/RePrintBarCode/${this.search_str}` })
          .then(res => {
            if (res.data.Code == 200) {
              res.data.Data.BarCode=this.search_str;
              res.data.Data.PrintCount = 1;
              res.data.Data.SplitCount = [];
              this.packageMsg = res.data.Data;
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
            }
          })
          .catch(err => {});
      }
    },
    //确认打印
    confirmPrint(){
      if(this.packageMsg.BarCode){
        if(this.packageMsg.IsOuterProduct){
          //外来器械包---分包
          if(this.GLOBAL.VerificationHandle([{val:this.packageMsg.SplitCount,type:"ArrayNotEmpty",msg:"至少选择打印一张"}])){
            axios({url:`/api/Package/RePrintOuterBarCode`,data:this.packageMsg,method:"POST"}).then(res=>{
              let type;
              if(res.data.Code==200){
                type="success";
                res.data.Data.forEach(element => {
                  CSManager.PrintBarcode(JSON.stringify(element));
                });
                this.$emit("reprint-to-father");
              }else{
                type="error";
              }
              this.showInformation({ classify: "message", msg: res.data.Msg,type:type });
            }).catch(err=>{})
          }
        }else{
          //普通条码包
          axios({url:`/api/Package/RePrintBarCode`,data:this.packageMsg,method:"POST"}).then(res=>{
            let type;
            if(res.data.Code==200){
              type = "success";
              res.data.Data.forEach(element => {
                CSManager.PrintBarcode(JSON.stringify(element));
              });
              this.$emit("reprint-to-father");
            }else{
              type = "error";
            }
            this.showInformation({ classify: "message", msg: res.data.Msg,type:type });
          }).catch(err=>{})
        }
      }else{
        this.showInformation({classify: "message", msg: "请查询条码！"})
      }
    }
  },
  computed: {
    countPrintNumber(){
      if(this.packageMsg.IsOuterProduct){
        return this.packageMsg.SplitCount==""||this.packageMsg.SplitCount==undefined?0:this.packageMsg.SplitCount.length*this.packageMsg.PrintCount;
      }else{
        return this.packageMsg.PrintCount;
      }
    }
  },
};
</script>

<style lang="scss">
#reprint {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 5;
  background: rgba(51, 51, 51, 0.6);
  .print_box {
    width: 520px;
    height: 476px;
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
    .search_box {
      display: flex;
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
    p {
      width: 64px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: rgba(135, 141, 159, 1);
      text-align: right;
    }
    ul {
      margin-top: 10px;
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
      }
    }
    dl {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      dt,
      dd {
        display: flex;
        justify-content: space-between;
      }
      dt {
        .el-select {
          width: 134px;
          height: 40px;
          margin: 0 10px;
          .el-select__tags{
            display: none;
          }
          input {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
        }
        span {
          font-size: 16px;
          font-family: Microsoft YaHei;
          color: rgba(135, 141, 159, 1);
        }
      }
      dd {
        width: 220;
        div {
          width: 142px;
          margin-left: 10px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
    .print_number {
      margin-top: 20px;
      display: flex;
      .el-input {
        width: 134px;
        margin: 0 10px;
        input {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          padding: 0 15px;
          text-indent: 0;
        }
      }
      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
    .option {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      margin: auto;
      text-align: center;
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