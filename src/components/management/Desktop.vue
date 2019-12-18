<template>
<div class="basic_main" id="managementHome">
    <ul class="desktop_box">
        <!-- 任务进度 -->
        <li class="desktop_box_li taskProgress">
            <div class="li_head">
                <p>任务进度</p>
                <span>{{formatTime}}</span>
            </div>
            <div class="li_content">
                <div class="li_content_title">
                    <p class="p_name">岗位</p>
                    <p>应完成数</p>
                    <p>实际完成数</p>
                    <p class="progress_p">完成度</p>
                </div>
                <ol>
                    <li>
                        <p class="p_name">回收</p>
                        <p>{{setProgressData("RecycleTaskForConsole","ShouldCompletedCount")}}包</p>
                        <p>{{setProgressData("RecycleTaskForConsole","AlreadyCompleteCount")}}包</p>
                        <p class="progress_p">
                            <el-progress v-if="desktopData.TaskSchedule.RecycleTaskForConsole" :percentage="countPercentage('RecycleTaskForConsole')"></el-progress>
                        </p>
                    </li>
                    <li>
                        <p class="p_name">清洗消毒</p>
                        <p>{{setProgressData("CleanTaskForConsole","ShouldCompletedCount")}}包</p>
                        <p>{{setProgressData("CleanTaskForConsole","AlreadyCompleteCount")}}包</p>
                        <p class="progress_p">
                            <el-progress v-if="desktopData.TaskSchedule.RecycleTaskForConsole" :percentage="countPercentage('CleanTaskForConsole')"></el-progress>
                        </p>
                    </li>
                    <li>
                        <p class="p_name">配包</p>
                        <p>{{setProgressData("PackageTaskForConsole","ShouldCompletedCount")}}包</p>
                        <p>{{setProgressData("PackageTaskForConsole","AlreadyCompleteCount")}}包</p>
                        <p class="progress_p">
                            <el-progress v-if="desktopData.TaskSchedule.RecycleTaskForConsole" :percentage="countPercentage('PackageTaskForConsole')"></el-progress>
                        </p>
                    </li>
                    <li>
                        <p class="p_name">灭菌</p>
                        <p>{{setProgressData("SterilizeTaskForConsole","ShouldCompletedCount")}}包</p>
                        <p>{{setProgressData("SterilizeTaskForConsole","AlreadyCompleteCount")}}包</p>
                        <p class="progress_p">
                            <el-progress v-if="desktopData.TaskSchedule.RecycleTaskForConsole" :percentage="countPercentage('SterilizeTaskForConsole')"></el-progress>
                        </p>
                    </li>
                    <li>
                        <p class="p_name">发放</p>
                        <p>{{setProgressData("ProvideTaskForConsole","ShouldCompletedCount")}}包</p>
                        <p>{{setProgressData("ProvideTaskForConsole","AlreadyCompleteCount")}}包</p>
                        <p class="progress_p">
                            <el-progress v-if="desktopData.TaskSchedule.RecycleTaskForConsole" :percentage="countPercentage('ProvideTaskForConsole')"></el-progress>
                        </p>
                    </li>
                </ol>
            </div>
        </li>
        <!-- 我的日程 -->
        <li class="desktop_box_li">
            <div class="li_content">
                <MyCalendar></MyCalendar>
            </div>
        </li>
        <!-- 不合格因素占比 -->
        <li class="desktop_box_li desktop_box_lix480">
            <div class="li_head">
                <p>不合格因素占比</p>
            </div>
            <div class="myEchars li_content"></div>
        </li>
        <!-- 借包天数 -->
        <li class="desktop_box_li desktop_box_lix480">
            <div class="li_head">
                <p>借包天数</p>
            </div>
            <div class="li_content">
                <ol>
                    <li>
                        <p class="p_name">XXXX科室</p>
                        <p class="p_name">骨穿包</p>
                        <p>4个</p>
                        <p>5天</p>
                    </li>
                    <li>
                        <p class="p_name">XXXX科室</p>
                        <p class="p_name">骨穿包</p>
                        <p>4个</p>
                        <p>5天</p>
                    </li>
                    <li>
                        <p class="p_name">XXXX科室</p>
                        <p class="p_name">骨穿包</p>
                        <p>4个</p>
                        <p>5天</p>
                    </li>
                    <li>
                        <p class="p_name">XXXX科室</p>
                        <p class="p_name">骨穿包</p>
                        <p>4个</p>
                        <p>5天</p>
                    </li>
                    <li>
                        <p class="p_name">XXXX科室</p>
                        <p class="p_name">骨穿包</p>
                        <p>4个</p>
                        <p>5天</p>
                    </li>
                    <li>
                        <p class="p_name">XXXX科室</p>
                        <p class="p_name">骨穿包</p>
                        <p>4个</p>
                        <p>5天</p>
                    </li>
                </ol>
                <el-pagination background layout="prev, pager, next" :total="100" @current-change="handleBorrowedPackagesChange">
                </el-pagination>
            </div>
        </li>
        <!-- 近效期包预警 -->
        <li class="desktop_box_li desktop_box_lix480">
            <div class="li_head">
                <p>近效期包预警</p>
            </div>
            <div class="li_content">
                <div class="empty_data" v-show="expiringPackageList===null||expiringPackageList.length==0">暂无数据</div>
                <ol>
                    <li v-for="(item,index) in expiringPackageList" :key="index">
                        <p class="p_name">{{item.SubClinicName}}</p>
                        <p class="p_name">{{item.ProductName}}</p>
                        <p>{{item.ExpiringCount}}个</p>
                        <p>{{item.RemainExpiringDays}}天</p>
                    </li>
                </ol>
                <el-pagination background layout="prev, pager, next" v-if="expiringPackageList===null||expiringPackageList.length" :total="Math.ceil(expiringPackageList.length / pageSize)*10" @current-change="handleExpiringPackagesChange">
                </el-pagination>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
