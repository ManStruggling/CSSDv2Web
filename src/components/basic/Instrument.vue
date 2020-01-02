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
            <el-input placeholder="搜索" class="basic_ipt_search" v-model.trim="basic_search" @input="searchThisTableData"></el-input>
        </p>
        <p>
            <a href="\ImportBaseData\器械汇入.xlsx" download="器械汇入" v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')">下载模板</a>
            <el-button class="importData" v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')">
                <input type="file" id="fileUploader" name="fileUploader" @change="fileChange" accept=".xls, .xlsx" />
            </el-button>
            <el-button type="primary" class="basic_ipt_add" @click="addTableTr">新增器械</el-button>
        </p>
    </div>
    <div class="basic_table table_unExpand">
        <el-table :data="table_data">
            <el-table-column label="器械名称" prop="Name" width="240" show-overflow-tooltip></el-table-column>
            <el-table-column label="简码" prop="ShortCode" width="210" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" prop="Specification" width="210">
                <template slot-scope="props">
                    {{props.row.Specification==''?'-':props.row.Specification}}
                </template>
            </el-table-column>
            <el-table-column label="安全库存" prop="SafeInventory" width="210"></el-table-column>
            <el-table-column v-if="GLOBAL.UserInfo.JobAndCompetence.includes('000')" label="Id" prop="Id" width="210"></el-table-column>
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
        <InstrumentBox v-if="showEditBox" @to-father="child2father" :data="toChildData"></InstrumentBox>
    </transition>
</div>
</template>

<script>
import InstrumentBox from "./InstrumentBox";
import XLSX from "xlsx";
export default {
    data() {
        return {
            basic_search: "", //查询条件
            table_data: [], //表的显示数据
            showEditBox: false, //是否显示编辑框
            toChildData: {}
        };
    },
    components: {
        InstrumentBox
    },
    created() {
        axios({
                url: `/odata/instruments`
            })
            .then(res => {
                this.table_data = res.data.value;
            })
            .catch(err => {});
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
        //请求数据
        requestData(arr, index) {
            axios({
                url: "/api/Instrument/BatchImport",
                method: "POST",
                data: arr[index]
            }).then(res => {
                if (res.data.Code == 200) {
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
        //新增tr
        addTableTr() {
            this.toChildData = {
                Id: 0,
                Name: "",
                OwnClinicId: 0,
                StandardName: "", //标准名称
                ShortCode: "", //器械简码
                CostPrice: 1, //成本价格
                ClearingPrice: 1, //清算价格
                SafeInventory: 1, //安全库存
                Specification: "", //规格
                Remark: "", //备注
                ProvideCssdId: 0, //发放供应室
                InstrumentPictures: []
            };
            this.showEditBox = true;
        },
        //删除this tr
        deleteThisTr(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该项?',
                confirmCallBack: () => {
                    axios.delete(`/api/Instrument/${this.table_data[index].Id}`, {
                            headers: {}
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = "success";
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
        //搜索
        searchThisTableData() {
            this.baseDataSearch(
                `/odata/instruments?$filter=contains(name,${"'" +
          encodeURIComponent(this.basic_search) +
          "'"}) or contains(shortcode,${"'" +
          encodeURIComponent(this.basic_search) +
          "'"})`
            );
        },
        //子组件传递值
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
