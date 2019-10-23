<template>
  <!-- 外来器械
        版本控制
        回收完成&修改完成：
          备用包验证：至少一个包
          非备用包验证：住院号，床号，病人姓名，急诊类型，至少一个包
        产品手动添加字段(key)：handleAddPackage -- IsNewOuterPackage (Boolean)  用于修改记录新增外来器械包，后台使用
   -->
  <div class="cssd_box" id="outerPackageRegistration">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <router-link to="/outerPackage/record" tag="li" v-if="!outerPackageChangeMode">
          <p>外来器械记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>备用包登记</p>
        <el-switch
          v-model="submitData.IsBackupPackage"
          active-color="#01BF6A"
          inactive-color="#dbdde6"
          :active-value="true"
          :inactive-value="false"
          :disabled="outerPackageChangeMode"
          @change="switchChange"
        ></el-switch>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
      <div class="table_box">
        <ol class="search_box" v-if="!submitData.IsBackupPackage&&!outerPackageChangeMode">
          <li>
            <span class="font16gray">住院号</span>
            <p>
              <el-input v-model.trim="search_HospitalId" @keyup.native.enter="searchOuterPackage" placeholder="请输入住院号"></el-input>
            </p>
          </li>
          <li>
            <el-button type="primary" @click="searchOuterPackage" class="btn120x40">查询</el-button>
          </li>
        </ol>
        <!-- 同济版本 -->
        <template v-if="GLOBAL.UserInfo.HospitalVersion=='TONGJI'">
          <ul v-if="!submitData.IsBackupPackage">
            <li>
              <p class="font16gray">住院号</p>
              <div class="el_input_box font16blod">
                <el-input
                  v-model.trim="submitData.Patient.HospitalId"
                  :disabled="true"
                  class="font16blod"
                  placeholder="住院号(必填)"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">床号</p>
              <div class="el_input_box font16blod">
                <el-input
                  v-model.trim="submitData.Patient.BedId"
                  :disabled="forbid"
                  class="font16blod"
                  placeholder="床号(必填)"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">病人姓名</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.PatientName"
                  :disabled="forbid"
                  class="font16blod"
                  placeholder="病人姓名(必填)"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">门诊类型</p>
              <div class="el_input_box">
                <el-select 
                  v-model="submitData.OutpatientType"
                  :disabled="forbid"
                  class="font16blod green24x13"
                  placeholder="门诊类型(必填)"
                >
                  <el-option label="择期" :value="0"></el-option>
                  <el-option label="急诊" :value="1"></el-option>
                </el-select>
              </div>
            </li>
            <li>
              <p class="font16gray">病区</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SubClinic"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
          </ul>
          <ul v-if="!submitData.IsBackupPackage">
            <li>
              <p class="font16gray">手术名称</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SurgicalName"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">手术时间</p>
              <div class="el_input_box">
                <el-date-picker
                  class="font16blod"
                  :editable="false"
                  :clearable="false"
                  v-model="submitData.Patient.SurgicalDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled="forbid"
                ></el-date-picker>
              </div>
            </li>
            <li>
              <p class="font16gray">手术间</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SurgicalRoom"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">台次</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.Stage"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
          </ul>
        </template>
        <!-- 非同济版本 -->
        <template v-if="GLOBAL.UserInfo.HospitalVersion!='TONGJI'">
          <ul v-if="!submitData.IsBackupPackage">
            <li>
              <p class="font16gray">住院号</p>
              <div class="el_input_box font16blod">
                <el-input
                  v-model.trim="submitData.Patient.HospitalId"
                  :disabled="true"
                  class="font16blod"
                  placeholder="住院号(必填)"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">床号</p>
              <div class="el_input_box font16blod">
                <el-input
                  v-model.trim="submitData.Patient.BedId"
                  :disabled="forbid"
                  class="font16blod"
                  placeholder="床号(必填)"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">病人姓名</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.PatientName"
                  :disabled="forbid"
                  class="font16blod"
                  placeholder="病人姓名(必填)"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">门诊类型</p>
              <div class="el_input_box">
                <el-select 
                  v-model="submitData.OutpatientType"
                  :disabled="forbid"
                  class="font16blod green24x13"
                  placeholder="门诊类型(必填)"
                >
                  <el-option label="择期" :value="0"></el-option>
                  <el-option label="急诊" :value="1"></el-option>
                </el-select>
              </div>
            </li>
            <li>
              <p class="font16gray">病区</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SubClinic"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">性别</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.Gender"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">年龄</p>
              <div class="el_input_box">
                <el-input v-model.trim="submitData.Patient.Age" :disabled="forbid" class="font16blod"></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">入院时间</p>
              <div class="el_input_box">
                <el-date-picker
                  class="font16blod"
                  :editable="false"
                  :clearable="false"
                  v-model="submitData.Patient.AdmissionDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled="forbid"
                ></el-date-picker>
              </div>
            </li>
            <li>
              <p class="font16gray">使用科室</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.Clinic"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">挂号科室</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.RegisteredClinic"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">挂号时间</p>
              <div class="el_input_box">
                <el-date-picker
                  class="font16blod"
                  :editable="false"
                  :clearable="false"
                  v-model="submitData.Patient.RegisteredDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled="forbid"
                ></el-date-picker>
              </div>
            </li>   
          </ul>
          <ul v-if="!submitData.IsBackupPackage">
            <li>
              <p class="font16gray">手术名称</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SurgicalName"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">医生姓名</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SurgicalDoctor"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">手术时间</p>
              <div class="el_input_box">
                <el-date-picker
                  class="font16blod"
                  :editable="false"
                  :clearable="false"
                  v-model="submitData.Patient.SurgicalDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled="forbid"
                ></el-date-picker>
              </div>
            </li>
            <li>
              <p class="font16gray">手术部位</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SurgicalSite"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">手术间</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.SurgicalRoom"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
            <li>
              <p class="font16gray">台次</p>
              <div class="el_input_box">
                <el-input
                  v-model.trim="submitData.Patient.Stage"
                  :disabled="forbid"
                  class="font16blod"
                ></el-input>
              </div>
            </li>
          </ul>
        </template>
        <div class="table_unExpand">
          <el-table :data="submitData.Packages">
            <el-table-column label="包名称" prop="ProductName" width="240" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="分包数" prop="SplitPackageCount" width="110"></el-table-column>
            <el-table-column label="有无植入物" width="150">
              <template slot-scope="props">{{props.row.HasImplants?'有':'无'}}</template>
            </el-table-column>
            <el-table-column label="清洗架" width="210">
              <template slot-scope="props">{{props.row.CarrierName}}</template>
            </el-table-column>
            <el-table-column label="送包单位" prop="SupplierName" width="150"></el-table-column>
            <el-table-column label="送包人" prop="DeliveryPerson" width="150"></el-table-column>
            <el-table-column label="操作" width="110">
              <template slot-scope="props">
                <div class="table_option">
                  <el-button
                    type="primary"
                    class="editThisRow"
                    @click="editThisRow(props.$index)"
                    :disabled="props.row.CanNotBeModified"
                    size="mini"
                  >修改</el-button>
                  <el-button
                    class="deleteThisRow"
                    @click="deleteThisRow(props.$index)"
                    :disabled="props.row.CanNotBeModified"
                    size="mini"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column></el-table-column>
          </el-table>
        </div>
        <el-button
          type="primary"
          @click="handleAddPackage"
          style="margin-top:30px;"
          class="btn120x40"
        >新增</el-button>
      </div>
      <div class="cssd_table_bottom">
        <p>
          <el-button v-if="outerPackageChangeMode" round @click="cancelChange">取消修改</el-button>
          <el-button
            type="primary"
            round
            @click="submitComplete"
          >{{outerPackageChangeMode?'修改完成':'保存'}}</el-button>
        </p>
      </div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <AddPackage
        v-if="isShowAddPackage"
        @addPackage-father="addPackage2father"
        :data="dataToChild"
        :index="index"
        :mode="mode"
        :isBackupPackage="submitData.IsBackupPackage"
      ></AddPackage>
    </transition>
  </div>
