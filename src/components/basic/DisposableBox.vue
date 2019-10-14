<template>
  <!-- 编辑弹出框 -->
  <div id="editBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>名称</p>
            <el-input type="text" placeholder="物品名称(必填)" v-model.trim="editBoxData.Name"></el-input>
          </li>
          <li>
            <p>简码</p>
            <el-input type="text" v-model="editBoxData.ShortCode" :disabled="true"></el-input>
          </li>
          <li>
            <p>规格</p>
            <el-input type="text" placeholder="规格" v-model.trim="editBoxData.Specification"></el-input>
          </li>
          <li>
            <p>成本价格</p>
            <el-input-number
              placeholder="成本价格"
              v-model="editBoxData.CostPrice"
              :min="1"
              :max="99999999"
              :controls="false"
              @change="numberChange"
            ></el-input-number>
          </li>
          <li class="textareaBox">
              <p>备注</p>
              <el-input type="textarea" v-model.trim="editBoxData.Remark" maxlength="20" placeholder="填写备注" show-word-limit></el-input>
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
    numberChange(newValue,oldValue){
      if(newValue==undefined){
        setTimeout(() => {
          this.editBoxData.CostPrice = 1;
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
            msg: "一次性物品名称不能为空！",
          }
        ])
      ) {
        axios({
          url: "/api/Product",
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
