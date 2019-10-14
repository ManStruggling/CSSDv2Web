<template>
  <div class="cssd_box" id="singleRecall">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
      </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box table_unExpand">
        <ul class="clear_float">
          <li>
            <p>灭菌设备</p>
            <span>{{submitData.DeviceName}}</span>
          </li>
          <li>
            <p>灭菌程序</p>
            <span>{{submitData.ProgramName}}</span>
          </li>
          <li>
            <p>灭菌人</p>
            <span>{{submitData.Sterilizer}}</span>
          </li>
          <li>
            <p>灭菌日期</p>
            <span>{{submitData.SterilizeDate}}</span>
          </li>
          <li>
            <p>化学灭菌状态</p>
            <span>{{submitData.ChemicalStatus}}</span>
          </li>
          <li>
            <p>化学审核人</p>
            <span>{{submitData.ChemicalReviewer}}</span>
          </li>
          <li>
            <p>化学审核日期</p>
            <span>{{submitData.ChemicalReviewDate}}</span>
          </li>
        </ul>
        <el-table :data="submitData.Packages">
          <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
          <el-table-column label="包名称" prop="Name" width="210"></el-table-column>
          <el-table-column label="包状态" prop="Status" width="210"></el-table-column>
          <el-table-column label="所在科室" prop="Location" width="210"></el-table-column>
          <el-table-column label="住院号" prop="PatientId" width="210"></el-table-column>
          <el-table-column label="病人姓名" prop="PatientName" width="210"></el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          <el-button @click="goBack">取消召回</el-button>
          <el-button type="primary" @click="comfirmRecall">一键召回</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitData: {
        Packages: [],
        DeviceName: "",
        ProgramName: "",
        SterilizeBarCode: "",
        SterilizeDate: "",
        Sterilizer: "",
        ChemicalStatus: "",
        ChemicalReviewer: "",
        ChemicalReviewDate: ""
      }
    };
  },
  created() {
    if (this.$route.query.sterilizeTaskId) {
      axios({
        url: `/api/Sterilize/ChemicalFailedRecall/${this.$route.query.sterilizeTaskId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            Object.assign(this.submitData, res.data.Data);
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    }
  },
  methods: {
    //返回 取消召回 确认召回
    goBack(){
      this.$router.replace({
        path:"/track/package",
        query:{
          BarCode:this.$route.query.BarCode
        }
      })
    },
    //确认召回
    comfirmRecall(){
      axios({url:`/api/Sterilize/ChemicalFailedRecall`,method:"POST",data:this.submitData}).then(res=>{
        let type;
        if(res.data.Code==200){
          type="success";
          this.goBack();
        }else{
          type="error";
        }
        this.showInformation({ classify: "message", msg: res.data.Msg ,type:type});
      }).catch(err=>{})
    }
  },
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableUnExpand";
@import "../../assets/css/tableTotalBottomBar";
#singleRecall {
  .cssd_table_center {
    .table_box {
      height: 100%;
      padding: 30px 40px;
      box-sizing: border-box;
      overflow-y: scroll;
      ul {
        padding-bottom: 10px;
        border-bottom: 1px solid #f2f4f7;
        li {
          float: left;
          line-height: 40px;
          margin: 0 94px 30px 0;
          p {
            float: left;
            text-align: right;
            width: 96px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            color: rgba(135, 141, 159, 1);
            margin-right: 16px;
          }
          span {
            float: left;
            width: 160px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .el-table{
        margin-top: 30px;
      }
    }
    .cssd_table_bottom {
      flex-direction: row-reverse;
    }
  }
}
</style>