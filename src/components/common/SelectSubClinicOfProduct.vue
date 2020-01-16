<template>
<div class="basic_lost_package_box">
    <div class="package_box">
        <h3>
            <el-select v-model="selectedSubClinicId" class="green24x13" :filterable="true" @change="selectedSubClinicIdChange">
                <el-option v-for="(item,index) in clinicList" :key="index" :label="item.ProvideSubClinicName" :value="item.ProvideSubClinicId">
                    <el-tooltip :content="item.ProvideSubClinicName" placement="right" :disabled="item.ProvideSubClinicName.length<8">
                        <p class="beyondHiding">{{item.ProvideSubClinicName}}</p>
                    </el-tooltip>
                </el-option>
            </el-select>
            <el-select v-model="packageBoxClassSelect" @change="packageClassChange" class="green24x13" :disabled="!selectedSubClinicId">
                <el-option label="全部" value="all"></el-option>
                <el-option label="追溯的无菌包" value="追溯的无菌包"></el-option>
                <el-option label="高水平消毒包" value="高水平消毒包"></el-option>
            </el-select>
            <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="packageSearch" :disabled="!selectedSubClinicId"></el-input>
        </h3>
        <el-table ref="multipleTable" :data="selectedSubClinicId?packageList:[]" tooltip-effect="dark" style="width: 100%" max-height="300" width="400" @row-click="handleRowClick" @selection-change="handleSelectionChange" :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="ProductName" label="包名称" width="240" class="product_name" sortable :sort-by="'ProductShortCode'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ProductQuantity" label="数量" sortable :sort-by="'ProductQuantity'">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.ProductQuantity" :min="0" :max="999" :controls="false" size="mini" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,scope.$index)})"></el-input-number>
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
            selectedSubClinicId: "",
            getUrl: "",
            packageBoxClassSelect: "all", //筛选类别
            searchShortCode: "", //简码搜索字段
            packageList: [], //显示的包列表
            multipleSelection: [],
            clinicList: [],
            pendingRecycleProducts: []
        };
    },
    props: {
        requestApi: String,
        getApiLimit: String,
        submitApi: String,
    },
    created() {
        this.$http
            .all([
                axios("/api/Clinic/SubClinic"),
                axios("/api/Recycle/PendingRecycleProducts")
            ])
            .then(
                this.$http.spread((acct, perms) => {
                    //请求所有子科室
                    if (acct.data.Code == 200) {
                        this.clinicList = acct.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: acct.data.Msg
                        });
                    }
                    //获取待回收的产品(发放决定回收)
                    if (perms.data.Code == 200) {
                        this.pendingRecycleProducts = perms.data.Data;
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: perms.data.Msg
                        });
                    }
                })
            );
    },
    methods: {
        selectedSubClinicIdChange() {
            this.$refs.multipleTable.clearSelection();
            this.judgedParameters();
            this.getPackagesData(this.getUrl);
        },
        //el-input-number change 事件
        handleNumberChange(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.packageList[index].ProductQuantity = 0;
                }, 0);
            }
        },
        //确认事件
        sendToFather() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.multipleSelection,
                    type: "ArrayNotEmpty",
                    msg: "至少选择一条！"
                }])
            ) {
                let arr = [];
                this.multipleSelection.forEach(element => {
                    arr.push(element.ProductQuantity);
                });
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
                                this.$emit("selectSubClinicOfProduct-to-father", res.data.Data);
                            } else {
                                this.showInformation({
                                    classify: "message",
                                    msg: res.data.Msg
                                });
                            }
                        })
                        .catch(err => {});
                } else {
                    if (
                        this.GLOBAL.VerificationHandle([{
                            val: arr,
                            type: "NumberAllCannotBeZero",
                            msg: "包数量不能为0！"
                        }])
                    ) {
                        this.$emit("selectSubClinicOfProduct-to-father", this.multipleSelection);
                    }

                }

            }
        },
        //取消事件
        cancelSend() {
            this.$emit("selectSubClinicOfProduct-to-father", false);
        },
        //点击当前行选择数据
        handleRowClick(row, column, event) {
            if (column) {
                this.$refs.multipleTable.toggleRowSelection(row);
            }
        },
        //搜索事件
        packageSearch() {
            this.judgedParameters();
            this.getPackagesData(this.getUrl);
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
            this.getUrl =
                this.packageBoxClassSelect == "all" ?
                `/odata/AllProducts?$filter=(${this.getApiLimit}) and (${this.requestApi}) and (ProvideSubClinicId eq ${this.selectedSubClinicId} or IsCommonProduct)` :
                `/odata/AllProducts?$filter=(${this.getApiLimit}) and(type eq ${encodeURI("'" + this.packageBoxClassSelect + "'")}) and (ProvideSubClinicId eq ${this.selectedSubClinicId} or IsCommonProduct)`;
            this.getUrl += ` and (contains(ProductShortCode,${"'" + encodeURIComponent(this.searchShortCode) + "'"}) or contains(ProductName,${"'" + encodeURIComponent(this.searchShortCode) +     "'"}))`;
        },
        //请求数据
        getPackagesData(url) {
            axios(url)
                .then(res => {
                    for (let i = 0; i < res.data.value.length; i++) {
                        //通用包指定选择的子科室
                        if (res.data.value[i].IsCommonProduct) {
                            res.data.value[i].ProvideSubClinicId = this.selectedSubClinicId;
                            for (let j = 0; j < this.clinicList.length; j++) {
                                if (this.selectedSubClinicId === this.clinicList[j].ProvideSubClinicId) {
                                    res.data.value[i].ProvideSubClinicName = this.clinicList[j].ProvideSubClinicName;
                                    res.data.value[i].ProvideClinicName = this.clinicList[j].ProvideClinicName;
                                    res.data.value[i].ProvideClinicId = this.clinicList[j].ProvideClinicId;
                                    break;
                                }
                            }
                        }
                        //丢失条码登记
                        if (!this.submitApi) {
                            res.data.value[i].IsLostPackage = true;
                            res.data.value[i].ProductQuantity = 0;
                            for (let j = 0; j < this.pendingRecycleProducts.length; j++) {
                                if (res.data.value[i].ProductId === this.pendingRecycleProducts[j].ProductId) {
                                    res.data.value[i].ProductQuantity += this.pendingRecycleProducts[j].ProductQuantity;
                                    break;
                                }
                            }
                        }
                        for(let j=0;j<this.multipleSelection.length;j++){
                            if(res.data.value[i].ProductId===this.multipleSelection[j].ProductId){
                                res.data.value[i] = this.multipleSelection[j];
                                break;
                            }
                        }
                    }
                    res.data.value.sort((a, b) => {
                        return b.ProductQuantity - a.ProductQuantity;
                    });
                    this.packageList = res.data.value;
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="scss">
.basic_lost_package_box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 5;
    background: rgba(51, 51, 51, 0.6);

    .package_box {
        background: #fff;
        width: 556px;
        height: 441px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 20px 30px 30px;

        h3 {
            display: flex;
            justify-content: space-between;

            .el-select {
                input {
                    width: 160px;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(35, 46, 65, 1);
                }
            }

            >.el-input {
                width: 160px;

                .el-input__inner {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(35, 46, 65, 1);

                    &:focus {
                        border-color: rgba(0, 193, 107, 1);
                    }
                }
            }
        }

        .el-table {
            height: 300px;

            &::before {
                height: 0;
            }

            thead {
                margin-top: 20px;

                th {
                    padding: 20px 0 5px 0;
                    border: 0;
                    line-height: 20px;
                    height: 20px;

                    div {
                        line-height: 20px;
                    }
                }

                .cell {
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    color: rgba(135, 141, 159, 1);
                    font-weight: normal;
                }
            }

            .el-table__body-wrapper {
                &::-webkit-scrollbar {
                    width: 7px;
                }

                tbody {
                    tr {
                        height: 50px;

                        td {
                            border: 0;
                            padding: 0;

                            .cell {
                                font-size: 18px;
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                color: rgba(35, 46, 65, 1);
                                line-height: 40px;

                                >div {
                                    font: inherit;
                                }
                            }
                        }
                    }

                    .el-input-number {
                        width: 60px;

                        .el-input--mini {
                            width: 100%;
                        }

                        input {
                            width: 100%;
                            height: 40px;

                            &:focus {
                                border-color: rgba(0, 193, 107, 1);
                            }
                        }
                    }

                    .el-select {
                        .el-input {
                            input {
                                font-family: "Microsoft YaHei";
                                font-size: 16px;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }

            .el-table__empty-text {
                font-size: 18px;
            }
        }

        h4 {
            text-align: center;
            margin-top: 20px;

            .el-button {
                width: 88px;
                height: 32px;
                padding: 0;
                border: 1px solid rgba(0, 193, 107, 1);
                font-size: 18px;
                font-family: Microsoft YaHei;
            }

            .el-button--default {
                background: #fff;
                color: rgba(0, 193, 107, 1);
            }

            .el-button--primary {
                background: rgba(0, 193, 107, 1);
            }
        }
    }
}
</style>
