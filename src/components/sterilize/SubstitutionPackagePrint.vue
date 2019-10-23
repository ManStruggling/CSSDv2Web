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
        <!-- <el-table :data="submitData.PackageBarCodes">
          <el-table-column label="包名称" prop="ProductName" width="240"></el-table-column>
          <el-table-column label="包条码" prop="BarCode" width="210"></el-table-column>
          <el-table-column label="科室" prop="ProvideSubClinicName" width="210"></el-table-column>
          <el-table-column label="包数量" width="210">
            <template slot-scope="props">
              <el-input-number
                v-if="props.row.IsNotPrintBarCode"
                v-model="props.row.ProductQuantity"
                :min="1"
                :max="props.row.MaximumQuantity"
                size="mini"
                :controls="false"
                @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"
              ></el-input-number>
              <div v-if="!props.row.IsNotPrintBarCode">{{props.row.ProductQuantity}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210">
            <template slot-scope="props">
              <el-button @click="deletePackage(props.$index,props.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>-->
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
@import "../../assets/css/tableUnExpand";
</style>