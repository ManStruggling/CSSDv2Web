<template>
  <div id="editBox" class="EditBoxReportFormBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>报表名称</p>
            <el-input type="text" placeholder="报表名称" v-model.trim="editBoxData.ReportName"></el-input>
          </li>
          <li>
            <p>报表类型</p>
            <el-select v-model="ReportType" class="green24x13" @change="reportTypeChange">
              <el-option
                v-for="(item,index) in allKeys"
                :key="index"
                :label="item.DisplayName"
                :value="item.MainReportId"
              ></el-option>
            </el-select>
          </li>
        </ul>
        <div class="multiSelectBox">
          <DraggableTransfer ref="transferBox" :sourceLeft="keyList" :targetRight="editBoxData.MainReport.Parameters" @transfer-to-father="transferToFather"></DraggableTransfer>
        </div>
      </div>
      <div class="editBoxOption">
        <el-button @click="editBoxCancelSave">取消</el-button>
        <el-button type="primary" @click="editBoxSave">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import DraggableTransfer from "../common/DraggableTransfer";
export default {
  props: ["toChildReportId"],
  data() {
    return {
      editBoxData: {
        ReportId: 0,
        ReportName: "",
        ReportUrl: "",
        MainReport: {
          MainReportId: 0,
          UrlString: "",
          DisplayName: "",
          Parameters: []
        }
      },
      allKeys: [],
      ReportType: "",
      keyList: []
    };
  },
  components:{
    DraggableTransfer
  },
  created() {
    if (this.$props.toChildReportId === 0) {
      axios({ url: `/api/Report/NewReportParameter` })
        .then(res => {
          if (res.data.Code == 200) {
            this.allKeys = res.data.Data.MainReports;
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    } else {
      axios({ url: `/api/Report/EditReport/${this.$props.toChildReportId}` })
        .then(res => {
          if (res.data.Code == 200) {
            this.editBoxData.ReportId = res.data.Data.ReportId;
            this.editBoxData.ReportName = res.data.Data.ReportName;
            this.editBoxData.ReportUrl = res.data.Data.ReportUrl;
            this.allKeys = res.data.Data.NewReportParameter.MainReports;
            this.ReportType = res.data.Data.MainReport.MainReportId;
            this.reportTypeChange(this.ReportType);
            this.editBoxData.MainReport = res.data.Data.MainReport;
            for(let i=0;i<this.editBoxData.MainReport.Parameters.length;i++){
              for(let j=0;j<this.keyList.length;j++){
                if(this.editBoxData.MainReport.Parameters[i].Id==this.keyList[j].Id){
                  this.keyList.splice(j,1);
                  break;
                }
              }
            }
            //所有报表类型
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    $("#editBox.EditBoxReportFormBox h3 .el-select .el-input__inner").val(
      "选择报表参数"
    );
  },
  methods: {
    transferToFather(data){
      this.editBoxData.MainReport.Parameters=data;
    },
    //报表类型改变
    reportTypeChange(val) {
      for (let i = 0; i < this.allKeys.length; i++) {
        if (val === this.allKeys[i].MainReportId) {
          this.keyList = this.allKeys[i].Parameters.concat([]);
          this.editBoxData.MainReport = {
            DisplayName: this.allKeys[i].DisplayName,
            MainReportId: this.allKeys[i].MainReportId,
            UrlString: this.allKeys[i].UrlString,
            Parameters: []
          };
          break;
        }
      }
      //穿梭框清空
      this.$refs.transferBox.data2=[];
      this.$refs.transferBox.changeTargetData=[];
    },
    //取消
    editBoxCancelSave() {
      this.$emit("to-father", "");
    },
    //保存
    editBoxSave() {
      let axiosMethod = "";
      if (this.editBoxData.ReportId == 0) {
        //新增模式
        axiosMethod = "post";
      } else {
        //更新模式
        axiosMethod = "put";
      }
      if (this.GLOBAL.VerificationHandle([{val: this.editBoxData.ReportName,type: "StringNotEmpty",msg: "报表名称不能为空！"},{val:this.editBoxData.MainReport.Parameters,type:"ArrayNotEmpty",msg:"您还没有选择报表参数,请选择报表参数！"}])) {
        this.editBoxData.ReportUrl = "";
        let reportTypeStr=``;
        let select_str=``;
        let expand_str = ``;
        for(let i=0;i<this.allKeys.length;i++){
          if(this.ReportType===this.allKeys[i].MainReportId){
            reportTypeStr = `/odata/${this.allKeys[i].UrlString}?`;
            break;
          }
        }
        for (
          let i = 0;
          i < this.editBoxData.MainReport.Parameters.length;
          i++
        ) {
          for (let j = 0; j < this.keyList.length; j++) {
            if (
              this.editBoxData.MainReport.Parameters[i] === this.keyList[j].Id
            ) {
              if (this.keyList[j].Type === 0) {
                select_str = select_str + this.keyList[j].UrlString + ",";
              } else {
                expand_str = expand_str + this.keyList[j].UrlString + ",";
              }
              this.editBoxData.MainReport.Parameters[i] = this.keyList[j];
            }
          }
        }
        if(expand_str){
          expand_str = "&$expand=" + expand_str.substr(0,expand_str.length-1);
        }
        if(select_str){  
          select_str = "$select=" + select_str.substr(0,select_str.length-1);
        }
        this.editBoxData.ReportUrl = reportTypeStr + select_str + expand_str;
        axios({
          url: "/api/Report",
          method: axiosMethod,
          data: this.editBoxData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              //操作成功
              type = "success";
              this.$emit("to-father", res.data.Data);
            } else {
              //其他状态码
              type = "error";
            }
            this.showInformation({
              classify: "message",
              msg: res.data.Msg,
              type: type
            });
          })
          .catch(error => {});
      }
    },
  }
};
</script>

<style lang="scss">
#editBox.EditBoxReportFormBox {
  .editContainer {
    .editContent {
      > ul.clear_float {
        border-bottom: 1px solid #f2f4f7;
        li {
          width: 234px;
          p {
            width: 64px;
          }
        }
      }
      .multiSelectBox {
        height: 560px;
      }
    }
  }
}
</style>