<template>
  <div id="lookFailedPackages">
    <div class="container table_unExpand">
      <el-table :data="data" height="385">
        <el-table-column label="包条码" prop="PackageBarCode" width="240"></el-table-column>
        <el-table-column label="包名称" prop="ProductName" width="210"></el-table-column>
        <el-table-column label="包数量" prop="ProductQuantity" width="210"></el-table-column>
        <el-table-column label="不合格原因" prop="Cause" width="210"></el-table-column>
        <el-table-column></el-table-column>
      </el-table>
      <span class="closeFailedPackages" @click="close"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["look_id"],
  data() {
    return {
        data:[]
    };
  },
  created() {
    axios({ url: `/api/Sterilize/FailedPackage/${this.$props.look_id}` }).then(
      res => {
        if (res.data.Code == 200) {
            this.data = res.data.Data;
        } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
        }
      }
    );
  },
  methods: {
      close(){
          this.$emit("to-father");
      }
  },
};
</script>

<style lang="scss">
@import "../../assets/css/tableUnExpand";
#lookFailedPackages {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  .container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: #fff;
    width: 950px;
    height: 400px;
    border-radius: 8px;
    .el-table{
        border-radius: 8px 8px 0 0;
    }
    .closeFailedPackages{
        position: absolute;
        right: -13px;
        top: -15px;
        width: 30px;
        height: 30px;
        background: url("../../assets/images/close_green.png");
        cursor: pointer;
    }
  }
}
</style>