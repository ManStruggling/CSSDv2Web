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
              v-model="setData.DeviceResetTime"
              :value-format="'HH:mm:ss'"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
            ></el-time-picker>
          </li>
          <li>
            <p>提前预警天数</p>
            <el-input-number
              v-model="setData.EarlyWarningDays"
              :min="1"
              :controls="false"
              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'EarlyWarningDays')})"
            ></el-input-number>
          </li>
          <!-- <li>
            <p>开始时间</p>
            <el-date-picker
              v-model="setData.WorkCountStartTime"
              type="datetime"
              :clearable="false"
              value-format="timestamp"
              placeholder="选择日期时间"
            ></el-date-picker>
          </li>
          <li>
            <p>结束时间</p>
            <el-date-picker
              v-model="setData.WorkCountEndTime"
              type="datetime"
              :clearable="false"
              value-format="timestamp"
              placeholder="选择日期时间"
            ></el-date-picker>
          </li>
          <li>
            <p>间隔小时</p>
            <el-input-number
              v-model="setData.WorkIntervalTime"
              :min="1"
              :controls="false"
              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'WorkIntervalTime')})"
            ></el-input-number>
          </li>
          <li>
            <p>

            </p>
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :clearable="false"
              :picker-options="GLOBAL.pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="timestamp"
            >
            </el-date-picker>
          </li> -->
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
export default {
  data() {
    return {
      setData: {
        DeviceResetTime: "",
        EarlyWarningDays: 1,
        WorkCountStartTime: "",
        WorkCountEndTime: "",
        WorkIntervalTime: ""
      },
      // value2:""
    };
  },
  created() {
    axios({ url: `/api/Configuration` })
      .then(res => {
        if (res.data.Code == 200) {
          this.setData = res.data.Data;
          this.setData.WorkCountStartTime *= 1000;
          this.setData.WorkCountEndTime *= 1000;
          this.setData.WorkIntervalTime /= 3600;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  methods: {
    //提交
    submitComplete() {
      this.setData.WorkCountStartTime /= 1000;
      this.setData.WorkCountEndTime /= 1000;
      this.setData.WorkIntervalTime *= 3600;
      axios({
        url: `/api/Configuration`,
        method: "PUT",
        data: this.setData
      })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            res.data.Data.WorkIntervalTime /= 3600;
            this.setData = res.data.Data;
            this.setData.WorkCountStartTime *= 1000;
            this.setData.WorkCountEndTime *= 1000;
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
    handleNumberChange(newValue, oldValue, origin) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.setData[origin] = oldValue;
        }, 0);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
#systemConfigure {
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
        }
      }
    }
    .cssd_table_bottom {
      justify-content: flex-end;
    }
  }
}
</style>