<template>
<!-- 工作区域 -->
<div class="basic_main">
    <div class="basic_main_head">
        <p></p>
        <p>
            <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增区域</el-button>
        </p>
    </div>
    <div class="basic_table table_unExpand">
        <el-table :data="table_data">
            <el-table-column label="区域名称" prop="Name" width="240"></el-table-column>
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
        <WorkAreaBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></WorkAreaBox>
    </transition>
</div>
</template>

<script>
import WorkAreaBox from "./WorkAreaBox";
export default {
    data() {
        return {
            table_data: [], //表的显示数据
            showEditBox: false, //是否显示编辑框
            toChildData: {}
        };
    },
    components: {
        WorkAreaBox
    },
    created() {
        axios({
                url: `/api/WorkArea`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.table_data = res.data.value;
                } else {
                    this.showInformation({
                        classify: 'message',
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
    },
    mounted() {},
    methods: {
        //新增tr
        addTableTr() {
            this.toChildData = {
                Id: 0,
                Name: ''
            };
            this.showEditBox = true;
        },
        //删除this tr
        deleteThisTr(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该项?',
                confirmCallBack: () => {
                    axios.delete(`/api/WorkArea/${this.table_data[index].Id}`, {
                            headers: {}
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = 'success';
                                this.table_data = res.data.Data;
                            } else {
                                type = "error";
                            }
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg,
                                type: type
                            });
                        })
                        .catch(err => {});
                },
                cancelCallBack: () => {}
            });
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
