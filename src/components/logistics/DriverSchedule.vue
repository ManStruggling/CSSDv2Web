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
              <el-select v-model="submitData.LogisticsType" class="green24x13">
                <el-option label="回收" :value="0"></el-option>
                <el-option label="发放" :value="1"></el-option>
              </el-select>
            </div>
          </li>
          <li style="width:304px;">
            <p class="font16gray">日期</p>
            <div class="el_input_box" style="width: 230px;">
              <el-date-picker
                v-model="submitData.PlanTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              ></el-date-picker>
            </div>
          </li>
          <li>
            <p class="font16gray">车辆</p>
            <div class="el_input_box">
              <el-select v-model="submitData.LogisticsCarId" class="green24x13">
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
              <el-select v-model="submitData.DriverId" class="green24x13">
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
        <el-table :data="submitData.Locations">
          <el-table-column label="抵达科室" width="240">
            <template slot-scope="props">
              <el-select v-model="props.row.ClinicId" class="green18x10">
                <el-option
                  v-for="(item,index) in data.Locations"
                  :key="index"
                  :label="item.ClinicName"
                  :value="item.ClinicId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210">
            <template slot-scope="props">
              <a class="deleteThisTr" @click="deleteThisTr(props.$index)">删除</a>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
        <h5>
          <el-button type="primary" @click="addSchedule" class="btn120x40">新增路线</el-button>
        </h5>
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
        DriverId: "",
        LogisticsCarId: "",
        PlanTime: "",
        Locations: []
      },
      data: {
        Locations: [],
        Drivers: [],
        Cars: []
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
    // 提交完成
    submitComplete() {
      axios({
        url: `/api/Logistics/DriverScheduleSubmit`,
        method: "Post",
        data: this.submitData
      })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
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
    //新增行程
    addSchedule() {
      this.submitData.Locations.push({ ClinicId: "" });
    },
    //取消修改
    cancelChange() {},
    //删除行程
    deleteThisTr(index) {
      this.$confirm("您确定要删除该行程吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitData.Locations.splice(index, 1);
        })
        .catch(() => {});
    },
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
      max-width: 1400px;
      justify-content: space-between;
      li {
        width: 234px;
        display: flex;
        justify-content: space-between;
        margin: 20px 0 20px 0;
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
    .el-table {
      tbody {
        .el-select {
          width: 160px;
        }
        a {
          color: #f93e3e;
        }
        .cell{
          .el-select{
            .el-input{
              input{
                font-size: 16px;
                font-weight:bold;
                &::-webkit-input-placeholder{
                  font-weight: normal;
                }
              }
            }
          }
        }
      }
    }
    h5{
      margin-top: 30px;
    }
  }
}
</style>