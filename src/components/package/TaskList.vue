<template>
  <div class="cssd_box tabs_half_bar" id="packageTaskList">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/" tag="li">
          <p>返回</p>
        </router-link>
        <li @click="handleManualEnter">
          <p>手工录入</p>
        </li>
        <router-link to="/package/cleanCheck" tag="li">
          <p>清洗审核</p>
        </router-link>
        <li @click="addSupportMaterialProduct">
          <p>添加辅料包</p>
        </li>
        <li>
          <p>器械检查</p>
        </li>
        <router-link to="/package/taskRecord" tag="li">
          <p>配包记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span v-show="hasNewTask">有新任务</span>
          <i @click="refresh"></i>
        </p>
      </div>
    </div>
    <div class="cssd_table_center table_collapse table_unExpand">
      <div class="cssd_table_left">
        <div class="cssd_talbe_left_menu">
          <div class="task_origin">
            <el-select v-model="selectOrigin" @change="originChange" popper-class="taskOrigin">
              <el-option label="清洗完成可配包" value="TasksOfCanBePackage"></el-option>
              <el-option label="清洗未完成" value="PackageTasksFromCleanUndone"></el-option>
              <el-option label="灭菌失败" value="PackageTasksFromSterilizeFailed"></el-option>
              <el-option label="辅料包新任务" value="PackageTasksFromSupportMaterialProduct"></el-option>
              <!-- <el-option label="灭菌过期" value="PackageTasksFromSterilizeExpired"></el-option> -->
            </el-select>
          </div>
          <el-tabs :tab-position="'left'" v-model="tabActiveName" @tab-click="tabsChange">
            <el-tab-pane
              v-for="(item,index) in tableData[selectOrigin]"
              :key="index"
              :name="index+''"
            >
              <div slot="label" class="tabTh">
                <h4>{{item.ClinicName}}</h4>
                <h3>{{item.SubClinicName}}</h3>
              </div>
              <div class="tab_content table_expand">
                <div class="content_title">
                  <p style="width:210px;">包名称</p>
                  <p>回收时间</p>
                  <p style="width:140px;">外包装</p>
                  <p style="width:60px;">计划数</p>
                  <p style="width:110px;">剩余数</p>
                  <p style="width:60px">可配数</p>
                  <p style="width:100px;">本次配包数</p>
                  <p>单包网篮</p>
                </div>
                <el-collapse
                  accordion
                  v-model="activeName"
                  @change="((activeName)=>{collapseChange(activeName,index)})"
                >
                  <el-collapse-item
                    v-for="(value,collapseIndex) in item.PackageTasks"
                    :key="collapseIndex"
                    :name="collapseIndex+''"
                    :class="value.IsNotBarCodeProduct?'collapseUnExpand':''"
                  >
                    <div slot="title" class="collapseTh">
                      <!-- 包名称 -->
                      <div class="collapseTd" style="width:250px;">
                        <el-popover
                          v-show="value.IsOuterProduct"
                          placement="right-start"
                          width="200"
                          trigger="hover"
                          @show="showPatientMessage(value)"
                        >
                          <div>
                            <p>
                              <span>住院号：</span>
                              <span>{{patienMessage.PatientHospitalId}}</span>
                            </p>
                            <p>
                              <span>床号：</span>
                              <span>{{patienMessage.PatientBedId}}</span>
                            </p>
                            <p>
                              <span>病人姓名：</span>
                              <span>{{patienMessage.PatientName}}</span>
                            </p>
                          </div>
                          <div slot="reference">{{value.ProductName}}</div>
                        </el-popover>
                        <div v-if="!value.IsOuterProduct">
                          {{value.ProductName}}
                          <i
                            class="viewPictures"
                            @click.stop="viewProductImg(value.ProductId)"
                          ></i>
                        </div>
                      </div>
                      <!-- 回收时间 -->
                      <div class="collapseTd">{{value.RecycleDate}}</div>
                      <!-- 外包装 -->
                      <div class="collapseTd" style="width:180px;">
                        <el-select v-model="value.ExternalPackageId" class="green18x10">
                          <el-option
                            v-for="(val,idx) in tableData.ExternalPackages"
                            :key="idx"
                            :label="val.ExternalPackageName"
                            :value="val.ExternalPackageId"
                          ></el-option>
                        </el-select>
                      </div>
                      <!-- 计划数 -->
                      <div class="collapseTd" style="width:100px;">
                        <!-- <el-input-number
                          v-if="selectOrigin=='PackageTasksFromSupportMaterialProduct'?true:false"
                          v-model="value.ScheduleQuantity"
                          :min="1"
                          :max="999"
                          :controls="false"
                          size="mini"
                          @click.native.stop="GLOBAL.cancelBubble"
                          @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,index,collapseIndex,'ScheduleQuantity')})"
                        ></el-input-number>-->
                        <div>{{value.ScheduleQuantity}}</div>
                      </div>
                      <!-- 剩余数 -->
                      <div class="collapseTd" style="width:150px;">
                        {{value.RemainingQuantity}}
                        <span
                          class="expeditedTag"
                          v-show="value.ExpeditedPackageQuantity!=0"
                        >加急 : {{value.ExpeditedPackageQuantity}}</span>
                      </div>
                      <!-- 可配数 -->
                      <div class="collapseTd" style="width:100px;">
                        <div>{{value.CanBePackagedQuantity}}</div>
                      </div>
                      <!-- 本次配包数 -->
                      <div class="collapseTd" style="width:150px;">
                        <template v-if="value.IsSingleCarrierProduct">1</template>
                        <template v-else>
                          <!-- 非个数包 -->
                          <el-input-number
                            v-if="!value.IsNumberProduct"
                            v-model="value.ThisTimePackageQuantity"
                            :min="0"
                            :max="value.CanBePackagedQuantity"
                            :controls="false"
                            size="mini"
                            @click.native.stop="GLOBAL.cancelBubble"
                            @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,index,collapseIndex,'ThisTimePackageQuantity')})"
                          ></el-input-number>
                          <!-- 个数包 -->
                          <div v-if="value.IsNumberProduct" class="thisTimePackageNumber">
                            <el-input-number
                              v-model="value.ThisTimePackageQuantity"
                              :min="0"
                              size="mini"
                              :max="value.NumberProductQuantity==0?value.CanBePackagedQuantity:(value.CanBePackagedQuantity%value.NumberProductQuantity==0?value.CanBePackagedQuantity/value.NumberProductQuantity:(value.CanBePackagedQuantity/value.NumberProductQuantity+'').split('.')[0]-0+1)"
                              :controls="false"
                              @click.native.stop="GLOBAL.cancelBubble"
                              @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,index,collapseIndex,'ThisTimePackageQuantity')})"
                            ></el-input-number>
                            <span
                              class="numberPackageSpan"
                            >* {{value.NumberProductQuantity==0?1:value.NumberProductQuantity}}</span>
                            <div
                              class="actuallyPackageNumber"
                              v-if="value.IsNumberProduct&&value.NumberProductQuantity!=0"
                            >{{value.ThisTimePackageQuantity*value.NumberProductQuantity>value.CanBePackagedQuantity?'本次配包数为：'+value.CanBePackagedQuantity:'本次配包数为：'+value.ThisTimePackageQuantity*value.NumberProductQuantity}}</div>
                          </div>
                          <div
                            class="actuallyPackageNumber"
                            v-if="value.IsNumberProduct&&value.NumberProductQuantity==0"
                          >{{'本次配包数为：'+value.ThisTimePackageQuantity}}</div>
                        </template>
                      </div>
                      <!-- 单网篮包 -->
                      <div class="collapseTd">
                        <div v-if="value.IsSingleCarrierProduct">{{value.SingleCarrierName}}</div>
                        <div v-else>-</div>
                      </div>
                    </div>
                    <div
                      class="InstrumentsAndMaterial"
                      v-if="!value.IsNotBarCodeProduct&&value.PackageInstrumentList"
                    >
                      <el-table
                        v-if="value.PackageInstrumentList.InstrumentCounts==''?false:true"
                        :data="value.PackageInstrumentList.InstrumentCounts"
                      >
                        <el-table-column label="器械名称" prop="Name" width="240"></el-table-column>
                        <el-table-column label="器械数/包" prop="Quantity" width="210"></el-table-column>
                        <el-table-column></el-table-column>
                      </el-table>
                      <el-table
                        v-if="value.PackageInstrumentList.MaterialCounts==''?false:true"
                        :data="value.PackageInstrumentList.MaterialCounts"
                      >
                        <el-table-column label="原料名称" prop="Name" width="240"></el-table-column>
                        <el-table-column label="原料数/包" prop="Quantity" width="210"></el-table-column>
                        <el-table-column></el-table-column>
                      </el-table>
                    </div>
                  </el-collapse-item>
                </el-collapse>
                <div class="tab_content_bottom">
                  <p></p>
                  <p>
                    <el-button
                      type="primary"
                      @click="packageComplete"
                      class="btn150x40main"
                      :disabled="selectOrigin=='PackageTasksFromCleanUndone'?true:false"
                    >配包完成</el-button>
                  </p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="cssd_table_right"></div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 配包任务审核人弹窗 -->
      <TaskListBox
        v-if="isShowTaskListBox"
        :data="templateSelection"
        @to-father="taskListBox2father"
        :origin="selectOrigin"
      ></TaskListBox>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 辅料包新任务 -->
      <PackageList
        v-if="isShowPackageList"
        @packageList-to-father="packgeList2father"
        :packageClass="'追溯的辅料包'"
        :getApiLimit="`type eq '追溯的辅料包'`"
      ></PackageList>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 查看照片 -->
      <PhotoView
        v-if="isShowPhoto"
        @viewPhoto-to-father="viewPhotoToFather"
        :data="pictures"
        :viewMode="true"
      ></PhotoView>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 手工录入 -->
      <ManualEnter
        v-if="isShowManualEnter"
        @to-father="scanner2father"
        :BarCodeList="[]"
        :ApiUrl="'/api/Scanner/Package/SingleProductCarrier'"
      ></ManualEnter>
    </transition>
  </div>
