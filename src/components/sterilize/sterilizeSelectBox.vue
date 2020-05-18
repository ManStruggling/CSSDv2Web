<template>
  <div class="device_select_box" @click.self="cancelSelect">
    <ul>
      <li v-for="(item,index) in deviceList" :key="index">
        <div class="device_box">
          <dl class="clear_float">
            <dt>
              <el-tooltip
                :content="item.SterilizeDeviceName"
                placement="top-start"
                :disabled="item.SterilizeDeviceName.length<10"
              >
                <h3 class="beyondHiding">{{item.SterilizeDeviceName}}</h3>
              </el-tooltip>
              <div class="devicePot clear_float">
                <p>
                  <span>总锅次:</span>
                  <u>{{item.SterilizeTotalBatch}}</u>
                </p>
                <p>
                  <span>当日锅次:</span>
                  <u>{{item.SterilizeTodayBatch}}</u>
                </p>
              </div>
            </dt>
            <dd v-if="item.Status!=2?true:false">
              <div class="deviceTimebox clear_float">
                <b>{{GLOBAL.timeFormatDuring(item.CurrentTime)}}</b>
                <el-button
                  @click="resetDeviceTime(index)"
                  :disabled="item.Status==0?true:false"
                  class="resetTImeBtn"
                ></el-button>
              </div>
            </dd>
            <!-- 待使用 = 0, 使用中 = 1, 设备异常 = 2 -->
            <dd class="clear_float" v-if="item.Status==2?true:false">
              <div class="deviceTimebox clear_float" style="float:right;">
                <b class="progError">程序出错</b>
                <el-button @click="resetDeviceStatus(index)" class="resetTImeBtn"></el-button>
              </div>
            </dd>
          </dl>
          <ol class="clear_float">
            <li v-for="(val,idx) in item.SterilizePrograms" :key="idx">
              <el-button
                :disabled="(!mode&&item.Status!=0)||DeviceType!=item.DeviceType"
                :class="$route.query.deviceId==item.SterilizeDeviceId&&$route.query.programId==val.ProgramId?'is-selected':''"
                @click="selectProgram(index,idx)"
              >{{val.IsDbTestProgram?`${val.ProgramName}(BD测试程序)`:val.ProgramName}}</el-button>
            </li>
          </ol>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  props: ["mode", "DeviceType"],
  data() {
    return {
      deviceList: []
    };
  },
  created() {
    axios({
      url: `/api/Sterilize/SterilizeDevices`
    })
      .then(res => {
        if (res.data.Code == 200) {
          this.deviceList = res.data.Data;
          //开启计时器do countdown
          this.deviceList.forEach((val, index) => {
            if (val.CurrentTime > 0) {
              val["Countdown" + index] = setInterval(() => {
                val.CurrentTime--;
                if (val.CurrentTime <= 0) {
                  clearInterval(val["Countdown" + index]);
                }
              }, 1000);
            }
          });
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
    this.deviceList.forEach((val, index) => {
      clearInterval(val["Countdown" + index]);
    });
  },
  methods: {
    //选择程序
    selectProgram(index, idx) {
      this.$emit("to-father", {
        DeviceModelName: this.deviceList[index].SterilizeDeviceName,
        DeviceId: this.deviceList[index].SterilizeDeviceId,
        DeviceModelProgramName: this.deviceList[index].SterilizePrograms[idx]
          .ProgramName,
        DeviceProgramId: this.deviceList[index].SterilizePrograms[idx]
          .ProgramId,
        IsDbTestProgram: this.deviceList[index].SterilizePrograms[idx]
          .IsDbTestProgram,
        DeviceType: this.deviceList[index].DeviceType
      });
    },
    //重置设备状态
    resetDeviceStatus(index) {
      this.deviceList[index].Status = 0;
    },
    //取消选择
    cancelSelect() {
      this.$emit("to-father", "");
    },
    //归零
    resetDeviceTime(index) {
      axios({
        url: `/api/Sterilize/ReturnDeviceTimeToZero/${this.deviceList[index].SterilizeDeviceId}`
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
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/deviceSelectBox";
</style>
