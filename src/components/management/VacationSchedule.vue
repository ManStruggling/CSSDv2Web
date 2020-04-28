<template>
  <!-- 节假日班表组件 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p></p>
      <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增班表</el-button>
    </div>
    <div class="basic_table table_unExpand">
      <el-table :data="table_data">
        <el-table-column label="班表名称" prop="name" width="240"></el-table-column>
        <el-table-column label="起止日期" prop="startEndDate" width="240"></el-table-column>
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
      <VacationScheduleBox
        v-if="showEditBox"
        @to-father="child2father"
        :viewModule="toChildData"
        :scheduledWorks="table_data"
        :UserInfo="UserInfo"
      ></VacationScheduleBox>
    </transition>
  </div>
</template>

<script>
import VacationScheduleBox from "./VacationScheduleBox";
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
    VacationScheduleBox
  },
  created() {
    axios({
      url: `/schedule`,
      method: "POST",
      data: {
        query: `query getVacationSchedules{
                    vacationSchedule(locationId:${this.UserInfo.ClinicId}){
                        id,name,startEndDate
                    }
                }`
      }
    })
      .then(res => {
        this.table_data = res.data.data.vacationSchedule;
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
                        storedEvent(aggregateId:${this.table_data[index].id},aggregate:"VacationSchedule",getLast:1){
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
