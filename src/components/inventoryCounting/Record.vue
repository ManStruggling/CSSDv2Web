<template>
<div class="cssd_box" id="inventoryCountingRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/inventoryCounting/registration" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p class="search_date">
                <el-date-picker v-model="search_date" type="daterange" align="right" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="GLOBAL.pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </p>
            <p>
                <el-button type="primary" @click="searchRecordsData">查询</el-button>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_table_expand cssd_record_ui table_expand">
        <div class="content_title">
            <p>盘库日期</p>
            <p>盘库编号</p>
            <p>操作人</p>
            <p>盘库科室</p>
            <p>包数量</p>
            <p>操作</p>
        </div>
        <!-- <el-collapse accordion @change="collapseChange">
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
              <p>
                <el-button
                  size="mini"
                  @click.stop="changeCleanRecord(collapseIndex)"
                  :disabled="(GLOBAL.UserInfo.JobAndCompetence.includes('121')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('100'))&&!item.CanNotBeModified?false:true"
                >修改</el-button>
              </p>
            </div>
          </div>
          <ul class="record_detail clear_float">
            <li>
              <p>当日锅次</p>
              <span>{{item.CleanTodayBatch}}</span>
            </li>
            <li>
              <p>总锅次</p>
              <span>{{item.CleanTotalBatch}}</span>
            </li>
            <li>
              <p>监控</p>
              <span>监控</span>
            </li>
            <li>
              <p>照片</p>
              <span>
                <a @click="handleShowPhotos(collapseIndex)">查看</a>
              </span>
            </li>
          </ul>
          <el-table :data="item.Carriers" :default-expand-all="true">
            <el-table-column label="网篮条码" prop="BarCode" width="240"></el-table-column>
            <el-table-column label="网篮名称" prop="Name" width="210"></el-table-column>
            <el-table-column label="包数量" prop="PackageQuantityInCarriers" width="210"></el-table-column>
            <el-table-column></el-table-column>
            <el-table-column type="expand" width="1">
              <template slot-scope="props">
                <div class="table_detail">
                  <div class="myTableTitle">
                    <p>所属科室</p>
                    <p>包名称</p>
                    <p>数量</p>
                  </div>
                  <ul>
                    <li
                      v-for="(selfs,myTableIndex) in props.row.PackageBarCodeDetailList"
                      :key="myTableIndex"
                    >
                      <p>{{selfs.ProvideSubClinicName}}</p>
                      <p>{{selfs.Name}}</p>
                      <p>{{selfs.Quantity}}</p>
                    </li>
                  </ul>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse> -->
        <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            search_date: [],
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
            //   if (index != "" && this.recordList[index].Carriers == "") {
            //     axios({
            //       url: `/api/Clean/CleanRecordDetailBy/${this.recordList[index].Id}`
            //     })
            //       .then(res => {
            //         if (res.data.Code == 200) {
            //           this.recordList[index].Carriers = res.data.Data;
            //         } else {
            //           this.showInformation({classify:"message",msg:res.data.Msg});
            //         }
            //       })
            //       .catch(err => console.log(err));
            //   }
        },
        //修改清洗记录
        changeCleanRecord(index) {
            //   this.$router.push({
            //     path: "/clean/registration",
            //     query: {
            //       recordId: this.recordList[index].Id
            //     }
            //   });
        },
        //查询
        searchRecordsData() {
            //   this.GLOBAL.searchRecord(
            //     this.search_date[0],
            //     this.search_date[1],
            //     this,
            //     "/odata/CleanRecords",
            //     "CleanStartDateTime"
            //   );
        },
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableExpand";
</style>