</template>

<script>
import AddPackage from "./AddPackage";
export default {
  data() {
    return {
      mode: false,
      index: -1, //子组件与父组件通信数据
      dataToChild: "", //子组件与父组件通信数据
      search_HospitalId: "",
      isShowAddPackage: false,
      forbid: true,
      outerPackageChangeMode: false, //记录修改
      submitData: {
        IsBackupPackage: false,//备用包
        OutpatientType: "", //门诊类型
        Patient: {
          HospitalId: "", //住院号
          BedId: "",
          PatientName: "",
          Gender: "", //性别
          Age: "",
          AdmissionDate: "", //入院时间
          Clinic: "", //所在科室
          SubClinic: "", //所在病区
          RegisteredClinic: "", //挂号科室
          RegisteredDate: "", //挂号时间
          SurgicalName: "", //手术名称
          SurgicalDoctor: "", //手术医生
          SurgicalRoom: "", //手术间
          SurgicalSite: "", //手术部位
          SurgicalDate: "", //手术时间
          Stage:""//台次
        },
        Packages: []
      }
    };
  },
  components: {
    AddPackage
  },
  created() {
    if (this.$route.query.recordId) {
      this.outerPackageChangeMode = true;
      this.forbid = false;
      axios({
        url: `/api/Recycle/PendingUpdateOuterProduct/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.submitData = res.data.Data;
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.GLOBAL.useWebsocketOrNot(this);
  },
  beforeDestroy() {
    if(this.websocket){
      this.websocket.close();
    }
  },
  methods: {
    goBack() {
      if (this.outerPackageChangeMode) {
        this.$router.push("/outerPackage/record");
      } else {
        this.$router.push("/");
      }
    },
    //switch 切换
    switchChange(val) {
      this.search_HospitalId = "";
      this.submitData = {
        IsBackupPackage: val,
        OutpatientType: "", //门诊类型
        Patient: {
          HospitalId: "", //住院号
          BedId: "",
          PatientName: "",
          Gender: "", //性别
          Age: "",
          AdmissionDate: "", //入院时间
          Clinic: "", //所在科室
          SubClinic: "", //所在病区
          RegisteredClinic: "", //挂号科室
          RegisteredDate: "", //挂号时间
          SurgicalName: "", //手术名称
          SurgicalDoctor: "", //手术医生
          SurgicalRoom: "", //手术间
          SurgicalSite: "", //手术部位
          SurgicalDate: "", //手术时间
          Stage:""//台次
        },
        Packages: []
      };
    },
    //住院号查询
    searchOuterPackage() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.search_HospitalId,
            type: "StringNotEmpty",
            msg: "查询的住院号不能为空！"
          }
        ])
      ) {
        axios({ url: `/api/Apply/MessageOfPatient/${this.search_HospitalId}` })
          .then(res => {
            this.forbid = false;
            let type;
            if (res.data.Code == 200) {
              type = "success";
              this.submitData.Patient = res.data.Data.Patient;
            } else if (res.data.Code == 300) {
              type = "warning";
            } else {
              //400
              type = "warning";
              this.submitData.Patient = {
                HospitalId: this.search_HospitalId,
                PatientName: "",
                Gender: "",
                Age: "",
                AdmissionDate: "",
                Clinic: "",
                SubClinic: "",
                BedId: "",
                SurgicalName: "",
                SurgicalDoctor: "",
                RegisteredClinic: "",
                RegisteredDate: "",
                SurgicalRoom: "",
                SurgicalSite: "",
                SurgicalDate: "",
                Stage:""
              };
            }
            this.showInformation({
              classify: "message",
              msg: res.data.Msg,
              type: type
            });
          })
          .then(err => {});
      }
    },
    //取消修改
    cancelChange() {
      this.$router.push("/outerPackage/record");
    },
    //回收完成
    submitComplete() {
      let url = "/api/Recycle/OuterProductRegister";
      let method = "POST";
      if (this.outerPackageChangeMode) {
        url = "/api/Recycle/OuterProductModify";
        method = "PUT";
      }
      if (this.submitData.IsBackupPackage) {
        //备用包
        if (
          this.GLOBAL.VerificationHandle([
            {
              val: this.submitData.Packages,
              type: "ArrayNotEmpty",
              msg: "您还没有添加外来器械包！请至少添加一个外来器械包！"
            }
          ])
        ) {
          this.submitData.OutpatientType = 0;
          this.submitRequest(url, method);
        }
      } else {
        //非备用包
        if (
          this.GLOBAL.VerificationHandle([
            {
              val: this.submitData.Patient.HospitalId,
              type: "StringNotEmpty",
              msg: "住院号不能为空！"
            },
            {
              val: this.submitData.Patient.BedId,
              type: "StringNotEmpty",
              msg: "床号不能为空！"
            },
            {
              val: this.submitData.Patient.PatientName,
              type: "StringNotEmpty",
              msg: "病人姓名不能为空！"
            },
            {
              val:this.submitData.OutpatientType,
              type:"StringNotEmpty",
              msg:"您还没有选择门诊类型！请选择门诊类型！"
            },
            {
              val: this.submitData.Packages,
              type: "ArrayNotEmpty",
              msg: "您还没有添加外来器械包！请至少添加一个外来器械包！"
            }
          ])
        ) {
          this.submitRequest(url, method);
        }
      }
    },
    //提交请求
    submitRequest(url, method) {
      axios({ url: url, method: method, data: this.submitData })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            //socket发送信息
            if(this.websocket){
              let sendData = {
                CssdId: this.GLOBAL.UserInfo.ClinicId,
                ReserveCheckState: false,
                PackageState: true,
              }
              if(this.GLOBAL.UserInfo.CssdProvideType===0){//回收生成发放
                sendData.ProvideState = true;
              }else if(this.GLOBAL.UserInfo.CssdProvideType===1){//预定生成发放
                sendData.ProvideState = false;
              }
              this.websocket.send(JSON.stringify(sendData));
            }
            if (this.outerPackageChangeMode) {
              this.$router.push("/outerPackage/record");
            } else {
              this.$router.go(0);
            }
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
    //修改this row
    editThisRow(index) {
      this.mode = this.outerPackageChangeMode;
      this.dataToChild = Object.assign({},this.submitData.Packages[index]);
      this.index = index;
      this.isShowAddPackage = true;
    },
    //删除this row
    deleteThisRow(index) {
      this.$confirm("您确定要删除该包?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitData.Packages.splice(index, 1);
        })
        .catch(() => {});
    },
    //addPackage与父组件的通信
    addPackage2father(data) {
      this.isShowAddPackage = false;
      if (data) {
        //新增
        if (data.index == -1) {
          this.submitData.Packages.push(data.data);
        } else {
          //修改
          this.submitData.Packages.splice(data.index,1,data.data);
        }
      }
    },
    //handle新增
    handleAddPackage() {
      this.dataToChild = {
        SupplierId: "",
        SupplierName: "",
        DeliveryPerson: "",
        ProductId: "",
        ProductName: "",
        HasImplants: false,
        IsNewOuterPackage:true,
        CarrierId: 0,
        CarrierName: "",
        SplitPackageCount: 1,
        InstrumentTotalCount:1,
        Instruments: []
      };
      this.index = -1; //新增
      this.mode = false;
      this.isShowAddPackage = true;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";
#outerPackageRegistration {
  .cssd_title_right {
    p {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(208, 212, 218, 1);
    }
  }
  .search_box {
    display: flex;
    justify-content: space-around;
    width: 450px;
    margin-bottom: 20px;
    > li {
      width: 234px;
      display: flex;
      justify-content: space-between;
      margin-right: 20px;
      > span {
        width: 64px;
        line-height: 40px;
        margin-right: 10px;
        text-align: right;
      }
      > p {
        .el-input {
          width: 160px;
          input{
            font-size: 16px;
            font-weight:bold;
color:rgba(51,51,51,1);
          }
        }
      }
    }
  }
  .cssd_table_center {
    .table_box {
      padding: 30px 40px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;
      .myTableTitle {
        display: flex;
        text-align: center;
        p {
          flex: 1;
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 234px;
          display: flex;
          justify-content: space-between;
          margin: 0 120px 20px 0;
          p {
            width: 64px;
            line-height: 40px;
            text-align: right;
          }
          .el_input_box {
            width: 160px;
            line-height: 40px;
            .el-date-editor {
              width: 100%;
            }
            .el-input__inner{
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }
      .el-table {
        tbody {
          tr:hover {
            td {
              background: transparent;
            }
          }
          .cell {
            font-weight: bold;
          }
        }
        .el-button {
          background: #fff;
          border: 0;
          &:hover {
            background: transparent;
          }
          &.el-button--primary {
            color: #00c16b;
          }
          &.el-button--default {
            color: #f93e3e;
          }
          span {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
          }
        }
      }
    }
    .cssd_table_bottom {
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
    }
  }
}
</style>