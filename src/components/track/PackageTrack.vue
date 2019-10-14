<template>
  <div class="cssd_box" id="track_package">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
      </ul>
      <div class="cssd_title_right">
        <p>
          <el-input v-model.trim="search_str" placeholder="请输入包条码" @keyup.enter.native="searchData"></el-input>
        </p>
        <p>
          <el-button type="primary" @click="searchData">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center trackCenter table_unExpand">
      <ul>
        <li>
          <p class="font16gray">包条码</p>
          <span class="font16blod">{{packages.BarCode}}</span>
        </li>
      </ul>
      <ul>
        <li>
          <p class="font16gray">包名称</p>
          <span class="font16blod">{{packages.ProductName}}</span>
        </li>
        <li>
          <p class="font16gray">外包装</p>
          <span class="font16blod">{{packages.ExternalPackage}}</span>
        </li>
        <li>
          <p class="font16gray">配包人</p>
          <span class="font16blod">{{packages.PackagePerson}}</span>
        </li>
      </ul>
      <ul class="ul_bottom">
        <li>
          <p class="font16gray">审核人</p>
          <span class="font16blod">{{packages.Reviewer}}</span>
        </li>
        <li>
          <p class="font16gray">有效日期</p>
          <span class="font16blod">{{packages.ValidDate}}</span>
        </li>
        <li class="font16gray">
          <p>包状态</p>
          <span class="font16blod">{{packages.PackageStatus}}</span>
        </li>
      </ul>
      <el-tabs activeName="0">
        <el-tab-pane label="流转日志" name="0">
          <el-table :data="packages.PackageRecord">
            <el-table-column label="流程名称" prop="FlowName" width="240"></el-table-column>
            <el-table-column label="记录时间" prop="When" width="210"></el-table-column>
            <el-table-column label="操作人" prop="Who" width="210"></el-table-column>
            <el-table-column label="位置" prop="Where" width="210"></el-table-column>
            <el-table-column
              label="描述"
              prop="Description"
              width="400"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="包状态" prop="PackageStatus" width="210"></el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="清洗消毒情况" name="1">
          <el-table :data="packages.CleanRecord">
            <el-table-column label="清洗编号" prop="BarCode" width="240"></el-table-column>
            <el-table-column label="清洗人" prop="Who"></el-table-column>
            <el-table-column label="清洗时间" prop="Date"></el-table-column>
            <el-table-column label="审核人" prop="Reviewer"></el-table-column>
            <el-table-column label="清洗设备" prop="Device"></el-table-column>
            <el-table-column label="清洗程序" prop="Program"></el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="灭菌情况" name="2">
          <el-table :data="packages.SterilizeRecord">
            <el-table-column label="灭菌编号" prop="BarCode" width="240"></el-table-column>
            <el-table-column label="灭菌人" prop="Who" width="210"></el-table-column>
            <el-table-column label="灭菌时间" prop="Date" width="210"></el-table-column>
            <el-table-column label="审核人" prop="Reviewer" width="210"></el-table-column>
            <el-table-column label="灭菌设备" prop="Device" width="210"></el-table-column>
            <el-table-column label="灭菌程序" prop="Program" width="210"></el-table-column>
            <el-table-column></el-table-column>
          </el-table>
          <el-button :disabled="packages.SterilizeRecord!=''&&packages.SterilizeRecord[0].CanBeRecalled?false:true" @click="singleRecall">单锅次召回</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_str: "",
      packages: {
        PackageRecord: [],
        CleanRecord: [],
        SterilizeRecord: []
      }
    };
  },
  created() {
    CSManager.handleDataThis = this;
    if (this.$route.query.BarCode) {
      this.search_str = this.$route.query.BarCode;
      this.searchData();
    }
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    //go back
    goBack() {
      if (this.$route.query.origin) {
        this.$router.replace({
          path: this.route.query.origin,
          query: {
            HospitalId: this.route.query.HospitalId
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    //查询
    searchData() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.search_str,
            type: "StringNotEmpty",
            msg: "包条码不能为空"
          }
        ])
      ) {
        axios(`/api/Tracking/Package/${this.search_str}`)
          .then(res => {
            if (res.data.Code == 200) {
              this.packages = res.data.Data;
              this.packages.BarCode = this.search_str;
              let tempArr = [];
              if (this.packages.SterilizeRecord) {
                tempArr.push(this.packages.SterilizeRecord);
              }
              this.packages.SterilizeRecord = tempArr;
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
            }
          })
          .catch(err => {});
      }
    },
    //单锅次召回
    singleRecall() {
      this.$router.replace({
        path:'/track/singleRecall',
        query:{
          BarCode:this.packages.BarCode,
          sterilizeTaskId:this.packages.SterilizeRecord[0].Id,      
        }
      })
    },
    handleBarCode(msg) {
      this.search_str = msg;
      this.searchData();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableUnExpand";
#track_package {
  .cssd_title_right {
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
          padding: 0 5px;
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
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0 30px 32px;
      &.ul_bottom {
        border-bottom: 1px solid #f2f4f7;
      }
      li {
        display: flex;
        width: 234px;
        justify-content: space-between;
        margin-right: 120px;
        p {
          width: 64px;
          text-align: right;
        }
        span {
          width: 148px;
        }
      }
    }
    .el-tabs {
      margin-top: 40px;
      .el-tabs__header {
        margin: 0 0 30px;
        .el-tabs__nav-wrap {
          height: 34px;
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
            .cell {
              font-size: 18px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(35, 46, 65, 1);
            }
          }
        }
        .el-button {
          margin-top: 30px;
          width: 120px;
          height: 40px;
          border: 1px solid #00c16b;
          background: #fff;
          color: #00c16b;
          font-size: 18px;
          &.is-disabled {
            color: #ccc;
            border-color: #ccc;
          }
        }
      }
    }
  }
}
</style>