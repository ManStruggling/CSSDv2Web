<template>
  <div id="carrier_list">
    <div class="carrier_box">
      <div class="container table_collapse table_unExpand">
        <div class="content_title">
          <p style="width:50px;">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            ></el-checkbox>
          </p>
          <p>网篮名称</p>
          <p>网篮条码</p>
        </div>
        <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
          <el-collapse accordion>
            <el-collapse-item
              v-for="(value,collapseIndex) in carrierList"
              :key="collapseIndex"
              :name="collapseIndex+''"
            >
              <div slot="title" class="collapseTh">
                <div class="collapseTd" style="width:90px;">
                  <div class="checkDiv">
                    <el-checkbox :label="value.BarCode">{{""}}</el-checkbox>
                  </div>
                </div>
                <div class="collapseTd">
                  <p>{{value.Name}}</p>
                </div>
                <div class="collapseTd">
                  <p>{{value.BarCode}}</p>
                </div>
              </div>
              <el-table :data="value.PackageBarCodeDetailList">
                <el-table-column width="130"></el-table-column>
                <el-table-column label="所属科室" prop="ProvideSubClinicName" width="210"></el-table-column>
                <el-table-column label="包名称" prop="Name" width="210" show-overflow-tooltip></el-table-column>
                <el-table-column label="包数量" prop="Quantity" width="100"></el-table-column>
                <el-table-column></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-checkbox-group>
      </div>
      <div class="carrier_box_b">
        <el-button @click="cancelSubmit" class="btn88x32empty">取消</el-button>
        <el-button type="primary" @click="saveSubmit" class="btn88x32">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      checkList: [],
      carrierList: [],
      checkAll: false,
      isIndeterminate: false
    };
  },
  created() {
    this.carrierList = this.$props.data;
  },
  mounted() {},
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        this.checkList = [];
        this.carrierList.forEach(element => {
          this.checkList.push(element.BarCode);
        });
      } else {
        this.checkList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.carrierList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.carrierList.length;
    },
    //取消事件
    cancelSubmit() {
      this.$emit("cleanFailed-to-father", "");
    },
    //确定事件
    saveSubmit() {
      this.$emit("cleanFailed-to-father", this.checkList);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";
#carrier_list {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 2;
  .carrier_box {
    width: 760px;
    height: 600px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: #fff;
    padding:60px 0 92px;
    box-sizing: border-box;
    border-radius: 8px;
    .container {
      height: 100%;
      overflow-y: scroll;
      .content_title{
        border-radius: 8px 8px 0 0;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        margin: auto;
        height:60px;
      }
      .el-collapse {
        .el-collapse-item {
          &.is-active {
            .el-checkbox {
              .el-checkbox__input.is-checked {
                .el-checkbox__inner {
                  background: #fff;
                  &::after {
                    border-color: #00c16b;
                  }
                }
              }
            }
          }
        }
        .checkDiv {
          line-height: 64px;
        }
      }
    }
    .carrier_box_b {
      border-radius: 0 0 8px 8px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      text-align: center;
      height: 92px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      .el-button--default {
        margin-right: 15px;
      }
      .el-button--primary {
        margin-left: 15px;
      }
    }
    // #app .el-checkbox__input.is-checked .el-checkbox__inner
  }
}
</style>