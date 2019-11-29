<template>
<div class="basic_package_box" id="disposableList">
    <div class="package_box">
        <h3>
            <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="packageSearch"></el-input>
        </h3>
        <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" max-height="300" width="400" @row-click="handleRowClick" @selection-change="handleSelectionChange" :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="ProductName" label="一次性物品名称" width="201" class="product_name" sortable :sort-by="'ProductShortCode'" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="Specification" label="规格" width="150" sortable :sort-by="'Specification'"></el-table-column>
            <el-table-column prop="ProductQuantity" label="数量" width="80" sortable :sort-by="'ProductQuantity'">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.ProductQuantity" :min="1" :max="999" :controls="false" size="mini" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,scope.$index)})"></el-input-number>
                </template>
            </el-table-column>
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
            getUrl: "",
            searchShortCode: "", //简码搜索字段
            list: [], //显示的包列表
            multipleSelection: [],
        };
    },
    props: ["cssdId"],
    created() {
        this.getProductData(`/odata/AllProducts?$filter=type eq '一次性物品'`);
    },
    methods: {
        //el-input-number change 事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.list[index].ProductQuantity = 1;
                }, 0);
            }
        },
        //确认事件
        sendToFather() {
            this.$emit("disposableList-to-father", this.multipleSelection);
        },
        //取消事件
        cancelSend() {
            this.$emit("disposableList-to-father", false);
        },
        //点击当前行选择数据
        handleRowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        //搜索事件
        packageSearch() {
            this.getProductData(`/odata/AllProducts?$filter=type eq '一次性物品' and (contains(ProductShortCode,${"'" +encodeURIComponent(this.searchShortCode) +"'"}) or contains(ProductName,${"'" +encodeURIComponent(this.searchShortCode) +"'"}))`);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //获取数据
        getProductData(url) {
            axios({
                url: url,
                headers: {
                    LocationId: this.cssdId
                }
            }).then(res => {
                this.list = res.data.value;
            }).catch(err => {})
        },
        getRowKeys(row) {
            return row.ProductId;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/packageList";

#disposableList {
    .package_box {
        .el-input {
            width: 100%;
        }
    }
}
</style>
