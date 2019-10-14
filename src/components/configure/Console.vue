<template>
  <div class="cssd_box" id="systemConsole">
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
        <div class="myEchars"></div>
        <div class="changeEcharsData">
          <el-date-picker
            v-model="value2"
            type="daterange"
            align="right"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <ul>
          <li class="expiredList">
            <dl>
              <dt>过期包预警</dt>
              <dd>
                <ol>
                  <li></li>
                </ol>
              </dd>
            </dl>
          </li>
          <li class="unqualifiedList">
            <dl>
              <dt>不合格包</dt>
              <dd></dd>
            </dl>
          </li>
          <li class="borrowList">
            <dl>
              <dt>借包</dt>
              <dd></dd>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value2: '',
      option: {
        //标题
        title: {
          text: "工作量",
          textStyle: {
            color: "#232E41",
            fontSize: 24
          }
        },
        //图例
        legend: {
          // type:"scroll",
          data: [
            "回收数",
            "清洗数",
            "配包数",
            "灭菌数",
            "发放数",
            "回收累积数",
            "清洗累积数",
            "配包累积数",
            "灭菌累积数",
            "发放累积数"
          ],
          left: 0,
          top: 40
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        //工具箱
        toolbox: {
          orient: "orient",
          top: 130,
          right: 20,
          itemGap: 20,
          feature: {
            dataZoom: { show: true },
            dataView: { show: true, readOnly: true },
            magicType: {
              show: true,
              type: ["line", "bar", "pie", "stack", "tiled"]
            },
            restore: { show: true },
            saveAsImage: {
              show: true
            }
          },
          iconStyle: {
            borderColor: "#00C16B",
            textPosition: "bottom",
            shadowOffsetY: 0
          },
          emphasis: {
            iconStyle: {
              borderColor: "#00C16B"
            }
          }
        },
        parallel: {
          left: 0
        },
        // label: {
        //   show: true
        //   // position:"top"
        // },
        // dataZoom: [
        //   {
        //     type: "slider",
        //     xAxisIndex: 0,
        //     filterMode: "empty"
        //   },
        //   {
        //     type: "slider",
        //     yAxisIndex: 0,
        //     filterMode: "empty"
        //   },
        //   {
        //     type: "inside",
        //     xAxisIndex: 0,
        //     filterMode: "empty"
        //   },
        //   {
        //     type: "inside",
        //     yAxisIndex: 0,
        //     filterMode: "empty"
        //   }
        // ],
        xAxis: {
          type: "category",
          data: [],
          axisPointer: {
            type: "shadow"
          },
          axisLabel:{
            color:"#878D9F",
            fontFamily:"Microsoft YaHei",
            fontSize:18,
            margin:20
          },
          axisTick:{
            show:false
          }
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: "{value}",
            color:"#878D9F",
            fontFamily:"Microsoft YaHei",
            fontSize:18,
          },
          axisLine: {
            show: false
          },
          axisTick:{
            show:false
          }
        },
        grid: {
          left: 40,
          top: 100,
          right:80,
          bottom:40
        },
        series: [
          {
            type: "bar",
            name: "回收数",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#FFD472"
                  },
                  {
                    offset: 1,
                    color: "#FF9A00"
                  }
                ])
              }
            },
            data: []
          },
          {
            type: "line",
            name: "回收累积数",
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#FFD472" },
                  { offset: 1, color: "#FF9A00" }
                ])
              }
            },
            data: []
          },
          {
            type: "bar",
            name: "清洗数",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#FF7688"
                  },
                  {
                    offset: 1,
                    color: "#FF5C6A"
                  }
                ])
              }
            },
            data: []
          },
          {
            type: "line",
            name: "清洗累积数",
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#FF7688" },
                  { offset: 1, color: "#FF5C6A" }
                ])
              }
            },
            data: []
          },
          {
            type: "bar",
            name: "配包数",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#D5A9FF"
                  },
                  {
                    offset: 1,
                    color: "#6701C8"
                  }
                ])
              }
            },
            data: []
          },
          {
            type: "line",
            name: "配包累积数",
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#D5A9FF" },
                  { offset: 1, color: "#6701C8" }
                ])
              }
            },
            data: []
          },
          {
            type: "bar",
            name: "灭菌数",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#A0F3CB"
                  },
                  {
                    offset: 1,
                    color: "#00C050"
                  }
                ])
              }
            },
            data: []
          },
          {
            type: "line",
            name: "灭菌累积数",
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#A0F3CB" },
                  { offset: 1, color: "#00C050" }
                ])
              }
            },
            data: []
          },
          {
            type: "bar",
            name: "发放数",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#A0B1FF"
                  },
                  {
                    offset: 1,
                    color: "#5170FF"
                  }
                ])
              }
            },
            data: []
          },
          {
            type: "line",
            name: "发放累积数",
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#A0B1FF" },
                  { offset: 1, color: "#5170FF" }
                ])
              }
            },
            data: []
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    // this.$notify({
    //       title: '提示',
    //       message: '这是一条不会自动关闭的消息',
    //       duration: 0
    //     });
    axios({ url: "/api/MainConsole" }).then(res => {
      if (res.data.Code == 200) {
        this.insertData(res.data.Data.MixedLineAndBar);
      } else {
      }
    });
  },
  methods: {
    SetEchart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.querySelector(".myEchars"));
      // 绘制图表
      myChart.setOption(this.option);
    },
    //插入数据
    insertData(data) {
      this.option.xAxis.data = data.xAxis;
      for (let i = 0; i < data.series.length; i++) {
        for (let j = 0; j < this.option.series.length; j++) {
          if (data.series[i].name == this.option.series[j].name) {
            this.option.series[j].data = data.series[i].data;
            break;
          }
        }
      }
      this.SetEchart();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
#systemConsole {
  .cssd_table_center {
    height: 100%;
    .table_box {
      height: 100%;
      padding: 30px;
      box-sizing: border-box;
      overflow-y: scroll;
      position: relative;
      .myEchars {
        height: 660px;
        width: 100%;
        box-shadow: 0px 0px 10px 0px rgba(51, 62, 80, 0.1);
        border-radius: 4px;
        padding: 30px 40px;
        box-sizing: border-box;
      }
      .changeEcharsData{
        position: absolute;
        right: 70px;
        top: 74px;
        width: 650px;
        height: 40px;
        .el-date-editor{
          font-size:16px;
font-family:Microsoft YaHei;
font-weight:bold;
color:rgba(51,51,51,1);
        }
      }
      ul {
        display: flex;
        margin-top: 20px;
        > li {
          height: 355px;
          flex: 1;
          dl {
            box-shadow: 0px 0px 10px 0px rgba(51, 62, 80, 0.1);
            border-radius: 4px;
            width: 100%;
            height: 100%;
            padding: 20px 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            dt {
              font-size: 24px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(35, 46, 65, 1);
              line-height: 31px;
              padding-bottom: 20px;
            }
            dd {
              flex: 1;
              overflow-y: scroll;
              ol {
                li {
                  height: 44px;
                  line-height: 44px;
                  font-size: 18px;
                  font-family: Microsoft YaHei;
                  color: rgba(35, 46, 65, 1);
                  line-height: 24px;
                }
              }
            }
          }
        }
        li.expiredList {
          padding: 0 10px 0 0;
        }
        li.unqualifiedList {
          padding: 0 10px;
        }
        li.borrowList {
          padding: 0 0 0 10px;
        }
      }
    }
  }
}
</style>