<template>
  <div class="cssd_box">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>查询日期</span>
          <el-date-picker
            v-model="dateStart"
            type="date"
            placeholder="选择日期"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM-dd"
            @change="change"
          ></el-date-picker>
        </p>
        <p>
          <span>至</span>
          <el-date-picker
            :disabled="dateStart==''?true:false"
            v-model="dateEnd"
            type="date"
            placeholder="选择日期"
            :editable="false"
            :clearable="false"
            :picker-options="endDateLimit"
            value-format="yyyy-MM-dd"
            @focus="focus"
          ></el-date-picker>
        </p>
        <p>
          <el-button type="primary" @click="searchRecordsData">查询</el-button>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_record_ui">
      <el-collapse accordion>
        <div class="content_title">
          <p>任务类型</p>
          <p>制定日期</p>
          <p>行程日期</p>
          <p>行程编号</p>
          <p>指定人</p>
          <p>车辆</p>
          <p>司机</p>
          <p>操作</p>
        </div>
        <el-collapse-item
          v-for="(item,collapseIndex) in recordList"
          :key="collapseIndex"
          :name="collapseIndex+''"
        >
          <div slot="title" class="collapseTh">
            <div class="collapseTd">
              <p>{{item.CleanStartDateTime}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanTaskBarCode}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanDeviceModel}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanDeviceModelProgram}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.Cleaner}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanPackageQuantity}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanTodayBatch}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanTotalBatch}}</p>
            </div>
            <div class="collapseTd">
              <p>监控</p>
            </div>
            <div class="collapseTd">
              <p><el-button size="mini" @click.stop="changeRecord(collapseIndex)">修改</el-button></p>
            </div>
          </div>
          <el-table
            :data="item.Carriers"
            :default-expand-all="true"
          >
            <el-table-column label="网篮条码" prop="BarCode"></el-table-column>
            <el-table-column label="网篮名称" prop="Name"></el-table-column>
            <el-table-column label="包数量" prop="PackageQuantityInCarriers"></el-table-column>
            <el-table-column type="expand" width="1">
              <template slot-scope="props">
                <div class="myTableTitle">
                  <p>所属科室</p>
                  <p>包名称</p>
                  <p>数量</p>
                </div>
                <ul>
                  <li
                    v-for="(selfs,myTableIndex) in props.row.ProductInformationForCleanList"
                    :key="myTableIndex"
                  >
                    <p>{{selfs.ProvideSubClinicName}}</p>
                    <p>{{selfs.ProductName}}</p>
                    <p>{{selfs.ProductQuantity}}</p>
                  </li>
                </ul>
              </template>
            </el-table-column>
          </el-table>
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
      dateStart: "",
      dateEnd: "",
      endDateLimit: {},
      recordList: []
    };
  },
  created() {
    this.dateStart = this.GLOBAL.GetNowDate();
    this.dateEnd = this.dateStart;
    this.searchRecordsData();
  },
  mounted() {},
  methods: {
    //修改记录
    changeRecord(index){
      this.$router.push({path:'/clean/registration',query:{
        recordId:this.recordList[index].Id}})
    },
    goBack(){
      this.$router.go(-1);
    },
    //查询
    searchRecordsData(){
      this.GLOBAL.searchRecord(this.dateStart,this.dateEnd,this);
    },
    //开始日期change事件
    change() {
      if (this.dateEnd < this.dateStart) {
        this.dateEnd = "";
      }
    },
    //结束日期禁用筛选
    focus(time) {
      let startTime = new Date(this.dateStart).getTime();
      this.endDateLimit = {
        disabledDate(time) {
          return time.getTime() < startTime-1000*60*60*24;
        }
      };
    }
  }
};
</script>

<style lang="scss">
@import'../../assets/css/tableNav';
@import'../../assets/css/cssdRecord';
</style>