<template>
<!-- 编辑弹出框 -->
<div id="editBox">
    <div class="editContainer">
        <div class="editContent">
            <ul class="clear_float">
                <li>
                    <p>原料名称</p>
                    <el-input type="text" placeholder="原料名称(必填)" v-model.trim="editBoxData.Name"></el-input>
                </li>
                <li>
                    <p>原料简码</p>
                    <el-input type="text" v-model="editBoxData.ShortCode" :disabled="editBoxData.Id==0"></el-input>
                </li>
                <li>
                    <p>规格</p>
                    <el-input type="text" placeholder="规格" v-model.trim="editBoxData.Specification"></el-input>
                </li>
                <li>
                    <p>成本价格</p>
                    <el-input-number placeholder="成本价格" v-model="editBoxData.CostPrice" :min="1" :max="99999999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'CostPrice')})"></el-input-number>
                </li>
                <li>
                    <p>清算价格</p>
                    <el-input-number placeholder="清算价格" v-model="editBoxData.ClearingPrice" :min="1" :max="99999999" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'ClearingPrice')})"></el-input-number>
                </li>
                <li>
                    <p>安全库存</p>
                    <el-input-number placeholder="安全库存" v-model="editBoxData.SafeInventory" :min="1" :controls="false" @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'SafeInventory')})"></el-input-number>
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
            editBoxData: {}
        };
    },
    created() {
        this.editBoxData = this.$props.data;
    },
    methods: {
        //el-input-number change 事件
        numberChange(newValue, oldValue, origin) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.editBoxData[origin] = 1;
                }, 0);
            }
        },
        //取消编辑
        editBoxCancelSave() {
            this.$emit("to-father", "");
        },
        //保存编辑
        editBoxSave() {
            //before submit must to do： 数据转换 表单验证;
            let axiosMethod = "";
            let arr = [{
                val: this.editBoxData.Name,
                type: "StringNotEmpty",
                msg: "原料名称不能为空！"
            }];
            if (this.editBoxData.Id == 0) {
                //新增模式
                axiosMethod = "post";
            } else {
                //更新模式
                axiosMethod = "put";
                arr.push({
                    val: this.editBoxData.ShortCode,
                    type: "ValueNotEmptyAndNotNull",
                    msg: "简码不能为空！"
                });
            }
            if (this.GLOBAL.VerificationHandle(arr)) {
                axios({
                        url: "/api/ProductMaterial",
                        method: axiosMethod,
                        data: this.editBoxData
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            //请求成功
                            type = "success";
                            this.$emit("to-father", res.data.Data);
                        } else {
                            //其他状态码
                            type = "error";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        });
                    })
                    .catch(error => {});
            }
        }
    }
};
</script>
