<template>
  <!-- 编辑弹出框 -->
  <div id="editBox" class="periodBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>班名称</p>
            <el-input
              type="text"
              placeholder="班名称(必填)"
              v-model.trim="editBoxData.Name"
              @input="getMaxLength"
            ></el-input>
          </li>
          <li>
            <p>颜色</p>
            <el-color-picker v-model="editBoxData.Color" show-alpha></el-color-picker>
          </li>
          <li>
            <p>开始时间</p>
            <el-time-select
              placeholder="起始时间"
              :clearable="false"
              v-model="editBoxData.StartTime"
              :picker-options="{
                            start: '00:00',
                            end: '23:59',
                            step: '00:15',
                            maxTime: editBoxData.EndTime
                        }"
            ></el-time-select>
          </li>
          <li>
            <p>结束时间</p>
            <el-time-select
              placeholder="结束时间"
              :clearable="false"
              v-model="editBoxData.EndTime"
              :picker-options="{
                            start: '00:00',
                            end: '23:59',
                            step: '00:15',
                            minTime: editBoxData.StartTime
                        }"
            ></el-time-select>
          </li>
          <li>
            <p>是否有午餐</p>
            <el-select class="green24x13" v-model="editBoxData.IsIncludeLunch">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
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
    //获取最大长度
    getMaxLength(val) {
      const char = val.match(/[\u2E80-\u9FFF]/g);
      const charLen = char ? char.length : 0;
      const num = val.match(/\d|\./g);
      const numLen = num ? num.length : 0;
      const otherLen = val.length - charLen - numLen;
      let calcLen = charLen * 1.1 + numLen * 0.65 + otherLen * 0.5;
      if (calcLen * 18 > 80) {
        this.editBoxData.Name = val.substring(0, val.length - 1);
      }
    },
    //取消编辑
    editBoxCancelSave() {
      this.$emit("to-father", "");
    },
    //保存编辑
    editBoxSave() {
      //before submit must to do： 数据转换 表单验证;
      let axiosMethod = "post";
      if (this.editBoxData.Id) {
        //更新模式
        axiosMethod = "put";
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.editBoxData.Name,
            type: "StringNotEmpty",
            msg: "班名称不能为空！"
          },
          {
            val: this.editBoxData.StartTime,
            type: "StringNotEmpty",
            msg: "开始时间不能为空！"
          },
          {
            val: this.editBoxData.EndTime,
            type: "StringNotEmpty",
            msg: "结束时间不能为空！"
          }
        ])
      ) {
        axios({
          url: `/api/Period/${this.editBoxData.Type}`,
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

<style lang="scss">
#editBox.periodBox {
  .editContent {
    > ul {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
