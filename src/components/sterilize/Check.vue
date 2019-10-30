<template>
  <div class="cssd_box" id="sterilizeCheck">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <li @click="fastLocation">
          <p>快速定位</p>
        </li>
        <li @click="biologyCheck">
          <p>生物监测</p>
        </li>
        <router-link to="/sterilize/checkRecord" tag="li">
          <p>灭菌审核记录</p>
        </router-link>
        <router-link to="/sterilize/recallRecord" tag="li">
          <p>召回记录</p>
        </router-link>
      </ul>
    </div>
    <div class="cssd_table_center cssd_table_subTabs review_check">
      <div class="cssd_table_left">
        <div class="cssd_talbe_left_menu">
          <dl class="isActive">
            <dt class="pendingReview reviewStatus">
              <span>待审核</span>
            </dt>
            <dd class="reviewDd" style="display:block;">
              <el-tabs
                :tab-position="'left'"
                :activeName="pendingReviewActiveName"
                @tab-click="tabClick"
              >
                <el-tab-pane
                  v-for="(item,index) in sterilizeTask.PendingReview"
                  :key="index"
                  :label="item.SterilizeTaskBarCode"
                  :name="index+''"
                >
                  <div class="tab_content table_unExpand">
                    <ul class="clear_float">
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
                    </ul>
                    <ul class="clear_float">
                      <li>
                        <p>灭菌设备</p>
                        <span>{{item.SterilizeDeviceName}}</span>
                      </li>
                      <li>
                        <p>灭菌程序</p>
                        <span>{{item.SterilizeProgramName}}</span>
                      </li>
                    </ul>
                    <ul class="clear_float">
                      <li>
                        <p>灭菌当日锅次</p>
                        <span>{{item.SterilizeTodayBatch}}</span>
                      </li>
                      <li>
                        <p>灭菌总锅次</p>
                        <span>{{item.SterilizeTotalBatch}}</span>
                      </li>
                    </ul>
                    <ul class="clear_float">
                      <li>
                        <p>质量检测类型</p>
                        <span>化学检测</span>
                      </li>
                      <li>
                        <p>质量检测结果</p>
                        <el-select v-model="item[item.ReviewType]" class="green24x13">
                          <el-option :label="'合格'" :value="2"></el-option>
                          <el-option :label="'不合格'" :value="3"></el-option>
                        </el-select>
                      </li>
                    </ul>
                    <ul class="clear_float">
                      <li>
                        <p>官腔检测结果</p>
                        <el-select v-model="item.CatheterReviewStatus" class="green24x13">
                          <el-option :label="'合格'" :value="2"></el-option>
                          <el-option :label="'不合格'" :value="3"></el-option>
                          <el-option :label="'未检测'" :value="4"></el-option>
                        </el-select>
                      </li>
                    </ul>
                    <div class="photoOption">
                      <span>已拍照片</span>
                      <p>
                        <s>{{computedPhotoNumber(index)}}</s>
                        <a @click="handleShowPhotos(index)">拍照</a>
                      </p>
                    </div>
                    <!-- <ul class="clear_float">
                      <li>
                        <p>备注</p>
                        <el-input type="textarea" v-model.trim="item.Remark"></el-input>
                      </li>
                    </ul>-->

                    <h5></h5>
                    <div class="content_title">
                      <p>包条码</p>
                      <p>包名称</p>
                      <p>包数量</p>
                      <p>不合格原因</p>
                      <p>操作</p>
                    </div>
                    <el-table :data="item.SterilizeFailedPackages" :show-header="false">
                      <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                      <el-table-column label="包名称" prop="ProductName" width="210"></el-table-column>
                      <el-table-column label="包数量" prop="ProductQuantity" width="210"></el-table-column>
                      <el-table-column label="不合格原因" width="210">
                        <template slot-scope="props">
                          <el-select v-model="props.row.FailedCauseId" class="green24x13">
                            <el-option
                              v-for="(val,idx) in failedCauses"
                              :key="idx"
                              :label="val.FailedCause"
                              :value="val.FailedCauseId"
                            ></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="210">
                        <template slot-scope="props">
                          <el-button @click="deleteFailedPackage(props.$index,item)">删除</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column></el-table-column>
                    </el-table>
                    <h6>
                      <el-button
                        type="primary"
                        @click="addFailedPackage(index)"
                        class="btn120x40"
                      >新增不合格包</el-button>
                      <el-button @click="addFailedCountPackage(index)">新增计数包</el-button>
                    </h6>
                    <div class="tab_content_bottom">
                      <el-button
                        type="primary"
                        @click="submitCheckResult(index)"
                        class="btn150x40main"
                      >审核完成</el-button>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </dd>
          </dl>
          <dl>
            <dt class="sterilizing reviewStatus">
              <span>灭菌中</span>
            </dt>
            <dd class="reviewDd">
              <el-tabs :tab-position="'left'" :activeName="sterilizingActiveName">
                <el-tab-pane
                  v-for="(item,index) in sterilizeTask.Sterilizing"
                  :key="index"
                  :label="item.SterilizeTaskBarCode"
                  :name="index+''"
                >
                  <div class="tab_content">
                    <div class="timerBox">
                      <p>{{GLOBAL.timeFormatDuring(item.RemainingTime)}}</p>
                      <span @click="resetDeviceTime(index)"></span>
                    </div>
                    <ul class="clear_float">
                      <li>
                        <p>灭菌开始时间</p>
                        <span>{{item.SterilizeStartDate}}</span>
                      </li>
                      <li>
                        <p>灭菌人</p>
                        <span>{{item.Sterilizer}}</span>
                      </li>
                    </ul>
                    <ul class="clear_float">
                      <li>
                        <p>灭菌设备</p>
                        <span>{{item.SterilizeDeviceName}}</span>
                      </li>
                      <li>
                        <p>灭菌程序</p>
                        <span>{{item.SterilizeProgramName}}</span>
                      </li>
                    </ul>
                    <ul class="clear_float">
                      <li>
                        <p>灭菌当日锅次</p>
                        <span>{{item.SterilizeTodayBatch}}</span>
                      </li>
                      <li>
                        <p>灭菌总锅次</p>
                        <span>{{item.SterilizeTotalBatch}}</span>
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
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <div v-if="isShowFastLocation" class="fast_location">
        <dl>
          <dt>
            <el-input v-model.trim="input_str" @keyup.enter.native="SaveOption" v-focus></el-input>
          </dt>
          <dd>
            <el-button type="primary" @click="cancelOption">取消</el-button>
            <el-button type="primary" @click="SaveOption">确定</el-button>
          </dd>
        </dl>
      </div>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 生物监测 -->
      <BiologyCheck v-if="isShowBiologyCheck" @biology-to-father="biologyToFather"></BiologyCheck>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 手工录入 -->
      <ManualEnter
        v-if="isShowManualEnter"
        :task_index="task_index"
        @to-father="packageData2father"
        :ApiUrl="`/api/Scanner/SterilizerReviewFailed/${sterilizeTask.PendingReview[task_index].SterilizeTaskId}`"
        :BarCodeList="sterilizeTask.PendingReview[task_index].SterilizeFailedPackages"
      ></ManualEnter>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 失败的计数包 -->
      <FailedCountPackages
        v-if="isShowFailedCountPackages"
        :task_index="task_index"
        @failedCountNumber-to-father="failedCountPackagesData2father"
        :ApiUrl="`/api/Sterilize/SterilizeNotBarCodePackage/${sterilizeTask.PendingReview[task_index].SterilizeTaskId}`"
      ></FailedCountPackages>
    </transition>
    <!-- 照片 -->
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 拍照 -->
      <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="photoData"></PhotoView>
    </transition>
  </div>