</template>

<script>
import TaskListBox from "./TaskListBox";
import PackageList from "../common/PackageList";
import PhotoView from "../common/PhotoView";
import ManualEnter from "../common/ManualEnter";
export default {
  data() {
    return {
      isShowManualEnter:false,
      hasNewTask: false, //是否有新任务
      pictures: [],
      activeName: "-1",
      tabActiveName:"0",
      isShowPhoto: false, //看照片
      isShowPackageList: false, //辅料包列表
      isShowTaskListBox: false, //配包框
      selectRadio: 0,
      selectOrigin: "TasksOfCanBePackage",
      tableData: {
        PackageTasksFromSterilizeFailed: null,
        PackageTasksFromCleanUndone: null,
        PackageTasksFromSupportMaterialProduct: null,
        TasksOfCanBePackage: null
      },
      templateSelection: {},
      patienMessage: {
        PatientHospitalId: "",
        PatientName: "",
        PatientBedId: ""
      }
    };
  },
  components: {
    TaskListBox,
    PackageList,
    PhotoView,
    ManualEnter
  },
  watch: {
    "tableData.TasksOfCanBePackage": {
      handler: function(newValue) {
        if (newValue != null && newValue != "") {
          let num = 0;
          newValue.forEach(element => {
            num += element.PackageTasks.length;
          });
          $(".taskOrigin ul li:first-child").html(
            `<span>清洗完成可配包</span><b>${num}</b>`
          );
        }
      },
      immediate: true,
      deep: true
    },
    "tableData.PackageTasksFromCleanUndone": {
      handler: function(newValue) {
        if (newValue != null && newValue != "") {
          let num = 0;
          newValue.forEach(element => {
            num += element.PackageTasks.length;
          });
          $(".taskOrigin ul li:nth-child(2)").html(
            `<span>清洗未完成</span><b>${num}</b>`
          );
        }
      },
      immediate: true,
      deep: true
    },
    "tableData.PackageTasksFromSterilizeFailed": {
      handler: function(newValue) {
        if (newValue != null && newValue != "") {
          let num = 0;
          newValue.forEach(element => {
            num += element.PackageTasks.length;
          });
          $(".taskOrigin ul li:nth-child(3)").html(
            `<span>灭菌失败</span><b>${num}</b>`
          );
        }
      },
      immediate: true,
      deep: true
    },
    "tableData.PackageTasksFromSupportMaterialProduct": {
      handler: function(newValue) {
        if (newValue != null && newValue != "") {
          let num = 0;
          newValue.forEach(element => {
            num += element.PackageTasks.length;
          });
          $(".taskOrigin ul li:last-child").html(
            `<span>辅料包新任务</span><b>${num}</b>`
          );
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    CSManager.handleDataThis = this;
    let origin = window.location.search.split("=")[1];
    if (origin) {
      this.selectOrigin = origin;
    }
    axios({ url: "/api/Package/PackageTasks" })
      .then(res => {
        if (res.data.Code == 200) {
          this.tableData = res.data.Data;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  },
  mounted() {
    this.GLOBAL.initWebSorcket(this,"PackageState");
  },
  beforeDestroy() {
    this.websocket.close();
    CSManager.handleDataThis = null;
  },
  methods: {
    //处理手工录入
    handleManualEnter() {
      this.isShowManualEnter = true;
    },
    scanner2father(data){
      this.isShowManualEnter = false;
      if(data){
        if(this.tableData.TasksOfCanBePackage){
          let bool = this.searchSinglePackage(data,"TasksOfCanBePackage");
          if(bool){
            return;
          }
          this.searchSinglePackage(data,"PackageTasksFromSterilizeFailed");
        }
      }
    },
    searchSinglePackage(data,origin){
      if(this.tableData[origin]){
        //优先匹配加急包
        for(let i=0;i<this.tableData[origin].length;i++){
          for(let j=0;j<this.tableData[origin][i].PackageTasks.length;j++){
            if(data.ProductId===this.tableData[origin][i].PackageTasks[j].ProductId&&this.tableData[origin][i].PackageTasks[j].CanBePackagedQuantity&&this.tableData[origin][i].PackageTasks[j].ExpeditedPackageQuantity&&!this.tableData[origin][i].PackageTasks[j].SingleCarrierId){
              this.tableData[origin][i].PackageTasks[j].SingleCarrierId=data.SingleCarrierId;
              this.tableData[origin][i].PackageTasks[j].SingleCarrierName=data.SingleCarrierName;
              this.tabActiveName=i+"";
              this.activeName=j+"";
              this.selectRadio=this.tableData[origin][i].PackageTasks[j].PackageTaskId;
              this.templateSelection = this.tableData[origin][i].PackageTasks[j];
              this.selectOrigin=origin;
              return true;
            }
          }
        }
        //匹配非加急包
        for(let i=0;i<this.tableData[origin].length;i++){
          for(let j=0;j<this.tableData[origin][i].PackageTasks.length;j++){
            if(data.ProductId===this.tableData[origin][i].PackageTasks[j].ProductId&&this.tableData[origin][i].PackageTasks[j].CanBePackagedQuantity&&!this.tableData[origin][i].PackageTasks[j].SingleCarrierId){
              this.tableData[origin][i].PackageTasks[j].SingleCarrierId=data.SingleCarrierId;
              this.tableData[origin][i].PackageTasks[j].SingleCarrierName=data.SingleCarrierName;
              this.tabActiveName=i+"";
              this.activeName=j+"";
              this.selectRadio=this.tableData[origin][i].PackageTasks[j].PackageTaskId;
              this.templateSelection = this.tableData[origin][i].PackageTasks[j];
              this.selectOrigin=origin;
              return true;
            }
          }
        }
      }
    },
    //刷新
    refresh() {
      window.location.reload();
    },
    //查看产品图片
    viewProductImg(val) {
      axios({ url: `/api/Product/Picture/${val}` })
        .then(res => {
          if (res.data.Code == 200) {
            this.pictures = res.data.Data;
            this.isShowPhoto = true;
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    },
    viewPhotoToFather() {
      this.isShowPhoto = false;
    },
    //改变来源
    originChange() {
      this.selectRadio = 0;
      this.activeName = "-1";
    },
    //显示外来器械包的病人信息
    showPatientMessage(value) {
      if (value.Requested == undefined) {
        axios({
          url: `/api/Package/PatientDetailForOuterProduct/${value.PackageTaskId}`
        })
          .then(res => {
            if (res.data.Code == 200) {
              value.Requested = true;
              if (res.data.Data) {
                this.patienMessage = res.data.Data;
              }
            } else {
              this.showInformation({ classify: "message", msg: res.data.Msg });
            }
          })
          .catch(err => {});
      }
    },
    //el-input-number change 事件
    handleNumberChange(newValue, oldValue, index, $index, origin) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.tableData[this.selectOrigin][index].PackageTasks[$index][
            origin
          ] = 1;
        }, 0);
      }
    },
    //添加辅料包
    addSupportMaterialProduct() {
      this.isShowPackageList = true;
    },
    //PackageList组件传递的值
    packgeList2father(data) {
      this.isShowPackageList = false;
      CSManager.handleDataThis = this;
      if (data) {
        this.tableData = data;
        this.selectOrigin = "PackageTasksFromSupportMaterialProduct";
        this.selectRadio = 0;
        this.activeName = "-1";
        this.websocket.send(JSON.stringify({
          CssdId: this.GLOBAL.UserInfo.ClinicId,
          ReserveCheckState: false,
          PackageState: true,
          ProvideState: false
        }))
      }
    },
    //taskListBox传递过来的值
    taskListBox2father(data,origin) {
      if (data) {
        this.websocket.send(JSON.stringify(data));
        window.location.href = `/package/taskList?origin=${origin}`;
      }
    },
    //配包完成
    packageComplete() {
      //templateSelection
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.selectRadio,
            type: "NumberNotZero",
            msg: "您还没有选择配包任务,请选择配包任务！"
          },
          {
            val: this.templateSelection.ThisTimePackageQuantity,
            type: "NumberNotZero",
            msg: "配包数不能为0！"
          }
        ])
      ) {
        if(this.templateSelection.IsSingleCarrierProduct){
          if(this.templateSelection.IsSingleCarrierProduct&&!this.templateSelection.SingleCarrierId){
            this.showInformation({classify:"message",msg:"单网篮包必须绑定网篮！"});
            return;
          }
          //单网篮包一次只能配一个
          this.templateSelection.ThisTimePackageQuantity = 1;
        }
        this.isShowTaskListBox = true;
      }
    },
    //tab切换数据
    tabsChange(val) {
      this.activeName = "-1";
      this.selectRadio = 0;
      this.templateSelection = {};
    },
    // //勾选替换数据
    // getTemplateRow(index, value) {
    //   //获取选中数据
    //   this.templateSelection = value;
    // },
    //选择的任务改变
    collapseChange(activeName, index) {
      if (activeName != "") {
        this.selectRadio = this.tableData[this.selectOrigin][
          index
        ].PackageTasks[activeName].PackageTaskId;
        this.templateSelection = this.tableData[this.selectOrigin][
          index
        ].PackageTasks[activeName];
        if (
          !this.tableData[this.selectOrigin][index].PackageTasks[activeName]
            .IsNotBarCodeProduct &&
          !this.tableData[this.selectOrigin][index].PackageTasks[activeName]
            .PackageInstrumentList
        ) {
          let url = `/api/Package/InstrumentAndMaterialBy/${this.tableData[this.selectOrigin][index].PackageTasks[activeName].ProductId}`;
          if (
            this.tableData[this.selectOrigin][index].PackageTasks[activeName]
              .IsOuterProduct
          ) {
            url = `/api/Package/InstrumentInOuterProduct/${this.tableData[this.selectOrigin][index].PackageTasks[activeName].PackageTaskId}`;
          }
          axios(url)
            .then(res => {
              if (res.data.Code == 200) {
                this.tableData[this.selectOrigin][index].PackageTasks[
                  activeName
                ].PackageInstrumentList = res.data.Data;
              } else {
                this.showInformation({
                  classify: "message",
                  msg: res.data.Msg
                });
              }
            })
            .catch(err => {});
        }
      } else {
        this.selectRadio = 0;
      }
    },
    //处理条码
    handleBarCode(msg){
      if(/^RY/.test(msg.toUpperCase())){
        let submitData={
          Pictures:[],
          ReviewerBarCode:msg,
          Packages:[]
        };
        for(let key in this.tableData){
          if(key==="TasksOfCanBePackage"||key==="PackageTasksFromSterilizeFailed"){
            if(this.tableData[key]){
              for(let i=0;i<this.tableData[key].length;i++){
                for(let j=0;j<this.tableData[key][i].PackageTasks.length;j++){
                  if(this.tableData[key][i].PackageTasks[j].SingleCarrierId){
                    this.tableData[key][i].PackageTasks[j].ThisTimePackageQuantity = 1;
                    submitData.Packages.push(this.tableData[key][i].PackageTasks[j]);
                  }
                }
              }
            }
          }
        }
        if(submitData.Packages==""){
          this.showInformation({classify:"message",msg:"单网篮包没有绑定单包网篮！"})
          return;
        }
        axios({url:`/api/Package/PackageTaskReceiveAndReturnPrintModel`,method:"POST",data:submitData}).then(res=>{
          let type;
          if(res.data.Code==200){
            type = "success";
            res.data.Data.forEach(element => {
              CSManager.PrintBarcode(JSON.stringify(element));
            });
            this.websocket.send(JSON.stringify({
              CssdId: this.GLOBAL.UserInfo.ClinicId,
              ReserveCheckState: false,
              PackageState: true,
              ProvideState: false,
            }))
            window.location.href = `/package/taskList?origin=${this.selectOrigin}`;
          }else{
            type = "error";
          }
          this.showInformation({
            classify: "message",
            msg: res.data.Msg,
            type: type
          });
        });
      }else{
        axios({url:`/api/Scanner/Package/SingleProductCarrier/${msg}`}).then(res=>{
          if(res.data.Code==200){
            this.scanner2father(res.data.Data);
          }else{
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        }).catch(err=>{})
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableUnExpand";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tabsHalfBar";
#packageTaskList {
  .cssd_title_right {
    p {
      display: flex;
      align-items: center;
      span {
        margin-right: 20px;
      }
      i {
        width: 22px;
        height: 20px;
        background: url("../../assets/images/refresh.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
  .cssd_table_center {
    .task_origin {
      width: 240px;
      border-bottom: 1px solid rgba(51, 64, 72, 1);
      height: 44px;
      .el-select {
        width: 100%;
        height: 100%;
        .el-input {
          height: 100%;
          position: relative;
          &::after {
            content: "";
            width: 18px;
            height: 10px;
            position: absolute;
            top: 17px;
            right: 15px;
            background: url("../../assets/images/arrow_white.png");
          }
          &.is-focus::after {
            transform: rotate(-180deg);
          }
          input {
            border: 0;
            height: 100%;
            background: #182b37;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
          }
          span {
            display: none;
          }
        }
      }
    }
    .el-tabs {
      .el-tabs__header {
        .el-tabs__item {
          .tabTh {
            text-align: left;
            h4 {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 21px;
            }
            h3 {
              font-size: 20px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 26px;
            }
          }
        }
      }
      .el-tabs__content {
        .tab_content {
          .el-collapse-item__header {
            &.is-active {
              .collapseTh {
                color: #fff;
                .collapseTd {
                  .viewPictures {
                    background-image: url("../../assets/images/imgLogo_white.png");
                  }
                  .numberPackageSpan,
                  .actuallyPackageNumber {
                    color: #fff;
                  }
                }
                .el-input-number {
                  .el-input {
                    input {
                      color: #fff;
                      &:focus {
                        border-color: #fff;
                      }
                    }
                  }
                }
                .el-select {
                  &.green18x10 {
                    .el-input {
                      &::after {
                        background: url("../../assets/images/arrow_white.png");
                      }
                      &.is-focus::after {
                        transform: rotate(180deg);
                      }
                    }
                  }
                  .el-input {
                    input {
                      color: #fff !important;
                      &:focus {
                        border-color: #fff;
                      }
                    }
                  }
                }
              }
            }
            .collapseTh {
              font-size: 18px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(35, 46, 65, 1);
              line-height: 63px;
              .collapseTd {
                font-size: inherit;
                font-weight: inherit;
                font-family: inherit;
                .viewPictures {
                  width: 19px;
                  height: 16px;
                  display: inline-block;
                  margin-left: 8px;
                  background: url("../../assets/images/imgLogo_green.png")
                    no-repeat;
                  background-size: 100% 100%;
                }
                > div,
                > span {
                  font-size: inherit;
                  font-weight: inherit;
                  font-family: inherit;
                  > div {
                    font-size: inherit;
                    font-weight: inherit;
                    font-family: inherit;
                  }
                }
                .expeditedTag {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: normal;
                }
                .thisTimePackageNumber {
                  line-height: 24px;
                  margin-top: 20px;
                }
                .numberPackageSpan {
                  margin-left: 10px;
                  font-size: 18px;
                  font-family: Microsoft YaHei;
                  color: rgba(135, 141, 159, 1);
                }
                .actuallyPackageNumber {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  color: rgba(196, 201, 209, 1);
                  line-height: 19px;
                  font-weight: normal;
                }
              }
              .el-select {
                width: 140px;
                line-height: 40px !important;
                .el-input {
                  input {
                    font-size: 16px !important;
                    font-family: Microsoft YaHei !important;
                    font-weight: bold !important;
                    color: rgba(51, 51, 51, 1) !important;
                  }
                }
              }
            }
          }
          .el-table {
            tbody {
              tr {
                &:nth-child(2n) {
                  display: table-row;
                }
                td {
                  border: 0;
                }
              }
            }
          }
          .tab_content_bottom {
            .el-button {
              &.is-disabled {
                background: #ccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>