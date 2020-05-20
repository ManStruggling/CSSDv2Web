<template>
  <div class="cssd_box" id="systemConfigure">
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box">
        <ul>
          <li>
            <p>重置锅次时间</p>
            <el-time-picker
              :editable="false"
              :clearable="false"
              v-model="setData.ResetDeviceBatchTime"
              :value-format="'HH:mm'"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
                format:'HH:mm'
              }"
            ></el-time-picker>
          </li>
          <li>
            <p>提前预警天数</p>
            <el-input-number
              v-model="setData.EarlyWarningDay"
              :min="1"
              :controls="false"
              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'EarlyWarningDay')})"
            ></el-input-number>
          </li>
          <li>
            <p>启用计数包</p>
            <div class="switch_box">
              <el-switch
                v-model="setData.IsActiveNotBarCodeProduct"
                active-color="#01BF6A"
                inactive-color="#dbdde6"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </div>
          </li>
          <li>
            <p>启用个数包</p>
            <div class="switch_box">
              <el-switch
                v-model="setData.IsActiveNumberProduct"
                active-color="#01BF6A"
                inactive-color="#dbdde6"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </div>
          </li>
          <li>
            <p>启用任务通知</p>
            <div class="switch_box">
              <el-switch
                v-model="setData.IsActiveNewTaskNotification"
                active-color="#01BF6A"
                inactive-color="#dbdde6"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </div>
          </li>
          <li>
            <p>打印回收清单</p>
            <div class="switch_box">
              <el-switch
                v-model="setData.IsPrintRecycleList"
                active-color="#01BF6A"
                inactive-color="#dbdde6"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </div>
          </li>
          <li>
            <p>代销包控制</p>
            <el-select v-model="setData.IsProxyProductPrintBarCode" class="green24x13">
              <el-option label="打印条码" :value="true"></el-option>
              <el-option label="计算数量" :value="false"></el-option>
            </el-select>
          </li>
          <li>
            <p>灭菌包数阈值</p>
            <el-input-number
              v-model="setData.SterilizeDeviceMaxScanAmount"
              :min="0"
              :controls="false"
              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'SterilizeDeviceMaxScanAmount')})"
            ></el-input-number>
          </li>
          <li>
            <p>软件名称</p>
            <el-input v-model.trim="setData.Company.Name"></el-input>
          </li>
        </ul>
        <ul>
          <li>
            <p>模板额外字段</p>
            <div class="switch_box">
              <el-switch
                v-model="setData.PackageBarCoreExternalString.IsActive"
                active-color="#01BF6A"
                inactive-color="#dbdde6"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </div>
          </li>
          <li v-show="setData.PackageBarCoreExternalString.IsActive">
            <p>清洗人</p>
            <el-input v-model.trim="setData.PackageBarCoreExternalString.Cleaner"></el-input>
          </li>
          <li v-show="setData.PackageBarCoreExternalString.IsActive">
            <p>灭菌人</p>
            <el-input v-model.trim="setData.PackageBarCoreExternalString.Sterilizer"></el-input>
          </li>
        </ul>
        <ul>
          <li>
            <p>每周生物检测</p>
            <div class="switch_box">
              <el-switch
                v-model="setData.ForceEveryWeeksSomedayBiologicalReview.IsActive"
                active-color="#01BF6A"
                inactive-color="#dbdde6"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </div>
          </li>
          <li v-show="setData.ForceEveryWeeksSomedayBiologicalReview.IsActive">
            <p>生物检测日期</p>
            <el-select
              v-model="setData.ForceEveryWeeksSomedayBiologicalReview.Day"
              class="green24x13"
            >
              <el-option label="星期天" :value="0"></el-option>
              <el-option label="星期一" :value="1"></el-option>
              <el-option label="星期二" :value="2"></el-option>
              <el-option label="星期三" :value="3"></el-option>
              <el-option label="星期四" :value="4"></el-option>
              <el-option label="星期五" :value="5"></el-option>
              <el-option label="星期六" :value="6"></el-option>
            </el-select>
          </li>
        </ul>
        <ul>
          <li class="img_upload">
            <p>公司Logo</p>
            <div class="img_box">
              <img :src="setData.Company.Logo" />
              <el-upload
                action
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleFileChange"
                :multiple="false"
                :limit="1"
                accept=".jpg, .jpeg, .png"
                :on-exceed="handleFileExceed"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </li>
        </ul>
      </div>
      <div class="cssd_table_bottom">
        <p>
          <el-button type="primary" round @click="submitComplete">保存</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
