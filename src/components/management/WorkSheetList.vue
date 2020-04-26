<template>
  <!-- 排班列表组件 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p></p>
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增班表</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table :data="table_data">
        <el-table-column label="班表名称" prop="name" width="240"></el-table-column>
        <el-table-column label="班表月份" prop="yearMonth" width="210"></el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="props">
            <a class="change_this_tr" @click.stop="editThisTr(props.$index)">编辑</a>
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
      <SchedulingWorkSheet
        v-if="showEditBox"
        @to-father="child2father"
        :viewModule="toChildData"
        :scheduledWorks="table_data"
        :UserInfo="UserInfo"
      ></SchedulingWorkSheet>
    </transition>
  </div>
</template>

<script>
import SchedulingWorkSheet from "./SchedulingWorkSheet";
export default {
  props: {
    UserInfo: Object
  },
  data() {
    return {
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildData: {}
    };
  },
  components: {
    SchedulingWorkSheet
  },
  created() {
    axios({
      url: `/schedule`,
      method: "POST",
      data: {
        operationName: "getSchedules",
        query: ` query getSchedules{ 
                    schedule(locationId:${this.UserInfo.ClinicId}){
                        id,name,yearMonth
                    }
                }`,
        variables: {}
      }
    })
      .then(res => {
        this.table_data = res.data.data.schedule;
      })
      .catch(err => {});
  },
  mounted() {},
  methods: {
    //新增
    addTableTr() {
      this.toChildData = {};
      this.showEditBox = true;
    },
    //编辑
    editThisTr(index) {
      var that = this;
      axios({
        url: `/system`,
        method: "POST",
        data: {
          query: ` query storedEvent{ 
                        storedEvent(aggregateId:${this.table_data[index].id},aggregate:"Schedule",getLast:1){
                            id,commandViewData
                        }
                    }`
        }
      })
        .then(res => {
          that.toChildData =
            res.data.data.storedEvent[res.data.data.storedEvent.length - 1];
          that.toChildData.id = this.table_data[index].id;
          that.showEditBox = true;
        })
        .catch(err => {});
    },
    //子组件传递数据
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
