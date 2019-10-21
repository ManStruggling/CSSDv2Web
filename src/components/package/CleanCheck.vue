<template>
  <div class="cleanReview">
    <transition
        name="slide"
        :enter-active-class="`animated  faster ${transitionEnterName}`"
        :leave-active-class="`animated  faster ${transitionLeaveName}`"
      >
      <div class="cssd_box" id="cleanCheck" v-show="isShowCleanView">
        <div class="cssd_title">
          <ul class="cssd_menu">
            <router-link to="/package/taskList" tag="li">
              <p>返回</p>
            </router-link>
            <router-link to="/package/cleanCheckRecord" tag="li">
              <p>清洗审核记录</p>
            </router-link>
          </ul>
        </div>
        <div class="cssd_table_center cssd_table_subTabs review_check">
          <div class="cssd_table_left">
            <div class="cssd_talbe_left_menu">
              <dl class="isActive">
                <dt class="reviewStatus">
                  <span>待审核</span>
                </dt>
                <dd class="reviewDd" style="display:block;">
                  <el-tabs :tab-position="'left'" activeName="0">
                    <el-tab-pane
                      v-for="(item,index) in cleanTask.CleanPendingReviewTasks"
                      :key="index"
                      :label="item.CleanBarCode"
                      :name="index+''"
                    >
                      <div class="tab_content">
                        <div class="checkStatusBox">
                          <p>清洗审核结果</p>
                          <el-select
                            v-model="item.CleanReviewResult"
                            filterable
                            allow-create
                            default-first-option
                            class="green24x13"
                          >
                            <el-option label="合格" :value="2"></el-option>
                            <el-option label="不合格" :value="3"></el-option>
                            <el-option label="部分合格" :value="4"></el-option>
                          </el-select>
                          <div class="unqualifiedCarrier" v-show="item.CleanReviewResult==4?true:false">
                            <p>不合格包</p>
                            <span>{{countFailedPackageNumber(index)}}</span>
                            <b @click="handleFailedPackages(index)">编辑</b>
                          </div>
                        </div>
                        <ul class="clear_float">
                          <li>
                            <p>清洗开始时间</p>
                            <span>{{item.CleanStartTime}}</span>
                          </li>
                          <li>
                            <p>清洗结束时间</p>
                            <span>{{item.CleanEndTime}}</span>
                          </li>
                          <li>
                            <p>清洗人</p>
                            <span>{{item.Cleaner}}</span>
                          </li>
                        </ul>
                        <ul class="clear_float">
                          <li>
                            <p>清洗设备</p>
                            <span>{{item.CleanDeviceModel}}</span>
                          </li>
                          <li>
                            <p>清洗程序</p>
                            <span>{{item.CleanDeviceModelProgram}}</span>
                          </li>
                        </ul>
                        <ul class="clear_float">
                          <li>
                            <p>清洗当日锅次</p>
                            <span>{{item.CleanTodayBatch}}</span>
                          </li>
                          <li>
                            <p>清洗总锅次</p>
                            <span>{{item.CleanTotalBatch}}</span>
                          </li>
                        </ul>
                        <ul class="clear_float">
                          <li>
                            <p>质量卡记录</p>
                            <el-select v-model="item.CleaningQualityCard" class="green24x13">
                              <el-option label="未做" :value="0"></el-option>
                              <el-option label="通过" :value="1"></el-option>
                              <el-option label="不通过" :value="2"></el-option>
                            </el-select>
                          </li>
                          <li class="myTextarea">
                            <p>备注</p>
                            <el-input type="textarea" resize="none" placeholder="填写备注" v-model="item.Remark" maxlength="20" show-word-limit></el-input>
                          </li>
                        </ul>
                        <div class="tab_content_bottom">
                          <el-button @click="submitCheckResult(index)" class="btn150x40main">审核完成</el-button>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </dd>
              </dl>
              <dl>
                <dt class="reviewStatus">
                  <span>清洗中</span>
                </dt>
                <dd class="reviewDd">
                  <el-tabs :tab-position="'left'" activeName="0">
                    <el-tab-pane
                      v-for="(item,index) in cleanTask.CleanCleaningTasks"
                      :key="index"
                      :label="item.CleanBarCode"
                      :name="index+''"
                    >
                      <div class="tab_content">
                        <div class="timerBox">
                          <p>{{timeFormatDuring(item.RemainingTime)}}</p>
                          <span @click="resetDeviceTime(index)"></span>
                        </div>
                        <ul class="clear_float">
                          <li>
                            <p>清洗开始时间</p>
                            <span>{{item.CleanStartTime}}</span>
                          </li>
                          <li>
                            <p>清洗人</p>
                            <span>{{item.Cleaner}}</span>
                          </li>
                        </ul>
                        <ul class="clear_float">
                          <li>
                            <p>清洗设备</p>
                            <span>{{item.CleanDeviceModel}}</span>
                          </li>
                          <li>
                            <p>清洗程序</p>
                            <span>{{item.CleanDeviceModelProgram}}</span>
                          </li>
                        </ul>
                        <ul class="clear_float">
                          <li>
                            <p>清洗当日锅次</p>
                            <span>{{item.CleanTodayBatch}}</span>
                          </li>
                          <li>
                            <p>清洗总锅次</p>
                            <span>{{item.CleanTotalBatch}}</span>
                          </li>
                        </ul>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </dd>
              </dl>
            </div>
          </div>
          <div class="cssd_table_right"></div>
        </div>
      </div>
    </transition>
    <transition
        name="slide"
        :enter-active-class="`animated  faster slideInRight`"
        :leave-active-class="`animated  faster slideOutRight`"
      >
      <CleanFailedPackages 
        v-if="isShowCleanFailedPackages" 
        @cleanFailed-to-father="cleanFailedToFather"
        :failedCarriers="failedCarrier"
        :taskId="taskId"
      ></CleanFailedPackages>
    </transition>
  </div>
