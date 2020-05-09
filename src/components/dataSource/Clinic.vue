<template>
  <!-- 主体 -->
  <div class="basic_main">
    <div class="basic_main_head">
      <p>
        <!-- <el-input
          type="text"
          placeholder="搜索"
          class="basic_ipt_search"
          v-model.trim="basic_search"
          @input="searchThisTableData"
        ></el-input>-->
      </p>
      <p>
        <a
          href="\ImportBaseData\科室汇入.xlsx"
          download="科室汇入"
          v-if="UserInfo.JobAndCompetence.includes('000')"
        >下载模板</a>
        <el-button class="importData" v-if="UserInfo.JobAndCompetence.includes('000')">
          <input
            type="file"
            id="fileUploader"
            name="fileUploader"
            @change="fileChange"
            accept=".xls, .xlsx"
          />
        </el-button>
        <el-button @click="handlePrint">打印条码</el-button>
        <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增科室</el-button>
      </p>
    </div>
    <div class="basic_table table_unExpand">
      <el-table :data="table_data">
        <el-table-column label="科室名称" prop="Name" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column label="拼音简码" prop="ShortCode" width="210" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室条码" prop="BarCode" width="210"></el-table-column>
        <el-table-column label="科室电话" prop="Telephone" width="210">
          <template slot-scope="props">{{props.row.Telephone==""?"-":props.row.Telephone}}</template>
        </el-table-column>
        <el-table-column
          v-if="UserInfo.JobAndCompetence.includes('000')"
          label="Id"
          prop="Id"
          width="210"
        ></el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="props">
            <a class="change_this_tr" @click.stop="editThisTr(props.$index)">编辑</a>
            <a class="delete_this_tr" @click.stop="deleteThisTr(props.$index)">删除</a>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </div>
    <!-- 打印条码 -->
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <PrintBarCodeList
        v-if="isShowBarCodeList"
        @printList-to-father="barCodeListToFather"
        :data="table_data"
        :labels="[{prop:'BarCode',label:'科室条码'},{prop:'Name',label:'科室名称'}]"
        :printUrl="'/api/Print/Clinic'"
      ></PrintBarCodeList>
    </transition>
    <!-- 科室编辑框 -->
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <ClinicBox
        v-if="showEditBox"
        @to-father="child2father"
        :data="toChildData"
        :UserInfo="UserInfo"
      ></ClinicBox>
    </transition>
  </div>
</template>

<script>
import ClinicBox from "./ClinicBox";
import PrintBarCodeList from "./PrintBarCodeList";
import XLSX from "xlsx";
export default {
  props: {
    UserInfo: Object
  },
  data() {
    return {
      isShowBarCodeList: false,
      Type: 0, //科室类型
      basic_search: "", //查询条件
      table_data: [], //表的显示数据
      showEditBox: false, //是否显示编辑框
      toChildData: {}
    };
  },
  components: {
    ClinicBox,
    PrintBarCodeList
  },
  created() {
    axios({
      url: "/api/Clinic"
    })
      .then(res => {
        if (res.data.Code == 200) {
          this.table_data = res.data.Data;
        } else {
          this.showInformation({
            classify: "message",
            msg: res.data.Msg
          });
        }
      })
      .catch(err => {});
  },
  mounted() {},
  methods: {
    //文件改变
    fileChange(evt) {
      let objData = {};
      var selectedFile = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = event => {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
          type: "binary"
        });
        workbook.SheetNames.forEach(function(sheetName) {
          objData[sheetName] = XLSX.utils
            .sheet_to_row_object_array(workbook.Sheets[sheetName])
            .splice(1);
        });
        for (let i = 0; i < objData.Sheet1.length; i++) {
          objData.Sheet1[i].SubClinics = objData.SubClinics.filter(val => {
            return val.ClinicId === objData.Sheet1[i].Id;
          });
        }
        this.requestData(objData.Sheet1, 0);
      };

      reader.onerror = function(event) {
        this.showInformation({
          classify: "message",
          msg: `文件不能被读取！Code ${event.target.error.code}`
        });
      };

      reader.readAsBinaryString(selectedFile);
    },
    //请求数据
    requestData(arr, index) {
      axios({
        url: "/api/Clinic/BatchImport",
        method: "POST",
        data: arr[index]
      })
        .then(res => {
          if (res.data.Code == 200) {
            if (index < arr.length - 1) {
              this.requestData(arr, index + 1);
            }
          } else {
            this.showInformation({
              classify: "message",
              msg: res.data.Msg
            });
          }
        })
        .catch(err => {});
    },
    searchThisTableData() {},
    //打印
    handlePrint() {
      this.isShowBarCodeList = true;
    },
    //条码列表与父组件通信
    barCodeListToFather() {
      this.isShowBarCodeList = false;
    },
    //新增tr
    addTableTr() {
      this.toChildData = {
        Id: 0,
        Name: "",
        ShortCode: "",
        Telephone: "",
        ClinicType: "",
        CanRecycleIfDoNotApplyPackage: false,
        IsNotPrintProvideList: false,
        SubClinics: []
      };
      this.showEditBox = true;
    },

    //删除this tr
    deleteThisTr(index) {
      this.showInformation({
        classify: "confirm",
        msg: "您确定要删除该项?",
        confirmCallBack: () => {
          axios
            .delete(`/api/Clinic/${this.table_data[index].Id}`)
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
        },
        cancelCallBack: () => {}
      });
    },

    //编辑this tr
    editThisTr(index) {
      this.toChildData = Object.assign({}, this.table_data[index]); //深拷贝
      this.showEditBox = true;
    },
    //科室编辑框与父组件通信
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
#editBox {
  .addDeviceModel {
    text-align: right;
    margin-right: 30px;
  }
}
</style>
