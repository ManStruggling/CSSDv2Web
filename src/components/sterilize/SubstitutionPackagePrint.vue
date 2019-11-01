<template>
  <div class="cssd_box" id="substitutionPackagePrint">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/sterilize/select" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right"></div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box table_unExpand">
        <el-table :data="data">
          <el-table-column label="包名称" prop="ProductName" width="240"></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          <s>共计</s>
          <!-- <b>{{countPackageNumber(submitData.PackageBarCodes)}}</b> -->
          <b>3</b>
          <span>包</span>
        </p>
        <p>
          <el-button type="primary" @click="printBarCode">开始打印</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: []
    };
  },
  methods: {
    printBarCode() {
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";
</style>