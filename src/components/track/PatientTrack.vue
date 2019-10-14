<template>
  <div class="cssd_box" id="track_patient">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
      </ul>
      <div class="cssd_title_right">
        <p>
          <el-input v-model.trim="search_str" placeholder="请输入住院号" @keyup.enter.native="searchData"></el-input>
        </p>
        <p>
          <el-button type="primary" @click="searchData">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center trackCenter table_unExpand">
      <ul>
        <li>
          <p class="font16gray">住院号</p>
          <span class="font16blod">{{data.Patient.HospitalId}}</span>
        </li>
        <li>
          <p class="font16gray">床号</p>
          <span class="font16blod">{{data.Patient.BedId}}</span>
        </li>
        <li>
          <p class="font16gray">病人姓名</p>
          <span class="font16blod">{{data.Patient.PatientName}}</span>
        </li>
        <li>
          <p class="font16gray">性别</p>
          <span class="font16blod">{{data.Patient.Gender}}</span>
        </li>
        <li>
          <p class="font16gray">年龄</p>
          <span class="font16blod">{{data.Patient.Age}}</span>
        </li>
        <li>
          <p class="font16gray">入院时间</p>
          <span class="font16blod">{{data.Patient.AdmissionDate}}</span>
        </li>
        <li>
          <p class="font16gray">使用科室</p>
          <span class="font16blod">{{data.Patient.Clinic}}</span>
        </li>
        <li>
          <p class="font16gray">病区</p>
          <span class="font16blod">{{data.Patient.SubClinic}}</span>
        </li>
        <li>
          <p class="font16gray">挂号科室</p>
          <span class="font16blod">{{data.Patient.RegisteredClinic}}</span>
        </li>
        <li>
          <p class="font16gray">挂号时间</p>
          <span class="font16blod">{{data.Patient.RegisteredDate}}</span>
        </li>
        <li>
          <p class="font16gray">门诊类型</p>
          <span class="font16blod">{{data.Patient.OutpatientType}}</span>
        </li>
        <li>
          <p class="font16gray">手术名称</p>
          <span class="font16blod">{{data.Patient.SurgicalName}}</span>
        </li>
        <li>
          <p class="font16gray">医生姓名</p>
          <span class="font16blod">{{data.Patient.SurgicalDoctor}}</span>
        </li>
        <li>
          <p class="font16gray">手术时间</p>
          <span class="font16blod">{{data.Patient.SurgicalDate}}</span>
        </li>
        <li>
          <p class="font16gray">手术部位</p>
          <span class="font16blod">{{data.Patient.SurgicalSite}}</span>
        </li>
        <li>
          <p class="font16gray">手术间</p>
          <span class="font16blod">{{data.Patient.SurgicalRoom}}</span>
        </li>
        <li>
          <p class="font16gray">台次</p>
          <span class="font16blod">{{data.Patient.Stage}}</span>
        </li>
      </ul>
      <el-table :data="data.Packages">
        <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
        <el-table-column label="包名称" prop="PackageName" width="210"></el-table-column>
        <el-table-column label="包操作" width="210">
          <template slot-scope="props">
            <a @click="toTracking(props.$index)">追溯</a>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_str: "",
      patient: "",
      packages: [],
      data: {
        Patient: {},
        Packages: []
      }
    };
  },
  created() {
    if(this.$route.query.HospitalId){
      this.search_str = this.$route.query.HospitalId;
      this.searchData();
    }
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  mounted() {},
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
            val: this.search_str,
            type: "StringNotEmpty",
            msg: "住院号不能为空！"
          }
        ])
      ) {
        axios(`/api/Tracking/PatientAndPackages/${this.search_str}`)
          .then(res => {
            if (res.data.Code == 200) {
              this.data = res.data.Data;
            } else {
              this.showInformation({classify:"message",msg:res.data.Msg});
            }
          })
          .catch(err => {});
      }
    },
    //追溯
    toTracking(index) {
      this.$router.replace({
        path:'/track/package',
        query:{
          BarCode:this.data.Packages[index].BarCode,
          HospitalId:this.search_str,
          origin:"/track/patient"       
        }
      })
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableUnExpand";
#track_patient {
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
      padding: 0 0 0 40px;
      border-bottom: 1px solid #f2f4f7;
      li {
        width: 234px;
        display: flex;
        justify-content: space-between;
        margin: 0 120px 30px 0;
        p {
          width: 64px;
          text-align: right;
        }
        span {
          width: 148px;
        }
      }
    }
    .el-table {
      a {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(0, 193, 107, 1);
        cursor:pointer;
      }
    }
  }
}
</style>