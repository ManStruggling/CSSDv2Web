<template>
  <div class="basic_main" id="workLoad">
    <div class="content">
      <div class="title">
        <p>
          <el-select
            class="green24x13"
            v-model="selectedStaff"
            filterable
            @change="filteredStaffChange"
          >
            <el-option label="全部人员" :value="0"></el-option>
            <el-option
              v-for="(item,index) in staffs"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
        <p>
          <el-date-picker
            v-model="search_date"
            type="daterange"
            align="right"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="GLOBAL.pickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-button type="primary" @click="searchWorkLoad" class="btn120x40">查询</el-button>
        </p>
      </div>
      <el-table :data="workLoadList" border :height="tableHeight">
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name" width="120"></el-table-column>
        <el-table-column label="回收" prop="recycleWorkLoad" width="120" sortable></el-table-column>
        <el-table-column label="清洗" prop="cleanWorkLoad" width="120" sortable></el-table-column>
        <el-table-column label="配包" prop="packageWorkLoad" width="120" sortable></el-table-column>
        <el-table-column label="灭菌" prop="sterilizeWorkLoad" width="120" sortable></el-table-column>
        <el-table-column label="发放" prop="provideWorkLoad" width="120" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { MessagePack } from "assert";
import { decode } from "@msgpack/msgpack";
export default {
  inject: ["managementReload"],
  props: {
    UserInfo: Object
  },
  data() {
    return {
      tableHeight: window.innerHeight - 165,
      selectedStaff: 0,
      staffs: [],
      workLoadList: [],
      totalData: [],
      search_date: []
    };
  },
  created() {
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date, date];
    axios({
      url: `/basic`,
      method: "POST",
      data: {
        query: `query getStaffs{
                        staff(clinicId:${this.UserInfo.ClinicId}){
                            id,name
                        }
                    }`
      }
    })
      .then(res => {
        this.staffs = res.data.data.staff;
      })
      .catch(err => {});
  },
  methods: {
    //查询工作量
    searchWorkLoad() {
      this.selectedStaff = 0;
      axios({
        url: "/report",
        method: "POST",
        data: {
          query: `query getWorkLoad{
                                workLoad(startYearMonth:"${this.search_date[0]}",endYearMonth:"${this.search_date[1]}"){
                                    id,name,recycleWorkLoad,cleanWorkLoad,packageWorkLoad,sterilizeWorkLoad,provideWorkLoad
                                }
                            }`
        }
      })
        .then(res => {
          this.totalData = res.data.data.workLoad;
          this.workLoadList = JSON.parse(JSON.stringify(this.totalData));
        })
        .catch(err => {});
    },
    filteredStaffChange(val) {
      if (val) {
        this.workLoadList = this.totalData.filter(item => {
          return item.id == val;
        });
      } else {
        this.workLoadList = JSON.parse(JSON.stringify(this.totalData));
      }
    }
  },
  computed: {}
};
</script>

<style lang="scss">
.schedulePopper {
  ol {
    li {
      display: flex;

      span {
        width: 90px;
        font-size: 16px;
        color: #878d9f;
        text-align: right;
      }

      b {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
  }
}

#workLoad {
  position: relative;
  padding: 30px 0;
  overflow-y: hidden;

  .content {
    overflow-y: auto;
    height: 100%;
    padding: 0 40px;

    .title {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .el-select {
        width: 160px;

        input {
          font-weight: bold;
          font-size: 16px;
          color: #333;
        }
      }

      .el-date-editor {
        border-color: #c4c9d1;

        &:hover {
          border-color: #c4c9d1;
        }

        input {
          font-weight: bold;
          font-size: 16px;
          color: #333;
        }

        .el-range-separator {
          color: #878d9f;
          font-size: 16px;
          font-family: Microsoft Yahei;
        }
      }

      .el-button--primary {
        margin-left: 20px;
      }

      p {
        > span {
          font-size: 18px;
          color: #878d9f;
          line-height: 40px;
          margin-right: 10px;
        }
      }
    }

    .el-table {
      cursor: pointer;
      width: 801px;

      thead {
        th {
          font-size: 18px;
          color: #878d9f;

          text-align: center;
        }
      }

      tbody {
        tr {
          &:hover {
            td {
              background-color: transparent;
            }
          }

          &.hover-row > td {
            background-color: transparent;
          }

          td {
            padding: 0;

            .cell {
              text-align: center;
              padding: 0;
              user-select: none;
              white-space: nowrap;
              user-select: none;
              height: 40px;
              line-height: 40px;
              color: #232e41;
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
    }

    p.remark {
      font-size: 14px;
      color: #878d9f;
      padding: 10px 0;
      line-height: 20px;
    }
  }
}
</style>