</template>

<script>
import BiologyCheck from "./BiologyCheck";
import FailedCountPackages from "./FailedCountPackages";
import ManualEnter from "../common/ManualEnter";
import PhotoView from "../common/PhotoView";
export default {
  data() {
    return {
      photoData: [],
      task_index: -1, //待审核任务的索引
      input_str: "", //快速定位绑定值
      isShowPhoto: false,
      isShowFailedCountPackages: false, //计数包控制器
      isShowBiologyCheck: false, //生物检测控制器
      isShowManualEnter: false, //手工录入控制器
      isShowFastLocation: false, //快速定位控制器
      pendingReviewActiveName: "0",
      sterilizingActiveName: "0",
      failedCauses: [], //失败原因
      sterilizeTask: {
        Sterilizing: [],
        PendingReview: []
      }
    };
  },
  components: {
    ManualEnter,
    BiologyCheck,
    FailedCountPackages,
    PhotoView
  },
  created() {
    CSManager.handleDataThis = this;
    axios({ url: "/api/Sterilize/GetSterilizeReviewTask" })
      .then(res => {
        if (res.data.Code == 200) {
          this.sterilizeTask = res.data.Data;
          this.failedCauses = res.data.Data.FailedCauses;
          //开启计时器do countdown  RemainingTime
          if (this.sterilizeTask.Sterilizing) {
            this.sterilizeTask.Sterilizing.forEach((val, index) => {
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
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
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
  beforeDestroy() {
    CSManager.handleDataThis = null;
    //清除计时器
    if (this.sterilizeTask.Sterilizing) {
      this.sterilizeTask.Sterilizing.forEach((val, index) => {
        clearInterval(val["Countdown" + index]);
      });
    }
  },
  methods: {
    //图片数据传递
    viewPhotoToFather() {
      this.isShowPhoto = false;
    },
    //处理显示图片
    handleShowPhotos(index) {
      this.photoData = this.sterilizeTask.PendingReview[index].Pictures;
      this.isShowPhoto = true;
    },
    //生物检测数据传递
    biologyToFather() {
      this.isShowBiologyCheck = false;
      CSManager.handleDataThis = this;
    },
    //处理显示生物检测
    biologyCheck() {
      this.isShowBiologyCheck = true;
    },
    //重置时间
    resetDeviceTime(index) {
      axios({
        url: `/api/Sterilize/ReturnDeviceTimeToZero/${this.sterilizeTask.Sterilizing[index].SterilizeDeviceId}`
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
    goBack() {
      this.$router.push("/sterilize/select");
    },
    //
    tabClick(vm) {
      this.pendingReviewActiveName = vm.index;
    },
    //快速定位弹窗  取消
    cancelOption() {
      this.isShowFastLocation = false;
      this.input_str = "";
    },
    //快速定位弹窗 确定
    SaveOption() {
      this.isShowFastLocation = false;
      if (this.sterilizeTask.PendingReview) {
        this.sterilizeTask.PendingReview.forEach((item, index) => {
          if (this.input_str.toUpperCase() == item.SterilizeTaskBarCode) {
            this.sterilizingActiveName = "-1";
            this.pendingReviewActiveName = index + "";
            $(".pendingReview")
              .siblings()
              .stop()
              .slideDown("fast")
              .end()
              .parent()
              .addClass("isActive")
              .siblings()
              .removeClass("isActive")
              .find("dd.reviewDd")
              .stop()
              .slideUp("fast");
            $(".cssd_talbe_left_menu").animate(
              { scrollTop: 60 + index * 40 },
              1000
            );
            return;
          }
        });
      }
      if (this.sterilizeTask.Sterilizing) {
        this.sterilizeTask.Sterilizing.forEach((item, index) => {
          if (this.input_str.toUpperCase() == item.SterilizeTaskBarCode) {
            this.pendingReviewActiveName = "-1";
            this.sterilizingActiveName = index + "";
            $(".sterilizing")
              .siblings()
              .stop()
              .slideDown("fast")
              .end()
              .parent()
              .addClass("isActive")
              .siblings()
              .removeClass("isActive")
              .find("dd.reviewDd")
              .stop()
              .slideUp("fast");
            $(".cssd_talbe_left_menu").animate(
              { scrollTop: 120 + index * 40 },
              1000
            );
            return;
          }
        });
      }
      this.input_str = "";
    },
    //快速定位
    fastLocation() {
      this.isShowFastLocation = true;
    },
    //添加不合格包
    addFailedPackage(index) {
      this.task_index = index;
      this.isShowManualEnter = true;
    },
    //添加不合格计数包
    addFailedCountPackage(index) {
      this.task_index = index;
      this.isShowFailedCountPackages = true;
    },
    //手工录入信息传递
    packageData2father(data) {
      this.isShowManualEnter = false;
      if (data) {
        // data.data.Package.FailedCauseId=this.failedCauses[0].FailedCauseId;
        this.sterilizeTask.PendingReview[
          data.index
        ].SterilizeFailedPackages.push(data.data.Package);
      }
    },
    //失败的计数包数据传递
    failedCountPackagesData2father(data) {
      this.isShowFailedCountPackages = false;
      if (data) {
        for (let i = 0; i < data.data.length; i++) {
          let onOff = true; //find data --true not find --false finded
          for (
            let j = 0;
            j <
            this.sterilizeTask.PendingReview[data.index].SterilizeFailedPackages
              .length;
            j++
          ) {
            if (
              this.sterilizeTask.PendingReview[data.index]
                .SterilizeFailedPackages[j].ProductId === data.data[i].ProductId
            ) {
              onOff = false;
              this.sterilizeTask.PendingReview[
                data.index
              ].SterilizeFailedPackages[j].ProductQuantity +=
                data.data[i].ProductQuantity;
              if (
                this.sterilizeTask.PendingReview[data.index]
                  .SterilizeFailedPackages[j].ProductQuantity >
                data.data[i].MaxProductQuantity
              ) {
                this.sterilizeTask.PendingReview[
                  data.index
                ].SterilizeFailedPackages[j].ProductQuantity =
                  data.data[i].MaxProductQuantity;
              }
              break;
            }
          }
          if (onOff) {
            this.sterilizeTask.PendingReview[
              data.index
            ].SterilizeFailedPackages.push(data.data[i]);
          }
        }
      }
    },
    //删除不合格包
    deleteFailedPackage(index, item) {
      item.SterilizeFailedPackages.splice(index, 1);
    },
    //灭菌审核提交
    submitCheckResult(index) {
      //化学检测不合格
      if (this.sterilizeTask.PendingReview[index].ChemicalReviewStatus == 3) {
        this.$confirm("确认化学检测不合格,并重新生成配包任务吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            axios({
              url: "/api/Sterilize/ChemicalSterilizeReviewFailed",
              method: "POST",
              data: this.sterilizeTask.PendingReview[index]
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
          })
          .catch(() => {});
      } else {
        //整理成后端需要的结构
        this.sterilizeTask.PendingReview[index].ReviewResultVm = {
          ReviewType: this.sterilizeTask.PendingReview[index].ReviewType,
          ReviewResult: this.sterilizeTask.PendingReview[index][
            this.sterilizeTask.PendingReview[index].ReviewType
          ]
        };
        //验证不合格原因
        for (
          let i = 0;
          i <
          this.sterilizeTask.PendingReview[index].SterilizeFailedPackages
            .length;
          i++
        ) {
          if (
            !this.sterilizeTask.PendingReview[index].SterilizeFailedPackages[i]
              .FailedCauseId
          ) {
            this.showInformation({
              classify: "message",
              msg: "请选择不合格原因！"
            });
            return;
          }
        }
        axios({
          url: "/api/Sterilize/SterilizeReviewComplete",
          method: "POST",
          data: this.sterilizeTask.PendingReview[index]
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
      }
    },
    handleBarCode(msg) {
      if (/^MJR/.test(msg)) {
        //faster location
        this.input_str = msg;
        this.SaveOption();
      } else {
        if (this.sterilizeTask.PendingReview[this.pendingReviewActiveName]) {
          let onOff = true;
          this.sterilizeTask.PendingReview[
            this.pendingReviewActiveName
          ].SterilizeFailedPackages.forEach(item => {
            //发现已录入
            if (item.BarCode == msg.toUpperCase()) {
              this.showInformation({
                classify: "message",
                msg: "该条码已录入！",
                type: "warning"
              });
              onOff = false;
              return;
            }
          });
          if (onOff) {
            axios({
              url: `/api/Scanner/SterilizerReviewFailed/${this.sterilizeTask.PendingReview[this.pendingReviewActiveName].SterilizeTaskId}/${msg}`
            })
              .then(res => {
                if (res.data.Code == 200) {
                  this.isShowManualEnter = false;
                  this.sterilizeTask.PendingReview[
                    this.pendingReviewActiveName
                  ].SterilizeFailedPackages.push(res.data.Data.Package);
                } else {
                  this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                  });
                }
              })
              .catch(err => {});
          }
        }
      }
    }
  },
  computed: {
    computedPhotoNumber() {
      return index => {
        return this.sterilizeTask.PendingReview[index].Pictures == null
          ? 0
          : this.sterilizeTask.PendingReview[index].Pictures.length;
      };
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/review";
@import "../../assets/css/tableUnExpand";
#sterilizeCheck {
  .content_title {
    margin-top: 30px;
    display: flex;
    height: 60px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    color: rgba(135, 141, 159, 1);
    line-height: 60px;
    padding-left: 40px;
    background: rgba(247, 248, 250, 1);
    p {
      width: 160px;
      margin-right: 50px;
    }
  }
  .photoOption {
    display: flex;
    padding: 30px 0 40px;
    line-height: 22px;
    border-bottom: 1px solid #f2f4f7;
    span {
      margin-right: 20px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: rgba(135, 141, 159, 1);
    }
    p {
      s {
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: #333333;
        font-weight: bold;
      }
      a {
        margin: 0 10px;
        font-size: 16px;
        cursor: pointer;
        font-family: Microsoft YaHei;
        color: #00c16b;
        font-weight: bold;
      }
      b {
        font-family: Microsoft YaHei;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        color: #00c16b;
      }
    }
  }
  .el-table {
    margin-top: 0;
    width: 100%;
    .cell {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(35, 46, 65, 1);
      .el-select {
        width: 160px;
        .el-input {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          input {
            padding: 0 15px 0 10px;
          }
        }
      }
      .el-button {
        border: 0;
        font-size: 18px;
        font-family: Microsoft YaHei;
        color: rgba(249, 62, 62, 1);
        &:hover {
          background: none;
        }
      }
    }
  }
  h6 {
    margin-top: 20px;
    .el-button--default {
      margin-left: 30px;
      width: 120px;
      height: 40px;
      border-color: rgba(0, 193, 107, 1);
      background: #fff;
      color: rgba(0, 193, 107, 1);
      padding: 0;
      font-size: 18px;
    }
  }
  .fast_location {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 2;
    dl {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 360px;
      height: 200px;
      border-radius: 8px;
      background: #fff;
      padding: 24px 30px;
      box-sizing: border-box;
      dt {
        margin-bottom: 20px;
        .el-input {
          height: 100px;
          .el-input__inner {
            height: 100px;
            line-height: 100px;
            padding: 20px;
            &:focus {
              border-color: rgba(0, 193, 107, 1);
            }
          }
        }
      }
      dd {
        text-align: center;
        .el-button {
          width: 88px;
          height: 32px;
          padding: 0;
          border: 1px solid rgba(0, 193, 107, 1);
          font-size: 18px;
          font-family: Microsoft YaHei;
        }
        .el-button--default {
          background: #fff;
          color: rgba(0, 193, 107, 1);
        }
        .el-button--primary {
          background: rgba(0, 193, 107, 1);
        }
      }
    }
  }
}
</style>