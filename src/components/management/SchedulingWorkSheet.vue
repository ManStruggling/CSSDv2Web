<template>
  <div class="cssd_totalBar" id="schedulingWork">
    <div class="container">
      <div class="scheduleMsg">
        <ul>
          <li>
            <p>班表名称</p>
            <el-input v-model.trim="submitData.Name" placeholder="班表名称"></el-input>
          </li>
          <li>
            <p>班表月份</p>
            <el-date-picker
              v-model="submitData.YearMonth"
              type="month"
              placeholder="请选择年月"
              :clearable="false"
              :editable="false"
              @change="dateChange"
              :picker-options="{
                  disabledDate:disabledDate
              }"
              value-format="yyyy-MM"
              :disabled="viewModule.id?true:false"
            ></el-date-picker>
          </li>
        </ul>
        <p>
          <el-button @click="statisticalTableView">查看统计表</el-button>
          <el-button type="primary" @click="printView">打印排版</el-button>
        </p>
      </div>
      <div class="workSheetRemark">
        <p>备注</p>
        <el-input
          type="textarea"
          placeholder="请填写备注"
          v-model.trim="submitData.Remark"
          resize="none"
        ></el-input>
      </div>
      <dl>
        <dt>
          <el-select placeholder="选择字段类别" class="green24x13" v-model="currentSelectPeriodType">
            <el-option label="常日班" :value="'Work'"></el-option>
            <el-option label="休假" :value="'Vacation'"></el-option>
            <el-option label="备班" :value="'WorkOverTime'"></el-option>
            <el-option label="工作区域" :value="'WorkArea'"></el-option>
          </el-select>
        </dt>
        <dd>
          <el-tag
            v-for="(item,index) in periodType[currentSelectPeriodType]"
            :key="index"
            @click="switchPeriodStatus(item)"
            :class="{'is-active':item.IsActive}"
          >{{item.name}}</el-tag>
        </dd>
      </dl>
      <el-table
        :data="submitData.Staffs"
        border
        row-key="StaffId"
        :height="tableHeight"
        style="width:100%;"
        v-show="submitData.Days!=''"
        fit
      >
        <el-table-column label="序号" fixed width="80" class-name="draggable" type="index"></el-table-column>
        <el-table-column :fixed="isNameFixed" class-name="draggable header_name_th">
          <div slot="header" class="header_name">
            <span>姓名</span>
            <i @click="isNameFixed = !isNameFixed" :class="isNameFixed?'locked':'unclock'"></i>
          </div>
          <template slot-scope="props">
            <div class="cell_name draggable">{{props.row.StaffName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in submitData.Days"
          :key="index"
          :label="item.day+'日'"
          :class-name="item.isWeekend?'is-weekend':''"
        >
          <template slot-scope="props">
            <el-popover
              placement="right"
              :disabled="props.row.Periods[item.day-1].PeriodId==0"
              trigger="hover"
              :open-delay="1000"
              @show="displayPopover(props.row.Periods[item.day-1])"
              popper-class="schedulePopper"
            >
              <ol>
                <li>
                  <span>开始时间：</span>
                  <b>{{formatTime(displayedPeriodMsg.startTime)}}</b>
                </li>
                <li>
                  <span>结束时间：</span>
                  <b>{{formatTime(displayedPeriodMsg.endTime)}}</b>
                </li>
                <li>
                  <span>午餐：</span>
                  <b>{{displayedPeriodMsg.isIncludeLunch?'有':'无'}}</b>
                </li>
              </ol>
              <div
                slot="reference"
                class="periodItem"
                :class="{'is-cell-active':props.row.Periods[item.day-1].IsCellActive}"
                @click="tableCellClick(props.row.Periods[item.day-1])"
                @mousedown="tableCellMousedown(props.row.Periods[item.day-1])"
                @mouseenter="tableCellMouseenter(props.row.Periods[item.day-1])"
                @mouseup="tableCellMouseup(props.row.Periods[item.day-1])"
              >{{initCellData(props.row.Periods[item.day-1],props.$index,item.day-1)}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="工作区域" :width="getMaxLength(submitData.Staffs)">
          <template slot-scope="props">
            <div
              class="workAreaItem"
              @click="workAreaCellClick(props.row)"
            >{{props.row.WorkAreaString}}</div>
          </template>
        </el-table-column>
        <el-table-column label="午餐">
          <template slot-scope="props">
            <div class="computedCell">{{countTotalIncludeLunchNumber(props.$index)}}</div>
          </template>
        </el-table-column>
        <el-table-column class-name="filterHeader filterHeaderByPeriodType" width="150">
          <template slot="header">
            <el-select
              v-model="filteredByPeriodType"
              class="green24x13"
              @change="filterHeadChange"
              placeholder="选择班类型"
            >
              <el-option label="常日班" :value="0"></el-option>
              <el-option label="休假" :value="1"></el-option>
              <el-option label="备班" :value="2"></el-option>
            </el-select>
          </template>
          <template slot-scope="props">
            <div class="computedCell">{{countTotalByPeriodType(props.$index)}}</div>
          </template>
        </el-table-column>
        <el-table-column class-name="filterHeader filterHeaderByPeriodId" width="150">
          <template slot="header">
            <el-select
              v-model="filteredByPeriodId"
              class="green24x13"
              @change="filterHeadByPeriodIdChange"
              placeholder="选择班种"
            >
              <el-option
                v-for="(item,index) in submitData.PeriodArray"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot-scope="props">
            <div class="computedCell">{{countTotalByPeriodId(props.$index)}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cssd_table_bottom">
      <p></p>
      <p>
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="confirmSubmit">保存</el-button>
      </p>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 打印排版 -->
      <PrintPreview v-if="isShowPrintView"></PrintPreview>
    </transition>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 查看统计表 -->
      <StatisticalTable v-if="isShowStatisticalTable" :tableData="toChildData"></StatisticalTable>
    </transition>
  </div>
</template>

<script>
import { MessagePack } from "assert";
import { decode } from "@msgpack/msgpack";
import Sortable from "sortablejs";
import "@/assets/css/hiprint/hiprint.css";
import "@/assets/css/hiprint/print-lock.css";

import "@/plugins/hiprint/jquery.min.js";
import "@/plugins/hiprint/jquery.minicolors.min.js";
import { hiprint } from "@/plugins/hiprint/hiprint.bundle.js";
import "@/plugins/hiprint/jquery.hiwprint.js";
import PrintPreview from "@/components/common/PrintPreview";
import StatisticalTable from "@/components/management/StatisticalTable";
export default {
  inject: ["managementReload"],
  props: {
    viewModule: Object,
    scheduledWorks: Array,
    UserInfo: Object
  },
  data() {
    let { year, month } = this.getNewDate(new Date());
    return {
      isShowStatisticalTable: false,
      //表格高度
      tableHeight: window.innerHeight - 180,
      //鼠标按下位置
      keyDownPosition: [],
      //当前激活的班种
      activePeriod: {},
      //当前激活的工作区域
      activeWorkArea: {},
      //提交数据模型
      submitData: {
        Id: 0,
        Name: "",
        YearMonth: "",
        Remark: "",
        Staffs: [],
        Days: [],
        PeriodArray: []
      },
      //当前选择的年月
      currentSelectMonth: {
        year,
        month
      },
      filteredByPeriodType: null,
      filteredByPeriodId: null,
      //当前选择的班种类别
      currentSelectPeriodType: "Work",
      //班种
      periodType: {
        Work: [],
        Vacation: [],
        WorkOverTime: [],
        WorkArea: []
      },
      //班种显示的数据
      displayedPeriodMsg: {
        startTime: "",
        endTime: "",
        isIncludeLunch: false
      },
      toChildData: {}, //传递给子组件统计表的数据
      isNameFixed: true, //name是否固定
      isShowPrintView: false, //是否显示打印排版
      hiprintTemplate: null, //打印实例
      //打印模板
      customPrintJson: {
        panels: [
          {
            index: 0,
            height: 297,
            width: 210,
            paperHeader: 40.5,
            paperFooter: 780,
            printElements: [
              {
                options: {
                  left: 10,
                  top: 35,
                  height: 44,
                  width: 825,
                  field: "table",
                  columns: [[]]
                },
                printElementType: {
                  title: "表格",
                  type: "tableCustom"
                }
              }
            ],
            paperNumberLeft: 565.5,
            paperNumberTop: 819
          }
        ]
      },
      //打印数据
      printData: {
        table: []
      }
    };
  },
  components: {
    PrintPreview,
    StatisticalTable
  },
  created() {
    axios({
      url: `/schedule`,
      method: "POST",
      data: {
        operationName: "getPeriods",
        query: ` query getPeriods{ 
                    Work:period(periodType:0){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    Vacation:period(periodType:1){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    WorkOverTime:period(periodType:2){
                        id,name,color,startTime,endTime,isIncludeLunch
                    }
                    WorkArea:workArea{
                        id,name
                    }
                }`,
        variables: {}
      }
    })
      .then(res => {
        for (const key in res.data.data) {
          res.data.data[key].forEach(element => {
            element.IsActive = false;
            if (key == "WorkArea") {
              element.IsPeriod = false;
              element.PeriodType = 0;
            } else {
              element.IsPeriod = true;
              if (key == "Work") {
                element.PeriodType = 0;
              } else if (key == "Vacation") {
                element.PeriodType = 1;
              } else if (key == "WorkOverTime") {
                element.PeriodType = 2;
              }
            }
          });
        }
        Object.assign(this.periodType, res.data.data);
        this.submitData.PeriodArray = this.periodType.Vacation.concat(
          this.periodType.Work,
          this.periodType.WorkOverTime
        );
      })
      .catch(err => {});
    //update
    if (this.viewModule.id) {
      this.submitData = JSON.parse(decode(this.viewModule.commandViewData));
      this.submitData.Id = this.viewModule.id;
      this.currentSelectMonth.month =
        this.submitData.YearMonth.split("-")[1] - 1;
      this.currentSelectMonth.year = this.submitData.YearMonth.split("-")[0];
    } else {
      //insert
      axios({
        url: `/basic`,
        method: "POST",
        data: {
          query: `query getStaffs{
                        staff(clinicId:${this.UserInfo.ClinicId}){
                            id,name,clinicId
                        }
                    }`
        }
      })
        .then(res => {
          res.data.data.staff.forEach(element => {
            element.Periods = [];
            element.StaffId = element.id;
            element.StaffName = element.name;
            element.WorkAreas = [];
            element.WorkAreaString = "";
          });
          this.submitData.Staffs = res.data.data.staff;
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.rowDrop();
    $(document).keydown(event => {
      if (event.keyCode == 46 || event.keyCode == 8) {
        this.deleteSelectedAreaPeriods();
      }
    });
  },
  provide() {
    return {
      closePrintView: this.closePrintView,
      startPrinting: this.startPrinting,
      printDesign: this.printDesign,
      rotatePrintPaper: this.rotatePrintPaper,
      closeStatisticalTable: this.closeStatisticalTable
    };
  },
  methods: {
    closeStatisticalTable() {
      this.isShowStatisticalTable = false;
    },
    //统计表展现
    statisticalTableView() {
      this.toChildData = JSON.parse(JSON.stringify(this.submitData));
      this.isShowStatisticalTable = true;
    },
    //过滤表头change (by PeriodType)
    filterHeadChange(val) {
      let str = "";
      if (val == 0) {
        str = "常日班";
      } else if (val == 1) {
        str = "休假";
      } else if (val == 2) {
        str = "备班";
      }
      $(".filterHeaderByPeriodType input").val(str);
    },
    //过滤表头change (by PeriodId)
    filterHeadByPeriodIdChange(val) {
      $(".filterHeaderByPeriodId input").val(
        this.submitData.PeriodArray.filter(element => {
          return element.id === val;
        })[0].name
      );
    },
    //显示popover详情
    displayPopover(obj) {
      if (obj.PeriodId) {
        Object.assign(
          this.displayedPeriodMsg,
          this.submitData.PeriodArray.filter(element => {
            return element.id === obj.PeriodId;
          })[0]
        );
      }
    },
    //确认提交
    confirmSubmit() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.submitData.Name,
            type: "StringNotEmpty",
            msg: "班表名称不能为空！"
          },
          {
            val: this.submitData.YearMonth,
            type: "StringNotEmpty",
            msg: "排班月份不能为空！"
          }
        ])
      ) {
        let method = "POST";
        if (this.viewModule.id) {
          method = "PUT";
        }
        axios({
          url: `/api/PlanDailySchedule`,
          method: method,
          data: this.submitData
        }).then(res => {
          let type;
          if (res.data.Code == 200) {
            type = "success";
            this.managementReload();
          } else {
            type = "error";
          }
          this.showInformation({
            classify: "message",
            msg: res.data.Msg,
            type: type
          });
        });
      }
    },
    //cell 点击事件
    tableCellClick(obj) {
      if (this.activePeriod.id) {
        obj.PeriodId = this.activePeriod.id;
        obj.PeriodName = this.activePeriod.name;
        obj.IsIncludeLunch = this.activePeriod.isIncludeLunch;
        obj.PeriodType = this.activePeriod.PeriodType;
      }
      let cellState = this.submitData.Staffs[obj.RowIndex].Periods[
        obj.ColumnIndex
      ].IsCellActive;
      this.resetCellStatus();
      obj.IsCellActive = !cellState;
      this.$forceUpdate();
    },
    //工作区域点击事件
    workAreaCellClick(obj) {
      if (
        this.activeWorkArea.id &&
        !obj.WorkAreas.includes(this.activeWorkArea.id)
      ) {
        obj.WorkAreas.push(this.activeWorkArea.id);
        if (obj.WorkAreaString) {
          obj.WorkAreaString += "," + this.activeWorkArea.name;
        } else {
          obj.WorkAreaString += this.activeWorkArea.name;
        }
      }
    },
    //删除选中的排班
    deleteSelectedAreaPeriods() {
      for (let i = 0; i < this.submitData.Staffs.length; i++) {
        for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
          if (this.submitData.Staffs[i].Periods[j].IsCellActive) {
            this.submitData.Staffs[i].Periods[j].PeriodId = 0;
            this.submitData.Staffs[i].Periods[j].PeriodName = "";
            this.submitData.Staffs[i].Periods[j].IsIncludeLunch = false;
            this.submitData.Staffs[i].Periods[j].PeriodType = null;
          }
        }
      }
    },
    //cell 鼠标按下事件
    tableCellMousedown(obj) {
      this.keyDownPosition[0] = obj.RowIndex;
      this.keyDownPosition[1] = obj.ColumnIndex;
    },
    //cell 鼠标进入事件
    tableCellMouseenter(obj) {
      if (this.keyDownPosition.length > 0) {
        let minRowIndex = Math.min(obj.RowIndex, this.keyDownPosition[0]);
        let maxRowIndex = Math.max(obj.RowIndex, this.keyDownPosition[0]);
        let minColumnIndex = Math.min(obj.ColumnIndex, this.keyDownPosition[1]);
        let maxColumnIndex = Math.max(obj.ColumnIndex, this.keyDownPosition[1]);
        for (let i = 0; i < this.submitData.Staffs.length; i++) {
          for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
            if (
              this.submitData.Staffs[i].Periods[j].RowIndex >= minRowIndex &&
              this.submitData.Staffs[i].Periods[j].RowIndex <= maxRowIndex &&
              this.submitData.Staffs[i].Periods[j].ColumnIndex <=
                maxColumnIndex &&
              this.submitData.Staffs[i].Periods[j].ColumnIndex >= minColumnIndex
            ) {
              this.submitData.Staffs[i].Periods[j].IsCellActive = true;
            } else {
              this.submitData.Staffs[i].Periods[j].IsCellActive = false;
            }
          }
        }
      }
    },
    //cell 鼠标抬起事件
    tableCellMouseup(obj) {
      if (this.keyDownPosition.length > 0) {
        let minRowIndex = Math.min(obj.RowIndex, this.keyDownPosition[0]);
        let maxRowIndex = Math.max(obj.RowIndex, this.keyDownPosition[0]);
        let minColumnIndex = Math.min(obj.ColumnIndex, this.keyDownPosition[1]);
        let maxColumnIndex = Math.max(obj.ColumnIndex, this.keyDownPosition[1]);
        for (let i = 0; i < this.submitData.Staffs.length; i++) {
          for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
            if (
              this.submitData.Staffs[i].Periods[j].RowIndex >= minRowIndex &&
              this.submitData.Staffs[i].Periods[j].RowIndex <= maxRowIndex &&
              this.submitData.Staffs[i].Periods[j].ColumnIndex <=
                maxColumnIndex &&
              this.submitData.Staffs[i].Periods[j].ColumnIndex >= minColumnIndex
            ) {
              if (this.activePeriod.id) {
                this.submitData.Staffs[i].Periods[
                  j
                ].PeriodId = this.activePeriod.id;
                this.submitData.Staffs[i].Periods[
                  j
                ].PeriodName = this.activePeriod.name;
                this.submitData.Staffs[i].Periods[
                  j
                ].IsIncludeLunch = this.activePeriod.isIncludeLunch;
                this.submitData.Staffs[i].Periods[
                  j
                ].PeriodType = this.activePeriod.PeriodType;
              }
            }
          }
        }
      }
      this.keyDownPosition = [];
      this.$forceUpdate();
    },
    //重置班种激活状态
    resetPeriodStatus() {
      this.submitData.PeriodArray.map(element => (element.IsActive = false));
      this.periodType.WorkArea.map(item => (item.IsActive = false));
    },
    //重置cell激活状态
    resetCellStatus() {
      this.submitData.Staffs.forEach(element => {
        element.Periods.map(item => {
          item.IsCellActive = false;
          return item;
        });
      });
    },
    //切换班种激活状态
    switchPeriodStatus(obj) {
      let periodState = obj.IsActive;
      this.resetPeriodStatus(obj);
      obj.IsActive = !periodState;
      if (obj.IsActive) {
        if (obj.IsPeriod) {
          Object.assign(this.activePeriod, obj);
          this.activeWorkArea = {};
        } else {
          Object.assign(this.activeWorkArea, obj);
          this.activePeriod = {};
        }
      } else {
        this.activePeriod = {};
        this.activeWorkArea = {};
      }
    },
    //年月change事件
    dateChange(val) {
      let { year, month } = this.getNewDate(new Date(val + "-01"));
      this.currentSelectMonth.year = year;
      this.currentSelectMonth.month = month;
      this.setCalendarDate();
    },
    //设置日期
    setCalendarDate() {
      this.submitData.Days = [];
      let thisMonthDays = new Date(
        this.currentSelectMonth.year,
        this.currentSelectMonth.month + 1,
        0
      ).getDate();
      for (let i = 1; i <= thisMonthDays; i++) {
        this.submitData.Days.push({
          day: i < 10 ? "0" + i : i + "",
          isWeekend: this.isWeekend(
            new Date(
              this.currentSelectMonth.year,
              this.currentSelectMonth.month,
              i
            )
          )
        });
      }
      this.initData();
    },
    //初始化数据
    initData() {
      this.submitData.Staffs.forEach(element => {
        element.Periods = [];
        this.submitData.Days.forEach(item => {
          element.Periods.push({
            Day: item.day,
            PeriodId: 0,
            PeriodName: "",
            IsIncludeLunch: false,
            IsWeekend: item.isWeekend,
            IsCellActive: false,
            IsCheckIn: false,
            PeriodType: null
          });
        });
      });
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(
        "#schedulingWork .el-table__body-wrapper tbody"
      );
      var sortable = new Sortable(tbody, {
        handle: ".draggable",
        animation: 180,
        delay: 0,
        onEnd: ({ newIndex, oldIndex }) => {
          const currRow = this.submitData.Staffs.splice(oldIndex, 1)[0];
          this.submitData.Staffs.splice(newIndex, 0, currRow);
        }
      });
    },
    //获取年月日
    getNewDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth();
      return {
        year,
        month
      };
    },
    //禁用日期
    disabledDate(time) {
      for (let i = 0; i < this.scheduledWorks.length; i++) {
        if (
          new Date(time.getTime() + 24 * 3600 * 1000)
            .toJSON()
            .substring(0, 7) == this.scheduledWorks[i].yearMonth
        ) {
          return true;
        }
      }
    },
    //旋转打印纸张
    rotatePrintPaper() {
      this.hiprintTemplate.rotatePaper();
    },
    //打印排版
    printView() {
      if (this.submitData.Days != "") {
        let printTablefields = [
          {
            title: "序号",
            field: "Index",
            width: 120,
            colspan: 1,
            align: "center",
            rowspan: 1
          },
          {
            title: "姓名",
            field: "StaffName",
            width: 200,
            colspan: 1,
            align: "center",
            rowspan: 1
          }
        ];
        this.submitData.Days.forEach(element => {
          printTablefields.push({
            title: element.day + "日",
            field: "Day" + element.day,
            width: 120,
            colspan: 1,
            align: "center",
            rowspan: 1
          });
        });
        printTablefields.push({
          title: "工作区域",
          field: "WorkAreaString",
          width: 400,
          colspan: 1,
          align: "center",
          rowspan: 1
        });
        this.customPrintJson.panels[0].printElements[0].options.columns[0] = printTablefields;
        this.customPrintJson.panels[0].printElements.push({
          options: {
            left: 10,
            top: 5,
            height: 25,
            width: 259,
            title: `${this.submitData.Name}         ${this.submitData.YearMonth}`,
            fontSize: 19,
            fontWeight: "600",
            textAlign: "center",
            lineHeight: 26
          },
          printElementType: {
            title: "自定义文本",
            type: "text"
          }
        });
        this.hiprintTemplate = new hiprint.PrintTemplate({
          template: this.customPrintJson,
          settingContainer: "#PrintElementOptionSetting",
          paginationContainer: ".hiprint-printPagination"
        });
        this.isShowPrintView = true;
      } else {
        this.showInformation({
          classify: "message",
          msg: "请先选择月份！"
        });
      }
    },
    //打印设计
    printDesign() {
      this.hiprintTemplate.design("#hiprint-printTemplate");
      if (this.hiprintTemplate.getOrient() === 1) {
        this.rotatePrintPaper();
      }
    },
    //开始打印
    startPrinting() {
      let printArr = [];
      for (let i = 0; i < this.submitData.Staffs.length; i++) {
        let obj = {};
        obj["Index"] = i + 1;
        Object.assign(obj, this.submitData.Staffs[i]);
        for (let j = 0; j < this.submitData.Staffs[i].Periods.length; j++) {
          obj[
            "Day" + this.submitData.Staffs[i].Periods[j].Day
          ] = this.submitData.Staffs[i].Periods[j].PeriodName;
        }
        printArr.push(obj);
      }
      this.printData.table = printArr;
      this.hiprintTemplate.print(this.printData);
    },
    //关闭预览
    closePrintView() {
      this.isShowPrintView = false;
    },
    //是否是周末
    isWeekend(date) {
      if (date.getDay() === 6 || date.getDay() === 0) {
        return true;
      } else {
        return false;
      }
    },
    //取消提交
    cancelSubmit() {
      this.$emit("to-father");
    },
    //时间格式化
    formatTime(time) {
      let hour = Math.floor(time / 3600);
      let minute = (time % 3600) / 60;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      return `${hour}:${minute}`;
    },
    //获取最大长度
    getMaxLength(arr) {
      let maxNumber = arr.reduce((acc, item) => {
        if (item) {
          const str = item.WorkAreaString.toString();
          const char = str.match(/[\u2E80-\u9FFF]/g);
          const charLen = char ? char.length : 0;
          const num = str.match(/\d|\./g);
          const numLen = num ? num.length : 0;
          const otherLen = str.length - charLen - numLen;
          let calcLen = charLen * 1.1 + numLen * 0.65 + otherLen * 0.5;

          if (acc < calcLen) {
            acc = calcLen;
          }
        }
        return acc;
      }, 0);
      return maxNumber * 18 > 100 ? maxNumber * 18 : 100;
    }
  },
  computed: {
    initCellData() {
      return (periodObj, rowIndex, columnIndex) => {
        periodObj.RowIndex = rowIndex;
        periodObj.ColumnIndex = columnIndex;
        return periodObj.PeriodName;
      };
    },
    //计算午餐数
    countTotalIncludeLunchNumber() {
      return index => {
        return this.submitData.Staffs[index].Periods.filter(element => {
          return element.IsIncludeLunch == true;
        }).length;
      };
    },
    //按班类计算
    countTotalByPeriodType() {
      return index => {
        if (this.filteredByPeriodType === null) {
          return 0;
        } else {
          return this.submitData.Staffs[index].Periods.filter(element => {
            return element.PeriodType == this.filteredByPeriodType;
          }).length;
        }
      };
    },
    //按班种计算
    countTotalByPeriodId() {
      return index => {
        if (this.filteredByPeriodId === null) {
          return 0;
        } else {
          return this.submitData.Staffs[index].Periods.filter(element => {
            return element.PeriodId == this.filteredByPeriodId;
          }).length;
        }
      };
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableTotalBottomBar";

.schedulePopper {
  ol {
    li {
      display: flex;

      span {
        width: 90px;
        font-size: 16px;
        color: #878d9f;
        text-align: right;

        &.popover_day {
          width: 70px;
        }
      }

      b {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
  }
}

#schedulingWork {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
  z-index: 9;
  box-sizing: border-box;

  .container {
    height: 100%;
    padding: 30px 40px;
    box-sizing: border-box;
    overflow-y: auto;

    .scheduleMsg {
      display: flex;
      justify-content: space-between;

      > ul {
        display: flex;
        line-height: 40px;

        li {
          display: flex;
          justify-content: space-between;
          width: 240px;
          margin-right: 100px;

          p {
            width: 70px;
            font-size: 16px;
            color: #878d9f;
            text-align: right;
          }

          .el-input {
            width: 160px;
          }

          .el-input__inner {
            font-weight: bold;
            font-size: 16px;
            color: #333;
          }
        }
      }

      p {
        .el-button {
          border: 1px solid #00c16b;
          background: #fff;
          color: #00c16b;
          width: 120px;
          height: 40px;
          box-sizing: border-box;
          font-size: 18px;

          &.el-button--primary {
            background: #00c16b;
            color: #fff;
          }
        }
      }
    }

    .workSheetRemark {
      border-bottom: 1px solid #f2f4f7;
      display: flex;
      padding: 20px 0;

      p {
        width: 70px;
        font-size: 16px;
        color: #878d9f;
        text-align: right;
      }

      .el-textarea {
        width: 520px;
        margin-left: 10px;
        height: 100px;

        textarea {
          height: 100%;
          font-weight: bold;
          font-size: 16px;
          color: #333;
          font-family: Microsoft YaHei;

          &::-webkit-input-placeholder {
            font-weight: normal;
          }
        }
      }
    }

    dl {
      margin: 20px 0;
      display: flex;

      dt {
        .el-select {
          width: 160px;

          .el-input__inner {
            font-weight: bold;
            font-size: 16px;
            color: #333;
          }
        }
      }

      dd {
        display: flex;

        .el-tag {
          height: 40px;
          line-height: 40px;
          box-sizing: border-box;
          margin-left: 40px;
          font-size: 18px;
          cursor: pointer;
          color: #232e41;
          border-color: #232e41;
          background: #fff;
          user-select: none;

          &.is-active {
            border-color: #00c16b;
            background: #e0fff1;
            color: #00c16b;
          }
        }
      }
    }

    .el-table {
      cursor: pointer;

      thead {
        th {
          text-align: center;
          font-size: 18px;
          color: #878d9f;

          &.is-weekend {
            background: #e0fff1;
          }

          &.header_name_th {
            .cell {
              line-height: 23px;
              height: 23px;

              .header_name {
                display: flex;
                line-height: 23px;
                padding: 0;

                i {
                  width: 14px;
                  height: 20px;
                  margin-left: 4px;

                  &.locked {
                    background: url(../../assets/images/locked.png) center
                      no-repeat;
                    background-size: 14px 20px;
                  }

                  &.unclock {
                    background: url(../../assets/images/unclock.png) center
                      no-repeat;
                    background-size: 14px 20px;
                  }
                }
              }
            }
          }

          &.filterHeader {
            padding: 0;

            div {
              height: 40px;
              padding: 0;

              input {
                border: 0;
                padding: 0 20px 0 5px;
                font-size: 18px;
                color: #878d9f;
              }
            }
          }
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

            &.is-weekend {
              background: #e0fff1;
            }

            .cell {
              text-align: center;
              padding: 0;
              user-select: none;
              white-space: nowrap;

              .periodItem,
              .computedCell {
                user-select: none;
                height: 40px;
                line-height: 40px;
                color: #232e41;
                font-size: 18px;
                font-weight: bold;

                &.is-cell-active {
                  background: rgba(153, 153, 255, 0.5);
                }
              }

              .workAreaItem {
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
    }
  }
}
</style>
