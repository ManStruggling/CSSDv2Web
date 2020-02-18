<template>
<div id="editBox" class="consumableProductBox">
    <div class="editContainer">
        <div class="editContent">
            <ul class="clear_float">
                <li>
                    <p>产品名称</p>
                    <el-input type="text" placeholder="器械名称(必填)" v-model.trim="editBoxData.Name"></el-input>
                </li>
                <li>
                    <p>最小规格数</p>
                    <el-input-number v-model.trim="editBoxData.MinimumUnit" :min="1" :max="999999" :controls="false" placeholder="最小规格数" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'MinimumUnit')})"></el-input-number>
                </li>
                <li>
                    <p>单价</p>
                    <el-input-number placeholder="单价" v-model="editBoxData.Price" :min="1" :max="999999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'Price')})"></el-input-number>
                </li>
                <li>
                    <p>请领代码</p>
                    <el-input type="text" placeholder="请领代码(必填)" v-model.trim="editBoxData.ReceiveCode"></el-input>
                </li>
                <li>
                    <p>请领部门</p>
                    <el-select v-model="editBoxData.ReceiveDepartmentId" placeholder="请领部门(必填)" class="green24x13">
                        <el-option v-for="(item,index) in receiveDepartments" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </li>
            </ul>
        </div>
        <div class="editBoxOption">
            <el-button @click="editBoxCancelSave">取消</el-button>
            <el-button type="primary" @click="editBoxSave">完成</el-button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            editBoxData: {},
            receiveDepartments: []
        };
    },
    created() {
        this.editBoxData = this.$props.data;
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
        }).catch(err => {})
    },
    methods: {
        //取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //保存编辑
        editBoxSave() {
            if (this.GLOBAL.VerificationHandle([{
                    val: this.editBoxData.Name,
                    type: "StringNotEmpty",
                    msg: "产品名称不能为空！"
                }, {
                    val: this.editBoxData.ReceiveCode,
                    type: "StringNotEmpty",
                    msg: "请领代码不能为空！"
                }, {
                    val: this.editBoxData.ReceiveDepartmentId,
                    type: "StringNotEmpty",
                    msg: "请领部门不能为空！"
                }])) {
                let method = "Post";
                if (this.editBoxData.Id != 0) {
                    method = "Put";
                }
                axios({
                    url: '/api/ConsumableProduct',
                    method: method,
                    data: this.editBoxData
                }).then(res => {
                    let type;
                    if (res.data.Code == 200) {
                        type = "success";
                        this.$emit("to-father", res.data.Data);
                    } else {
                        type = "error";
                    }
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg,
                        type: type
                    });
                }).catch(err => {})
            }
        },
        //数字改变
        numberChange(newValue, oldValue, origin) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.editBoxData[origin] = oldValue;
                }, 0);
            }
        }
    }
};
</script>

<style lang="scss">

</style>