export default {
  data() {
    return {
      setData: {
        ResetDeviceBatchTime: "00:00",
        EarlyWarningDay: 7,
        SterilizeDeviceMaxScanAmount: 0,
        IsActiveNotBarCodeProduct: false,
        IsActiveNumberProduct: false,
        IsActiveNewTaskNotification: false,
        IsPrintRecycleList: false,
        IsProxyProductPrintBarCode: true,
        PackageBarCoreExternalString: {
          IsActive: false,
          Cleaner: "",
          Sterilizer: ""
        },
        ForceEveryWeeksSomedayBiologicalReview: {
          IsActive: false,
          Day: ""
        },
        Company: {
          Name: "",
          Logo: ""
        }
      }
    };
  },
  created() {
    this.UserInfo.test123 = 43;
    axios({
      url: `/api/Configuration`
    })
      .then(res => {
        if (res.data.Code == 200) {
          if (!res.data.Data.PackageBarCoreExternalString) {
            Object.assign(res.data.Data, {
              PackageBarCoreExternalString: {
                IsActive: false,
                Cleaner: "",
                Sterilizer: ""
              }
            });
          }
          if (!res.data.Data.ForceEveryWeeksSomedayBiologicalReview) {
            Object.assign(res.data.Data, {
              ForceEveryWeeksSomedayBiologicalReview: {
                IsActive: false,
                Day: ""
              }
            });
          }
          this.setData = res.data.Data;
        } else {
          this.showInformation({
            classify: "message",
            msg: res.data.Msg
          });
        }
      })
      .catch(err => {});
  },
  methods: {
    //文件超过限制
    handleFileExceed(files, fileList) {
      this.handleFileReader(files[0]);
    },
    //文件状态change
    handleFileChange(file, fileList) {
      this.handleFileReader(file.raw);
    },
    //读取文件
    handleFileReader(file) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.setData.Company.Logo = fileReader.result;
      };
    },
    //提交
    submitComplete() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.setData.Company.Name,
            type: "StringNotEmpty",
            msg: "软件名称不能为空！"
          },
          {
            val: this.setData.Company.Logo,
            type: "StringNotEmpty",
            msg: "公司logo未上传！"
          }
        ])
      ) {
        axios({
          url: `/api/Configuration`,
          method: "POST",
          data: this.setData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              type = "success";
              this.UserInfo.Configuration = this.setData;
              store.dispatch("UserInfo", this.UserInfo);
              sessionStorage.userInfo = JSON.stringify(this.UserInfo);
              window.UserInfo = JSON.parse(JSON.stringify(this.UserInfo));
              window.location.href = "/management/configure";
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
    handleNumberChange(newValue, oldValue, origin) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.setData[origin] = oldValue;
        }, 0);
      }
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
@import "../../assets/css/tableTotalBottomBar";

#systemConfigure {
  position: static;
  height: 100%;
  padding-top: 0;

  .cssd_table_center {
    .table_box {
      height: 100%;
      padding: 30px 40px;
      box-sizing: border-box;
      overflow-y: scroll;

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          display: flex;
          justify-content: space-between;
          margin-right: 120px;
          width: 266px;
          margin-bottom: 20px;

          &.img_upload {
            width: 400px;

            .img_box {
              display: flex;
              width: 300px;
              justify-content: space-between;

              img {
                width: 140px;
                height: 140px;
              }

              .el-upload-list {
                display: none;
              }

              .el-upload {
                width: 140px;
                height: 140px;
              }
            }
          }

          p {
            font-size: 16px;
            font-family: Microsoft YaHei;
            color: rgba(135, 141, 159, 1);
            line-height: 40px;
            width: 96px;
            text-align: right;
          }

          .el-date-editor,
          .el-input-number {
            width: 160px;
          }

          input {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }

          .switch_box {
            width: 160px;
            display: flex;
            align-items: center;
          }

          .el-select,
          .el-input {
            width: 160px;
          }
        }
      }
    }

    .cssd_table_bottom {
      justify-content: flex-end;
    }
  }
}
</style>
