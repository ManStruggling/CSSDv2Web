<template>
  <div id="editBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>原因名称</p>
            <el-input type="text" placeholder="原因名称(必填)" v-model.trim="editBoxData.Name"></el-input>
          </li>
          <li>
            <p>原因岗位</p>
            <el-select class="green24x13" v-model="editBoxData.CauseType">
              <el-option label="清洗" :value="0"></el-option>
              <el-option label="配包" :value="1"></el-option>
              <el-option label="灭菌" :value="2"></el-option>
            </el-select>
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
    //取消
    editBoxCancelSave() {
      this.$emit("to-father", "");
    },
    //保存
    editBoxSave() {
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
            msg: "名称不能为空！"
          },
          {
            val: this.editBoxData.CauseType,
            type: "StringNotEmpty",
            msg: "原因岗位不能为空！"
          }
        ])
      ) {
        axios({
          url: "/api/FailedCause",
          method: axiosMethod,
          data: this.editBoxData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              //操作成功
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