import echarts from "echarts";
import MyCalendar from "../common/Calendar";
export default {
    data() {
        return {
            nowDate: null,
            stampInterval: null,
            pageSize: 6, //每页条数
            expiringPackageList: [], //当前页显示的近效期包
            desktopData: {
                BorrowedPackagesConsole: {

                },
                ExpiringPackagesWarning: {
                    ExpiringPackages: []
                },
                FailedPackageFactor: {

                },
                TaskSchedule: {
                    CleanTaskForConsole: [],
                    PackageTaskForConsole: [],
                    ProvideTaskForConsole: [],
                    RecycleTaskForConsole: [],
                    SterilizeTaskForConsole: []
                }

            },
            option: {
                backgroundColor: "#fff",
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [{
                    name: "访问来源",
                    type: "pie",
                    radius: "90%",
                    center: ["50%", "50%"],
                    data: [{
                            value: 400,
                            name: "搜索引擎",
                            itemStyle: {
                                color: "#FF3948"
                            }
                        },
                        {
                            value: 335,
                            name: "直接访问",
                            itemStyle: {
                                color: "#FF7533"
                            }
                        },
                        {
                            value: 310,
                            name: "邮件营销",
                            itemStyle: {
                                color: "#FFB749"
                            }
                        },
                        {
                            value: 274,
                            name: "联盟广告",
                            itemStyle: {
                                color: "#FFDC49"
                            }
                        },
                        {
                            value: 235,
                            name: "视频广告",
                            itemStyle: {
                                color: "#96E842"
                            }
                        }
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: "radius",
                    label: {
                        normal: {
                            textStyle: {
                                color: "#232E41"
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: "#BDC6D3"
                            },
                            smooth: 0.1,
                            length: 20,
                            length2: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            // color: '#FF3948',
                            shadowBlur: 200,
                            shadowColor: "rgba(0, 0, 0, 0)"
                        }
                    },
                    animationType: "scale",
                    animationEasing: "elasticOut",
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }]
            }
        };
    },
    components: {
        MyCalendar
    },
    created() {
        this.nowDate = new Date().getTime();
        this.stampInterval = setInterval(() => {
            this.nowDate += 1000;
        }, 1000);
        axios({
            url: `/api/MainConsole/Desktop`
        }).then(res => {
            if (res.data.Code == 200) {
                this.desktopData = res.data.Data;
                this.handleExpiringPackagesChange(1);
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                });
            }
        }).catch(err => {})
    },
    mounted() {
        this.SetEchart();
    },
    beforeDestroy() {
        clearInterval(this.stampInterval);
    },
    methods: {
        //近效期包页码change
        handleExpiringPackagesChange(val) {
            this.expiringPackageList = this.desktopData.ExpiringPackagesWarning.ExpiringPackages.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
        //借包页码change
        handleBorrowedPackagesChange(val) {
            console.log(val)
        },
        //绘制echars
        SetEchart() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.querySelector(".myEchars"));
            // 绘制图表
            myChart.setOption(this.option);
        },
    },
    computed: {
        formatTime() {
            let hours = new Date(this.nowDate).getHours();
            let minutes = new Date(this.nowDate).getMinutes();
            return `${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}`;
        },
        //找到对应供应室的数据
        setProgressData() {
            return (origin,field) => {
                if (this.desktopData.TaskSchedule[origin] && this.desktopData.TaskSchedule[origin].length != 0) {
                    let arr = this.desktopData.TaskSchedule[origin].filter(val => {
                        return val.CssdId === this.GLOBAL.UserInfo.ClinicId
                    });
                    if (arr.length != 0) {
                        return arr[0][field];
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        },
        //计算对应供应室的比例
        countPercentage() {
            return (origin) => {
                if (this.desktopData.TaskSchedule[origin] && this.desktopData.TaskSchedule[origin].length != 0) {
                    let arr = this.desktopData.TaskSchedule[origin].filter(val => {
                        return val.CssdId === this.GLOBAL.UserInfo.ClinicId
                    });
                    if (arr.length != 0) {
                        let num = (arr[0].AlreadyCompleteCount / arr[0].ShouldCompletedCount).toFixed(2) * 100;
                        return num;
                    } else {
                        return 0;
                    }
                    this.desktopData.TaskSchedule[origin]
                } else {
                    return 0;
                }
            }
        }
    },
};
</script>

<style lang="scss">
#managementHome {
    padding: 30px 0 0 40px;

    ul.desktop_box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 1640px;
        padding-right: 30px;
        box-sizing: border-box;

        .desktop_box_li {
            width: 790px;
            height: 480px;
            box-shadow: 0px 0px 10px 0px rgba(51, 62, 80, 0.2);
            border-radius: 8px;
            margin-bottom: 30px;
            padding: 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;

            .li_head {
                height: 70px;
                display: flex;
                justify-content: space-between;
                line-height: 30px;

                p {
                    font-size: 24px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                }

                span {
                    font-size: 20px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                }
            }

            .li_content {
                flex: 1;
                .empty_data {
                    text-align: center;
                    font-size: 18px;
                    font-weight: normal;
                    color: #D0D4DA;
                }
                .li_content_title{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    color: #878d9f;
                    p{
                        width: 80px;
                        &.p_name{
                            width: 180px;
                        }
                        &.progress_p{
                            width: 270px;
                        }
                    }
                }
                >ol {
                    height: 318px;

                    >li {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;

                        >p {
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            line-height: 24px;
                            color: #232e41;
                            width: 50px;

                            &.p_name {
                                width: 180px;
                            }
                        }
                    }
                }
            }

            &.taskProgress {
                ol {
                    li {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 40px;

                        p {
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            line-height: 24px;
                            color: #232e41;
                            width: 80px;

                            &.progress_p {
                                width: 270px;

                                .el-progress {
                                    .el-progress-bar__outer {
                                        height: 10px !important;
                                        width: 200px;

                                        .el-progress-bar__inner {
                                            background: linear-gradient(90deg,
                                                    rgba(160, 243, 203, 1) 0%,
                                                    rgba(0, 192, 80, 1) 100%);
                                        }
                                    }

                                    .el-progress__text {
                                        margin-left: 0;
                                        font-size: 18px !important;
                                        font-family: Microsoft YaHei;
                                        line-height: 24px;
                                        color: #232e41;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // #878D9F
            .el-pagination {

                .btn-quickprev,
                .btn-quicknext,
                .number,
                .btn-prev,
                .btn-next {
                    background: #fff;
                    border: 1px solid #878D9F;
                    border-radius: 4px;
                    box-sizing: border-box;

                    &:hover {
                        border-color: #00C16B;
                    }
                }

                .number {
                    &.active {
                        background: #00C16B;
                        border-color: #00C16B;

                        &:hover {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>
