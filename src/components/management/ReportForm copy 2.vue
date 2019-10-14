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
        <!-- <el-table
            :data="dataList"
            
          >
              <el-table-column
                v-for="(item,index) in columnList"
                :key="index"
                :label="item.label"
                :prop="item.prop"
              ></el-table-column>
        </el-table>-->
        <el-table :data="tableData" border row-key="Id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="PackageDateTime" label="配包日期" sortable></el-table-column>
          <el-table-column prop="PackageTaskBarCode" label="配包编号" sortable></el-table-column>
          <el-table-column prop="ProductName" label="包名称"></el-table-column>
          <el-table-column prop="BarCode" label="包条码"></el-table-column>
          <el-table-column prop="PackageStatus" label="包状态"></el-table-column>
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
      columnList: [],
      tableData: [
        // {
        //   Id: 1,
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   Id: 2,
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1517 弄"
        // },
        // {
        //   Id: 3,
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   test: {},
        //   address: "上海市普陀区金沙江路 1519 弄",
        //   children: [
        //     {
        //       Id: 31,
        //       //   date: "2016-05-01",
        //       //   name: "王小虎",
        //       //   address: "上海市普陀区金沙江路 1519 弄",
        //       test: "test"
        //     },
        //     {
        //       Id: 32,
        //       name: "tetst",
        //       //   date: "2016-05-01",
        //       //   name: "王小虎",
        //       //   address: "上海市普陀区金沙江路 1519 弄"
        //       test: "test",
        //       obj: {
        //         origin: "1234"
        //       }
        //     }
        //   ]
        // },
        // {
        //   Id: 4,
        //   date: "2016-05-03",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1516 弄"
        // }
      ]
    };
  },
  mounted() {
    axios({
      url: `/odata/SterilizeTask?$expand=products($expand=product($select=name,ClearingPrice),ProvideSubClinic($select=name)),operator($select=name),chemistryreviewer($select=name),cssd($select=name)`
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
              temp_obj.children = this.collationArrayData(
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
      })
      .catch(err => {});
  },
  methods: {
    collationObjectData(key, data, Id) {
      let tempObj = {};
      for (let i in data) {
        if (Object.prototype.toString.call(data[i]) == "[object Array]") {
          tempObj.children = this.collationArrayData(
            data[i],
            Id + "" + data.Id - 0
          );
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
    collationArrayData(data, Id) {
      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
        tempArr.push(this.collationObjectData("", data[i], Id));
      }
      return tempArr;
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