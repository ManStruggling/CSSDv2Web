<template>
<div id="basic_count_number_package" class="basic_package_box">
    <div class="package_box">
        <h3>
            <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="packageSearch"></el-input>
        </h3>
        <el-table ref="multipleTable" :data="packageList" tooltip-effect="dark" style="width: 100%" max-height="280" width="400" @selection-change="handleSelectionChange" @row-click="handleRowClick" :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="ProductName" label="包名称" width="201" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ProvideSubClinicName" label="回收科室" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="数量">
                <template slot-scope="props">
                    <el-input-number v-model="props.row.ProductQuantity" :controls="false" :min="1" :max="props.row.MaximumQuantity" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.$index)})"></el-input-number>
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
            searchShortCode: "", //简码搜索字段
            packageList: [], //显示的包列表
            multipleSelection: []
        };
    },
    props: ['getApi'],
    created() {
        axios({
            url: this.$props.getApi
        }).then(res => {
            this.packageList = res.data.value;
        }).catch(err => {})
    },
    methods: {
        //点击当前行选择数据
        handleRowClick(row, column, event) {
            if (column) {
                this.$refs.multipleTable.toggleRowSelection(row);
            }
        },
        //el-input-number change 事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.packageList[index].ProductQuantity = 1;
                }, 0);
            }
        },
        //取消
        cancelSend() {
            this.$emit('countNumber-to-father', '');
        },
        //确定
        sendToFather() {
            this.$emit('countNumber-to-father', this.multipleSelection);
        },
        //搜索事件
        packageSearch() {
            //code
            axios({
                url: `${this.$props.getApi}?$filter=contains(ProductShortCode,${"'" +encodeURIComponent(this.searchShortCode) +"'"}) 
                    or contains(ProductName,${"'" +encodeURIComponent(this.searchShortCode) +"'"})`
            }).then(res => {
                for (let i = 0; i < res.data.value.length; i++) {
                    for(let j=0;j<this.multipleSelection.length;j++){
                        if(res.data.value[i].ProductId===this.multipleSelection[j].ProductId){
                            res.data.value[i] = this.multipleSelection[j];
                            break;
                        }
                    }
                }
                this.packageList = res.data.value;
            }).catch(err => {})
        },
        //选择数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getRowKeys(row) {
            return row.ProductId;
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/packageList";

#basic_count_number_package {
    h3 {
        .el-input {
            width: 100%;
        }
    }
}
</style>
