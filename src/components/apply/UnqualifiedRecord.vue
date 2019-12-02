<template>
<div class="cssd_box" id="unqualifiedRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/apply/unqualifiedPackageRegistration" tag="li">
                <p>返回</p>
            </router-link>
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
    <div class="cssd_table_center cssd_record_ui table_unExpand">
        <div class="content_title">
            <p>登记日期</p>
            <p>记录人</p>
            <p>操作</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.RegisterDate}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.RegisterPerson}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <el-button size="mini" @click.stop="changeRecord(collapseIndex)" :disabled="(GLOBAL.UserInfo.JobAndCompetence.includes('271')||GLOBAL.UserInfo.JobAndCompetence.includes('000')||GLOBAL.UserInfo.JobAndCompetence.includes('200'))&&!item.CanNotBeModified?false:true">修改</el-button>
                        </p>
                    </div>
                </div>
                <el-table :data="item.FailedPackages">
                    <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
                    <el-table-column label="包名称" prop="Name" width="210"></el-table-column>
                    <el-table-column label="不合格原因" prop="FailedPackageCauseString" width="210"></el-table-column>
                    <el-table-column label="照片">
                        <template slot-scope="props">
                            <a @click="handleShowPhotos(collapseIndex,props.$index)">查看</a>
                        </template>
                    </el-table-column>
                    <el-table-column></el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
    <!-- 照片 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 查看照片 -->
        <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="photoData" :viewMode="true"></PhotoView>
    </transition>
</div>
</template>

<script>
import PhotoView from "../common/PhotoView";
export default {
    data() {
        return {
            photoData: [],
            search_date: [],
            isShowPhoto: false,
            endDateLimit: {},
            recordList: []
        };
    },
    created() {
        let date = this.GLOBAL.GetNowDate();
        this.search_date = [date, date];
        this.searchRecordsData();
    },
    mounted() {},
    components: {
        PhotoView
    },
    methods: {
        //处理照片查看
        handleShowPhotos(index, idx) {
            axios({
                url: `/api/FailedPackage/Picture/${this.recordList[index].FailedPackages[idx].PackageBarCodeId}`
            }).then(res => {
                if (res.data.Code == 200) {
                    this.recordList[index].FailedPackages[idx].FailedPackagePictures = res.data.Data;
                    this.photoData = this.recordList[index].FailedPackages[idx].FailedPackagePictures;
                    this.isShowPhoto = true;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
        },
        viewPhotoToFather() {
            this.isShowPhoto = false;
        },
        //二次请求
        collapseChange(index) {
            if (index != "" && this.recordList[index].FailedPackages == "") {
                axios({
                    url: `/api/FailedPackage/FailedPackagesBy/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].FailedPackages = res.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //修改记录
        changeRecord(index) {
            this.$router.push({
                path: "/apply/unqualifiedPackageRegistration",
                query: {
                    recordId: this.recordList[index].Id
                }
            });
        },
        //查询
        searchRecordsData() {
            this.GLOBAL.searchRecord(`/api/FailedPackageRecords/${this.search_date[0]}/${this.search_date[1]}`, this);
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableUnExpand";

#unqualifiedRecord {
    .cssd_table_center {
        .el-table {
            a {
                cursor: pointer;
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #00c16b;
            }
        }
    }
}
</style>
