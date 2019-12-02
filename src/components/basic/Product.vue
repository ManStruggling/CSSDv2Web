<template>
<!--
    主体
    编辑弹出框
    交互 显示对象详情
    新增tr
    删除this tr
    编辑this tr
    取消编辑
    保存编辑
    editBox 添加程序
    editBox 删除程序
  -->
<!-- 主体 -->
<div class="basic_main">
    <div class="basic_main_head">
        <p>
            <el-input type="text" placeholder="搜索" class="basic_ipt_search" v-model.trim="basic_search" @input="searchThisTableData" />
        </p>
        <p>
            <a href="\ImportBaseData\产品汇入.xlsx" download="产品汇入" v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')">下载模板</a>
            <el-button class="importData" v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')">
                <input type="file" id="fileUploader" name="fileUploader" @change="fileChange" accept=".xls, .xlsx" />
            </el-button>
            <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增包</el-button>
        </p>
    </div>
    <div class="basic_table table_unExpand">
        <el-table :data="table_data">
            <el-table-column label="包名称" prop="Name" width="240"></el-table-column>
            <el-table-column label="简码" prop="ShortCode" width="210"></el-table-column>
            <el-table-column label="发放供应室" prop="ProvideCssdName" width="210"></el-table-column>
            <el-table-column :label="Type==81?'发放科室':'所属科室'" prop="ProvideClinicName" width="300">
                <template slot-scope="props">{{props.row.ProvideClinicName+'/'+props.row.ProvideSubClinicName}}</template>
            </el-table-column>
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
        <ProductBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></ProductBox>
    </transition>
</div>
</template>

<script>
import ProductBox from "./ProductBox";
import XLSX from "xlsx";
export default {
    data() {
        return {
            Type: 0, //器械类型
            basic_search: "", //查询条件
            table_data: [], //表的显示数据
            total_data: [], //所有数据
            showEditBox: false, //是否显示编辑框
            toChildData: {}
        };
    },
    components: {
        ProductBox
    },
    created() {},
    watch: {
        $route: {
            //路由监听
            handler: function (to, from, next) {
                this.Type = to.params.Type - 0; //获取当前路由参数的Type值
                axios("/api/Product/ByType/" + this.Type)
                    .then(res => {
                        if (res.data.Code == 200) {
                            this.total_data = res.data.Data;
                            this.table_data = JSON.parse(JSON.stringify(this.total_data));
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
                    objData[sheetName] = XLSX.utils
                        .sheet_to_row_object_array(workbook.Sheets[sheetName])
                        .splice(1);
                });
                for (let i = 0; i < objData.Sheet1.length; i++) {
                    objData.Sheet1[i].InstrumentCounts = objData.InstrumentCounts.filter(
                        val => {
                            return val.ProductId === objData.Sheet1[i].Id;
                        }
                    );
                    objData.Sheet1[i].MaterialCounts = objData.MaterialCounts.filter(
                        val => {
                            return val.ProductId === objData.Sheet1[i].Id;
                        }
                    );
                }
                this.requestData(objData.Sheet1, 0);
            };

            reader.onerror = function (event) {
                this.showInformation({
                    classify: "message",
                    msg: `文件不能被读取！Code ${event.target.error.code}`
                });
            };

            reader.readAsBinaryString(selectedFile);
        },
        //请求数据
        requestData(arr, index) {
            axios({
                    url: "/api/Product",
                    method: "POST",
                    data: arr[index]
                })
                .then(res => {
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
                })
                .catch(err => {});
        },
        //搜索数据
        searchThisTableData() {
            this.table_data = this.total_data.filter(element => {
                if (element.Name.includes(this.basic_search.toUpperCase()) || (element.ShortCode ? element.ShortCode.includes(this.basic_search.toUpperCase()) : false)) {
                    return true;
                }
            })
        },
        //新增tr   IsSingleCarrierProduct
        addTableTr() {
            this.toChildData = {
                Id: 0,
                Name: "",
                SupplierId: "",
                ExternalPackage: "", //外包装
                CostPrice: 1,
                ClearingPrice: 1,
                ShortCode: "",
                ProvideCssdId: "", //发放供应室
                ProvideClinicId: "", //发放科室
                ProvideSubClinicId: "", //发放子科室
                InstrumentListTemplate: 0,
                HowManyProductsPrintATotalBarCode: 0,
                HowManyInstrumentListArePrinted: 0,
                Remark: "", //备注
                Type: this.Type,
                InstrumentCounts: [], //器械列表
                MaterialCounts: [], //包原料列表
                ProductPictures: [], //产品图片列表
                IsCommonProduct: false,
                IsNotPrintBarCode: false,
                IsNumberProduct: false,
                IsPrintLabel: false,
                IsSingleCarrierProduct: false,
                NumberProductQuantity: 0,
                ProvideGenerateType: 0,
                DeviceType: 2,
                ProductPictures: []
            };
            if (this.Type == 82) {
                this.toChildData.DeviceType = 0;
            }
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
                                type = "success";
                                this.table_data = res.data.Data;
                                this.total_data = JSON.parse(JSON.stringify(res.data.Data));
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
                })
                .catch(() => {});
        },
        //编辑this tr
        editThisTr(index) {
            this.toChildData = Object.assign({}, this.table_data[index]); //深拷贝
            this.showEditBox = true;
        },
        //器械列表组件传值
        child2father(data) {
            this.showEditBox = false;
            if (data) {
                this.table_data = data;
                this.total_data = JSON.parse(JSON.stringify(data));
            }
        }
    }
};
</script>

<style lang="scss">
</style>
