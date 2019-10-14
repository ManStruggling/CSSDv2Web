<template>
  <div class="cssd_box recoveryRecord">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="recoveryRecordGoback">
          <p>返回</p>
        </li>
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
    <div class="cssd_table_center cssd_table_expand cssd_record_ui">
      <div class="content_title" v-if="mode==1?true:false">
        <p>回收日期</p>
        <p>回收编号</p>
        <p>回收人</p>
        <p>移交人</p>
        <p>载体</p>
        <p>还包数</p>
        <p>操作</p>
      </div>
      <div class="content_title" v-if="mode==1?false:true">
        <p>回收日期</p>
        <p>回收编号</p>
        <p>录入人</p>
        <p>载体</p>
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
              <p>{{item.RecycleDate}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.RecycleBarCode}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.RecyclePersonName}}</p>
            </div>
            <div class="collapseTd" v-if="mode==1?true:false">
              <p>{{item.SenderName}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.CarrierName}}</p>
            </div>
            <div class="collapseTd" v-if="mode==1?true:false">
              <p></p>
            </div>
            <div class="collapseTd">
              <p>
                <el-button
                  size="mini"
                  @click.stop="changeRecycleRecord(collapseIndex)"
                  :disabled="(GLOBAL.UserInfo.JobAndCompetence.includes('111')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('100'))&&!item.CanNotBeModified?false:true"
                >修改</el-button>
              </p>
            </div>
          </div>
          <div class="table_expand">
              <el-table
              :style="'width:100%;'"
              :data="item.RecyclePackages"
              :default-expand-all="true"
            >
              <el-table-column label="包条码" prop="PackageBarCode" width="240"></el-table-column>
              <el-table-column label="包名称" prop="PackageName" width="210"></el-table-column>
              <el-table-column label="回收科室" prop="ProvideSubClinicName" width="210"></el-table-column>
              <el-table-column label="包数量" prop="PackageQuantity" width="210"></el-table-column>
              <el-table-column
                label="丢失器械总数"
                prop="LostInstrumentTotalCount"
                v-if="mode==2?false:true"
                width="210"
              ></el-table-column>
              <el-table-column label="" prop=""></el-table-column>
              <el-table-column type="expand" width="1">
                <template slot-scope="props" v-if="!props.row.IsNotPrintBarCode">
                  <div class="table_detail" v-if="!(props.row.LostInstrumentInRecycleRecords=='')">
                    <div class="myTableTitle" v-if="mode==2?false:true">
                      <p>器械名称</p>
                      <p>丢失数</p>
                    </div>
                    <ul>
                      <li
                        v-for="(selfs,myTableIndex) in props.row.LostInstrumentInRecycleRecords"
                        :key="myTableIndex"
                      >
                        <p>{{selfs.InstrumentName}}</p>
                        <div>{{selfs.LostInstrumentQuantity}}</div>
                      </li>
                    </ul>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
      recordList: [],
      mode: 1 //1 回收记录  2 新购入记录
    };
  },
  created() {
    this.mode = this.$route.query.source.indexOf("回收") >= 0 ? 1 : 2;
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date,date];
    this.searchRecordsData();
  },
  mounted() {},
  methods: {
    //编程式路由返回
    recoveryRecordGoback() {
      if (this.mode == 1) {
        this.$router.push("/recovery/registration");
      } else {
        this.$router.push("/recovery/newPurchasing");
      }
    },
    //二次请求
    collapseChange(index) {
      if (index != "" && this.recordList[index].RecyclePackages == "") {
        axios({
          url: `/api/Recycle/RecycleDetailForRecord/${this.recordList[index].Id}`
        }).then(res => {
          if (res.data.Code == 200) {
            this.recordList[index].RecyclePackages = res.data.Data;
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        });
      }
    },
    //修改回收记录
    changeRecycleRecord(index) {
      let path;
      if (this.mode == 1) {
        path = "/recovery/registration";
      } else {
        path = "/recovery/newPurchasing";
      }
      this.$router.push({
        path: path,
        query: { recordId: this.recordList[index].Id }
      });
    },
    searchRecordsData() {
      this.GLOBAL.searchRecord(
        this.search_date[0],
        this.search_date[1],
        this,
        "/odata/RecycleRecords",
        "RecycleDate",
        "",
        this.$route.query.source
      );
    },

  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableExpand";
</style>