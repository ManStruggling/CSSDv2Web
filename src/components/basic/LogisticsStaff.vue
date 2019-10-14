<template>
  <!-- 物流人员 -->
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
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增物流人员</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table
        :data="table_data"
      >
        <el-table-column label="员工姓名" prop="StaffName" width="240"></el-table-column>
        <el-table-column label="员工工号" prop="StaffJobNumber" width="210"></el-table-column>
        <el-table-column label="员工条码编号" prop="StaffBarCode" width="210"></el-table-column>
        <el-table-column label="登录密码" prop="Password" width="210"></el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="props">
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
      <LogisticsStaffBox v-if="showEditBox" @to-father="child2father"></LogisticsStaffBox>
    </transition>
  </div>
</template>
<script>
import LogisticsStaffBox from "./LogisticsStaffBox";
export default {
  data() {
    return {
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
    };
  },
  components: {
    LogisticsStaffBox
  },
  created() {
    axios({ url: `/api/Logistics/Drivers` })
    .then(res => {
        if(res.data.Code==200){
            this.table_data = res.data.Data;
        }else{
          this.showInformation({classify:"message",msg:res.data.Msg});
        }
    })
    .catch(err => {});
  },
  mounted() {},
  methods: {
    searchThisTableData() {
    //   this.baseDataSearch(
    //     `/odata/ProductMaterials?$filter=contains(name,${"'" +
    //       this.basic_search +
    //       "'"})`
    //   );
    },
    //新增tr
    addTableTr() {
      this.showEditBox = true;
    },
    //删除this tr
    deleteThisTr(index) {
      this.$confirm("您是否确定删除该项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
        //   删除接口
        //   code
          axios
            .delete(
              `/api/Logistics/CancelDriverOfStaff/${this.table_data[index].StaffId}`)
            .then(res => {
              let type;
              if (res.data.Code == 200) {
                type='success';
                this.table_data = res.data.Data;
              } else {
                type="error";
              }
              this.showInformation({classify:"message",msg:res.data.Msg,type: type});
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    child2father(data) {
      this.showEditBox = false;
      if (data) {
        this.table_data = data;
      }
    }
  }
};
</script>

<style lang="scss">
</style>