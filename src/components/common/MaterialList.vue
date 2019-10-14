<template>
  <div class="basic_instrument" id="basic_material">
    <div class="instrument_box">
      <h3>
        <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="materialSearch"></el-input>
      </h3>
      <el-table
        ref="multipleTable"
        :data="materialList"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="300"
        width="400"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="Name" label="名称" width="120"></el-table-column>
        <el-table-column prop="Specification" label="规格" width="80"></el-table-column>
        <el-table-column prop="Quantity" label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.Quantity" :min="1" :max="999" :controls="false" @change="((newValue,oldValue)=>{handleCountNumberPackage(newValue,oldValue,scope.$index)})"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <h4>
        <el-button type="primary" @click="cancelSend" class="btn88x32empty">取消</el-button>
        <el-button type="primary" @click="sendToFather" class="btn88x32">确定</el-button>
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchShortCode: "", //简码搜索字段
      materialList: [], //显示的器械列表
      multipleSelection: []
    };
  },
  methods: {
    //点击当前行选择数据
    handleRowClick(row){
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleCountNumberPackage(newValue,oldValue,index){
      if(newValue==undefined){
        setTimeout(() => {
          this.materialList[index].Quantity = 1;
        }, 0);
      }
    },
    //确认事件
    sendToFather() {
      this.$emit("to-father", this.multipleSelection);
    },
    //取消事件
    cancelSend() {
      this.$emit("to-father", false);
    },
    //搜索事件
    materialSearch() {
      //code
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKeys(row) {
      return row.Id;
    },
    getMaterialsData(url) {
      axios(url)
        .then(res => {
          res.data.value.forEach(item => {
            item.Quantity = 1;
          });
          this.materialList = res.data.value;
        })
        .catch(err => {
          //error
        });
    }
  },
  created() {
    this.getMaterialsData(`/odata/productmaterials`);
  }
};
</script>

<style lang="scss" scoped>
.basic_instrument {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 3;
  .instrument_box {
    background: #fff;
    width: 420px;
    height: 441px;
    box-shadow:0px 0px 10px 0px rgba(51,62,80,0.2);
    border-radius:8px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    box-sizing: border-box;
    padding: 20px 30px 30px;
    h3 {
      display: flex;
    }
    .el-table {
      height: 300px;
      overflow-y: scroll;
      th{
        .cell{
          font-size:14px;
          font-family:Microsoft YaHei;
          color:rgba(135,141,159,1);
        }
      }
      td{
        .cell{
          font-size:18px;
          font-family:Microsoft YaHei;
          font-weight:bold;
          color:rgba(35,46,65,1);
          .el-input-number{
            width: 60px;
            input{
               font-size:18px;
              font-family:Microsoft YaHei;
              font-weight:bold;
              color:rgba(35,46,65,1);
              padding: 0;
            }
          }
        }
      }
    }
    h4 {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>