</template>

<script>
import CleanFailedPackages from "./CleanFailedPackages";
export default {
  data() {
    return {
      taskIndex: 0,//不合格包所属任务索引
      taskId: 0,//不合格包所属任务Id
      failedCarrier: [],
      isShowCleanView:true,//清洗任务view
      isShowCarrierList: false,//不合格网篮view
      isShowCleanFailedPackages:false,//不合格包view
      cleanTask: {
        CleanCleaningTasks: [],
        CleanPendingReviewTasks: []
      }
    };
  },
  components: {
    CleanFailedPackages
  },
  created() {
    axios({ url: "/api/Clean/CleanReview" })
      .then(res => {
        if (res.data.Code == 200) {
          this.cleanTask = res.data.Data;
          //开启计时器do countdown  RemainingTime
          if (this.cleanTask.CleanCleaningTasks) {
            this.cleanTask.CleanCleaningTasks.forEach((val, index) => {
              if(val.RemainingTime>0){
                val["Countdown" + index] = setInterval(() => {
                  val.RemainingTime--;
                  if (val.RemainingTime <= 0) {
                    clearInterval(val["Countdown" + index]);
                  }
                }, 1000);
              }
            });
          }
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  beforeDestroy() {
    //清除计时器
    if (this.cleanTask.CleanCleaningTasks) {
      this.cleanTask.CleanCleaningTasks.forEach((val, index) => {
        clearInterval(val["Countdown" + index]);
      });
    }
  },
  mounted() {
    $(".cssd_table_subTabs").on("click", "dt.reviewStatus", function() {
      $(this)
        .siblings()
        .stop()
        .slideToggle("fast")
        .end()
        .parent()
        .toggleClass("isActive")
        .siblings()
        .removeClass("isActive")
        .find("dd")
        .stop()
        .slideUp("fast");
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //el-input-number change事件
    handleNumberChange(newValue, oldValue, origin, index) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.cleanTask.CleanPendingReviewTasks[index].CleaningQualityRecord[
            origin
          ] = 0;
        }, 0);
      }
    },
    //清洗审核提交
    submitCheckResult(index) {
      if (this.cleanTask.CleanPendingReviewTasks[index].CleanReviewResult == 4) {
        if (!this.GLOBAL.VerificationHandle([{val: this.cleanTask.CleanPendingReviewTasks[index].FailedPackageNumber,type: "NumberNotZero",msg: "您的审核结果为部分不合格！请至少添加一个不合格包！"}])) {
          return;
        }
      }
      axios({
        url: "/api/Clean/CleanReviewSubmit",
        method: "POST",
        data: this.cleanTask.CleanPendingReviewTasks[index]
      })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            this.$router.go(0);
          } else {
            type = "error";
          }
          this.showInformation({
            classify: "message",
            msg: res.data.Msg,
            type: type
          });
        })
        .catch(err => {});
    },
    //不合格包数据传递
    cleanFailedToFather(data) {
      this.isShowCleanFailedPackages = false;
      this.isShowCleanView = true;
      if (data) {
        this.cleanTask.CleanPendingReviewTasks[
          this.taskIndex
        ].FailedCarriers = data;
      }
    },
    //处理部分合格包
    handleFailedPackages(index) {
      this.taskIndex = index;
      this.taskId = this.cleanTask.CleanPendingReviewTasks[index].CleanTaskId;
      this.failedCarrier = this.cleanTask.CleanPendingReviewTasks[
        index
      ].FailedCarriers;
      this.isShowCleanView = false;
      this.isShowCleanFailedPackages = true;
    },
    resetDeviceTime(index) {
      axios({url: `/api/Clean/ReturnDeviceTimeToZero/${this.cleanTask.CleanCleaningTasks[index].CleanDeviceId}`})
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            this.$router.go(0);
          } else {
            type = "error";
          }
          this.showInformation({
            classify: "message",
            msg: res.data.Msg,
            type: type
          });
        })
        .catch(err => {});
    }
  },
  computed: {
    timeFormatDuring() {
      return timeSeconds => {
        var hours = parseInt((timeSeconds % (60 * 60 * 24)) / (60 * 60));
        var minutes = parseInt((timeSeconds % (60 * 60)) / 60);
        var seconds = timeSeconds % 60;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
      };
    },
    countFailedPackageNumber(){
      return index=>{
        let list = this.cleanTask.CleanPendingReviewTasks[index].FailedCarriers;
        let num =0;
        for(let i=0;i<list.length;i++){
          for(let j=0;j<list[i].Packages.length;j++){
            num += list[i].Packages[j].CanNotBePackagedCount;
          }
        }
        this.cleanTask.CleanPendingReviewTasks[index].FailedPackageNumber = num;
        return num;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/review";
.cleanReview{
  position: absolute;
  left: 0;
  right: 0;
  top: 40px;
  bottom: 0;
  margin: auto;
  #cleanCheck {
    top: 0;
    .checkStatusBox {
      .el-select {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>