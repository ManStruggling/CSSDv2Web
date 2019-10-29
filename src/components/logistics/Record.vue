<template>
  <div class="cssd_box" id="routeScheduleRecord">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/logistics/driverSchedule" tag="li">
          <p>返回</p>
        </router-link>
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
          <el-button type="primary" @click="searchRecordsData">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_record_ui table_unExpand">
      <el-collapse accordion @change="collapseChange">
        <div class="content_title">
          <p style="width:100px;">任务类型</p>
          <p>制定日期</p>
          <p>开始日期</p>
          <p>结束日期</p>
          <p style="width:120px;">制定人</p>
          <p style="width:120px;">车辆</p>
          <p style="width:120px;">司机</p>
          <p style="width:60px;">操作</p>
        </div>
        <el-collapse-item
          v-for="(item,collapseIndex) in recordList"
          :key="collapseIndex"
          :name="collapseIndex+''"
        >
          <div slot="title" class="collapseTh">
            <div class="collapseTd" style="width:100px;">
              <p>{{item.TaskType}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CreatedTime}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.PlanStartTime}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.PlanEndTime}}</p>
            </div>
            <div class="collapseTd" style="width:120px;">
              <p>{{item.Operator}}</p>
            </div>
            <div class="collapseTd" style="width:120px;">
              <p>{{item.Car}}</p>
            </div>
            <div class="collapseTd" style="width:120px;">
              <p>{{item.Driver}}</p>
            </div>
            <div class="collapseTd" style="width:100px;">
              <p><el-button size="mini" @click.stop="changeRecord(collapseIndex)">修改</el-button></p>
            </div>
          </div>
          <el-tabs>
            <el-tab-pane label="行程1" name="0">1</el-tab-pane>
            <el-tab-pane label="行程2" name="1">2</el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
      <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search_date:[],
      endDateLimit: {},
      recordList: []
    };
  },
  created() {
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date,date];
    this.searchRecordsData();
  },
  mounted() {},
  methods: {
    //二次请求
    collapseChange(index) {
      if (index != "" && this.recordList[index].Locations == "") {
        axios({
          url: `/api/Logistics/LookOverDriverScheduleDetail/${this.recordList[index].DriverScheduleId}`
        }).then(res => {
          if (res.data.Code == 200) {
            this.recordList[index].Locations = res.data.Data;
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        });
      }
    },
    //修改记录
    changeRecord(index){
      this.$router.push({path:'/clean/registration',query:{
        recordId:this.recordList[index].Id}})
    },
    //查询
    searchRecordsData(){
      axios({url:`/api/Logistics/DriverScheduleRecord/${this.search_date[0]}/${this.search_date[1]}`}).then(res=>{
        if(res.data.Code==200){
          this.recordList = res.data.Data;
        }else{
          this.showInformation({classify:"message",msg:res.data.Msg});
        }
      }).catch(err=>{})
    }
  }
};
</script>

<style lang="scss">
@import'../../assets/css/tableNav';
@import'../../assets/css/cssdRecord';
@import'../../assets/css/tableUnExpand';
#routeScheduleRecord{
  .el-tabs {
    margin: 20px 0 0 40px;
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
  }
}
</style>