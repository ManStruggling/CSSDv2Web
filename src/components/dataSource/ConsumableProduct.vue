<template>
  <!-- 主体 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p>
        <el-input
          placeholder="搜索"
          class="basic_ipt_search"
          v-model.trim="basic_search"
          @input="searchThisTableData"
        ></el-input>
      </p>
      <p>
        <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增产品</el-button>
      </p>
    </div>
    <div class="basic_table table_unExpand">
      <el-table :data="table_data">
        <el-table-column label="产品名称" prop="Name" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column label="最小规格数" prop="MinimumUnit" width="210" show-overflow-tooltip></el-table-column>
        <el-table-column label="单价" prop="Price" width="210"></el-table-column>
        <el-table-column label="请领代码" prop="ReceiveCode" width="210"></el-table-column>
        <el-table-column label="请领部门" prop="ReceiveDepartment" width="210"></el-table-column>
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
      <ConsumableProductBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></ConsumableProductBox>
    </transition>
  </div>
</template>

<script>
import ConsumableProductBox from "./ConsumableProductBox";
import XLSX from "xlsx";
export default {
  data() {
    return {
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildData: {}
    };
  },
  components: {
    ConsumableProductBox
  },
  created() {
    axios({
      url: `/api/ConsumableProduct`
    })
      .then(res => {
        this.table_data = res.data.Data;
      })
      .catch(err => {});
  },
  mounted() {},
  methods: {
    //新增tr
    addTableTr() {
      this.toChildData = {
        Id: 0,
        Name: "",
        MinimumUnit: 1,
        Price: 1,
        ReceiveDepartmentId: "",
        ReceiveCode: ""
      };
      this.showEditBox = true;
    },
    //删除this tr
    deleteThisTr(index) {
      this.showInformation({
        classify: "confirm",
        msg: "您确定要删除该项?",
        confirmCallBack: () => {
          axios
            .delete(`/api/ConsumableProduct/${this.table_data[index].Id}`, {
              headers: {}
            })
            .then(res => {
              let type;
              if (res.data.Code == 200) {
                type = "success";
                this.table_data = res.data.Data;
              } else {
                type = "error";
              }
              this.showInformation({
                classify: "message",
                msg: res.data.Msg,
                type: type
              });
            })
            .catch(err => {});
        },
        cancelCallBack: () => {}
      });
    },
    //编辑this tr
    editThisTr(index) {
      this.toChildData = Object.assign({}, this.table_data[index]); //深拷贝
      this.showEditBox = true;
    },
    //搜索
    searchThisTableData() {},
    //子组件传递值
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
