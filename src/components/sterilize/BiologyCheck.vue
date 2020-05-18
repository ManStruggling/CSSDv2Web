<template>
  <!-- 编辑弹出框 -->
  <div id="biologyCheck">
    <div class="editContainer">
      <div class="editContent">
        <div class="sterilize_search">
          <el-input
            v-model.trim="search_str"
            placeholder="请输入灭菌编号"
            @keyup.enter.native="searchData"
            v-focus
          ></el-input>
          <el-button type="primary" @click="searchData" class="btn120x40">查询</el-button>
        </div>
        <ul>
          <li>
            <p class="filed_label">灭菌开始时间</p>
            <span class="filed_txt">{{data.SterilizeStartDate}}</span>
          </li>
          <li>
            <p class="filed_label">灭菌结束时间</p>
            <span class="filed_txt">{{data.SterilizeEndDate}}</span>
          </li>
          <li>
            <p class="filed_label">灭菌设备</p>
            <span class="filed_txt">{{data.SterilizeDevice}}</span>
          </li>
          <li>
            <p class="filed_label">灭菌程序</p>
            <span class="filed_txt">{{data.SterilizeProgram}}</span>
          </li>
          <li v-if="UserInfo.HospitalVersion === 'YUXISHIRENMIN'">
            <p class="filed_label">生物培养开始时间</p>
            <el-date-picker
              v-model="data.BiologicalStartTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :clearable="false"
              :picker-options="Object.assign({disabledDate:disabledStartDate},GLOBAL.pickerOptions)"
              @change="wetherStartDateGtEndDate"
            ></el-date-picker>
          </li>
          <li v-if="UserInfo.HospitalVersion === 'YUXISHIRENMIN'">
            <p class="filed_label">生物培养结束时间</p>
            <el-date-picker
              v-model="data.BiologicalEndTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :clearable="false"
              @change="wetherStartDateGtEndDate"
              :picker-options="Object.assign({disabledDate:disabledEndDate},GLOBAL.pickerOptions)"
            ></el-date-picker>
          </li>
          <li>
            <p class="filed_label">灭菌人</p>
            <span class="filed_txt">{{data.SterilizePerson}}</span>
          </li>
          <li>
            <p class="filed_label">当日锅次</p>
            <span class="filed_txt">{{data.SterilizeTodayBatch}}</span>
          </li>
          <li>
            <p class="filed_label">总锅次</p>
            <span class="filed_txt">{{data.SterilizeTotalBatch}}</span>
          </li>
          <li>
            <p class="filed_label">生物检测结果</p>
            <el-select v-model="status" class="green18x10">
              <el-option label="不合格" :value="false"></el-option>
              <el-option label="合格" :value="true"></el-option>
            </el-select>
          </li>
        </ul>
        <div class="photoOption">
          <span>已拍照片</span>
          <p>
            <s>{{computedPhotoNumber}}</s>
            <a @click="handleShowPhotos">拍照</a>
          </p>
        </div>
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
            :data="data.Pictures"
          ></PhotoView>
        </transition>
      </div>
      <div class="boxOption">
        <el-button @click="CancelSave" class="btn88x32empty">取消</el-button>
        <el-button type="primary" @click="BoxSave" class="btn88x32">审核完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PhotoView from "../common/PhotoView";
