<template>
<div class="cssd_box" id="reprint2">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <el-input placeholder="请输入包条码" v-model.trim="searchBarCode"></el-input>
                <el-button type="primary" @click="searchPackageMessage">查询</el-button>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar">
        <div class="table_box">
            <ul>
                <li>
                    <p>包条码</p>
                    <div class="el_input_box">{{packageMessage.BarCode}}</div>
                </li>
                <li v-if="GLOBAL.UserInfo.HospitalVersion == 'TONGJI'&&packageMessage.IsOuterProduct">
                    <p>供应商</p>
                    <div class="el_input_box">
                        <el-select v-model="packageMessage.SupplierId" class="green24x13" @change="supplierChange">
                            <el-option v-for="(item,index) in suppliers" :key="index" :label="item.SupplierName" :value="item.SupplierId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <p>包名称</p>
                    <div class="el_input_box" v-if="GLOBAL.UserInfo.HospitalVersion == 'TONGJI'&&packageMessage.IsOuterProduct">
                        <el-select v-model="packageMessage.ProductId" class="green24x13">
                            <el-option v-for="(item,index) in products" :key="index" :label="item.ProductName" :value="item.ProductId"></el-option>
                        </el-select>
                    </div>
                    <div class="el_input_box" v-else>{{packageMessage.ProductName}}</div>
                </li>
                <li>
                    <p>外包装</p>
                    <div class="el_input_box">
                        <el-select v-model="packageMessage.ExternalPackageId" class="green24x13">
                            <el-option v-for="(item,index) in packageMessage.ExternalPackages" :key="index" :label="item.ExternalPackage" :value="item.ExternalPackageId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <p>配包人</p>
                    <div class="el_input_box">
                        <el-select v-model="packageMessage.PackagePersonId" class="green24x13">
                            <el-option v-for="(item,index) in packageMessage.Staffs" :key="index" :label="item.StaffName" :value="item.StaffId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <p>审核人</p>
                    <div class="el_input_box">
                        <el-select v-model="packageMessage.PackageReviewerId" class="green24x13">
                            <el-option v-for="(item,index) in packageMessage.Staffs" :key="index" :label="item.StaffName" :value="item.StaffId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <p>所属科室</p>
                    <div class="el_input_box">{{packageMessage.SubClinicName}}</div>
                </li>
                <li>
                    <p>包状态</p>
                    <div class="el_input_box">{{packageMessage.Status}}</div>
                </li>
                <li>
                    <p>灭菌日期</p>
                    <div class="el_input_box">
                        <el-date-picker v-model="packageMessage.SterilizeDate" type="datetime" placeholder="选择日期时间" :clearable="false" value-format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </div>
                </li>
                <li>
                    <p>有效日期</p>
                    <div class="el_input_box">{{packageMessage.ValidDate}}</div>
                </li>
                <li v-if="packageMessage.IsNumberProduct">
                    <p>包内个数</p>
                    <div class="el_input_box">
                        <el-input-number v-model="packageMessage.NumberProductQuantity" :controls="false" :min="1" :max="999" @change="inputNumberChange('NumberProductQuantity')"></el-input-number>
                    </div>
                </li>
            </ul>
            <dl v-show="packageMessage.IsOuterProduct">
                <dt>
                    <p>打印第</p>
                    <el-select v-model="packageMessage.SplitCount" multiple class="green18x10" placeholder="请选择(必选)" @change="splitCountChange">
                        <el-option v-for="item in packageMessage.SplitPackageCount" :key="item" :label="item+''" :value="item+''"></el-option>
                    </el-select>
                    <span>张</span>
                </dt>
                <dd>
                    <p>分包数</p>
                    <div>{{packageMessage.SplitPackageCount}}</div>
                </dd>
                <dd v-if="GLOBAL.UserInfo.HospitalVersion=='TONGJI'">
                    <p>筐号</p>
                    <div>
                        <a @click="editBoxNumbers">编辑</a>
                    </div>
                </dd>
            </dl>
            <div class="print_number">
                <p>打印份数</p>
                <el-input-number v-model="packageMessage.PrintCount" :controls="false" :min="1" :max="999" placeholder="打印份数" @change="inputNumberChange('PrintCount')"></el-input-number>
                <span>共 {{countPrintNumber}} 张</span>
            </div>
            <el-dialog :visible.sync="dialogVisible" width="300px" :modal="false" :show-close="false" :close-on-click-modal="false">
                <div class="divBox">
                    <div class="boxItem" v-for="(item,index) in boxList" :key="index">
                        <p class="font16gray">{{'筐号'+(item.key)}}</p>
                        <el-input v-model.trim="item.value"></el-input>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="boxNumbersConfirm">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button type="primary" @click="printBarCode">保存并打印</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            searchBarCode: "",
            dialogVisible: false,
            boxList: [],
            suppliers: [],
            products: [],
            packageMessage: {
                BarCode: "",
                ProductName: "",
                ExternalPackage: "",
                PackagePerson: "",
                PackageReviewer: "",
                SubClinicName: "",
                Status: "",
                SterilizeDate: "",
                ValidDate: "",
                SplitCount: []
            }
        };
    },
    watch: {
        "packageMessage.SplitCount": {
            handler: function (newValue) {
                if (newValue.length > 0) {
                    setTimeout(() => {
                        $("#reprint2 dt .el-select .el-input__inner").attr({
                            placeholder: newValue.join()
                        });
                    }, 0);
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        //供应商change事件
        supplierChange(val) {
            this.packageMessage.ProductId = '';
            this.products = this.suppliers.filter(element => {
                return element.SupplierId == val;
            })[0].Products;
        },
        //编辑筐号
        editBoxNumbers() {
            if (this.packageMessage.SplitCount == '') {
                this.showInformation({
                    classify: 'message',
                    msg: '未选择打印张数！'
                });
            } else {
                this.boxList = [];
                this.packageMessage.SplitCount.forEach((item, index) => {
                    this.packageMessage.BoxNumbers[index] = this.packageMessage.BoxNumbers[index] === undefined ? '' : this.packageMessage.BoxNumbers[index];
                    this.boxList.push({
                        key: item,
                        value: this.packageMessage.BoxNumbers[index]
                    });
                });
                this.dialogVisible = true;
            }
        },
        //筐号编辑框确定事件
        boxNumbersConfirm() {
            var arr = [];
            this.boxList.forEach(element => {
                arr.push(element.value);
            });
            if (this.GLOBAL.VerificationHandle([{
                    val: arr,
                    type: 'StringAllNotEmpty',
                    msg: '筐号不能为空！'
                }])) {
                this.packageMessage.BoxNumbers = [];
                this.boxList.forEach(element => {
                    this.packageMessage.BoxNumbers.push(element.value);
                });
                this.dialogVisible = false;
            }
        },
        //打印条码
        printBarCode() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.packageMessage.BarCode,
                    type: "StringNotEmpty",
                    msg: "请查询条码！"
                }])
            ) {
                if (this.packageMessage.IsOuterProduct) {
                    //外来器械包---分包
                    if (
                        this.GLOBAL.VerificationHandle([{
                            val: this.packageMessage.SplitCount,
                            type: "ArrayNotEmpty",
                            msg: "至少选择打印一张"
                        }])
                    ) {
                        if (this.GLOBAL.UserInfo.HospitalVersion == 'TONGJI') {
                            if (this.GLOBAL.VerificationHandle([{
                                    val: this.packageMessage.BoxNumbers,
                                    type: 'ArrayNotEmpty',
                                    msg: '筐号不能为空！'
                                }, {
                                    val: this.packageMessage.BoxNumbers,
                                    type: 'StringAllNotEmpty',
                                    msg: '筐号不能为空！'
                                }])) {
                                this.outerPackageReprintRequest();
                            }
                        } else {
                            this.outerPackageReprintRequest();
                        }

                    }
                } else {
                    //普通条码包
                    axios({
                            url: `/api/Package/RePrintBarCode`,
                            data: this.packageMessage,
                            method: "POST"
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = "success";
                                res.data.Data.forEach(element => {
                                    CSManager.PrintBarcode(JSON.stringify(element));
                                });
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
                }
            }
        },
        //外来器械重新打印请求
        outerPackageReprintRequest() {
            axios({
                    url: `/api/Package/RePrintOuterBarCode`,
                    data: this.packageMessage,
                    method: "POST"
                })
                .then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        res.data.Data.forEach(element => {
                            CSManager.PrintBarcode(JSON.stringify(element));
                        });
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
        //查询包信息
        searchPackageMessage() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.searchBarCode,
                    type: "StringNotEmpty",
                    msg: "查询的条码不能为空！"
                }])
            ) {
                axios({
                        url: `/api/Package/RePrintBarCode/${this.searchBarCode}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            res.data.Data.BarCode = this.searchBarCode;
                            res.data.Data.PrintCount = 1;
                            res.data.Data.SplitCount = [];
                            if (this.GLOBAL.UserInfo.HospitalVersion == 'TONGJI') {
                                if (res.data.Data.IsOuterProduct) {
                                    var that = this;
                                    axios(`/api/Recycle/OuterProduct/Suppliers`).then(res => {
                                        if (res.data.Code == 200) {
                                            that.suppliers = res.data.Data;
                                            that.products = that.suppliers.filter(element => {
                                                return element.SupplierId == that.packageMessage.SupplierId;
                                            })[0].Products;
                                        } else {
                                            this.showInformation({
                                                classify: 'message',
                                                msg: res.data.Msg
                                            });
                                        }
                                    });
                                    res.data.Data.BoxNumbers = [];
                                }
                            }
                            this.packageMessage = res.data.Data;
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    })
                    .catch(err => {});
            }
        },
        //number change
        inputNumberChange(newValue,origin) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.packageMessage[origin] = 1;
                }, 0);
            }
        },
        //打印第几张change事件
        splitCountChange() {
            if (this.GLOBAL.UserInfo.HospitalVersion == 'TONGJI') {
                this.packageMessage.BoxNumbers = [];
            }
        }
    },
    computed: {
        countPrintNumber() {
            if (this.packageMessage.IsOuterProduct) {
                return this.packageMessage.SplitCount == "" ||
                    this.packageMessage.SplitCount == undefined ?
                    0 :
                    this.packageMessage.SplitCount.length *
                    this.packageMessage.PrintCount;
            } else {
                return this.packageMessage.PrintCount;
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";

#reprint2 {
    .cssd_title {
        .cssd_title_right {
            p {
                display: flex;

                .el-input {
                    width: 180px;
                    margin-right: 20px;

                    input {
                        background: #182b37;
                        border-width: 2px;
                        font-size: 18px;
                        font-family: Microsoft YaHei;
                        color: #fff;
                        font-weight: bold;
                        padding: 0 10px;
                    }
                }

                .el-button {
                    margin: 0;
                }
            }
        }
    }

    .cssd_table_center {
        .table_box {
            height: 100%;
            padding: 30px 40px;
            box-sizing: border-box;
            overflow-y: scroll;

            ul {
                display: flex;
                flex-wrap: wrap;

                li {
                    width: 234px;
                    display: flex;
                    justify-content: space-between;
                    margin: 0 120px 20px 0;

                    p {
                        width: 64px;
                        line-height: 40px;
                        text-align: right;
                        font-size: 16px;
                        color: #878d9f;
                    }

                    .el_input_box {
                        width: 160px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #333;
                        line-height: 40px;

                        .el-input {
                            input {
                                color: #333;
                                font-size: 16px;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }

            dl {
                margin: 10px 0;
                display: flex;

                dt,
                dd {
                    display: flex;
                    justify-content: space-between;
                    line-height: 40px;

                    p {
                        color: #878d9f;
                        width: 64px;
                        text-align: right;
                    }
                }

                dt {
                    .el-select {
                        width: 134px;
                        height: 40px;
                        margin: 0 10px;

                        .el-select__tags {
                            display: none;
                        }

                        input {
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                    }

                    span {
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        color: rgba(135, 141, 159, 1);
                    }
                }

                dd {
                    width: 220;

                    div {
                        width: 142px;
                        margin-left: 10px;
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(51, 51, 51, 1);
                    }

                    a {
                        color: #00c16b;
                        font-weight: bold;
                        cursor: pointer;
                    }
                }
            }

            .print_number {
                display: flex;
                line-height: 40px;

                p {
                    color: #878d9f;
                }

                .el-input-number {
                    width: auto;

                    .el-input {
                        width: 134px;
                        margin: 0 10px;

                        input {
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: #333;
                            padding: 0 15px;
                            text-indent: 0;
                        }
                    }
                }

                span {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    color: #878d9f;
                }
            }

            .el-dialog__body {
                max-height: 300px;
                overflow-y: scroll;

                .divBox {
                    .boxItem {
                        display: flex;
                        line-height: 40px;
                        margin-bottom: 10px;

                        p {
                            width: 60px;
                            text-align: right;
                            margin-right: 20px;
                        }

                        .el-input {
                            width: 160px;
                            font-size: 18px;
                            color: #333;
                        }
                    }
                }
            }
        }
    }
}
</style>
