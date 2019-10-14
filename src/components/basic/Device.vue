<template>
  <!-- 主体 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p>
        <el-input
          type="text"
          placeholder="搜索"
          class="basic_ipt_search"
          v-model.trim="basic_search"
          @input="searchThisTableData"
        ></el-input>
      </p>
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增设备</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table :data="table_data">
        <el-table-column label="设备名称" prop="Name" width="240"></el-table-column>
        <el-table-column label="简码" prop="ShortCode" width="210"></el-table-column>
        <el-table-column label="设备条码" prop="BarCode" width="210"></el-table-column>
        <el-table-column label="总锅次" prop="TotalBatch" width="210"></el-table-column>
        <el-table-column label="使用状态" prop="IsActive" width="210"></el-table-column>
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
      <DeviceBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></DeviceBox>
    </transition>
  </div>
</template>
<script>
import DeviceBox from "./DeviceBox";
export default {
  data() {
    return {
      Type: 0,
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildData: {}
    };
  },
  components: {
    DeviceBox
  },
  created() {},
  mounted() {},
  watch: {
    $route: {
      //路由监听
      handler: function(to, from, next) {
        this.Type = to.params.Type - 0; //获取当前路由参数的Type值
        axios(`/api/Device/ByType/${this.Type}`)
          .then(res => {
            if (res.data.Code == 200) {
              this.table_data = res.data.Data;
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
            }
          })
          .catch(error => {});
      },
      immediate: true
    }
  },
  methods: {
    searchThisTableData() {
      this.baseDataSearch(
        `/odata/devices?$filter=type eq ${encodeURI(
          "'" + this.GLOBAL.DeviceDictionary[this.Type] + "'"
        )} and (contains(name,${"'" +
          this.basic_search +
          "'"}) or contains(shortcode,${"'" + this.basic_search + "'"}))`
      );
    },
    //新增tr
    addTableTr() {
      this.toChildData = {
        Id: 0,
        Name: "",
        ShortCode: "",
        BarCode: "",
        OwnCssdId: 1,
        TotalBatch: 0, //总锅次
        TodayBatch: 0,
        LastMaintenanceDate: "", //上次维护时间
        Manufacturer: "", //生产商名称
        Supplier: "", //供应商名称
        DeviceModelId: 0, //设备型号id
        ProduceDate: "",
        IsActive: true,
        DevicePrograms: [],
        CleanDeviceType:0, //0 单腔 1长龙 只针对清洗设备
        Type: this.Type
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
          //删除接口 /Device/{type}/{id}
          axios
            .delete(`/api/Device/${this.Type}/${this.table_data[index].Id}`)
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
      if (data) {
        this.table_data = data;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
