<template>
<div class="cssd_box disposableItemInboundRecord">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/inventory/disposableItemInbound" tag="li">
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
            <p>入库日期</p>
            <p>操作人</p>
            <p>入库类型</p>
            <p>入库科室</p>
        </div>
        <el-collapse accordion @change="collapseChange">
            <el-collapse-item v-for="(item,collapseIndex) in recordList" :key="collapseIndex" :name="collapseIndex+''">
                <div slot="title" class="collapseTh">
                    <div class="collapseTd">
                        <p>{{item.RecordDateTime}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.Operator}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.InboundType}}</p>
                    </div>
                    <div class="collapseTd">
                        <p>{{item.SubClinicName}}</p>
                    </div>
                </div>
                <el-table :data="item.Packages" :default-expand-all="true">
                    <el-table-column label="名称" prop="ProductName" width="240"></el-table-column>
                    <el-table-column label="批号" prop="BatchNumber" width="210"></el-table-column>
                    <el-table-column label="有效日期" prop="ValidDate" width="210"></el-table-column>
                    <el-table-column label="数量" prop="Quantity" width="210"></el-table-column>
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
        //二次请求
        collapseChange(index) {
            if (index != '' && (this.recordList[index].Packages == '' || this.recordList[index].Packages === null)) {
                axios({
                    url: `/api/Inventory/InboundPackages/${this.recordList[index].InboundRecordId}`
                }).then(res => {
                    if (res.data.Code == 200) {
                        this.recordList[index].Packages = res.data.Data;
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
            this.GLOBAL.searchRecord(`/api/Inventory/DisposableProductInboundRecord/${this.search_date[0]}/${this.search_date[1]}`, this);
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/cssdRecord";
@import "../../assets/css/tableUnExpand";
</style>
