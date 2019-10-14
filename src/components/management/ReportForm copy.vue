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
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="Id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="test" label="test"></el-table-column>
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
        {
          Id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          Id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          Id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          children: [
            {
              Id: 31,
            //   date: "2016-05-01",
            //   name: "王小虎",
            //   address: "上海市普陀区金沙江路 1519 弄",
              test:'test'
            },
            {
              Id: 32,
              name:"children",
            //   date: "2016-05-01",
            //   name: "王小虎",
            //   address: "上海市普陀区金沙江路 1519 弄"
            test:"test2"
            }
          ]
        },
        {
          Id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  mounted() {
    axios({
      url: `/odata/PackageTaskReceives?$expand=packages($expand=product)`
    })
      .then(res => {
        let getData = res.data.value;
        let data = [];
        console.log(new Date().getTime());
        for (let i = 0; i < getData.length; i++) {
          let temp_obj = {};
          let temp_arr = [];
          for (let j in getData[i]) {
            if (
              Object.prototype.toString.call(getData[i][j]) == "[object Array]"
            ) {
              let returnData = this.collationArrayData(j, getData[i][j]);
              for (let k = 0; k < returnData.length; k++) {
                temp_arr.push(returnData[k]);
              }
            } else if (
              Object.prototype.toString.call(getData[i][j]) == "[object Object]"
            ) {
              //可能是array
              let returnData = this.collationObjectData(j, getData[i][j]);
              for (let k = 0; k < returnData.length; k++) {
                temp_arr.push(returnData[k]);
              }
            } else {
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
        console.log(data);
        console.log(new Date().getTime());
      })
      .catch(err => {});
  },
  methods: {
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
          for (let j = 0; j < returnData.length; j++) {
            tempArr.push(returnData[j]);
          }
        } else {
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
    collationArrayData(key, data) {
      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
        let returnData = this.collationObjectData(key, data[i]);
        for (let j = 0; j < returnData.length; j++) {
          tempArr.push(returnData[j]);
        }
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