import { mapState } from "vuex";
export default {
  inject: ["reload"],
  data() {
    return {
      status: true,
      isShowPhoto: false,
      search_str: "",
      data: {
        SterilizeTaskId: 0,
        SterilizeStartDate: "",
        SterilizeEndDate: "",
        SterilizeDevice: "",
        SterilizeProgram: "",
        SterilizePerson: "",
        SterilizeTodayBatch: "",
        SterilizeTotalBatch: "",
        BiologicalStartTime: "",
        BiologicalEndTime: "",
        Pictures: []
      }
    };
  },
  components: {
    PhotoView
  },
  created() {
    CSManager.handleDataThis = this;
  },
  mounted() {},
  methods: {
    //图片数据传递
    viewPhotoToFather() {
      this.isShowPhoto = false;
    },
    //处理显示图片
    handleShowPhotos(index) {
      this.isShowPhoto = true;
    },
    //搜索数据
    searchData() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.search_str,
            type: "StringNotEmpty",
            msg: "搜索灭菌编号不能为空！"
          }
        ])
      ) {
        axios({
          url: `/api/Sterilize/BiologicalReviewSearch/${this.search_str}`
        })
          .then(res => {
            if (res.data.Code == 200) {
              res.data.Data.BiologicalStartTime = "";
              res.data.Data.BiologicalEndTime = "";
              Object.assign(this.data, res.data.Data);
            } else {
              this.showInformation({
                classify: "message",
                msg: res.data.Msg
              });
            }
          })
          .catch(err => {});
      }
    },
    //取消编辑
    CancelSave() {
      this.$emit("biology-to-father", "");
    },
    //保存编辑
    BoxSave() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.data.SterilizeTaskId,
            type: "NumberNotZero",
            msg: "您还没有查询灭菌编号！请查询灭菌编号！"
          }
        ])
      ) {
        if (
          this.UserInfo.HospitalVersion === "YUXISHIRENMIN" &&
          !this.GLOBAL.VerificationHandle([
            {
              val: this.data.BiologicalStartTime,
              type: "StringNotEmpty",
              msg: "生物培养开始时间不能为空！"
            },
            {
              val: this.data.BiologicalEndTime,
              type: "StringNotEmpty",
              msg: "生物培养结束时间不能为空！"
            }
          ])
        ) {
          return;
        }
        if (this.status) {
          axios({
            url: `/api/Sterilize/BiologicalReviewSuccess`,
            method: "POST",
            data: {
              SterilizeTaskId: this.data.SterilizeTaskId,
              Pictures: this.data.Pictures
            }
          }).then(res => {
            if (res.data.Code == 200) {
              this.reload();
            } else {
              this.showInformation({
                classify: "message",
                msg: res.data.Msg
              });
            }
          });
        } else {
          this.showInformation({
            classify: "confirm",
            msg: "确认生物检测不合格,并发起一键召回吗?",
            confirmCallBack: () => {
              this.$router.push({
                path: "/sterilize/recall",
                query: {
                  sterilizeTaskId: this.data.SterilizeTaskId
                }
              });
            },
            cancelCallBack: () => {}
          });
        }
      }
    },
    handleBarCode(msg) {
      this.search_str = msg;
      this.searchData();
    },

    disabledStartDate(times) {
      return times.getTime() <= Date.now() ? false : true;
    },
    disabledEndDate(times) {
      return times.getTime() + 3600 * 1000 * 24 - 1 <
        new Date(this.data.BiologicalStartTime).getTime()
        ? true
        : this.disabledStartDate(times);
    },
    wetherStartDateGtEndDate(times) {
      if (
        new Date(this.data.BiologicalStartTime).getTime() >
        new Date(this.data.BiologicalEndTime).getTime()
      ) {
        this.data.BiologicalEndTime = "";
        this.showInformation({
          msg: "重新选择生物培养结束时间",
          classify: "message"
        });
      }
    }
  },
  computed: {
    computedPhotoNumber() {
      return this.data.Pictures.length;
    },
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  }
};
</script>

<style lang="scss">
#biologyCheck {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 2;

  .editContainer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 900px;
    height: 390px;
    border-radius: 8px;
    background: #fff;
    padding: 20px 30px;
    box-sizing: border-box;

    .editContent {
      .sterilize_search {
        margin-bottom: 20px;

        .el-input {
          width: 160px;
          margin-right: 20px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);

          input {
            padding: 0 5px 0 10px;
          }
        }

        .el-button {
          background: #00c16b;
          font-size: 18px;
          font-family: Microsoft YaHei;
          color: rgba(255, 255, 255, 1);
        }
      }

      > ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        li {
          display: flex;
          width: 400px;
          justify-content: space-between;

          p.filed_label {
            width: 170px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            color: rgba(135, 141, 159, 1);
            text-align: right;
            line-height: 40px;
          }
          .el-date-editor {
            input {
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
              font-size: 16px;
            }
          }

          span.filed_txt {
            flex: 1;
            margin-left: 10px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .el-select {
            flex: 1;
            margin-left: 10px;
            input {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }
          }
        }
      }

      .photoOption {
        display: flex;
        padding: 10px;
        line-height: 22px;
        border-bottom: 0;

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
    }

    .boxOption {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
