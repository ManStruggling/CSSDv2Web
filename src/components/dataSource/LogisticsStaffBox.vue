<template>
  <!-- 编辑弹出框 -->
  <div id="editBox" class="logisticsStaffBox">
    <div class="editContainer">
      <div class="editContent">
        <div class="Staff_search">
          <el-input
            v-model.trim="search_str"
            placeholder="请输入人员条码"
            @keyup.enter.native="searchData"
          ></el-input>
          <el-button type="primary" @click="searchData" class="btn120x40">查询</el-button>
        </div>
        <ul class="clear_float">
          <li>
            <p>员工姓名</p>
            <span>{{editBoxData.StaffName}}</span>
          </li>
          <li>
            <p>员工工号</p>
            <span>{{editBoxData.StaffJobNumber}}</span>
          </li>
          <li>
            <p>登录密码</p>
            <span>{{editBoxData.Password}}</span>
          </li>
        </ul>
      </div>
      <div class="editBoxOption">
        <el-button @click="editBoxCancelSave">取消</el-button>
        <el-button type="primary" @click="editBoxSave">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      search_str: "",
      editBoxData: {
        StaffId: 0,
        StaffName: "",
        StaffJobNumber: "",
        Password: ""
      }
    };
  },
  created() {},
  methods: {
    searchData() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.search_str,
            type: "StringNotEmpty",
            msg: "搜索员工条码不能为空！"
          }
        ])
      ) {
        axios({ url: `/api/Logistics/NewDrivers/Search/${this.search_str}` })
          .then(res => {
            if (res.data.Code == 200) {
              this.editBoxData = res.data.Data;
            } else {
              this.showInformation({classify:"message",msg:res.data.Msg});
            }
          })
          .catch(err => {});
      }
    },
    //取消编辑
    editBoxCancelSave() {
      this.$emit("to-father", "");
    },
    //保存编辑
    editBoxSave() {
      //before submit must to do： 数据转换 表单验证;
      if (
        this.GLOBAL.VerificationHandle([
            {
              val: this.editBoxData.StaffId,
              type: "NumberNotZero",
              msg: "您还未查询人员！请查询人员！"
            }
        ])
      ) {
        axios({
          url: "/api/Logistics/SettingStaffToDriver",
          method: "Post",
          data: this.editBoxData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              //请求成功
              type = "success";
              this.$emit("to-father", res.data.Data);
            } else {
              //其他状态码
              type = "error";
            }
            this.showInformation({classify:"message",msg:res.data.Msg,type: type});
          })
          .catch(error => {});
      }
    }
  }
};
</script>

<style lang="scss">
#editBox.logisticsStaffBox {
  .Staff_search {
    margin: 20px 0 0 30px;
    .el-input {
      width: 160px;
      margin-right: 20px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .el-button {
      background: #00c16b;
      font-size: 18px;
      font-family: Microsoft YaHei;
      color: rgba(255, 255, 255, 1);
    }
  }
  .editContent {
    > ul {
      li {
        span {
          width: 160px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 40px;
        }
      }
    }
  }
}
</style>
