<template>
  <!-- 包装弹窗 -->
  <div id="editBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>包装名称</p>
            <el-input type="text" placeholder="包装名称(必填)" v-model.trim="editBoxData.Name"></el-input>
          </li>
          <li>
            <p>有效期天数</p>
            <el-input-number
              v-model="editBoxData.ValidDays"
              :min="1"
              :controls="false"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'ValidDays')})"
            ></el-input-number>
          </li>
          <li>
            <p>恶劣天气有效期天数</p>
            <el-input-number
              v-model="editBoxData.ValidDaysOnBadWeather"
              :min="1"
              :controls="false"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'ValidDaysOnBadWeather')})"
            ></el-input-number>
          </li>
        </ul>
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
      editBoxData: {}
    };
  },
  created() {
    this.editBoxData = this.$props.data;
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
      //before submit must to do： 数据转换 表单验证;
      let axiosMethod = "";
      if (this.editBoxData.Id == 0) {
        //新增模式
        axiosMethod = "post";
      } else {
        //更新模式
        axiosMethod = "put";
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.editBoxData.Name,
            type: "StringNotEmpty",
            msg: "包装名称不能为空！"
          }
        ])
      ) {
        axios({
          url: "/api/BasicInformation/ExternalPackage",
          method: axiosMethod,
          data: this.editBoxData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              //请求成功
              type = "success";
              this.$emit("to-father", res.data.Data);
            } else {
              //其他状态码
              type = "error";
            }
            this.showInformation({
              classify: "message",
              msg: res.data.Msg,
              type: type
            });
          })
          .catch(error => {});
      }
    }
  }
};
</script>