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
                <el-select v-model="recordId" filterable @change="changeClinic" class="white24x13">
                    <el-option v-for="(item,index) in checkTasks" :key="index" :label="item.ClinicName" :value="item.Id"></el-option>
                </el-select>
            </p>
        </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
        <div class="table_box">
            <el-table :data="tableData()">
                <el-table-column width="240" label="包名称" prop="ProductName"></el-table-column>
                <el-table-column width="210" label="原包基数" prop="OriginalQuantity"></el-table-column>
                <el-table-column width="210" label="本次调整数" prop="AdjustQuantity"></el-table-column>
                <el-table-column></el-table-column>
            </el-table>
        </div>
        <div class="cssd_table_bottom">
            <p></p>
            <p>
                <el-button @click="checkComplete('/api/ProductBasicQuantity/ReviewFailed')">审核不通过</el-button>
                <el-button type="primary" round @click="checkComplete('/api/ProductBasicQuantity/ReviewPass')">审核通过</el-button>
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
            recordId: null,
            checkTasks: [],
        };
    },
    created() {
        axios({
            url: `/api/ProductBasicQuantity/PendingReviewRecords`
        }).then(res=>{
            if(res.data.Code==200){
                this.checkTasks = res.data.Data.ApplyRecords;
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
        tableData(){
            for (let i = 0; i < this.checkTasks.length; i++) {
                if(this.checkTasks[i].Id === this.recordId){
                    return this.checkTasks[i].Products;
                }
            }
            return [];
        },
        // 审核
        checkComplete(url){
            if(this.recordId){
                axios({
                    url: `${url}/${this.recordId}`,
                    method: 'POST'
                }).then(res=>{
                    let type;
                    if(res.data.Code==200){
                        type = 'success';
                        this.reload();
                    }else{
                        type = 'error';
                    }
                    this.showInformation({
                        classify: 'message',
                        type: type,
                        msg: res.data.Msg
                    })
                }).catch(err=>{})
            }else{
                this.showInformation({
                    classify: 'message',
                    msg: '科室未选择！'
                })
            }
        },
        //调整主科室
        changeClinic(val){
            if(this.checkTasks.filter(item=>item.Id==val)[0].Products==''){
                axios({
                    url: `/api/ProductBasicQuantity/PendingReviewRecord/Packages/${this.recordId}`
                }).then(res=>{
                    this.checkTasks.forEach(item=>{
                        if(item.Id===this.recordId){
                            item.Products = res.data.Data;
                            return;
                        }
                    })
                }).catch(err=>{})
            }
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
