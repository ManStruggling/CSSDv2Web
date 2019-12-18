<template>
<div id="sterilizeablePackages" class="basic_package_box">
    <div class="package_box">
        <h3>
            <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="packageSearch"></el-input>
        </h3>
        <el-table ref="multipleTable" :data="packageList" tooltip-effect="dark" style="width: 100%" max-height="280" width="400" @selection-change="handleSelectionChange" :row-key="getRowKeys" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="ProductName" label="包名称" width="201" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="BarCode" label="包条码" width="160"></el-table-column>
            <el-table-column prop="ProvideSubClinicName" label="发放科室" width="160" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
        <h4>
            <el-button @click="cancelSend">取消</el-button>
            <el-button type="primary" @click="sendToFather">确定</el-button>
        </h4>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            searchShortCode: "", //简码搜索字段
            packageList: [], //显示的包列表
            multipleSelection: []
        };
    },
    methods: {
        //取消
        cancelSend() {
            this.$emit('sterilizeable-to-father', '');
        },
        //确定
        sendToFather() {
            this.$emit('sterilizeable-to-father', this.multipleSelection);
        },
        //点击当前行选择数据
        handleRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        //搜索事件
        packageSearch() {
            
        },
        //选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getRowKeys(row) {
            return row.PackageBarCodeId;
        }
    },
    created() {
        axios({
            url: `/api/Sterilize/CanBeSterilizePackages`
        }).then(res => {
            this.packageList = res.data.Data;
        }).catch(err => {})
    }
};
</script>

<style lang="scss">
@import "../../assets/css/packageList";

#sterilizeablePackages {
    .package_box {
        width: 636px;
    }

    h3 {
        .el-input {
            width: 100%;
        }
    }
}
</style>
