<template>
  <div class="cssd_box" id="cleanReviewRecords">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/package/cleanCheck" tag="li">
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
    <div class="cssd_table_center cssd_record_ui">
      <div class="content_title">
        <p>审核日期</p>
        <p>清洗编号</p>
        <p>审核人</p>
        <p>审核结果</p>
      </div>
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item,collapseIndex) in recordList"
          :key="collapseIndex"
          :name="collapseIndex+''"
        >
          <div slot="title" class="collapseTh">
            <div class="collapseTd">
              <p>{{item.ReviewTime}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanTaskBarCode}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.ReviewerName}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CleanReviewResult}}</p>
            </div>
          </div>
          <ul class="record_detail clear_float">
            <li>
              <p>清洗开始时间</p>
              <span>{{item.CleanStartDateTime}}</span>
            </li>
            <li>
              <p>清洗结束时间</p>
              <span>{{item.CleanEndDateTime}}</span>
            </li>
            <li>
              <p>清洗人</p>
              <span>{{item.CleanerName}}</span>
            </li>
            <li>
              <p>清洗设备</p>
              <span>{{item.CleanDeviceName}}</span>
            </li>
            <li>
              <p>清洗程序</p>
              <span>{{item.CleanDeviceProgramName}}</span>
            </li>
            <li>
              <p>当日锅次</p>
              <span>{{item.CleanTodayBatch}}</span>
            </li>
            <li>
              <p>总锅次</p>
              <span>{{item.CleanTotalBatch}}</span>
            </li>
            <li v-if="item.IsPartialSuccess">
              <p>不合格器械</p>
              <span>
                <a @click="lookFailedInstruments(item.Id)">查看</a>
              </span>
            </li>
          </ul>
          <div class="remarkBox">
            <p>备注</p>
            <span>{{item.Remark}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 查看不合格网篮 -->
      <LookFailedInstruments
        v-if="isShowFailedInstruments"
        :record_id="record_id"
        @to-father="failedInstruments2father"
      ></LookFailedInstruments>
    </transition>
  </div>
</template>

<script>
import LookFailedInstruments from "./LookFailedInstruments";
export default {
  data() {
    return {
      record_id: -1,
      isShowFailedInstruments: false,
      search_date:[],
      endDateLimit: {},
      recordList: []
    };
  },
  components: {
    LookFailedInstruments
  },
  created() {
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date,date];
    this.searchRecordsData();
  },
  mounted() {},
  methods: {
    lookFailedInstruments(val) {
      this.record_id = val;
      this.isShowFailedInstruments = true;
    },
    failedInstruments2father() {
      this.isShowFailedInstruments = false;
    },
    //修改清洗记录
    changeCheckRecord(index) {
      this.$router.push({
        path: "/package/cleanCheckRecordChange",
        query: {
          recordId: this.recordList[index].Id
        }
      });
    },
    searchRecordsData() {
      this.GLOBAL.searchRecord(
        this.search_date[0],
        this.search_date[1],
        this,
        "/odata/cleanreviewrecords",
        "ReviewTime"
      );
    },
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/cssdRecord";

#cleanReviewRecords {
  .record_detail {
    padding-bottom: 0;
    border: 0;
    a {
      cursor: pointer;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #00c16b;
    }
  }
  .remarkBox{
    padding: 0 0 20px 40px;
    line-height: 40px;
    display: flex;
    p{
      text-align: right;
      width: 96px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: #878d9f;
      margin-right: 16px;
    }
    span{
      font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    }
  }
  .cssd_table_center {
    .el-table {
      width: 1101px;
      margin: 0 40px;
      border-radius: 4px;
      td,
      th {
        background: #fff;
        &:hover {
          background: #fff;
        }
      }
      tbody {
        td {
          padding: 0;
          height: 60px;
        }
      }
    }
  }
}
</style>