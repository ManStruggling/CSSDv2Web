<template>
<div class="cssd_box" id="packageRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/package/taskList" tag="li">
                <p>返回</p>
            </router-link>
            <li @click="handleReprintList">
                <p>重打器械清单</p>
            </li>
        </ul>
        <div class="cssd_title_right">
            <p class="search_date">
                <el-date-picker v-model="search_date" type="daterange" align="right" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="GLOBAL.pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </p>
            <p>
                <el-button type="primary" @click="searchRecordsData">查询</el-button>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_table_expand cssd_record_ui table_expand">
        <div class="content_title">
            <p>配包日期</p>
            <p>配包编号</p>
            <p>配包人</p>
            <p>审核人</p>
            <p>配包总数</p>
            <p>照片</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''" :class="item.IsNotBarCodeProduct?'collapseUnExpand':''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.PackageTaskReceiveDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.PackageTaskBarCode}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.PackagePersonName}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.ReviewerName}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.PackageTotalCount}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <a @click.stop="handleShowPhotos(collapseIndex)">查看</a>
                        </p>
                    </div>
                </div>
                <el-table :data="item.PackageReceiveTasks" :default-expand-all="true" @row-click="rowClick">
                    <el-table-column label="包名称" prop="ProductName" width="240"></el-table-column>
                    <el-table-column label="包数量" prop="ThisTimePackageQuantity" width="210"></el-table-column>
                    <el-table-column></el-table-column>
                    <el-table-column type="expand" width="1">
                        <template slot-scope="props">
                            <div class="table_detail" v-if="props.row.IsNotBarCodeProduct==true?false:true">
                                <div class="myTableTitle">
                                    <p>包条码</p>
                                    <p>操作</p>
                                </div>
                                <ul>
                                    <li v-for="(selfs,myTableIndex) in props.row.Packages" :key="myTableIndex">
                                        <p>{{selfs.PackageBarCode}}</p>
                                        <p><a class="track_a" @click="track(selfs.PackageBarCode)">追溯</a></p>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
    <!-- 照片 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 拍照 -->
        <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="photoData" :viewMode="true"></PhotoView>
    </transition>
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <ReprintList v-if="isShowReprintList" @reprintList-to-father="reprintListToFather"></ReprintList>
    </transition>
</div>
</template>

<script>
import PhotoView from "../common/PhotoView";
import Reprint from "./Reprint";
import ReprintList from "./ReprintList";
export default {
    data() {
        return {
            isShowReprintList: false,
            isShowPhoto: false,
            search_date: [],
            endDateLimit: {},
            recordList: [],
            photoData: []
        };
    },
    components: {
        PhotoView,
        Reprint,
        ReprintList
    },
    created() {
        let date = this.GLOBAL.GetNowDate();
        this.search_date = [date, date];
        this.searchRecordsData();
    },
    mounted() {},
    methods: {
        //重新打印器械清单与父组件通信
        reprintListToFather() {
            this.isShowReprintList = false;
        },
        //处理重新打印器械清单
        handleReprintList() {
            this.isShowReprintList = true;
        },
        //图片数据传递
        viewPhotoToFather() {
            this.isShowPhoto = false;
        },
        //处理显示图片
        handleShowPhotos(index) {
            if (this.recordList[index].Pictures == undefined) {
                axios({
                    url: `/api/Package/Picture/${this.recordList[index].Id}`
                }).then(res => {
                    this.recordList[index].Pictures = res.data.Data;
                    this.photoData = this.recordList[index].Pictures;
                    this.isShowPhoto = true;
                }).catch(err => {})
            } else {
                this.photoData = this.recordList[index].Pictures;
                this.isShowPhoto = true;
            }
        },
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.recordList[index].PackageReceiveTasks == '' || this.recordList[index].PackageReceiveTasks === null)) {
                axios({
                    url: `/api/Package/PackageTaskReceiveDetail/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].PackageReceiveTasks = res.data.Data;
                        this.$forceUpdate();
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //三次请求
        rowClick(row, column, event) {
            if (row.Packages == '' || row.Packages === null) {
                axios({
                        url: `/api/Package/PackageInformation/${row.Id}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            row.Packages = res.data.Data;
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    })
                    .catch(err => {});
            }
        },
        //追溯
        track(BarCode) {
            this.$router.push({
                path: "/track/package",
                query: {
                    BarCode: BarCode
                }
            });
        },
        //查询
        searchRecordsData() {
            this.GLOBAL.searchRecord(`/api/Package/PackageTaskReceiveRecords/${this.search_date[0]}/${this.search_date[1]}`, this);
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableExpand";

#packageRecord {
    .track_a {
        color: #00c16b;
        cursor: pointer;
    }

    .el-collapse-item {
        &.is-active {
            .collapseTh {
                .collapseTd {
                    a {
                        color: #fff;
                    }
                }
            }
        }

        .collapseTh {
            .collapseTd {
                a {
                    color: #00c16b;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
