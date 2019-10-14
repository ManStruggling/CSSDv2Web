<template>
  <div id="barCodeList">
    <div class="barCode_box">
      <div class="container">
        <el-table
          ref="multipleTable"
          :data="dataList"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          height="508"
          :row-key="getRowKeys"
        >
          <el-table-column type="selection" width="130" :reserve-selection="true"></el-table-column>
          <el-table-column 
            v-for="(item,index) in $props.labels"
            :key="index"
            :label="item.label"
            :prop="item.prop"
          ></el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="barCode_box_b">
        <el-button @click="cancelSubmit" class="btn88x32empty">取消</el-button>
        <el-button type="primary" @click="saveSubmit" class="btn88x32">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data","labels","printUrl"],
  data() {
    return {
      checkList: [],
      dataList: []
    };
  },
  created() {
    CSManager.handleDataThis = this;
    this.dataList = this.$props.data.slice(0);
  },
  mounted() {},
  methods: {
    getRowKeys(row) {
      return row.Id;
    },
    handleSelectionChange(val) {
      this.checkList = val;
    },
    //取消事件
    cancelSubmit() {
      this.$emit("printList-to-father");
    },
    //确定事件
    saveSubmit() {
      if (this.GLOBAL.VerificationHandle([{val: this.checkList,type: "ArrayNotEmpty",msg: "至少选择一个打印条码！"}])) {
        axios({url:`${this.$props.printUrl}`,data:this.checkList,method:"POST"}).then(res=>{
          if(res.data.Code==200){
            CSManager.PrintBarcode(JSON.stringify(res.data.Data)); 
            this.$emit("printList-to-father");
          }else{
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        }).catch(err=>{})
      }
    }
  }
};
</script>

<style lang="scss">
#barCodeList {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 2;
  .barCode_box {
    width: 760px;
    height: 600px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: #fff;
    padding-bottom: 92px;
    box-sizing: border-box;
    border-radius: 8px;
    .container {
      height: 100%;
      overflow: hidden;
      .el-table {
        border-radius: 8px 8px 0 0;
        .el-checkbox__inner {
          width: 16px;
          height: 16px;
        }
        .cell {
          padding: 0;
        }
        th {
          background: #f7f8fa;
          font-size: 18px;
          font-family: Microsoft YaHei;
          color: rgba(135, 141, 159, 1);
          height: 60px;
          &:nth-child(1) {
            .cell {
              padding-left: 40px;
            }
          }
        }
        tbody {
          td {
            height: auto;
          }
          .cell {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(35, 46, 65, 1);
            line-height: 64px;
          }
          tr {
            td {
                &:nth-child(1) {
                    padding-left: 40px;
                }
            }
          }
        }
      }
    }
    .barCode_box_b {
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
      .el-button--default {
        margin-right: 15px;
      }
      .el-button--primary {
        margin-left: 15px;
      }
    }
  }
}
</style>