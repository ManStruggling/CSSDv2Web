<template>
  <div class="cssd_box" id="reprint">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/sterilize/select" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <el-input placeholder="请输入包条码" v-model.trim="searchBarCode"></el-input>
          <el-button type="primary" @click="searchPackageMessage">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box">
        <ul>
          <li>
            <p>包条码</p>
            <div class="el_input_box">{{packageMessage.BarCode}}</div>
          </li>
          <li>
            <p>包名称</p>
            <div class="el_input_box">{{packageMessage.ProductName}}</div>
          </li>
          <li>
            <p>外包装</p>
            <div class="el_input_box">{{packageMessage.ExternalPackage}}</div>
          </li>
          <li>
            <p>配包人</p>
            <div class="el_input_box">{{packageMessage.PackagePerson}}</div>
          </li>
          <li>
            <p>审核人</p>
            <div class="el_input_box">{{packageMessage.PackageReviewer}}</div>
          </li>
          <li>
            <p>所属科室</p>
            <div class="el_input_box">{{packageMessage.SubClinicName}}</div>
          </li>
          <li>
            <p>包状态</p>
            <div class="el_input_box">{{packageMessage.Status}}</div>
          </li>
          <li>
            <p>灭菌日期</p>
            <div class="el_input_box">{{packageMessage.SterilizeDate}}</div>
          </li>
          <li>
            <p>有效日期</p>
            <div class="el_input_box">{{packageMessage.ValidDate}}</div>
          </li>
        </ul>
      </div>
      <div class="cssd_table_bottom">
        <p></p>
        <p>
          <el-button type="primary" @click="printBarCode">保存并打印</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchBarCode: "",
      packageMessage: {
        BarCode: "",
        ProductName: "",
        ExternalPackage: "",
        PackagePerson: "",
        PackageReviewer: "",
        SubClinicName: "",
        Status: "",
        SterilizeDate: "",
        ValidDate: ""
      }
    };
  },
  methods: {
    //打印条码
    printBarCode() {},
    searchPackageMessage() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.searchBarCode,
            type: "StringNotEmpty",
            msg: "查询的条码不能为空！"
          }
        ])
      ) {
        axios({ url: `/api/Package/RePrintBarCode/${this.searchBarCode}` })
          .then(res => {
            if (res.data.Code == 200) {
              res.data.Data.BarCode = this.searchBarCode;
              res.data.Data.PrintCount = 1;
              res.data.Data.SplitCount = [];
              this.packageMessage = res.data.Data;
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
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
#reprint {
  .cssd_title {
    .cssd_title_right {
      p {
        display: flex;
        .el-input {
          width: 180px;
          margin-right: 20px;
          input {
            background: #182b37;
            border-width: 2px;
            font-size: 18px;
            font-family: Microsoft YaHei;
            color: #fff;
            font-weight: bold;
            padding: 0 10px;
          }
        }
        .el-button {
          margin: 0;
        }
      }
    }
  }
  .cssd_table_center {
    .table_box {
      height: 100%;
      padding: 30px 40px;
      box-sizing: border-box;
      overflow-y: scroll;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 234px;
          display: flex;
          justify-content: space-between;
          margin: 0 120px 20px 0;
          p {
            width: 64px;
            line-height: 40px;
            text-align: right;
            font-size: 16px;
            color: #878d9f;
          }
          .el_input_box {
            width: 160px;
            font-size: 16px;
            font-weight: bold;
            color: #333;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>