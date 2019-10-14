<template>
  <!-- 外包装 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p>
        <!-- <el-input
          type="text"
          placeholder="搜索"
          class="basic_ipt_search"
          v-model.trim="basic_search"
          @input="searchThisTableData"
        ></el-input> -->
      </p>
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增包装</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table
        :data="table_data"
      >
        <el-table-column label="外包装名称" prop="Name" width="240"></el-table-column>
        <el-table-column label="有效期天数" prop="ValidDays" width="210"></el-table-column>
        <el-table-column label="恶劣天气有效期天数" prop="ValidDaysOnBadWeather" width="210"></el-table-column>
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
      <ExternalPackageBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></ExternalPackageBox>
    </transition>
  </div>
</template>
<script>
import ExternalPackageBox from "./ExternalPackageBox";
export default {
  data() {
    return {
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      addNewTrData: {
        Id: 0,
        Name: "",
        ValidDays: 1, //有效期天数
        ValidDaysOnBadWeather: 1 //恶劣天气下的有效期天数
      }, //新添数据结构
      toChildData: {} //传递给子组件的数据
    };
  },
  components: {
    ExternalPackageBox
  },
  created() {
    axios({ url: "/api/BasicInformation/ExternalPackage" })
      .then(res => {
        if (res.data.Code == 200) {
          this.table_data = res.data.Data;
        } else {
          this.showInformation({classify:"message",msg:res.data.Msg});
        }
      })
      .catch(err => {});
  },
  mounted() {},
  methods: {
    searchThisTableData() {},
    //新增tr
    addTableTr() {
      this.toChildData = {
        Id: 0,
        Name: "",
        ValidDays: 1, //有效期天数
        ValidDaysOnBadWeather: 1 //恶劣天气下的有效期天数
      };
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
          //删除接口
          //code
          axios.delete(`/api/BasicInformation/ExternalPackage/${this.table_data[index].Id}`)
            .then(res => {
              let type;
              if(res.data.Code==200){
                type='success';
                this.table_data = res.data.Data
              }else{
                type='error';
              }
              this.showInformation({classify:"message",msg:res.data.Msg,type: type});
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    //编辑this tr
    editThisTr(index) {
      this.toChildData = JSON.parse(JSON.stringify(this.table_data[index])); //深拷贝
      this.showEditBox = true;
    },
    child2father(data) {
      this.showEditBox = false;
      if(data){
        this.table_data = data;
      }
    }
  }
};
</script>