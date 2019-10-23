<template>
  <div class="cssd_box" id="driverSchedule">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <router-link to="/logistics/subClinicUsedPackage" tag="li">
          <p>查看已使用包</p>
        </router-link>
        <router-link to="/logistics/driverScheduleRecord" tag="li">
          <p>制定记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right"></div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <ul>
          <li>
            <p class="font16gray">任务类型</p>
            <div class="el_input_box">
              <el-select v-model="submitData.LogisticsType" class="green24x13" placeholder="任务类型(必填)">
                <el-option label="回收" :value="0"></el-option>
                <el-option label="发放" :value="1"></el-option>
              </el-select>
            </div>
          </li>
          <li style="width:304px;">
            <p class="font16gray">开始时间</p>
            <div class="el_input_box" style="width: 230px;">
              <el-date-picker
                v-model="submitData.PlanStartTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间(必填)"
                @change="startTimeChange"
                default-time="06:00:00"
              ></el-date-picker>
            </div>
          </li>
          <li style="width:304px;">
            <p class="font16gray">结束时间</p>
            <div class="el_input_box" style="width: 230px;">
              <el-date-picker
                v-model="submitData.PlanEndTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间(填写)"
                :picker-options="endPickerOptions"
                default-time="06:00:00"
                @change="endTimeChange"
              ></el-date-picker>
            </div>
          </li>
          <li>
            <p class="font16gray">车辆</p>
            <div class="el_input_box">
              <el-select v-model="submitData.LogisticsCarId" class="green24x13" placeholder="车辆(必填)">
                <el-option
                  v-for="(item,index) in data.Cars"
                  :key="index"
                  :label="item.LogisticsCarName"
                  :value="item.LogisticsCarId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <p class="font16gray">司机</p>
            <div class="el_input_box">
              <el-select v-model="submitData.DriverId" class="green24x13" placeholder="司机(必填)" @change="driverChange">
                <el-option
                  v-for="(item,index) in data.Drivers"
                  :key="index"
                  :label="item.DriverName"
                  :value="item.DriverId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <p class="font16gray">副手</p>
            <div class="el_input_box">
              <el-select v-model="submitData.HelperId" class="green24x13" placeholder="副手(必填)" @change="helperChange">
                <el-option
                  v-for="(item,index) in data.Drivers"
                  :key="index"
                  :label="item.DriverName"
                  :value="item.DriverId"
                ></el-option>
              </el-select>
            </div>
          </li>
        </ul>
      </div>
      <div class="cssd_table_bottom">
        <p></p>
        <p>
          <!-- <el-button @click="cancelChange">取消修改</el-button> -->
          <el-button type="primary" @click="submitComplete">制定完成</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitData: {
        LogisticsType: "",
        PlanStartTime:"",
        PlanEndTime:"",
        LogisticsCarId: "",
        DriverId: "",
        HelperId:""
      },
      data: {
        Drivers: [],
        Cars: []
      },
      endPickerOptions:{
        disabledDate: (time) => {
          if(this.submitData.PlanStartTime === ""){
            return false;
          }else{
            return time.getTime() < new Date(this.submitData.PlanStartTime.split(" ")[0]+' 00:00:00');
          }
        }
      }
    };
  },
  created() {
    axios("/api/Logistics/DriverScheduleInitialVm")
      .then(res => {
        if (res.data.Code == 200) {
          this.data = res.data.Data;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  methods: {
    //开始时间change
    startTimeChange(val) {
      if(val > this.submitData.PlanEndTime) {
        this.submitData.PlanEndTime = "";
      }
    },
    //结束时间change
    endTimeChange(val){
      if(val < this.submitData.PlanStartTime){
        this.submitData.PlanEndTime = "";
      }
    },
    //司机change
    driverChange(val) {
      if(this.submitData.HelperId === val) {
        this.submitData.DriverId = '';
        this.showInformation({ classify: "message", msg: "司机和副手不能相同！"});
      }
    },
    //副手change
    helperChange(val) {
      if(this.submitData.DriverId === val) {
        this.submitData.HelperId = '';
        this.showInformation({ classify: "message", msg: "司机和副手不能相同！"});
      }
    },
    // 提交完成
    submitComplete() {
      if(this.GLOBAL.VerificationHandle([
        {val:this.submitData.LogisticsType,type:"StringNotEmpty",msg:"任务类型不能为空！"},{val:this.submitData.PlanStartTime,type:"StringNotEmpty",msg:"开始时间不能为空！"},{val:this.submitData.PlanEndTime,type:"StringNotEmpty",msg:"结束时间不能为空！"},{val:this.submitData.LogisticsCarId,type:"StringNotEmpty",msg:"车辆不能为空！"},{val:this.submitData.DriverId,type:"StringNotEmpty",msg:"司机不能为空！"},{val:this.submitData.HelperId,type:"StringNotEmpty",msg:"副手不能为空！"}
      ])){
        axios({
          url: `/api/Logistics/DriverScheduleSubmit`,
          method: "Post",
          data: this.submitData
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
    //取消修改
    cancelChange() {},
    goBack() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";
#driverSchedule {
  .table_box {
    width: 100%;
    height: 100%;
    padding: 30px 40px;
    box-sizing: border-box;
    overflow-y: scroll;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 234px;
        display: flex;
        justify-content: space-between;
        margin: 20px 20px 20px 0;
        p {
          width: 64px;
          line-height: 40px;
          text-align: right;
        }
        .el_input_box {
          width: 160px;
          line-height: 40px;
          .el-date-editor {
            width: 100%;
          }
          .el-date-editor{
            width: 230px;
          }
          .el-input__inner {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            &::-webkit-input-placeholder {
              font-size: 16px;
              font-family: Microsoft YaHei;
              color: rgba(196, 201, 209, 1);
              font-weight: normal;
              color: #c4c9d1;
            }
          }
        }
      }
    }
  }
}
</style>