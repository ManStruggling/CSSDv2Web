<template>
  <div class="cssd_box sterilizeReadyRecord">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/sterilize/ready" tag="li">
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
        <p>灭菌准备日期</p>
        <p>网篮名称</p>
        <p>操作人</p>
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
              <p>{{item.SterilizeReadyDate}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CarrierName}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.Operator}}</p>
            </div>
            <div class="collapseTd">
              <p>
                <el-button
                  size="mini"
                  @click.stop="changeRecord(collapseIndex)"
                  :disabled="(UserInfo.JobAndCompetence.includes('141')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100'))&&!item.CanNotBeModified?false:true"
                >修改</el-button>
              </p>
            </div>
          </div>
          <el-table :data="item.Packages">
            <el-table-column label="包名称" prop="ProductName" width="240" show-overflow-tooltip></el-table-column>
            <el-table-column label="包条码" prop="ProductBarCode" width="210"></el-table-column>
            <el-table-column
              label="科室"
              prop="ProvideSubClinicName"
              width="210"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="包数量" prop="ProductQuantity" width="210"></el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    UserInfo: Object
  },
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
          url: `/api/Sterilize/SterilizeReadyDetailBy/${this.recordList[index].Id}`
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
    //修改清洗记录
    changeRecord(index) {
      this.$router.push({
        path: "/sterilize/ready",
        query: {
          recordId: this.recordList[index].Id
        }
      });
    },
    //查询
    searchRecordsData() {
      this.GLOBAL.searchRecord(
        `/api/Sterilize/SterilizeReadyRecords/${this.search_date[0]}/${this.search_date[1]}`,
        this
      );
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableUnExpand";
</style>
