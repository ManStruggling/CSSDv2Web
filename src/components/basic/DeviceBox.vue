<template>
  <!-- 编辑弹出框 -->
  <div id="editBox" class="deviceBox_editBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>设备名称</p>
            <el-input type="text" placeholder="设备名称(必填)" v-model.trim="editBoxData.Name" maxlength="10"></el-input>
          </li>
          <li>
            <p>设备简码</p>
            <el-input type="text" v-model="editBoxData.ShortCode" :disabled="editBoxData.Id==0"></el-input>
          </li>
          <li>
            <p>设备条码</p>
            <el-input type="text" v-model="editBoxData.BarCode" :disabled="true"></el-input>
          </li>
          <li>
            <p>生产日期</p>
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="editBoxData.ProduceDate"
              type="date"
              placeholder="选择日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </li>
          <li>
            <p>所属供应室</p>
            <el-select v-model="editBoxData.OwnCssdId" placeholder="请选择" class="green24x13">
              <el-option
                v-for="item in opetionCssdList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <p>总锅次</p>
            <el-input-number
              v-model="editBoxData.TotalBatch"
              :min="1"
              :max="1000000"
              :controls="false"
              label="总锅次"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'TotalBatch')})"
            ></el-input-number>
          </li>
          <li>
            <p>当日锅次</p>
            <el-input-number
              v-model="editBoxData.TodayBatch"
              :min="1"
              :max="100"
              :controls="false"
              label="当日锅次"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'TodayBatch')})"
            ></el-input-number>
          </li>
          <li>
            <p>上次维护日期</p>
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="editBoxData.LastMaintenanceDate"
              type="date"
              placeholder="选择日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </li>
          <li>
            <p>选择设备型号</p>
            <el-cascader
              expand-trigger="hover"
              :options="optionList"
              v-model="selectedOptions"
              @change="handleChange"
              placeholder="设备型号(必选)"
              class="green24x13"
            ></el-cascader>
          </li>
          <li>
            <p>是否启用</p>
            <el-select v-model="editBoxData.IsActive" placeholder="请选择" class="green24x13">
              <el-option :label="'是'" :value="true"></el-option>
              <el-option :label="'否'" :value="false"></el-option>
            </el-select>
          </li>
          <li v-if="editBoxData.Type===1">
            <p>设备类型</p>
            <el-select v-model="editBoxData.CleanDeviceType" class="green24x13">
              <el-option label="单腔" :value="0"></el-option>
              <el-option label="长龙" :value="1"></el-option>
            </el-select>
          </li>
        </ul>
        <dl>
          <dt>
            <p>程序名称</p>
            <p>程序运作时长（分钟）</p>
          </dt>
          <dd v-for="(item,index) in editBoxData.DevicePrograms" :key="index">
            <p>{{item.Name}}</p>
            <p>{{item.Duration}}</p>
          </dd>
        </dl>
      </div>

      <div class="editBoxOption">
        <el-button @click="editBoxCancelSave">取消</el-button>
        <el-button type="primary" @click="editBoxSave">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      editBoxData: {},
      optionList: [], //供应商、生产商、设备型号关联表
      selectedOptions: [], //关联选择的数据
      opetionCssdList: [], //供应室List
      DeviceModelProgramList: [] //设备程序字典
    };
  },
  created() {
    this.editBoxData = this.$props.data;
    if (this.editBoxData.Id == 0) {
      this.editBoxData.ProduceDate = this.GLOBAL.GetNowDate();
      this.editBoxData.LastMaintenanceDate = this.editBoxData.ProduceDate;
    }
    this.selectedOptions[0] = this.editBoxData.Supplier;
    this.selectedOptions[1] = this.editBoxData.Manufacturer;
    this.selectedOptions[2] = this.editBoxData.DeviceModelId;
    axios(`/api/Device/DeviceDetail`)
    .then(res => {
      if (res.data.Code == 200) {
        //success
        this.opetionCssdList = res.data.Data.CssdComponentVms;
        this.optionList = res.data.Data.CascadeSelectorComponentVms;
        this.DeviceModelProgramList =
          res.data.Data.DictionaryDeviceModelProgram;
        this.getDeviceProgramsData();
      } else {
        //faild
        this.showInformation({classify:"message",msg:res.data.Msg});
      }
    })
    .catch(err => {
      //失败
    });
  },

  methods: {
    //el-input-number change 事件
    numberChange(newValue, oldValue, origin) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.editBoxData[origin] = 1;
        }, 0);
      }
    },
    //取消编辑
    editBoxCancelSave() {
      this.$emit("to-father", "");
    },
    //保存编辑
    editBoxSave() {
      //before submit must to do: 数据转换 表单验证;
      let axiosMethod = "";
      if (this.editBoxData.Id == 0) {
        //新增模式
        axiosMethod = "post";
      } else {
        //更新模式
        axiosMethod = "put";
      }
      if (this.GLOBAL.VerificationHandle([
          {
            val: this.editBoxData.Name,
            type: "StringNotEmpty",
            msg: "设备名称不能为空！"
          },
          {
            val: this.editBoxData.DeviceModelId,
            type: "NumberNotZero",
            msg: "您还没哟选择设备型号！请选择设备型号！"
          }
      ])) {
        axios({
          url: "/api/Device",
          method: axiosMethod,
          data: this.editBoxData
        })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            this.$emit("to-father", res.data.Data);
          } else {
            type = "error";
          }
          this.showInformation({classify:"message",msg:res.data.Msg,type: type});
        })
        .catch(error => {});
      }
    },
    //设备型号选择改变触发事件
    handleChange() {
      this.editBoxData.Supplier = this.selectedOptions[0] + "";
      this.editBoxData.Manufacturer = this.selectedOptions[1] + "";
      this.editBoxData.DeviceModelId = this.selectedOptions[2];

      this.getDeviceProgramsData();
    },
    getDeviceProgramsData() {
      this.editBoxData.DevicePrograms = [];
      this.DeviceModelProgramList[this.editBoxData.DeviceModelId].forEach(
        item => {
          this.editBoxData.DevicePrograms.push({
            Name: item.Name,
            Duration: item.Duration
          });
        }
      );
    }
  }
};
</script>

<style lang="scss">
#editBox.deviceBox_editBox {
  ul{
    border-bottom: 1px solid #F2F4F7;
  }
  dl {
    margin: 30px 0 30px 30px;
    dt {
      display: flex;
      p {
        width: 160px;
        margin-right: 50px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        color: rgba(135, 141, 159, 1);
        line-height: 24px;
        &:nth-child(2){
          width: 200px;
        }
      }
    }
    dd {
      margin-top: 20px;
      display: flex;
      p {
        width: 160px;
        margin-right: 50px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        color: rgba(35, 46, 65, 1);
        line-height: 24px;
      }
    }
  }
}
</style>
