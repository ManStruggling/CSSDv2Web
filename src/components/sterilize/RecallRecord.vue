<template>
<div class="cssd_box" id="recallRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/sterilize/check" tag="li">
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
    <div class="cssd_table_center cssd_table_expand cssd_record_ui table_expand">
        <div class="content_title">
            <p>召回日期</p>
            <!-- <p>召回编号</p> -->
            <p>召回人</p>
            <p>审核类型</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.RecallDate}}</p>
                    </div>
                    <!-- <div class="collapseTd">
              <p>{{item.CleanTaskBarCode}}</p>
            </div>-->
                    <div class="collapseTd">
                        <p>{{item.RecallPerson}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.SterilizeType}}</p>
                    </div>
                </div>
                <el-table :data="item.SterilizeTasks" :default-expand-all="true" @row-click="rowClick">
                    <el-table-column label="灭菌编码" prop="SterilizeBarCode" width="240"></el-table-column>
                    <el-table-column label="灭菌日期" prop="SterilizeDate" width="210"></el-table-column>
                    <el-table-column label="灭菌人" prop="SterilizePerson" width="210"></el-table-column>
                    <el-table-column label="灭菌设备" prop="SterilizeDevice" width="210"></el-table-column>
                    <el-table-column label="灭菌程序" prop="SterilizeProgram" width="210"></el-table-column>
                    <el-table-column></el-table-column>
                    <el-table-column type="expand" width="1">
                        <template slot-scope="props">
                            <div class="recall_table_detail">
                                <div class="myTableTitle">
                                    <p>包条码</p>
                                    <p>包名称</p>
                                    <p>包状态</p>
                                    <p>所在科室</p>
                                    <p>住院号</p>
                                    <p>床号</p>
                                    <p>病人姓名</p>
                                </div>
                                <ul>
                                    <li v-for="(selfs,myTableIndex) in props.row.Packages" :key="myTableIndex">
                                        <p>{{selfs.PackageBarCode}}</p>
                                        <p>{{selfs.ProductName}}</p>
                                        <p>{{selfs.PackageStatus}}</p>
                                        <p>{{selfs.LocationOfSubClinic}}</p>
                                        <p>{{selfs.PatientHospitalId}}</p>
                                        <p>{{selfs.PatientBedId}}</p>
                                        <p>{{selfs.PatientName}}</p>
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
</div>
</template>

<script>
export default {
    data() {
        return {
            isShowPhoto: false,
            search_date: [],
            endDateLimit: {},
            recordList: [],
            photoData: []
        };
    },
    created() {
        let date = this.GLOBAL.GetNowDate();
        this.search_date = [date, date];
        this.searchRecordsData();
    },
    mounted() {},
    methods: {
        //请求照片
        // handleShowPhotos(index) {
        // axios({url:`/api/Sterilize/Picture/${this.recordList[index].Id}`}).then(res=>{
        //   if(res.data.Code==200){
        //     this.recordList[index].Pictures=res.data.Data;
        //     this.photoData = this.recordList[index].Pictures;
        //     this.isShowPhoto = true;
        //   }else{
        //     this.showInformation({ classify: "message", msg: res.data.Msg });
        //   }
        // })
        // },
        //卸载照片组件
        // viewPhotoToFather() {
        //   this.isShowPhoto = false;
        // },
        //三次请求
        rowClick(row, column, event) {
            $(event.srcElement)
                .parents(".el-table__row")
                .next()
                .find(".recall_table_detail")
                .slideToggle("fast");
            if (row.Packages == '' || row.Packages === null) {
                axios({
                        url: `/api/Sterilize/PackagesForBiologicalRecall/${row.SterilizeTaskId}`
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
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.recordList[index].SterilizeTasks == '' || this.recordList[index].SterilizeTasks === null)) {
                axios({
                        url: `/api/Sterilize/BiologicalRecallSterilizeTasks/${this.recordList[index].Id}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            this.recordList[index].SterilizeTasks = res.data.Data;
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    })
                    .catch(err => console.log(err));
            }
        },
        //查询
        searchRecordsData() {
            this.GLOBAL.searchRecord(`/api/Sterilize/BiologicalRecallRecords/${this.search_date[0]}/${this.search_date[1]}`, this);
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableExpand";

#recallRecord {
    .cssd_table_center {
        .el-table {
            tbody {
                .el-table__expanded-cell {
                    border: 0;

                    .recall_table_detail {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
