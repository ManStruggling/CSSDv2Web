<template>
<div class="basic_package_box">
    <div class="package_box">
        <h3>
            <el-select v-model="packageBoxClassSelect" @change="packageClassChange" v-if="!selectIsFix" class="green24x13">
                <el-option label="全部" value="all"></el-option>
                <el-option label="追溯的无菌包" value="追溯的无菌包"></el-option>
                <el-option label="高水平消毒包" value="高水平消毒包"></el-option>
                <el-option label="追溯的辅料包" value="追溯的辅料包" :disabled="optionIsFix"></el-option>
            </el-select>
            <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="packageSearch" :style="selectIsFix?'width:100%':''"></el-input>
        </h3>
        <el-table ref="multipleTable" :data="packageList" tooltip-effect="dark" style="width: 100%" max-height="300" width="400" @row-click="handleRowClick" @selection-change="handleSelectionChange" :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="ProductName" label="包名称" width="201" class="product_name" sortable :sort-by="'ProductShortCode'" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ProvideSubClinicName" label="所属科室" sortable :sort-by="'ProvideSubClinicShortCode'" width="160">
                <template slot-scope="scope">
                    <el-select v-if="scope.row.IsCommonProduct" v-model="scope.row.ProvideSubClinicId" filterable class="green18x10">
                        <el-option v-for="(item,index) in clinicList" :key="index" :label="item.ProvideSubClinicName" :value="item.ProvideSubClinicId"></el-option>
                    </el-select>
                    <div v-if="!scope.row.IsCommonProduct">{{scope.row.ProvideSubClinicName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="ProductQuantity" label="数量" sortable :sort-by="'ProductQuantity'">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.ProductQuantity" :min="1" :max="999" :controls="false" size="mini" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,scope.$index)})" @blur.native.stop="GLOBAL.cancelBubble"></el-input-number>
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
            mode: 1, //0新购入 1回收 2辅料包新任务 3条码丢失
            requestUrl: "",
            getUrl: "",
            selectIsFix: false,
            optionIsFix: false,
            packageBoxClassSelect: "all", //筛选类别
            searchShortCode: "", //简码搜索字段
            packageList: [], //显示的包列表
            multipleSelection: [],
            isRequested: false, //是否请求
            clinicList: []
        };
    },
    props: {
        packageClass: String,
        getApiLimit: String,
        requestApi: String,
        submitApi: String
    },
    created() {
        axios({
                url: "/api/Clinic/SubClinic"
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.clinicList = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
        if (this.packageClass == "追溯的辅料包") {
            //配包辅料包任务添加
            this.mode = 2;
            this.packageBoxClassSelect = this.packageClass;
            this.selectIsFix = true;
        } else if (this.packageClass == "NotBarCodeProducts") {
            this.mode = 1;
            this.optionIsFix = true;
        } else if (this.packageClass == "NewPurchasing") {
            this.mode = 0;
            this.optionIsFix = true;
        } else if (this.packageClass == "LostBarCode") {
            this.mode = 3;
            this.optionIsFix = true;
        }
        this.packageClassChange();
    },
    methods: {
        //el-input-number change 事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.packageList[index].ProductQuantity = 1;
                }, 0);
            }
        },
        //确认事件
        sendToFather() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.multipleSelection,
                    type: "ArrayNotEmpty",
                    msg: "至少选择一条！"
                }])) {
                let arr = [];
                this.multipleSelection.forEach(val => {
                    arr.push(val.ProvideSubClinicId);
                });
                if (
                    this.GLOBAL.VerificationHandle([{
                        val: arr,
                        type: "StringAllNotEmpty",
                        msg: "您选择的通用包没有选择回收科室！请选择回收科室！"
                    }])
                ) {
                    if (this.submitApi) {
                        axios({
                                url: this.submitApi,
                                data: {
                                    Products: this.multipleSelection
                                },
                                method: "POST"
                            })
                            .then(res => {
                                if (res.data.Code == 200) {
                                    this.$emit("packageList-to-father", res.data.Data);
                                } else {
                                    this.showInformation({
                                        classify: "message",
                                        msg: res.data.Msg
                                    });
                                }
                            })
                            .catch(err => {});
                    } else {

                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            if (this.multipleSelection[i].IsCommonProduct) {
                                for (let j = 0; j < this.clinicList.length; j++) {
                                    if (
                                        this.multipleSelection[i].ProvideSubClinicId ===
                                        this.clinicList[j].ProvideSubClinicId
                                    ) {
                                        this.multipleSelection[
                                            i
                                        ].ProvideSubClinicName = this.clinicList[
                                            j
                                        ].ProvideSubClinicName;
                                        this.multipleSelection[i].ProvideClinicName = this.clinicList[
                                            j
                                        ].ProvideClinicName;
                                    }
                                }
                            }
                            if (this.mode === 3) {
                                this.multipleSelection[i].IsLostPackage = true;
                            }
                        }
                        this.$emit("packageList-to-father", this.multipleSelection);

                    }

                }

            }
        },
        //取消事件
        cancelSend() {
            this.$emit("packageList-to-father", false);
        },
        //点击当前行选择数据
        handleRowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        //搜索事件
        packageSearch() {
            this.judgedParameters();
            let url;
            url =
                this.getUrl +
                ` and (contains(ProductShortCode,${"'" +
          this.searchShortCode +
          "'"}) or contains(ProductName,${"'" + this.searchShortCode + "'"}))`;
            this.getPackagesData(url);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getRowKeys(row) {
            return row.ProductId;
        },
        //类别选择change 请求
        packageClassChange() {
            this.judgedParameters();
            this.getPackagesData(this.getUrl);
        },
        //判断参数范围
        judgedParameters() {
            if (this.getApiLimit) {
                this.getUrl =
                    this.packageBoxClassSelect == "all" ?
                    `/odata/AllProducts?$filter=(${this.getApiLimit}) and (${this.requestApi})` :
                    `/odata/AllProducts?$filter=(${
                this.getApiLimit
              }) and(type eq ${encodeURI(
                "'" + this.packageBoxClassSelect + "'"
              )})`;
            } else {
                this.getUrl =
                    this.packageBoxClassSelect == "all" ?
                    `/odata/AllProducts?$filter=(${this.requestApi})` :
                    `/odata/AllProducts?$filter=type eq ${encodeURI(
                "'" + this.packageBoxClassSelect + "'"
              )}`;
            }
        },
        //请求数据
        getPackagesData(url) {
            axios(url)
                .then(res => {
                    for (let i = 0; i < res.data.value.length; i++) {
                        //通用包默认无所属科室、需要用户自选
                        if (res.data.value[i].IsCommonProduct) {
                            res.data.value[i].ProvideSubClinicId = "";
                        }
                    }
                    this.packageList = res.data.value;
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/packageList";
</style>
