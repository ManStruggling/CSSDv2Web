<template>
  <div class="cssd_box" id="scheduleList">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>物流人员</span>
          <el-input v-model.trim="search_barCode" placeholder="请输入人员条码"></el-input>
        </p>
        <p>
          <span>行程日期</span>
          <el-date-picker
            v-model="search_date"
            type="date"
            placeholder="选择日期"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </p>
        <p>
          <el-button type="primary" @click="searchRecordsData">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_record_ui table_unExpand">
      <el-collapse accordion @change="collapseChange">
        <div class="content_title">
          <p>开始时间</p>
          <p>车辆</p>
          <p>制定人</p>
        </div>
        <el-collapse-item
          v-for="(item,collapseIndex) in scheduleData.DriverSchedules"
          :key="collapseIndex"
          :name="collapseIndex+''"
        >
          <div slot="title" class="collapseTh">
            <div class="collapseTd">
              <p>{{item.PlanTime}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.LogisticsCarName}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.PlanPerson}}</p>
            </div>
          </div>
          <el-table :data="item.Locations">
            <el-table-column label="抵达科室" prop="ArrivalClinic" width="240"></el-table-column>
            <el-table-column label="抵达时间" prop="ArrivalTime" width="210"></el-table-column>
            <el-table-column label="包数量" prop="PackageCount" width="210"></el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_barCode: "",
      search_date: "",
      scheduleData: {
        LogisticsPerson: "",
        DriverSchedules: []
      }
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    //二次请求
    collapseChange(index) {
      if (
        index != "" &&
        this.scheduleData.DriverSchedules[index].Locations == ""
      ) {
        axios({
          url: `/api/Logistics/LookOverDriverScheduleDetail/${this.scheduleData.DriverSchedules[index].ScheduleId}`
        }).then(res => {
          if (res.data.Code == 200) {
            this.scheduleData.DriverSchedules[index].Locations = res.data.Data;
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        });
      }
    },
    //查询
    searchRecordsData() {
      if (this.GLOBAL.VerificationHandle([{val:this.search_barCode,type:"StringNotEmpty",msg:"人员条码不能为空！"},{val:this.search_date,type:"StringNotEmpty",msg:"行程日期不能为空！"}])) {
        axios({
          url: `/api/Logistics/LookOverDriverSchedule/${this.search_barCode}/${this.search_date}`
        })
          .then(res => {
            if (res.data.Code == 200) {
              this.scheduleData = res.data.Data;
              this.search_barCode = this.scheduleData.LogisticsPerson;
            } else {
              this.showInformation({classify:"message",msg:res.data.Msg});
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
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableUnExpand";
#scheduleList {
  .cssd_title_right {
    p {
      display: flex;
      span {
        line-height: 40px;
      }
      .el-input {
        width: 160px;
        input {
          background: #182b37;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
}
</style>