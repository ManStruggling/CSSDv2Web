<template>
  <!-- 报表组件 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p></p>
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增报表</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table
        :data="table_data"
      >
        <el-table-column label="报表名称" prop="ReportName" width="240"></el-table-column>
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
      <ReportFormBox v-if="showEditBox" @to-father="child2father" :toChildReportId="toChildReportId"></ReportFormBox>
    </transition>
  </div>
</template>
<script>
import ReportFormBox from "./ReportFormBox";
export default {
  data() {
    return {
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildReportId: 0
    };
  },
  components: {
    ReportFormBox
  },
  created() {
    axios({url:`/api/Report`}).then(res=>{
      if(res.data.Code==200){
        this.table_data = res.data.Data;
      }else{
        this.showInformation({classify:"message",msg:res.data.Msg});
      }
    }).catch(err=>{})
  },
  mounted() {},
  methods: {
    //新增
    addTableTr() {
      this.toChildReportId = 0;
      this.showEditBox = true;
    },
    editThisTr(index){
        this.toChildReportId = this.table_data[index].ReportId;
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
          axios
            .delete(`/api/Report/${this.table_data[index].ReportId}`)
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

<style lang="scss">
</style>