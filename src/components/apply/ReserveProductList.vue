<template>
  <div class="basic_package_box" id="reserveProductList">
    <div class="package_box">
      <h3>
        <el-select v-model="packageBoxClassSelect" @change="packageClassChange" class="green24x13">
          <el-option label="全部" value="all"></el-option>
          <el-option label="追溯的无菌包" value="追溯的无菌包"></el-option>
          <el-option label="高水平消毒包" value="高水平消毒包"></el-option>
          <el-option label="追溯的辅料包" value="追溯的辅料包"></el-option>
        </el-select>
        <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="packageSearch"></el-input>
      </h3>
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="300"
        width="400"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="ProductName" label="包名称" width="201" class="product_name" sortable :sort-by="'ProductShortCode'" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ProductQuantity" label="数量" sortable :sort-by="'ProductQuantity'">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.ProductQuantity" :min="1" :max="999" :controls="false" size="mini" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,scope.$index)})"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <h4>
        <el-button @click="cancelSend">取消</el-button>
        <el-button type="primary" @click="sendToFather">确定</el-button>
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getUrl:"",
      packageBoxClassSelect: "all", //筛选类别
      searchShortCode: "", //简码搜索字段
      list: [], //显示的包列表
      multipleSelection: [],
    };
  },
  props:["cssdId"],
  created() {
    axios({url:`/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成'`,headers:{CssdId:this.$props.cssdId}}).then(res=>{
      this.list = res.data.value;
    }).catch(err=>{})
  },
  methods: {
    //el-input-number change 事件
    handleNumberChange(newValue,oldValue,index){
      if(newValue==undefined){
        setTimeout(() => {
          this.list[index].ProductQuantity = 1;
        }, 0);
      }
    },
    //确认事件
    sendToFather() {
      this.$emit("productList-to-father",this.multipleSelection);
    },
    //取消事件
    cancelSend() {
      this.$emit("productList-to-father", false);
    },
    //点击当前行选择数据
    handleRowClick(row){
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    //搜索事件
    packageSearch() {
      //code
      let url;
      url = `/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成' and (contains(ProductShortCode,${"'" +this.searchShortCode +"'"}) or  contains(ProductName,${"'" +this.searchShortCode +"'"}))`
        axios({url:url,headers:{CssdId:this.$props.cssdId}}).then(res=>{
          this.list =res.data.value;
        }).catch(err=>{})
      
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKeys(row) {
      return row.ProductId;
    },
    //类别选择change 请求 
    packageClassChange() {
      this.getUrl = this.packageBoxClassSelect=="all"?`/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成`:`/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成' and type eq ${encodeURI("'" + this.packageBoxClassSelect + "'")}`;
      this.getPackagesData(this.getUrl);
    },
    getPackagesData(url) {
      axios({url:url,headers:{CssdId:this.$props.cssdId}})
        .then(res => {
          this.list = res.data.value;
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/packageList";
#reserveProductList{
  .package_box{
    width:440px;
    h3{
      >.el-input{
        width: 210px;
      }
    }
  }
}
</style>