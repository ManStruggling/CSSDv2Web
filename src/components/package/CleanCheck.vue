<template>
  <!-- 清洗审核
        清洗中：每条任务绑定计时器，倒计时，组件卸载前清除定时器
        taskIndex: 当前操作的审核索引，不合格包根据当前索引插入数据
        taskId：当前操作的审核任务Id，根据当前Id请求所有网篮
        failedCarrier：当前清洗失败的网篮
  -->
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
        <div
          :class="{cssd_table_center:true, cssd_table_subTabs:true, review_check:true,displayNav:displayNav}"
        >
          <div class="cssd_table_left">
            <div class="cssd_talbe_left_menu">
              <dl class="isActive">
                <dt class="reviewStatus">
                  <span>待审核（{{cleanTask.CleanPendingReviewTasks==null?0:cleanTask.CleanPendingReviewTasks.length}}）</span>
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
                          <div
                            class="unqualifiedCarrier"
                            v-show="item.CleanReviewResult==4?true:false"
                          >
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
                            <el-input
                              type="textarea"
                              resize="none"
                              placeholder="填写备注"
                              v-model="item.Remark"
                            ></el-input>
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
                  <span>清洗中（{{cleanTask.CleanCleaningTasks==null?0:cleanTask.CleanCleaningTasks.length}}）</span>
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
                          <p>{{GLOBAL.timeFormatDuring(item.RemainingTime)}}</p>
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
              <div class="shrinkNavBox">
                <div class="border_div"></div>
                <i @click="displayNav=!displayNav" class="el-icon-d-arrow-left"></i>
              </div>
              <div class="expandNavBox" @click="displayNav=!displayNav"></div>
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
        :UserInfo="UserInfo"
      ></CleanFailedPackages>
    </transition>
  </div>
</template>

<script>
import CleanFailedPackages from "./CleanFailedPackages";
export default {
  inject: ["reload"],
  props: {
    UserInfo: Object
  },
  data() {
    return {
      displayNav: true,
      taskIndex: 0, //不合格包所属任务索引
      taskId: 0, //不合格包所属任务Id
      failedCarrier: [],
      isShowCleanView: true, //清洗任务view
      isShowCarrierList: false, //不合格网篮view
      isShowCleanFailedPackages: false, //不合格包view
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
    axios({
      url: "/api/Clean/CleanReview"
    })
      .then(res => {
        if (res.data.Code == 200) {
          this.cleanTask = res.data.Data;
          //开启计时器do countdown  RemainingTime
          if (this.cleanTask.CleanCleaningTasks) {
            this.cleanTask.CleanCleaningTasks.forEach((val, index) => {
              if (val.RemainingTime > 0) {
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
          this.showInformation({
            classify: "message",
            msg: res.data.Msg
          });
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
      this.$router.back(-1);
    },
    //清洗审核提交
    submitCheckResult(index) {
      if (
        this.cleanTask.CleanPendingReviewTasks[index].CleanReviewResult == 4
      ) {
        if (
          !this.GLOBAL.VerificationHandle([
            {
              val: this.cleanTask.CleanPendingReviewTasks[index]
                .FailedPackageNumber,
              type: "NumberNotZero",
              msg: "您的审核结果为部分不合格！请至少添加一个不合格包！"
            }
          ])
        ) {
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
            this.reload();
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
    //不合格包数据传递  根据当前索引，插入更新不合格数据
    cleanFailedToFather(data) {
      this.isShowCleanFailedPackages = false;
      this.isShowCleanView = true;
      if (data) {
        this.cleanTask.CleanPendingReviewTasks[
          this.taskIndex
        ].FailedCarriers = data;
      }
    },
    //处理部分合格包 绑定当前审核的索引、任务Id、清洗失败的网篮
    handleFailedPackages(index) {
      this.taskIndex = index;
      this.taskId = this.cleanTask.CleanPendingReviewTasks[index].CleanTaskId;
      this.failedCarrier = this.cleanTask.CleanPendingReviewTasks[
        index
      ].FailedCarriers;
      this.isShowCleanView = false;
      this.isShowCleanFailedPackages = true;
    },
    //重置时间
    resetDeviceTime(index) {
      axios({
        url: `/api/Clean/ReturnDeviceTimeToZero/${this.cleanTask.CleanCleaningTasks[index].CleanDeviceId}`
      })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            this.reload();
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
    countFailedPackageNumber() {
      return index => {
        let list = this.cleanTask.CleanPendingReviewTasks[index].FailedCarriers;
        let num = 0;
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].Packages.length; j++) {
            num += list[i].Packages[j].CanNotBePackagedCount;
          }
        }
        this.cleanTask.CleanPendingReviewTasks[index].FailedPackageNumber = num;
        return num;
      };
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/review";

.cleanReview {
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
