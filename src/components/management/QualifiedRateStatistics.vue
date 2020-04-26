<template>
  <div class="basic_main" id="qualifiedRate">
    <div class="content">
      <div class="title">
        <p>
          <el-select
            class="green24x13"
            v-model="reportType"
            filterable
            @change="filteredTypeChange"
          >
            <el-option :value="0" label="清洗合格率"></el-option>
            <el-option :value="1" label="配包合格率"></el-option>
            <el-option :value="2" label="灭菌合格率"></el-option>
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
          <el-button type="primary" @click="searchQualifiedRate" class="btn120x40">查询</el-button>
        </p>
      </div>
      <el-table :data="dataList" border :height="tableHeight">
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column label="姓名" prop="who" width="120"></el-table-column>
        <el-table-column label="地点" prop="where" width="120"></el-table-column>
        <el-table-column label="总数" prop="totalCount" width="120" sortable></el-table-column>
        <el-table-column label="合格数" prop="passCount" width="120" sortable></el-table-column>
        <el-table-column label="不合格数" prop="failedCount" width="120" sortable></el-table-column>
        <el-table-column label="合格率" prop="passRate" width="120" sortable></el-table-column>
        <!-- <el-table-column label="报表类型" width="120" sortable>
          <template slot-scope="props">{{props.row.passRateReportType===0?"清洗合格率":(props.row.passRateReportType===1?"配包合格率":"灭菌合格率")}}</template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["managementReload"],
  props: {
    UserInfo: Object
  },
  data() {
    return {
      tableHeight: window.innerHeight - 165,
      reportType: null,
      dataList: [],
      totalData: [],
      search_date: []
    };
  },
  created() {
    let date = this.GLOBAL.GetNowDate();
    this.search_date = [date, date];
  },
  methods: {
    //查询合格率
    searchQualifiedRate() {
      if (this.reportType != null) {
        axios({
          url: "/passratereport",
          method: "POST",
          data: {
            query: `query getPassRate {
                      passRate(type:${this.reportType},startYearMonth:"${this.search_date[0]}",endYearMonth:"${this.search_date[1]}") {
                        id,passCount,failedCount,passRate,passRateReportType,totalCount,who,where
                      }
                    }`
          }
        })
          .then(res => {
            this.totalData = res.data.data.passRate;
            this.dataList = JSON.parse(JSON.stringify(this.totalData));
          })
          .catch(err => {});
      } else {
        this.showInformation({
          classify: "message",
          msg: "请选择报表类型"
        });
      }
    },
    filteredTypeChange(val) {
      if (val) {
        this.dataList = this.totalData.filter(item => {
          return item.id == val;
        });
      } else {
        this.dataList = JSON.parse(JSON.stringify(this.totalData));
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

#qualifiedRate {
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
