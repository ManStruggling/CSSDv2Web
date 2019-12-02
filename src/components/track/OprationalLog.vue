<template>
  <div class="cssd_box" id="track_opration">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
      </ul>
      <div class="cssd_title_right">
        <p class="search_date">
          <el-date-picker
            v-model="search_date"
            type="daterange"
            align="right"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="GLOBAL.pickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </p>
        <p>
          <el-input
            v-model.trim="search_str"
            placeholder="请输入员工条码"
            @keyup.enter.native="searchData"
          ></el-input>
        </p>
        <p>
          <el-button type="primary" @click="searchData">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center trackCenter table_unExpand">
      <p class="font16gray">
        员工姓名
        <span class="font16blod">{{StaffName}}</span>
      </p>
      <el-table :data="operateRecords">
        <el-table-column label="操作时间" prop="OperateTime" width="240"></el-table-column>
        <el-table-column label="地点" prop="Location" width="210"></el-table-column>
        <el-table-column label="包操作" prop="Description" width="210" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_date: [],
      search_str: "",
      StaffName: "",
      operateRecords: []
    };
  },
  created() {
    CSManager.handleDataThis = this;
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date,date];
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    //go back
    goBack() {
      this.$router.go(-1);
    },
    //查询
    searchData() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val:this.search_date,
            type:"ArrayNotEmpty",
            msg:"搜索时间不能为空！"
          },
          {
            val: this.search_str,
            type: "StringNotEmpty",
            msg: "员工条码不能为空！"
          }
        ])
      ) {
        axios(`/api/Tracking/StaffOperateRecords/${this.search_str}/${this.search_date[0]}/${this.search_date[1]}`)
          .then(res => {
            if (res.data.Code == 200) {
              this.operateRecords = res.data.Data.OperateRecords;
              this.StaffName = res.data.Data.StaffName;
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
            }
          })
          .catch(err => {});
      }
    },
    //追溯
    handleBarCode(msg){
      this.search_str = msg;
      this.searchData();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableUnExpand";
#track_opration {
  .cssd_title_right {
    p.search_date {
      margin-right: 40px;
    }
    p {
      display: flex;
      margin: 0;
      > span {
        width: 60px;
        line-height: 40px;
      }
      .el-input {
        margin-right: 20px;
        width: 180px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        input {
          color: #fff;
          background: #182b37;
        }
      }
      .el-button {
        margin: 0;
      }
    }
  }
  .trackCenter {
    padding: 30px 40px;
    height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
    p {
      span {
        margin-left: 16px;
      }
    }
    .el-table {
      margin-top: 30px;
    }
  }
}
</style>