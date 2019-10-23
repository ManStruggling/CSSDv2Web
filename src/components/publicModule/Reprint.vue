<template>
  <div class="cssd_box" id="reprint">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/sterilize/select" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right"></div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box"></div>
      <div class="cssd_table_bottom">
        <p></p>
        <p>
          <el-button type="primary" @click="printBarCode">保存并打印</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    printBarCode() {}
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
</style>