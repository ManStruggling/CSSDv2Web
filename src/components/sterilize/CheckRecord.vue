<template>
  <div class="cssd_box" id="sterilizeCheckRecord">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/sterilize/check" tag="li">
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
        <p>灭菌编号</p>
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
              <p>{{item.SterilizeReviewDate}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.SterilizeTaskBarCode}}</p>
            </div>
            <div class="collapseTd">
              <p>{{item.ChemicalReviewStatus}}</p>
            </div>
          </div>
          <ul class="record_detail clear_float">
            <li>
              <p>灭菌开始时间</p>
              <span>{{item.SterilizeStartDate}}</span>
            </li>
            <li>
              <p>灭菌结束时间</p>
              <span>{{item.SterilizeEndDate}}</span>
            </li>
            <li>
              <p>灭菌人</p>
              <span>{{item.Sterilizer}}</span>
            </li>
            <li>
              <p>灭菌设备</p>
              <span>{{item.SterilizeDeviceName}}</span>
            </li>
            <li>
              <p>灭菌程序</p>
              <span>{{item.SterilizeProgramName}}</span>
            </li>
            <li>
              <p>当日锅次</p>
              <span>{{item.SterilizeTodayBatch}}</span>
            </li>
            <li>
              <p>总锅次</p>
              <span>{{item.SterilizeTotalBatch}}</span>
            </li>
            <li>
              <p>化学审核人</p>
              <span>{{item.ChemicalReviewer}}</span>
            </li>
            <li>
              <p>生物灭菌状态</p>
              <span>{{item.BiologicalReviewStatus}}</span>
            </li>
            <li>
              <p>生物审核人</p>
              <span>{{item.BiologicalReviewer}}</span>
            </li>
            <li>
              <p>管腔检测</p>
              <span>{{item.CatheterReviewStatus}}</span>
            </li>
            <li v-if="UserInfo.HospitalVersion === 'YUXISHIRENMIN'">
              <p>物理检测</p>
              <span>{{item.PhysicalReviewStatus}}</span>
            </li>
            <li v-if="UserInfo.HospitalVersion === 'YUXISHIRENMIN'">
              <p>生物培养开始时间</p>
              <span>{{item.BiologicalStartTime}}</span>
            </li>
            <li v-if="UserInfo.HospitalVersion === 'YUXISHIRENMIN'">
              <p>生物培养结束时间</p>
              <span>{{item.BiologicalEndTime}}</span>
            </li>
            <li>
              <p>不合格包</p>
              <span>
                <a @click="lookFailedPackages(item.Id)">查看</a>
              </span>
            </li>
            <li>
              <p>照片</p>
              <span>
                <a @click="handleShowPhotos(collapseIndex)">查看</a>
              </span>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
      <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 查看不合格包 -->
      <RecordLookFailedPackages
        v-if="isShowFailedPackages"
        :look_id="look_id"
        @to-father="child2father"
      ></RecordLookFailedPackages>
    </transition>
    <!-- 照片 -->
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 拍照 -->
      <PhotoView
        v-if="isShowPhoto"
        @viewPhoto-to-father="viewPhotoToFather"
        :data="photoData"
        :viewMode="true"
      ></PhotoView>
    </transition>
  </div>
</template>

<script>
import RecordLookFailedPackages from "./RecordLookFailedPackages";
import PhotoView from "../common/PhotoView";
import { mapState } from "vuex";
export default {
  data() {
    return {
      look_id: -1,
      isShowPhoto: false,
      isShowFailedPackages: false,
      search_date: [],
      endDateLimit: {},
      recordList: [],
      photoData: []
    };
  },
  components: {
    RecordLookFailedPackages,
    PhotoView
  },
  created() {
    CSManager.handleDataThis = this;
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date, date];
    this.searchRecordsData();
  },
  mounted() {},
  methods: {
    //处理照片显示
    handleShowPhotos(index) {
      axios({
        url: `/api/Sterilize/Picture/${this.recordList[index].Id}`
      }).then(res => {
        if (res.data.Code == 200) {
          this.recordList[index].Pictures = res.data.Data;
          this.photoData = this.recordList[index].Pictures;
          this.isShowPhoto = true;
        } else {
          this.showInformation({
            classify: "message",
            msg: res.data.Msg
          });
        }
      });
    },
    //照片数据通信
    viewPhotoToFather() {
      this.isShowPhoto = false;
    },
    //不合格包数据通信
    child2father() {
      this.isShowFailedPackages = false;
    },
    //查看不合格包
    lookFailedPackages(val) {
      this.look_id = val;
      this.isShowFailedPackages = true;
    },
    //查询
    searchRecordsData() {
      this.GLOBAL.searchRecord(
        `/api/Sterilize/SterilizeReviewRecords/${this.search_date[0]}/${this.search_date[1]}`,
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
#sterilizeCheckRecord {
  .record_detail {
    > li > p {
      width: 128px;
    }
  }
}
</style>
