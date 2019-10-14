<template>
  <!--
    主体
    编辑弹出框
    交互 显示对象详情
    新增tr
    删除this tr
    编辑this tr
    取消编辑
    保存编辑
    editBox 添加程序
    editBox 删除程序
  -->
  <!-- 主体 -->
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
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增供应商</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table
        :data="table_data"
      >
        <el-table-column label="供应商名称" prop="Name" width="240"></el-table-column>
        <el-table-column label="传真" prop="FaxNumber" width="210">
          <template slot-scope="props">
            {{props.row.FaxNumber==""?"-":props.row.FaxNumber}}
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="ContactPerson" width="210">
          <template slot-scope="props">
            {{props.row.ContactPerson==""?"-":props.row.ContactPerson}}
          </template>
        </el-table-column>
        <el-table-column label="联系人号码" prop="ContactNumber" width="210">
          <template slot-scope="props">
            {{props.row.ContactNumber==""?"-":props.row.ContactNumber}}
          </template>
        </el-table-column>
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
      <SupplierBox v-if="showEditBox" @to-father="child2father" :data="toChildData" :Type="Type"></SupplierBox>
    </transition>
  </div>
</template>
<script>
import SupplierBox from "./SupplierBox";
export default {
  data() {
    return {
      Type: 0, //器械类型
      model: "add",
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildData: {}
    };
  },
  components: {
    SupplierBox
  },
  created() {},
  watch: {
    $route: {
      //路由监听
      handler: function(to, from, next) {
        this.Type = to.params.Type - 0; //获取当前路由参数的Type值
        axios("/api/Supplier/ByType/" + this.Type)
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
    searchThisTableData() {},
    //新增tr
    addTableTr() {
      this.toChildData = {
        SupplierId: 0,
        Name: "",
        FaxNumber: "",
        PhoneNumber: "",
        ContactPerson: "",
        ContactNumber: "",
        Address: "",
        Remark: "", //备注
        Type: this.Type,
        RelatedManufacturerIds: []
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
          axios
            .delete(`/api/Supplier/${this.Type}/${this.table_data[index].SupplierId}`)
            .then(res => {
              let type;
              if(res.data.Code==200){
                type='success';
                this.table_data = res.data.Data;
              }else{
                type = 'error';
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
    //get child data
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