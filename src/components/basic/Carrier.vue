<template>
<!-- 网篮编辑框 -->
<div class="basic_main">
    <div class="basic_main_head">
        <p>
            <!-- <el-input
          placeholder="搜索"
          class="basic_ipt_search"
          v-model.trim="basic_search"
          @input="searchThisTableData"
        ></el-input> -->
        </p>
        <p>
            <a href="\ImportBaseData\网篮汇入.xlsx" download="网篮汇入" v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')">下载模板</a>
            <el-button class="importData" v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')">
                <input type="file" id="fileUploader" name="fileUploader" @change="fileChange" accept=".xls, .xlsx" />
            </el-button>
            <el-button @click="handlePrint">打印条码</el-button>
            <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增网篮</el-button>
        </p>
    </div>
    <div class="basic_table table_unExpand">
        <el-table :data="table_data">
            <el-table-column label="网篮名称" prop="Name" width="240"></el-table-column>
            <el-table-column label="条码" prop="BarCode" width="210"></el-table-column>
            <el-table-column label="旧条码" prop="OldBarCode" width="210"></el-table-column>
            <el-table-column label="操作" width="210">
                <template slot-scope="props">
                    <a class="change_this_tr" @click.stop="editThisTr(props.$index)">编辑</a>
                    <a class="delete_this_tr" @click.stop="deleteThisTr(props.$index)">删除</a>
                </template>
            </el-table-column>
            <el-table-column></el-table-column>
        </el-table>
    </div>
    <!-- 条码打印 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <PrintBarCodeList v-if="isShowBarCodeList" @printList-to-father="barCodeListToFather" :data="table_data" :labels="[{prop:'BarCode',label:'网篮条码'},{prop:'Name',label:'网篮名称'}]" :printUrl="'/api/Print/Carrier'"></PrintBarCodeList>
    </transition>
    <!-- 网篮编辑框 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <CarrierBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></CarrierBox>
    </transition>
</div>
</template>

<script>
import CarrierBox from "./CarrierBox";
import PrintBarCodeList from "./PrintBarCodeList";
import XLSX from "xlsx";
export default {
    data() {
        return {
            isShowBarCodeList: false,
            Type: 0, //网篮类型
            basic_search: "", //查询条件
            table_data: [], //表的显示数据
            showEditBox: false, //是否显示编辑框
            toChildData: {}
        };
    },
    components: {
        CarrierBox,
        PrintBarCodeList
    },
    created() {},
    watch: {
        $route: {
            //路由监听
            handler: function (to, from, next) {
                this.Type = to.params.Type - 0; //获取当前路由参数的Type值
                axios(`/api/BasicInformation/Carrier/${this.Type}`)
                    .then(res => {
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
            immediate: true
        }
    },
    mounted() {},
    methods: {
        //文件改变
        fileChange(evt) {
            let objData = {};
            var selectedFile = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = event => {
                var data = event.target.result;
                var workbook = XLSX.read(data, {
                    type: "binary"
                });
                workbook.SheetNames.forEach(function (sheetName) {
                    objData[sheetName] = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]).splice(1);
                });
                this.requestData(objData.Sheet1, 0);
            };
            reader.onerror = function (event) {
                this.showInformation({
                    classify: "message",
                    msg: `文件不能被读取！Code ${event.target.error.code}`,
                });
            };
            reader.readAsBinaryString(selectedFile);
        },
        //循环请求数据
        requestData(arr, index) {
            axios({
                url: "/api/BasicInformation/Carrier",
                method: "POST",
                data: arr[index]
            }).then(res => {
                if (res.data.Code == 200) {
                    if (this.Type === arr[index].Type) {
                        this.table_data = res.data.Data;
                    }
                    if (index < arr.length - 1) {
                        this.requestData(arr, index + 1);
                    }
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            }).catch(err => {})
        },
        //条码列表与父组件通信
        barCodeListToFather() {
            this.isShowBarCodeList = false;
        },
        //打印
        handlePrint() {
            this.isShowBarCodeList = true;
        },
        //新增
        addTableTr() {
            this.toChildData = {
                Id: 0,
                Name: "",
                BarCode: "",
                OldBarCode: "",
                Type: this.Type
            };
            this.showEditBox = true;
        },
        //搜索
        searchThisTableData() {

        },
        //编辑
        editThisTr(index) {
            this.toChildData = Object.assign({}, this.table_data[index]);
            this.showEditBox = true;
        },
        //删除
        deleteThisTr(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该项?',
                confirmCallBack: () => {
                    axios
                        .delete(`/api/BasicInformation/Carrier/${this.Type}/${this.table_data[index].Id}`, {
                            headers: {}
                        })
                        .then(res => {
                            if (res.data.Code == 200) {
                                this.table_data = res.data.Data;
                            } else {
                                this.showInformation({
                                    classify: "message",
                                    msg: res.data.Msg
                                });
                            }
                        })
                        .catch(err => {});
                },
                cancelCallBack: () => {}
            });
        },
        //子组件传递数据
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
