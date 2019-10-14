<template>
  <div class="cssd_box" id="inventory_counting">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>盘库科室</span>
          <el-select v-model="clinicSelected" class="white24x13">
            <el-option label="供应室" value="1"></el-option>
          </el-select>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box"></div>
      <div class="cssd_table_bottom">
        <p>
          <el-button type="primary" round @click="submitComplete">盘库完成</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clinicSelected: ""
    };
  },
  components: {},
  created() {
    CSManager.handleDataThis = this;
  },
  mounted() {
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    //提交完成
    submitComplete() {}
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
#inventory_counting {
  .cssd_title_right {
    p {
      .el-select {
        width: 200px;
        .el-input{
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(208, 212, 218, 1);
          input{
            color: #fff;
          }
        }
      }
    }
  }
  .cssd_table_center {
    overflow: hidden;
    .table_box {
      padding: 40px 20px 40px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;
    }
    .cssd_table_bottom {
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
    }
  }
}
</style>