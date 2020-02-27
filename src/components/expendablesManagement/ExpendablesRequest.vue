<template>
<div class="cssd_box" id="consumableRequest">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <li @click="goBack">
                <p>返回</p>
            </li>
            <router-link to="/expendables/requestRecord" tag="li">
                <p>请领记录</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>请领部门</span>
                <el-select v-model="submitData.ReceiveDepartmentId" filterable class="white24x13" placeholder="选择请领部门" @change="receiveDepartmentChange">
                    <el-option v-for="(item,index) in receiveDepartments" :key="index" :label="item.name" :value="item.id">
                        <el-tooltip :content="item.name" placement="right" :disabled="item.name.length<12">
                            <p class="beyondHiding">{{item.name}}</p>
                        </el-tooltip>
                    </el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <el-table :data="submitData.Products">
                <el-table-column width="240" label="产品名称">
                    <template slot-scope="props">
                        <el-select v-model="props.row.Id" class="green18x10" @change="((val)=>{consumableChange(val,props.row)})">
                            <el-option v-for="(item,index) in consumableProducts" :key="index" :label="item.name" :value="item.id" :disabled="item.forbid">
                                <el-tooltip :content="item.name" placement="right" :disabled="item.name.length<12">
                                    <p class="beyondHiding">{{item.name}}</p>
                                </el-tooltip>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="最小规格数" prop="MinimumUnit"></el-table-column>
                <el-table-column width="210" label="本次请领数">
                    <template slot-scope="props">
                        <el-input-number v-model="props.row.ThisTimeRequestCount" :controls="false" :min="1" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.row)})"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="210" label="本次请领总数">
                    <template slot-scope="props">{{countTotalNumber(props.row)}}</template>
                </el-table-column>
                <el-table-column width="210" label="操作">
                    <template slot-scope="props">
                        <a @click="deleteThisItem(props.$index)">删除</a>
                    </template>
                </el-table-column>
                <el-table-column></el-table-column>
            </el-table>
            <el-button @click="insertItem" class="btn88x32" :disabled="!submitData.ReceiveDepartmentId">新增</el-button>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button @click="cancelChange" v-if="isChangeMode">取消修改</el-button>
                <el-button type="primary" round @click="submitComplete">{{isChangeMode?'修改完成':'入库完成'}}</el-button>
            </p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    inject: ['reload'],
    data() {
        return {
            isChangeMode: false,
            receiveDepartments: [],
            consumableProducts: [],
            submitData: {
                ReceiveDepartmentId: '',
                Products: []
            }
        };
    },
    created() {
        axios({
            url: '/consumable',
            method: 'POST',
            data: {
                query: `query getReceiveDepartment{
                            receiveDepartmentT{
                                id,name
                            }
                        }`
            }
        }).then(res => {
            this.receiveDepartments = res.data.data.receiveDepartmentT;
        }).catch(err => {});
        if (this.$route.query.recordId) {
            this.isChangeMode = true;
            axios({
                url: `/api/ExternalRequest/PendingUpdateExternalRequestRecord/${this.$route.query.recordId}`
            }).then(res => {
                if (res.data.Code == 200) {
                    this.submitData = res.data.Data;
                    this.requestProductAccordingToDepartment(res.data.Data.ReceiveDepartmentId,this.checkConsumableCanBeUseable);
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    })
                }
            }).catch(err => {})
        }
    },
    mounted() {},
    methods: {
        //请领部门change
        receiveDepartmentChange(val) {
            this.submitData.Products = [];
            this.requestProductAccordingToDepartment(val);
            this.checkConsumableCanBeUseable();
        },
        requestProductAccordingToDepartment(val,callBack) {
            axios({
                url: '/consumable',
                method: 'POST',
                data: {
                    query: `query getConsumableProducts{
                            product(receiveDepartmentId:${val}){
                                id,minimumUnit,name,receiveCode,receiveDepartmentId
                            }
                        }`
                }
            }).then(res => {
                this.consumableProducts = res.data.data.product;
                if(callBack){
                    callBack();
                }
            }).catch(err => {})
        },
        //检测耗材的可用
        checkConsumableCanBeUseable() {
            let selectedConsumableId = [];
            this.submitData.Products.forEach(element => {
                selectedConsumableId.push(element.Id);
            });
            this.consumableProducts.forEach(element => {
                if (selectedConsumableId.includes(element.id)) {
                    element.forbid = true;
                } else {
                    element.forbid = false;
                }
            });
        },
        //耗材change
        consumableChange(val, row) {
            for (let i = 0; i < this.consumableProducts.length; i++) {
                if (this.consumableProducts[i].id === val) {
                    row.Id = this.consumableProducts[i].id;
                    row.MinimumUnit = this.consumableProducts[i].minimumUnit;
                    row.Name = this.consumableProducts[i].name;
                    row.ReceiveCode = this.consumableProducts[i].receiveCode;
                    break;
                }
            }
            this.checkConsumableCanBeUseable();
        },
        goBack() {
            if (this.isChangeMode) {
                this.$router.push("/expendables/requestRecord");
            } else {
                this.$router.push('/');
            }
        },
        //取消修改
        cancelChange() {
            this.$router.push({
                path: `/expendables/requestRecord`
            });
        },
        //删除
        deleteThisItem(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该项吗?',
                confirmCallBack: () => {
                    this.submitData.Products.splice(index, 1);
                    this.checkConsumableCanBeUseable();
                },
                cancelCallBack: () => {}
            });
        },
        //新增
        insertItem() {
            this.submitData.Products.push({
                Id: "",
                ThisTimeRequestCount: 1
            })
        },
        //提交
        submitComplete() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.submitData.ReceiveDepartmentId,
                    type: "StringNotEmpty",
                    msg: "请领部门不能为空！"
                }, {
                    val: this.submitData.Products,
                    type: "ArrayNotEmpty",
                    msg: "请领耗材不能为空！"
                }])) {
                if (this.submitData.Products.every(item => item.Id != "")) {
                    let method = "POST";
                    if(this.isChangeMode){
                        method = "PUT";
                    }
                    axios({
                        url: "/api/ExternalRequest",
                        method: method,
                        data: this.submitData
                    }).then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            if(this.isChangeMode){
                                this.$router.push("/expendables/requestRecord");
                            }else{
                                this.reload();
                            }
                        } else {
                            type = "error";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        })
                    }).catch(err => {})
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: "耗材未选择！",
                    })
                }
            }
        },
        //数量change事件
        handleNumberChange(newValue, oldValue, rowItem) {
            if (newValue == undefined) {
                setTimeout(() => {
                    rowItem.ThisTimeRequestCount = 1;
                }, 0);
            }
        }
    },
    computed: {
        countTotalNumber() {
            return row => {
                if (row.MinimumUnit) {
                    row.ThisTimeRequestTotal = row.MinimumUnit * row.ThisTimeRequestCount;
                    return row.ThisTimeRequestTotal;
                } else {
                    return 0;
                }
            }
        }
    },
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#consumableRequest {
    .cssd_title {
        .cssd_title_right {
            .el-select {
                width: 200px;

                .el-input {
                    input {
                        border: 2px solid #9EA6B2;
                        font-size: 18px;
                        font-weight: bold;
                        color: #fff;
                    }
                }
            }
        }
    }

    .cssd_table_center {
        overflow: hidden;

        .table_box {
            padding: 30px 40px;
            height: 100%;
            box-sizing: border-box;
            overflow-y: scroll;

            .el-table {
                tbody {
                    .cell {
                        font-size: 18px;
                        color: #232e41;
                        font-weight: bold;

                        a {
                            cursor: pointer;
                            color: #F93E3E;
                            font-weight: bold;
                        }

                        .el-select {
                            width: 160px;
                        }

                        .el-date-editor {
                            width: 160px;
                        }

                        .el-input {
                            width: 160px;
                        }

                        .el-input-number {
                            width: 60px;

                            >.el-input {
                                width: 100%;
                            }
                        }

                        input {
                            font-size: 16px;
                            font-weight: bold;
                            color: #232E41;
                            display: block;

                        }
                    }
                }
            }

            .el-button {
                margin-top: 20px;
                color: #fff;
            }
        }

        .cssd_table_bottom {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
