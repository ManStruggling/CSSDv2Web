<template>
  <div class="cssd_box" id="subClinicUsedPackage">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/logistics/driverSchedule" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right"></div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <el-table :data="packages">
          <el-table-column label="科室名称" prop="ClinicName" width="240"></el-table-column>
          <el-table-column label="包数量" prop="PackageQuantity" width="210"></el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          共计
          <span>{{countPackagesNumber()}}</span> 包
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      packages: []
    };
  },
  created() {
    axios({ url: `/api/Logistics/SubClinicUsedPackage` })
      .then(res => {
        if (res.data.Code == 200) {
          this.packages = res.data.Data.Packages;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  methods: {},
  computed: {
    countPackagesNumber() {
      return () => {
        let num = 0;
        this.packages.forEach(item => {
          num += item.PackageQuantity;
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
#subClinicUsedPackage {
  .cssd_title_right {
    .el-select {
      width: 200px;
      .el-input {
        input {
          font-size: 18px;
          color: #fff;
          font-weight: bold;
          &::-webkit-input-placeholder {
            font-weight: normal;
            color: #d0d4da;
          }
        }
      }
    }
  }
  .cssd_table_center {
    overflow-y: hidden;
    .table_box {
      padding: 30px 40px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;
    }
    .cssd_table_bottom {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>