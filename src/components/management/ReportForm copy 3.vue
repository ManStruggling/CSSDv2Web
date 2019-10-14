<template>
  <div class="cssd_box" id="reportForm">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
      <div class="cssd_title_right"></div>
    </div>
    <div class="cssd_table_center">
      <div class="table_box">
        <el-table
          :data="tableData"
          border
          row-key="Id"
          default-expand-all
          @row-click="tableRowClick"
        >
          <div v-for="(item,index) in columnList" :key="index">
            <el-table-column v-if="!item.isArray" :prop="item.prop" :label="item.label" sortable></el-table-column>
            <el-table-column
              v-if="item.isArray"
              :label="item.label"
              :prop="item.prop"
              sortable
              type="expand"
              width="1"
            >
              <template slot-scope="props">
                <el-table
                  v-for="(val,idx) in item.subCols"
                  :key="idx"
                  border
                  :data="props.row[val.prop]"
                >
                  <el-table-column
                    v-for="(subVal,subIdx) in val.arr"
                    :key="subIdx"
                    :prop="subVal.prop"
                    :label="subVal.label"
                    sortable
                  ></el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </div>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      num: 0,
      columnList: [],
      tableData: [],
    };
  },
  mounted() {
    axios({
      url: `/odata/SterilizeTask?$expand=products($expand=product($select=name),ProvideSubClinic($select=name);$select=Product,ProvideSubClinic,Quantity),operator($select=name),chemistryreviewer($select=name),cssd($select=name)&$select=Id,BarCode`
    })
      .then(res => {
        let getData = res.data.value;
        let data = [];
        for (let i = 0; i < getData.length; i++) {
          let temp_obj = {};
          for (let j in getData[i]) {
            if (
              Object.prototype.toString.call(getData[i][j]) == "[object Array]"
            ) {
              temp_obj[j] = this.collationArrayData(
                getData[i][j],
                getData[i].Id
              );
            } else if (
              Object.prototype.toString.call(getData[i][j]) == "[object Object]"
            ) {
              Object.assign(
                temp_obj,
                this.collationObjectData(j, getData[i][j], getData[i].Id)
              );
            } else {
              temp_obj[j] = getData[i][j];
            }
          }
          data.push(temp_obj);
        }
        console.log(data);
        this.tableData = data;
        if (this.tableData.length !== 0) {
          let cols_obj = { isArray: true, subCols: [] };
          for (let i in this.tableData[0]) {
            if (
              Object.prototype.toString.call(this.tableData[0][i]) ==
              "[object Array]"
            ) {
              //pakages
              let temp__arr = [];
              for (let j in this.tableData[0][i][0]) {
                if (j != "Id") {
                  temp__arr.push({ label: this.getLabel(j,"Sterilize"), prop: j });
                }
              }
              cols_obj.subCols.push({
                label: "table",
                prop: i,
                arr: temp__arr
              });
            } else {
              if (i != "Id") {
                this.columnList.push({
                  label: this.getLabel(i,"Sterilize"),
                  prop: i,
                  isArray: false
                });
              }
            }
          }
          this.columnList.push(cols_obj);
        }
      })
      .catch(err => {});
  },
  methods: {
    tableRowClick(row, column, event) {
      $(event.target)
        .parents(".el-table__row")
        .next()
        .toggle();
    },
    //objec整理
    collationObjectData(key, data, Id) {
      let tempObj = {};
      for (let i in data) {
        if (Object.prototype.toString.call(data[i]) == "[object Array]") {
          tempObj[i] = this.collationArrayData(data[i], Id + "" + data.Id - 0);
        } else if (
          Object.prototype.toString.call(data[i]) == "[object Object]"
        ) {
          Object.assign(
            tempObj,
            this.collationObjectData(key + i, data[i], Id + "" + data.Id - 0)
          );
        } else {
          if (i !== "Id") {
            tempObj[key + i] = data[i];
          } else {
            tempObj.Id = Id + "" + data.Id - 0 + 10000;
          }
        }
      }
      return tempObj;
    },
    //array整理
    collationArrayData(data, Id) {
      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
        tempArr.push(this.collationObjectData("", data[i], Id));
      }
      return tempArr;
    },
    getLabel(key,origin){
      let tableLabelDictionary={
        Sterilize: {
          ProductName: "包名称",
          ProductClearingPrice: "产品价格",
          ProvideSubClinicName: "科室名称",
          Quantity: "数量",
          ChemistryReviewerName: "化学检测审核人",
          BiologicalReviewerName: "生物检测审核人",
          OperatorName: "灭菌人",
          SterilizeDeviceName: "灭菌设备",
          SterilizeProgramName: "灭菌程序",
          CssdName: "供应室",
          BarCode: "灭菌条码",
          CreatedTime: "灭菌开始时间",
          OperateEndTime: "灭菌结束时间",
          ChemistryReviewTime: "化学检测审核时间",
          ChemistryReviewResult: "化学检测结果",
          CatheterReviewResult: "管腔检测结果",
          BiologicalTime: "生物检测时间",
          BiologicalReviewResult: "生物检测结果",
          ThisTimeSterilizeQuantity: "本次灭菌包数量",
          SterilizeTotalBatch: "灭菌总锅次",
          SterilizeBatch: "灭菌当日锅次",
          HelpSterilizeQuantity: "代消包数量"
        }
      }
      return tableLabelDictionary[origin][key]?tableLabelDictionary[origin][key]:key;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
#reportForm {
  .cssd_table_center {
    height: 100%;
    .table_box {
      height: 100%;
    }
  }
}
</style>