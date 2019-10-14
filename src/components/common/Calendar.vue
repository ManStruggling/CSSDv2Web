<template>
  <div id="myCalendar">
    <div class="calendar_header">
      <div class="calendar_box">
        <p>我的日程</p>
        <el-date-picker
          v-model="currentSelect"
          type="month"
          :default-value="new Date()"
          :clearable="false"
          placeholder="选择月"
          format="yyyy-MM"
          value-format="yyyy-MM"
          @change="monthChange"
        ></el-date-picker>
      </div>
    </div>
    <div class="calendar_body">
      <ol>
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ol>
      <ul class="calendar_body_ul">
        <li
          class="date_view"
          v-for="(item,index) in visibleCalendar"
          :key="index"
          :class="[
                    {'other_month': !item.isCurrentMonth},
                    {todayBg: item.isCurrentDay},
                    {handleDay: item.clickDay}
                ]"
          @click="handleClickDay(item)"
        >
          <p v-show="item.isCurrentMonth">{{item.day}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    let { year, month, day } = this.getNewDate(new Date());
    return {
      currentSelect: `${year}-${month + 1}`, //当前月份
      currentDate: { year, month, day },
      currentSelectMonth: { year, month },
      visibleCalendar: []
    };
  },
  created() {
    this.setCalendarDate();
  },
  methods: {
    //获取年月日
    getNewDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      return { year, month, day };
    },
    // 是否是今天
    isCurrentDay(date) {
      let { year, month, day } = this.getNewDate(date);
      return (
        this.currentDate.year == year &&
        this.currentDate.month == month &&
        this.currentDate.day == day
      );
    },
    // 是否是当前月
    isCurrentMonth(date) {
      let { year, month } = this.getNewDate(date);
      return (
        this.currentSelectMonth.year == year &&
        this.currentSelectMonth.month == month
      );
    },
    //点击某一天
    handleClickDay(item) {
      if (item.isCurrentMonth) {
        this.visibleCalendar.map(x => {
          x.clickDay = false;
        });
        this.$set(item, "clickDay", true);
      }
    },
    //月份改变
    monthChange(val) {
      this.currentSelectMonth = {
        year: Number(val.split("-")[0]),
        month: val.split("-")[1] - 1
      };
      this.setCalendarDate();
    },
    //获取日历日期
    setCalendarDate() {
      this.visibleCalendar = [];
      //当月一号的时间
      let currentFirstDay = new Date(
        this.currentSelectMonth.year,
        this.currentSelectMonth.month,
        1
      );
      // 获取当前月第一天星期几
      let weekDay = currentFirstDay.getDay();
      let startTime = currentFirstDay - weekDay * 24 * 60 * 60 * 1000;
      for (let i = 0; i < 42; i++) {
        let dateItem = {
          date: new Date(startTime + i * 24 * 60 * 60 * 1000),
          year: this.currentSelectMonth.year,
          month: this.currentSelectMonth.month + 1,
          day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
          clickDay: false
        };
        dateItem.isCurrentMonth = this.isCurrentMonth(dateItem.date);
        dateItem.isCurrentDay = this.isCurrentDay(dateItem.date);
        this.visibleCalendar.push(dateItem);
      }
    }
  }
};
</script>

<style lang="scss">
#myCalendar {
  .calendar_header {
    .calendar_box {
      height: 70px;
      display: flex;
      justify-content: space-between;
      p {
        font-size: 24px;
        font-weight: bold;
        color: #232e41;
        font-family: Microsoft YaHei;
      }
      .el-date-editor {
        width: 120px;
        height: 30px;
        .el-input__inner {
          height: 30px;
          line-height: 30px;
          padding: 0 0 0 10px;
          box-sizing: border-box;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          font-family: Microsoft YaHei;
        }
        .el-input__prefix {
          display: none;
        }
      }
    }
  }
  .calendar_body {
    width: 700px;
    text-align: center;
    > ol {
      display: flex;
      background: #f7f8fa;
      height: 40px;
      line-height: 40px;
      li {
        flex: 1;
        font-size: 18px;
        font-family: Microsoft YaHei;
        color: #878d9f;
      }
    }
    .calendar_body_ul {
      display: flex;
      flex-wrap: wrap;
      .date_view {
        width: 100px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        border-bottom: 1px solid #f1f2f5;
        &.todayBg {
          background: #00c16b;
          &.other_month{
            background:transparent;
          }
        }
        // &.other_month {
        //   background: #eee;
        // }
        &.handleDay {
          background: #99f;
        }
      }
    }
  }
}
</style>