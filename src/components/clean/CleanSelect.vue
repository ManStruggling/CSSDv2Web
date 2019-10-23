<template>
  <!-- 清洗设备选择
        倒计时：设备状态为1使用中并且剩余时间>0 为设备绑定一个定时器，页面销毁前清除定时器
        设备状态：0 -- 待使用   1 -- 使用中   2 -- 异常
        传参：路由传参设备Id、程序Id
   -->
  <div class="cssd_box deviceSelect">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li>
          <router-link to="/" tag="p">返回</router-link>
        </li>
        <li>
          <router-link to="/clean/record" tag="p">清洗记录</router-link>
        </li>
      </ul>
      <span></span>
    </div>
    <div class="device_select_container">
      <ul>
        <li v-for="(item,index) in deviceList" :key="index">
          <div class="device_box">
            <dl class="clear_float">
              <dt>
                <h3>{{item.Name}}</h3>
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
              <dd v-if="item.CleanDeviceType===0 && item.Status!=2?true:false">
                <div class="deviceTimebox clear_float">
                  <b>{{timeFormatDuring(item.CurrentTime)}}</b>
                  <el-button @click="resetDeviceTime(index)" :disabled="item.Status==0?true:false" class="resetTImeBtn"></el-button>
                </div>
              </dd>
              <dd class="clear_float" v-if="item.CleanDeviceType===0 && item.Status==2?true:false">
                <div class="deviceTimebox clear_float">
                  <b class="progError">程序出错</b>
                  <el-button @click="resetDeviceStatus(index)" class="resetTImeBtn"></el-button>
                </div>
              </dd>
            </dl>
            <ol class="clear_float">
              <li
                v-for="(val,idx) in item.CleanPrograms"
                :key="idx"
              >
                <el-button
                  :disabled="item.CleanDeviceType===1||item.Status==0?false:true"
                  @click="selectProgram(index,idx)"
                >{{val.Name}}</el-button>
              </li>
            </ol>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceList: []
    };
  },
  created() {
    axios({ url: `/api/Clean/CleanDevices` })
      .then(res => {
        if (res.data.Code == 200) {
          this.deviceList = res.data.Data;
          //开启计时器do countdown
          this.deviceList.forEach((val, index) => {
            if (val.CleanDeviceType===0&&val.CurrentTime > 0) {
              val["Countdown" + index] = setInterval(() => {
                val.CurrentTime--;
                if (val.CurrentTime <= 0) {
                  clearInterval(val["Countdown" + index]);
                  this.$router.go(0);
                }
              }, 1000);
            }
          });
        } else {
          this.showInformation({classify:"message",msg:res.data.Msg});
        }
      })
      .catch(err => {});
  },
  mounted() {},
  methods: {
    //选择程序
    selectProgram(index, idx) {
      this.$router.push({
        path: "/clean/registration",
        query: {
          deviceName: this.deviceList[index].Name,
          deviceId: this.deviceList[index].Id,
          programName: this.deviceList[index].CleanPrograms[idx].Name,
          programId: this.deviceList[index].CleanPrograms[idx].Id
        }
      });
    },
    beforeDestroy() {
      //清除计时器
      this.deviceList.forEach((val, index) => {
        clearInterval(val["Countdown" + index]);
      });
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
            type="success";
            this.$router.go(0);
          } else {
            type="error";
          }
          this.showInformation({classify:"message",msg:res.data.Msg,type: type});
        })
        .catch(err => {});
    }
  },
  computed: {
    timeFormatDuring(){
      return timeSeconds=>{
        var hours = parseInt((timeSeconds % (60 * 60 * 24)) / (60 * 60));
        var minutes = parseInt((timeSeconds % (60 * 60)) / (60));
        var seconds = timeSeconds % 60;
        hours = hours < 10 ? ('0' + hours) : hours;
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        return hours + ":" + minutes + ":" + seconds;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdDeviceSelect";
</style>