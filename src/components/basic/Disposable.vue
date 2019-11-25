<template>
<!-- 一次性物品 -->
<div class="basic_main">
    <div class="basic_main_head">
        <p>
            <el-input placeholder="搜索" class="basic_ipt_search" v-model.trim="basic_search" @input="searchThisTableData"></el-input>
        </p>
        <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增</el-button>
    </div>
    <div class="basic_table table_unExpand">
        <el-table :data="table_data">
            <el-table-column label="一次性物品名称" prop="Name" width="240"></el-table-column>
            <el-table-column label="规格" prop="Specification" width="210"></el-table-column>
            <el-table-column label="价格" prop="CostPrice" width="210"></el-table-column>
            <el-table-column label="操作" width="210">
                <template slot-scope="props">
                    <a class="change_this_tr" @click.stop="editThisTr(props.$index)">编辑</a>
                    <a class="delete_this_tr" @click.stop="deleteThisTr(props.$index)">删除</a>
                </template>
            </el-table-column>
            <el-table-column></el-table-column>
        </el-table>
    </div>

    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <DisposableBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></DisposableBox>
    </transition>
</div>
</template>

<script>
import DisposableBox from "./DisposableBox";
export default {
    data() {
        return {
            Type: 84,
            basic_search: "", //查询条件
            table_data: [], //表的显示数据
            showEditBox: false, //是否显示编辑框
            toChildData: {}
        };
    },
    components: {
        DisposableBox
    },
    created() {
        axios("/api/Product/ByType/" + this.Type).then(res => {
                if (res.data.Code == 200) {
                    this.table_data = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(error => {});
    },
    mounted() {},
    methods: {
        searchThisTableData() {
            this.baseDataSearch(`/odata/products?$filter=type eq ${encodeURI("'" + this.GLOBAL.ProductDictionary[this.Type] + "'")} 
        and (contains(name,${"'" + encodeURIComponent(this.basic_search) + "'"}) or contains(shortcode,${"'" + encodeURIComponent(this.basic_search) + "'"}))`);
        },
        //新增tr
        addTableTr() {
            this.toChildData = {
                Id: 0,
                Name: "",
                ShortCode: "", //简码
                CostPrice: 1, //价格
                Specification: "", //规格
                Remark: "",
                Type: this.Type
            };
            this.showEditBox = true;
        },
        //删除this tr
        deleteThisTr(index) {
            this.$confirm("您是否确定删除该项?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                })
                .then(() => {
                    //删除接口
                    //code
                    axios
                        .delete(`/api/Product/${this.Type}/${this.table_data[index].Id}`)
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = 'success';
                                this.table_data = res.data.Data;
                            } else {
                                type = 'error';
                            }
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg,
                                type: type
                            });
                        })
                        .catch(err => {});
                })
                .catch(() => {});
        },
        //编辑this tr
        editThisTr(index) {
            this.toChildData = Object.assign({}, this.table_data[index]); //深拷贝
            this.showEditBox = true;
        },
        child2father(data) {
            this.showEditBox = false;
            if (data) {
                this.table_data = data;
            }
        }
    }
};
</script>

<style lang="scss">
</style>
