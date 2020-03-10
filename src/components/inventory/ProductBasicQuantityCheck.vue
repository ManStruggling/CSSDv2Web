<template>
<div class="cssd_box" id="productBasicQuantityCheck">
    <div class="cssd_title">
        <ul class="cssd_menu">
            <router-link to="/" tag="li">
                <p>返回</p>
            </router-link>
        </ul>
        <div class="cssd_title_right">
            <p>
                <span>调整科室</span>
                <el-select v-model="ClinicId" filterable @change="changeClinic" class="white24x13">
                    <el-option v-for="(item,index) in GLOBAL.UserInfo.SubClinics" :key="index" :label="item.SubClinicName" :value="item.SubClinicId"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <el-table :data="submitData.Products">
                <el-table-column width="240" label="包名称" prop="ProductName"></el-table-column>
                <el-table-column width="210" label="原包基数" prop="OriginalQuantity"></el-table-column>
                <el-table-column width="210" label="本次调整数" prop="AdjustQuantity"></el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button @click="checkFailed">审核不通过</el-button>
                <el-button type="primary" round @click="checkSuccess">审核通过</el-button>
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
            ClinicId: null,
            checkTasks: {
                
            },
            submitData: {
                Products: []
            }
        };
    },
    created() {
        axios({
            url: `/api/ProductBasicQuantity/PendingReviewRecords`
        }).then(res=>{
            if(res.data.Code==200){
                this.checkTasks = res.data.Data;
            }else{
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                })
            }
        })
    },
    mounted() {},
    methods: {
        //审核通过
        checkSuccess() {
            axios({
                url: "/api/ProductBasicQuantity/ApplyAdjustQuantity",
                method: "POST",
                data: this.submitData
            }).then(res=>{
                let type;
                if(res.data.Code==200){
                    type = "success";
                    this.reload();
                }else{
                    type = "error";
                }
                this.showInformation({
                    classify: "message",
                    msg: Msg,
                    type: type
                })
            }).catch(err=>{})
        },
        // 审核不通过
        checkFailed(){
            
        },
        //调整主科室
        changeClinic(val){

        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#productBasicQuantityCheck {
    .cssd_title_right {
        .el-select {
            width: 200px;

            .el-input {
                input {
                    font-size: 18px;
                    color: #fff;
                    font-weight: bold;

                    &::-webkit-input-placeholder {
                        font-weight: normal;
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
                    }
                }
            }
        }

    }
}
</style>
