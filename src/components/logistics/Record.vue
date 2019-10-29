<template>
  <div class="cssd_box">
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
      <el-collapse accordion>
        <div class="content_title">
          <p style="width:100px;">任务类型</p>
          <p>制定日期</p>
          <p style="width:120px;">制定人</p>
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
            <div class="collapseTd" style="width:120px;">
              <p>{{item.Operator}}</p>
            </div>
            <div class="collapseTd" style="width:60px;">
              <p><el-button size="mini" @click.stop="changeRecord(collapseIndex)">修改</el-button></p>
            </div>
          </div>
          <ul class="record_detail clear_float">
            <li>
              <p>开始日期</p>
              <span>{{item.PlanStartTime}}</span>
            </li>
            <li>
              <p>结束日期</p>
              <span>{{item.PlanEndTime}}</span>
            </li>
            <li>
              <p>车辆</p>
              <span>{{item.Car}}</span>
            </li>
            <li>
              <p>司机</p>
              <span>{{item.Driver}}</span>
            </li>
            <li>
              <p>副手</p>
              <span>{{item.Helper}}</span>
            </li>
          </ul>
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
</style>