<template>
  <div class="cssd_box" id="subClinicUsedPackage">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/logistics/driverSchedule" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>科室</span>
          <el-select v-model="SubClinicId" filterable @change="changeSubClinic" class="white24x13">
            <el-option
              v-for="(item,index) in packageList.SubClinics"
              :key="index"
              :label="item.SubClinicName"
              :value="item.SubClinicId"
            ></el-option>
          </el-select>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <el-table :data="packageList.Packages" :empty-text="'请选择科室'">
          <el-table-column label="包条码" prop="ProductBarCode" align="center" width="240"></el-table-column>
          <el-table-column label="包名称" prop="ProductName" align="center" width="210"></el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          共计
          <span>{{countPackageNumber}}</span> 包
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      SubClinicId: "",
      packageList: {
        SubClinics: [],
        Packages: []
      }
    };
  },
  created() {
    axios({ url: `/api/Logistics/SubClinicUsedPackage/0` })
      .then(res => {
        if (res.data.Code == 200) {
          this.packageList = res.data.Data;
        } else {
          this.showInformation({classify:"message",msg:res.data.Msg});
        }
      })
      .catch(err => {});
  },
  methods: {
    //子科室已使用的包
    changeSubClinic(val) {
      axios({ url: `/api/Logistics/SubClinicUsedPackage/${val}` })
        .then(res => {
          if (res.data.Code == 200) {
            this.packageList.Packages = res.data.Data.Packages;
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        })
        .catch(err => {});
    }
  },
  computed: {
    countPackageNumber() {
      let num = 0;
      if(this.packageList.Packages){
        num = this.packageList.Packages.length;
      }
      return num;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";
#subClinicUsedPackage {
  .cssd_title_right{
    .el-select{
      width: 200px;
      .el-input{
        input{
          font-size: 18px;
          color: #fff;
          font-weight: bold;
          &::-webkit-input-placeholder{
            font-weight: normal;
            color: #D0D4DA;
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