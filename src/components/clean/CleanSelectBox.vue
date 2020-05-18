<template>
  <div class="device_select_box" @click.self="cancelSelect">
    <ul>
      <li v-for="(item,index) in deviceList" :key="index">
        <div class="device_box">
          <dl class="clear_float">
            <dt>
              <el-tooltip
                :content="item.Name"
                placement="top-start"
                :disabled="item.Name.length<10"
              >
                <h3 class="beyondHiding">{{item.Name}}</h3>
              </el-tooltip>
              <div class="devicePot clear_float">
                <p>
                  <span>总锅次：</span>
                  <u>{{item.CleanTotalBatch}}</u>
                </p>
                <p>
                  <span>当日锅次：</span>
                  <u>{{item.CleanBatch}}</u>
                </p>
              </div>
            </dt>
            <dd v-if="item.DeviceType===0&&item.Status!=2?true:false">
              <div class="deviceTimebox clear_float">
                <b>{{GLOBAL.timeFormatDuring(item.CurrentTime)}}</b>
                <el-button
                  @click="resetDeviceTime(index)"
                  class="resetTImeBtn"
                  :disabled="item.Status==0?true:false"
                ></el-button>
              </div>
            </dd>
            <!-- 待使用 = 0, 使用中 = 1, 设备异常 = 2 -->
            <dd class="clear_float" v-if="item.DeviceType===0&&item.Status==2?true:false">
              <div class="deviceTimebox clear_float">
                <b class="progError">程序出错</b>
                <el-button @click="resetDeviceStatus(index)" class="resetTImeBtn"></el-button>
              </div>
            </dd>
          </dl>
          <ol class="clear_float">
            <li v-for="(val,idx) in item.CleanPrograms" :key="idx">
              <el-button
                :disabled="item.Status==0||item.DeviceType===1||(mode&&OriginDeviceId==item.Id)?false:true"
                :class="$route.query.deviceId==item.Id&&$route.query.programId==val.Id?'is-selected':''"
                @click="selectProgram(index,idx)"
              >{{val.Name}}</el-button>
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
  props: ["mode", "OriginDeviceId"],
  data() {
    return {
      last_select_device_id: 0,
      last_select_program_id: 0,
      deviceList: []
    };
  },
  created() {
    axios({
      url: `/api/Clean/CleanDevices`
    })
      .then(res => {
        if (res.data.Code == 200) {
          this.deviceList = res.data.Data;
          //开启计时器do countdown
          this.deviceList.forEach((val, index) => {
            if (val.DeviceType === 0 && val.CurrentTime > 0) {
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
        DeviceName: this.deviceList[index].Name,
        DeviceId: this.deviceList[index].Id,
        ProgramName: this.deviceList[index].CleanPrograms[idx].Name,
        ProgramId: this.deviceList[index].CleanPrograms[idx].Id
      });
    },
    //取消选择
    cancelSelect() {
      this.$emit("to-father", "");
    },
    //重置设备状态
    resetDeviceStatus(index) {
      this.deviceList[index].Status = 0;
    },
    resetDeviceTime(index) {
      axios({
        url: `/api/Clean/ReturnDeviceTimeToZero/${this.deviceList[index].Id}`
      })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            this.reload();
          } else {
            type = "error";
          }
          this.$message({
            message: res.data.Msg,
            type: type,
            center: true,
            duration: 500
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
