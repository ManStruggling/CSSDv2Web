<template>
  <div class="cssd_box" id="applyRecord">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/apply/registration" tag="li">
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
      <div class="content_title">
        <p>使用日期</p>
        <p>使用编号</p>
        <p>使用人</p>
        <p>住院号</p>
        <p>病人姓名</p>
        <p>床号</p>
        <p>操作</p>
      </div>
      <el-collapse accordion @change="collapseChange">
        <el-collapse-item
          v-for="(item,collapseIndex) in recordList"
          :key="collapseIndex"
          :name="collapseIndex+''"
        >
          <div slot="title" class="collapseTh">
            <div class="collapseTd">
              <p>{{item.ApplyingDate}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.BarCode}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.Applier}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.PatientHospitalId}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.PatientName}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.PatientBedId}}</p>
            </div>
            <div class="collapseTd">
              <p>
                <el-button
                  size="mini"
                  @click.stop="changeRecord(collapseIndex)"
                  :disabled="(UserInfo.JobAndCompetence.includes('271')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('200'))?false:true"
                >修改</el-button>
              </p>
            </div>
          </div>
          <el-table stripe highlight-current-row :data="item.Packages">
            <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
            <el-table-column label="包名称" prop="ProductName" width="210" show-overflow-tooltip></el-table-column>
            <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
            <el-table-column label="所属科室" prop="SubClinicName" width="210"></el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  data() {
    return {
      search_date: [],
      endDateLimit: {},
      recordList: []
    };
  },
  created() {
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date, date];
    this.searchRecordsData();
  },
  mounted() {},
  methods: {
    //二次请求
    collapseChange(index) {
      if (
        index != "" &&
        (this.recordList[index].Packages == "" ||
          this.recordList[index].Packages === null)
      ) {
        axios({
          url: `/api/Apply/PackagesBy/${this.recordList[index].Id}`
        }).then(res => {
          if (res.data.Code == 200) {
            this.recordList[index].Packages = res.data.Data;
          } else {
            this.showInformation({
              classify: "message",
              msg: res.data.Msg
            });
          }
        });
      }
    },
    //修改记录
    changeRecord(index) {
      this.$router.push({
        path: "/apply/registration",
        query: {
          recordId: this.recordList[index].Id
        }
      });
    },
    //查询
    searchRecordsData() {
      this.GLOBAL.searchRecord(
        `/api/Apply/ApplyingRecords/${this.search_date[0]}/${this.search_date[1]}`,
        this
      );
    }
  },
  computed: {
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableUnExpand";

#applyRecord {
}
</style>
