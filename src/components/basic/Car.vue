<template>
  <!-- 物流车组件 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p>
        <!-- <el-input
          placeholder="搜索"
          class="basic_ipt_search"
          v-model.trim="basic_search"
          @input="searchThisTableData"
        ></el-input> -->
      </p>
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增车</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table
        :data="table_data"
      >
        <el-table-column label="车辆名称" prop="Name" width="240"></el-table-column>
        <el-table-column label="车辆条码编号" prop="BarCode" width="210"></el-table-column>
        <el-table-column label="车牌号" prop="CarNumber" width="210"></el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="props">
            <a class="change_this_tr" @click.stop="editThisTr(props.$index)">编辑</a>
              <a class="delete_this_tr" @click.stop="deleteThisTr(props.$index)">删除</a>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </div>

    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 编辑弹出框 -->
      <CarBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></CarBox>
    </transition>
  </div>
</template>

<script>
import CarBox from "./CarBox";
export default {
  data() {
    return {
      Type: 0, //车辆类型
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildData: {}
    };
  },
  components: {
    CarBox
  },
  created() {},
  watch: {
    $route: {
      //路由监听
      handler: function(to, from, next) {
        this.Type = to.params.Type - 0; //获取当前路由参数的Type值
        axios(`/api/LogisticsCar/${this.Type}`)
          .then(res => {
            if (res.data.Code == 200) {
              this.table_data = res.data.Data;
            } else {
              this.showInformation({classify:"message",msg:res.data.Msg});
            }
          })
          .catch(error => {});
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    //新增
    addTableTr() {
      this.toChildData = {
        Id: 0,
        Name: "",
        BarCode: "",
        CarNumber: "",
        Type: this.Type
      };
      this.showEditBox = true;
    },
    //搜索
    searchThisTableData() {
      
    },
    editThisTr(index){
        this.toChildData = JSON.parse(JSON.stringify(this.table_data[index]));
        this.showEditBox = true;
    },
    deleteThisTr(index){
        this.$confirm("您是否确定删除该项?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
        })
        .then(() => {
          //删除接口
          //code
          axios
            .delete(`/api/LogisticsCar/${this.Type}/${this.table_data[index].Id}`, {
                headers: {}
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.table_data = res.data.Data;
                } else {
                  this.showInformation({classify:"message",msg:res.data.Msg});
                }
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    //子组件传递数据
    child2father(data) {
      this.showEditBox = false;
      if(data){
        this.table_data = data;
      }
    }
  }
};
</script>
