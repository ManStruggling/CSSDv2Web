<template>
  <div class="cssd_echars">
    <ul>
      <li>
        <p>设备编号</p>
        <span>{{deviceDetail.TotalTime}}</span>
      </li>
      <li>
        <p>总锅次</p>
        <span>{{deviceDetail.CycleCount}}</span>
      </li>
      <li>
        <p>当日锅次</p>
        <span>{{deviceDetail.Load}}</span>
      </li>
      <li>
        <p>排气时间</p>
        <span>{{deviceDetail.ExhaustTime}}</span>
      </li>
      <li>
        <p>最高温度</p>
        <span>{{deviceDetail.MaxTemperature}}</span>
      </li>
      <li>
        <p>最低温度</p>
        <span>{{deviceDetail.MinTemperature}}</span>
      </li>
      <li>
        <p>准备时间</p>
        <span>{{deviceDetail.PrepareTime}}</span>
      </li>
      <li>
        <p>开始时间</p>
        <span>{{deviceDetail.StartDateTime}}</span>
      </li>
      <li>
        <p>灭菌时间</p>
        <span>{{deviceDetail.SterilizeTime}}</span>
      </li>
      <li>
        <p>总共用时</p>
        <span>{{deviceDetail.TotalTime}}</span>
      </li>
    </ul>
    <div class="echars_box">
      <div class="device_echars"></div>
    </div>
    <i class="close_btn el-icon-close" @click="closeEchars"></i>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    echarsData: {
      type: Object
    }
  },
  data() {
    return {
      deviceDetail: {
        CycleCount: 0,
        ExhaustTime: "",
        Load: "",
        MaxTemperature: "",
        MinTemperature: "",
        Numbering: "",
        PrepareTime: "",
        StartDateTime: "",
        SterilizeTime: "",
        TotalTime: ""
      },
      option: {
        color: ["#00C050", "#5170FF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "line"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: [
            { name: "温度", icon: "roundRect" },
            { name: "压强", icon: "roundRect" }
          ],
          textStyle: {
            color: "#878D9F"
          }
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "温度",
            min: -250,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} °C"
            }
          },
          {
            type: "value",
            name: "压强",
            min: -500,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: "{value} KPa"
            }
          }
        ],
        series: [
          {
            name: "温度",
            type: "line",
            smooth: true,
            data: [],
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#A0F3C8" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#00C050" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
          {
            name: "压强",
            type: "line",
            smooth: true,
            data: [],
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#A0B1FF" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#5170FF" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.option.xAxis[0].data = this.echarsData.Graph.times;
    this.option.series[0].data = this.echarsData.Graph.temperature;
    this.option.series[1].data = this.echarsData.Graph.pressure;
    Object.assign(this.deviceDetail, this.echarsData);
    this.setEchars();
  },
  methods: {
    setEchars() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.querySelector(".device_echars"));
      // 绘制图表
      myChart.setOption(this.option);
    },
    closeEchars() {
      this.$emit("echars-to-father");
    }
  }
};
</script>

<style lang="scss" scoped>
.cssd_echars {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 80px;
  margin: auto;
  background: #fff;
  padding: 30px 40px;
  overflow-y: auto;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      width: 240px;
      margin-right: 120px;
      margin-bottom: 30px;
      p {
        width: 74px;
        font-size: 16px;
        color: #878d9f;
      }
      span {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-left: 16px;
      }
    }
  }
  .echars_box {
    box-shadow: 0px 0px 10px 0px rgba(51, 62, 80, 0.1);
    border-radius: 4px;
    padding: 20px;
    .device_echars {
      height: 600px;
    }
  }
  .close_btn {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 40px;
    color: #ccc;
    cursor: pointer;
  }
}
</style>