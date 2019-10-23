<template>
  <div class="table_box" id="jubu">
    <div class="madeBySelfBox">
      <p>
        <el-select v-model="selectReportId" class="green18x10">
          <el-option
            v-for="(item,index) in reportList"
            :key="index"
            :label="item.ReportName"
            :value="item.ReportId"
          ></el-option>
        </el-select>
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
        <el-button type="primary" class="btn120x40" @click="creatReport">查询报表</el-button>
      </p>
      <p class="madeBySelfBoxRightP">
        <el-input v-model.trim="searchField" placeholder="输入查询的产品名称"></el-input>
        <el-button class="btn120x40empty" @click="exportData">导出报表</el-button>
        <el-button @click="setpdf">打印</el-button>
      </p>
    </div>
    <el-table 
      :data="tableData.filter(data => !searchField || data.ProductName.toLowerCase().includes(searchField.toLowerCase()))" 
      show-summary 
      row-key="Id" 
      border 
      height="100%"
    >
      <el-table-column
        v-for="(item,index) in columnList"
        :key="index"
        :label="item.DisplayName"
        :prop="dropCol[index].SpliceName"
        :filters="item.FilterArr"
        :filter-method="filterData"
        :column-key="index+''"
        sortable
        :sort-by="dropCol[index].SpliceName"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import toExcel from "@/utils/json2excel";
