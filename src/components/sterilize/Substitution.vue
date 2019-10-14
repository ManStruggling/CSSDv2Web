<template>
  <div id="substitution">
    <dl>
      <dt>
        <p>代消包数量</p>
        <el-input-number v-model="num" :min="1" :controls="false" @change="handleNumberChange"></el-input-number>
      </dt>
      <dd>
        <el-button class="btn88x32empty" @click="cancel">取消</el-button>
        <el-button type="primary" class="btn88x32" @click="complete">确定</el-button>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 1
    };
  },
  methods: {
    handleNumberChange(newValue, oldValue) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.num = 1;
        }, 0);
      }
    },
    //取消
    cancel(){
        this.$emit("substitution-to-father");
    },
    //确定
    complete(){
        this.$emit("substitution-to-father",this.num);
    }
  }
};
</script>

<style lang="scss">
#substitution {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 2;
  dl {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 246px;
    height: 135px;
    background: #fff;
    border-radius: 8px;
    padding: 20px 30px;
    box-sizing: border-box;
    dt {
      display: flex;
      p {
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: rgba(135, 141, 159, 1);
        line-height: 40px;
        margin: 0 10px;
      }
      .el-input-number {
        width: 60px;
        input {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
    dd {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>