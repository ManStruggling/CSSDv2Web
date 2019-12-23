<template>
<div class="schedulingWork cssd_totalBar">
    <div class="container">
        <ul>
            <li>
                <p>班表名称</p>
                <el-input v-model.trim="submitData.Name" placeholder="班表名称"></el-input>
            </li>
            <li>
                <p>班表月份</p>
                <el-date-picker v-model="submitData.Date" type="month" placeholder="请选择年月" :clearable="false" :editable="false"></el-date-picker>
            </li>
        </ul>
    </div>
    <div class="cssd_table_bottom">
        <p></p>
        <p>
            <el-button @click="cancelSubmit">取消</el-button>
            <el-button type="primary">保存</el-button>
        </p>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            submitData: {

            }
        }
    },
    methods: {
        cancelSubmit(){
            this.$emit('to-father');
        }
    },
}
</script>

<style lang="scss">
@import "../../assets/css/tableTotalBottomBar";

.schedulingWork {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
    z-index: 9;
    box-sizing: border-box;
    .container{
        height: 100%;
        padding: 30px 40px;
        box-sizing: border-box;
        overflow-y: auto;
        >ul{
            display: flex;
            line-height: 40px;
            border-bottom: 1px solid #F2F4F7;
            padding-bottom: 30px;
            li{
                display: flex;
                justify-content: space-between;
                width: 240px;
                margin-right: 100px;
                p{
                    width: 70px;
                    font-size: 16px;
                    color: #878D9F;
                    text-align: right;
                }
                .el-input{
                    width: 160px;
                }
                .el-input__inner{
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                }
            }
        }
    }
}
</style>