export default {
  data() {
    return {
      searchField:"",//查询的字串
      search_date: [],//查询的日期
      selectReportId: "",
      reportList: [],//报表列表
      columnList: [],
      dropCol: [],
      tableData: [],//报表数据
      currentReportId: 0  //当前报表的Id
    };
  },
  created() {
    axios("/api/Report")
      .then(res => {
        if (res.data.Code == 200) {
          this.reportList = res.data.Data;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  mounted() {
    this.rowDrop();
    // this.columnDrop();
  },
  methods: {
    //过滤数据method
    filterData(value, row, column) {
      for (let i = 0; i < this.columnList.length; i++) {
        if (this.columnList[i].DisplayName === column.label) {
          return row[this.columnList[i].SpliceName] == value;
        }
      }
    },
    //生成报表
    creatReport() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.selectReportId,
            type: "StringNotEmpty",
            msg: "请选择报表！"
          },
          {
            val: this.search_date,
            type: "ArrayNotEmpty",
            msg: "请选择查询日期！"
          }
        ])
      ) {
        let url = "";
        for (let i = 0; i < this.reportList.length; i++) {
          if (this.selectReportId === this.reportList[i].ReportId) {
            url = this.reportList[i].ReportUrl;
            this.columnList = JSON.parse(
              JSON.stringify(this.reportList[i].Parameters)
            );
            if (this.columnList.length < 6) {
            }
            this.dropCol = JSON.parse(JSON.stringify(this.columnList));
            break;
          }
        }
        axios(
          `${url}&$filter=CreatedTime ge ${
            this.search_date[0]
          } and CreatedTime le ${this.search_date[1]}`
        )
          .then(res => {
            this.currentReportId = this.selectReportId;
            let getData = res.data.value;
            let data = [];
            for (let i = 0; i < getData.length; i++) {
              let temp_obj = {};
              let temp_arr = [];
              // delete getData[i].Products
              for (let j in getData[i]) {
                if (
                  Object.prototype.toString.call(getData[i][j]) ==
                  "[object Array]"
                ) {
                  let returnData = this.collationArrayData(j, getData[i][j]);
                  for (let k = 0; k < returnData.length; k++) {
                    temp_arr.push(returnData[k]);
                  }
                } else if (
                  Object.prototype.toString.call(getData[i][j]) ==
                  "[object Object]"
                ) {
                  //可能是array
                  let returnData = this.collationObjectData(j, getData[i][j]);
                  if (returnData.length == 1) {
                    Object.assign(temp_obj, returnData[0]);
                  } else {
                    for (let k = 0; k < returnData.length; k++) {
                      temp_arr.push(returnData[k]);
                    }
                  }
                } else {
                  if (/Time$/.test(j)) {
                    getData[i][j] =
                      getData[i][j].slice(0, 10) +
                      " " +
                      getData[i][j].slice(11, 19);
                  }
                  temp_obj[j] = getData[i][j];
                }
              }
              if (temp_arr == "") {
                data.push(temp_obj);
              } else {
                for (let j = 0; j < temp_arr.length; j++) {
                  data.push(Object.assign(temp_arr[j], temp_obj));
                }
              }
            }
            for (let i = 0; i < data.length; i++) {
              data[i].Id = i + 1;
            }
            this.tableData = data;
            //过滤功能数组
            for (let i = 0; i < this.columnList.length; i++) {
              let filterArr = [];
              for (let j = 0; j < this.tableData.length; j++) {
                filterArr.push(
                  this.tableData[j][this.columnList[i].SpliceName]
                );
              }
              this.columnList[i].FilterArr = this.unique(filterArr);
              for (let j = 0; j < this.columnList[i].FilterArr.length; j++) {
                this.columnList[i].FilterArr[j] = {
                  text: this.columnList[i].FilterArr[j],
                  value: this.columnList[i].FilterArr[j]
                };
              }
            }
          })
          .catch(err => {});
      }
    },
    //整理object数据
    collationObjectData(key, data) {
      let tempArr = [];
      let tempObj = {};
      for (let i in data) {
        if (Object.prototype.toString.call(data[i]) == "[object Array]") {
          let returnData = this.collationArrayData(key + i, data[i]);
          for (let j = 0; j < returnData.length; j++) {
            tempArr.push(returnData[j]);
          }
        } else if (
          Object.prototype.toString.call(data[i]) == "[object Object]"
        ) {
          let returnData = this.collationObjectData(key + i, data[i]);
          if (returnData.length == 1) {
            Object.assign(tempObj, returnData[0]);
          } else {
            for (let j = 0; j < returnData.length; j++) {
              tempArr.push(returnData[j]);
            }
          }
        } else {
          if (/Time$/.test(key + i)) {
            data[i] = data[i].slice(0, 10) + " " + data[i].slice(11, 19);
          }
          tempObj[key + i] = data[i];
        }
      }
      if (tempArr == "") {
        tempArr.push(tempObj);
        return tempArr;
      } else {
        for (let i = 0; i < tempArr.length; i++) {
          Object.assign(tempArr[i], tempObj);
        }
        return tempArr;
      }
    },
    //数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    //整理array数据
    collationArrayData(key, data) {
      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
        let returnData = this.collationObjectData(key, data[i]);
        for (let j = 0; j < returnData.length; j++) {
          tempArr.push(returnData[j]);
        }
      }
      return tempArr;
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(
        "#jubu .el-table__body-wrapper tbody"
      );
      Sortable.create(tbody, {
        animation: 180,
        delay: 0,
        onEnd: ({ newIndex, oldIndex }) => {
          const currRow = this.tableData.splice(oldIndex, 1)[0];
          this.tableData.splice(newIndex, 0, currRow);
        }
      });
    },
    //列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector(
        "#jubu .el-table__header-wrapper tr"
      );
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          let oldItem = this.dropCol[evt.oldIndex];
          this.dropCol.splice(evt.oldIndex, 1);
          this.dropCol.splice(evt.newIndex, 0, oldItem);
        }
      });
    },
    //打印pdf文件
    setpdf() {
      let jubuHtml = `<div id="viewEffect"><table class="table table-bordered table-striped text-center" cellpadding="10" cellspacing="10" width="100%"><thead><tr class="tr_th">`;
      this.dropCol.forEach(element => {
        jubuHtml += `<th>${element.DisplayName}</th>`;
      });
      jubuHtml += `</tr></thead><tbody>`;
      jubuHtml += $(".el-table__body-wrapper tbody").html();
      jubuHtml += "</tbody><tfoot>";
      jubuHtml += $(".el-table__footer-wrapper tbody").html();
      jubuHtml += "</tfoot></table></div>";
      window.document.body.innerHTML = jubuHtml;

      window.print();

      function print(id_str) {
        var el = document.getElementById(id_str);
        var iframe = document.createElement("IFRAME");
        var doc = null;
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        doc.write("<div>" + el.innerHTML + "</div>");
        doc.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        if (navigator.userAgent.indexOf("MSIE") > 0) {
          document.body.removeChild(iframe);
        }
      }
      this.$router.go(0);
    },
    exportData() {
      const th = [];
      const filterVal = [];
      this.columnList.forEach(element => {
        th.push(element.DisplayName);
        filterVal.push(element.SpliceName);
      });
      const data = this.tableData.map(v => filterVal.map(k => v[k]));
      let excelName = this.reportList.filter(item => {
        return item.ReportId === this.currentReportId;
      })[0].ReportName;
      const [fileName, fileType, sheetName] = [excelName, "xlsx", "Sheet1"];
      toExcel({ th, data, fileName, fileType, sheetName });
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
#jubu.table_box {
  height: 100%;
  padding: 90px 40px 30px;
  box-sizing: border-box;
  .madeBySelfBox {
    position: absolute;
    left: 280px;
    right: 40px;
    top: 30px;
    padding: 0 0 20px;
    display: flex;
    justify-content: space-between;
    .el-date-editor {
      margin: 0 20px;
      input {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
    .el-select {
      input {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
    .el-button {
      font-size: 18px;
      font-family: Microsoft YaHei;
      color: #fff;
      background: #00c16b;
      border: 0;
      line-height: 40px;
      &.el-button--default {
        background: #fff;
        color: #00c16b;
        border: 1px solid #00c16b;
        width: 120px;
      }
    }
    .madeBySelfBoxRightP{
      display: flex;
      .el-input{
        width: 200px;
        margin-right: 10px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
  }
  .el-table {
    border-color: #aeb2ba;
    &::before,
    &::after {
      background-color: #aeb2ba;
    }
    .el-table__empty-block {
      font-size: 18px;
    }
    thead {
      th {
        background: #f7f8fa;
        border-color: #aeb2ba;
        .cell {
          font-size: 18px;
          color: #878d9f;
        }
      }
    }
    .el-table__body-wrapper {
      tbody {
        tr {
          &:hover {
            td {
              background-color: transparent;
            }
          }
          td {
            border-color: #aeb2ba;
            .cell {
              color: #232e41;
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
    }
    .el-table__footer-wrapper {
      tbody {
        tr {
          td {
            border-color: #aeb2ba;
            .cell {
              color: #878d9f;
              font-size: 18px;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
}
#viewEffect {
  padding: 30px 40px;
  .el-table {
    table {
      border-collapse: collapse;
    }
    thead {
      display: table-header-group;
      .cell {
        display: flex;
        align-items: center;
      }
    }
  }
  table,
  th,
  td {
    border: 1px solid #aeb2ba;
    padding: 5px 0;
    text-align: center;
  }
  .tr_th th {
    background: #f7f8fa;
    text-align: center;
    font-size: 18px;
    font-family: Microsoft YaHei;
    color: #878d9f;
    font-weight: normal;
    padding: 12px 5px;
  }
  tbody {
    td {
      .cell {
        font-size: 18px;
        font-weight: bold;
        font-family: Microsoft YaHei;
        color: #232e41;
      }
    }
  }
  tfoot tr td {
    background-color: #f7f8fa;
    color: #878d9f;
    font-family: Microsoft YaHei;
    font-weight: normal;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #aeb2ba;
  }
  .el-table--border,
  .el-table--group {
    border-left: 1px solid #aeb2ba;
    border-bottom: 1px solid #aeb2ba;
  }
}
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>