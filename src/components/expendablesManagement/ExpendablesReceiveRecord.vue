<template>
<div class="cssd_box" id="consumableReceiveRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/expendables/receive" tag="li">
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
            <p>领用日期</p>
            <p>领用人</p>
            <p>操作人</p>
            <p>操作</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.CreatedTime}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.RequestPerson}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Operator}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>
                            <el-button size="mini" @click.stop="changeCleanRecord(item.Id)">修改</el-button>
                        </p>
                    </div>
                </div>
                <el-table :data="item.Products" :default-expand-all="true">
                    <el-table-column label="产品名称" prop="Name" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column label="本次领用数" prop="ThisTimeRequestCount" width="210"></el-table-column>
                    <el-table-column></el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <div class="recordNoData" v-show="recordList==''">暂无数据</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            search_date: [],
            recordList: []
        };
    },
    created() {
        let date = this.GLOBAL.GetNowDate();
        this.search_date = [date, date];
        this.searchRecordsData();
    },
    mounted() {},
    methods: {
        changeCleanRecord(Id) {
            this.$router.push({
                path: "/expendables/receive",
                query: {
                    recordId: Id
                }
            });
        },
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.recordList[index].Products == '' || this.recordList[index].Products === null)) {
                axios({
                    url: `/api/InternalRequest/InternalRequestItems/${this.recordList[index].Id}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].Products = res.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                });
            }
        },
        //查询
        searchRecordsData() {
            axios({
                url: `/api/InternalRequest/InternalRequestRecord/${this.search_date[0]}/${this.search_date[1]}`
            }).then(res => {
                if (res.data.Code == 200) {
                    this.recordList = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                    })
                }
            }).catch(err => {})
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableUnExpand";
</style>
