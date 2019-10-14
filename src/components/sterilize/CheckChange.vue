<template>
  <div class="cssd_box" id="sterilizeCheckRecordChange">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li>
          <router-link to="/sterilize/checkRecord" tag="p">返回</router-link>
        </li>
      </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="tab_content">
        <ul class="clear_float">
          <li>
            <p>灭菌开始时间</p>
            <span>{{data.SterilizeStartDate}}</span>
          </li>
          <li>
            <p>灭菌结束时间</p>
            <span>{{data.SterilizeEndDate}}</span>
          </li>
          <li>
            <p>灭菌人</p>
            <span>{{data.Sterilizer}}</span>
          </li>
        </ul>
        <ul class="clear_float">
          <li>
            <p>灭菌设备</p>
            <span>{{data.SterilizeDeviceName}}</span>
          </li>
          <li>
            <p>灭菌程序</p>
            <span>{{data.SterilizeProgramName}}</span>
          </li>
        </ul>
        <ul class="clear_float">
          <li>
            <p>灭菌当日锅次</p>
            <span>{{data.SterilizeTodayBatch}}</span>
          </li>
          <li>
            <p>灭菌总锅次</p>
            <span>{{data.SterilizeTotalBatch}}</span>
          </li>
        </ul>
        <ul class="clear_float">
          <li>
            <p>质量检测类型</p>
            <el-select
              v-model="data.ReviewType"
              class="green24x13"
              @change="reviewClassChange"
              :disabled="!data.HasBiologicalTest"
            >
              <el-option :label="'化学检测'" :value="'ChemicalReviewStatus'"></el-option>
              <el-option :label="'生物检测'" :value="'BiologicalReviewStatus'"></el-option>
            </el-select>
          </li>
          <li>
            <p>质量检测结果</p>
            <!-- 化学检测不可更改                 生物检测合格状态不可改                生物检测不合格状态不可改 -->
            <el-select
              v-model="data[data.ReviewType]"
              class="green24x13"
              :disabled="data.ReviewType=='ChemicalReviewStatus'||guideData.BiologicalReviewStatus==2||guideData.BiologicalReviewStatus==3?true:false"
            >
              <el-option :label="'合格'" :value="2"></el-option>
              <el-option :label="'不合格'" :value="3"></el-option>
            </el-select>
          </li>
        </ul>
        <ul class="clear_float">
          <li>
            <p>官腔检测结果</p>
            <el-select v-model="data.CatheterReviewStatus" class="green24x13">
              <el-option :label="'合格'" :value="2"></el-option>
              <el-option :label="'不合格'" :value="3"></el-option>
              <el-option :label="'未检测'" :value="4"></el-option>
            </el-select>
          </li>
          <!-- <li>
            <p>备注</p>
            <el-input type="textarea" v-model.trim="data.Remark" resize="none"></el-input>
          </li>-->
        </ul>
        <h5>
          <el-button class="btn120x40">打开摄像头</el-button>
        </h5>
        <div class="content_title">
          <p>包条码</p>
          <p>包名称</p>
          <p>包数量</p>
          <p>不合格原因</p>
          <p>操作</p>
        </div>

        <el-table :data="data.SterilizeFailedPackages" :show-header="false">
          <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
          <el-table-column label="包名称" prop="Name" width="210"></el-table-column>
          <el-table-column label="不合格原因" width="210">
            <template slot-scope="props">
              <el-select v-model="props.row.FailedCause">
                <el-option :label="'指示胶带不合格'" :value="0"></el-option>
                <el-option :label="'湿包'" :value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210">
            <template slot-scope="props">
              <el-button @click="deleteFailedPackage(props.$index,data)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
        <h6>
          <el-button type="primary" @click="addFailedPackage()" class="btn120x40">新增不合格包</el-button>
          <el-button>新增计数包</el-button>
        </h6>
        <div class="tab_content_bottom cssd_table_bottom">
          <el-button @click="cancelChange" class="btn150x40main">取消修改</el-button>
          <el-button @click="submitChangeResult" type="primary" class="btn150x40main">修改完成</el-button>
        </div>
      </div>
      <!-- 手工录入 -->
      <ManualEnter
        v-if="isShowManualEnter"
        @to-father="packageData2father"
        :mode="1"
        :ApiUrl="'/api/Scanner/SterilizeReady'"
        :BarCodeList="data.SterilizeFailedPackages"
      ></ManualEnter>
    </div>
  </div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
  data() {
    return {
      isShowManualEnter: false,
      data: {},
      guideData: {} //参照数据  控制select的disabled
    };
  },
  components: {
    ManualEnter
  },
  created() {
    if (this.$route.query.recordId) {
      axios({
        url: `/api/Sterilize/PendingUpdateSterilizeReviewRecord/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.data = res.data.Data;
            this.guideData = Object.assign({}, res.data.Data);
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        })
        .catch(err => {});
    }
  },
  mounted() {},
  methods: {
    //添加不合格包
    addFailedPackage() {
      this.isShowManualEnter = true;
    },
    //手工录入信息传递
    packageData2father(data) {
      this.isShowManualEnter = false;
      if (data) {
        data.PackageBarCodeScannerVm.FailedCause = 0; //追加一个灭菌失败原因
        this.data.SterilizeFailedPackages.push(data.PackageBarCodeScannerVm);
      }
    },
    //删除不合格包
    deleteFailedPackage(index, data) {
      data.SterilizeFailedPackages.splice(index, 1);
    },
    //质量检测类型change
    reviewClassChange(type) {
      if (type == "BiologicalReviewStatus") {
        this.data.BiologicalReviewStatus = 2;
      }
      if (type == "ChemicalReviewStatus") {
        this.data.BiologicalReviewStatus = this.guideData.BiologicalReviewStatus;
      }
    },
    //灭菌审核记录修改提交
    submitChangeResult() {
      //生物检测不合格
      if (
        this.data.ReviewType == "BiologicalReviewStatus" &&
        this.data.BiologicalReviewStatus == 3
      ) {
        this.$confirm("确认生物检测不合格,并发起一键召回吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push({
              path: "/sterilize/recall",
              query: {
                sterilizeTaskId: this.data.SterilizeTaskId
              }
            });
          })
          .catch(() => {});
      } else {
        //修改完成
        this.data.ReviewResultVm = {
          ReviewType: this.data.ReviewType,
          ReviewResult: this.data[this.data.ReviewType]
        };
        axios({
          url: `/api/Sterilize/SterilizeReviewRecordModify`,
          method: "PUT",
          data: this.data
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              type = "success";
              this.$router.push({ path: "/sterilize/checkRecord" });
            } else {
              type = "error";
            }
            this.showInformation({classify:"message",msg:res.data.Msg,type: type});
          })
          .catch(err => {});
      }
    },
    //取消修改
    cancelChange() {
      this.$router.push({ path: "/sterilize/checkRecord" });
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
#sterilizeCheckRecordChange {
  .tab_content {
    height: 100%;
    overflow-y: scroll;
    padding: 30px 40px;
    box-sizing: border-box;
    ul {
      li {
        float: left;
        line-height: 40px;
        margin: 30px 94px 0 0;
        p {
          float: left;
          text-align: right;
          width: 96px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          color: rgba(135, 141, 159, 1);
          margin-right: 16px;
        }
        span {
          float: left;
          width: 160px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
        .el-select {
          width: 160px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          color: rgba(196, 201, 209, 1);
          .el-input {
            font: inherit;
            input {
              font: inherit;
            }
          }
        }
      }
    }
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
    h5 {
      padding: 40px 0;
      border-bottom: 1px solid #f2f4f7;
      .el-button {
        font-size: 18px;
        font-family: Microsoft YaHei;
        color: rgba(255, 255, 255, 1);
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
    .tab_content_bottom {
      padding-right: 40px;
      justify-content: flex-end;
      align-items: center;
      .el-button--default {
        background: #fff;
        color: rgba(0, 193, 107, 1);
      }
    }
  }
}
</style>