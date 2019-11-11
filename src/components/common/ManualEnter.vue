<template>
<div id="manual_enter">
    <dl>
        <dt>
            <el-input v-model.trim="input_str" @keyup.enter.native="SaveOption" v-focus placeholder="请扫描或手动录入条码"></el-input>
        </dt>
        <dd>
            <el-button @click="cancelOption">取消</el-button>
            <el-button type="primary" @click="SaveOption">确定</el-button>
        </dd>
    </dl>
</div>
</template>

<script>
export default {
    props: ["BarCodeList", "ApiUrl", "task_index", "firstRequest", "func", "CustomBarcode"],
    data() {
        return {
            input_str: "",
            alreadyRequested: false
        };
    },
    created() {},
    mounted() {},
    methods: {
        cancelOption() {
            this.$emit("to-father", "");
        },
        SaveOption() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.input_str,
                    type: "StringNotEmpty",
                    msg: "扫描条码不能为空！"
                }])
            ) {
                if (this.func) {
                    this.func(this.input_str);
                    this.$emit("to-father", "");
                    return;
                }
                //先请求再匹配是否重复
                if (this.$props.firstRequest) {
                    if (this.alreadyRequested == false) {
                        this.alreadyRequested = true;
                        axios(`${this.$props.ApiUrl}/${this.input_str}`)
                            .then(res => {
                                if (res.data.Code == 200) {
                                    if (this.$props.task_index >= 0) {
                                        this.$emit("to-father", {
                                            data: res.data.Data,
                                            index: this.$props.task_index
                                        });
                                    } else {
                                        if (res.data.Data.PackageBarCodeScannerVm) {
                                            for (let i = 0; i < this.$props.BarCodeList.length; i++) {
                                                if (
                                                    this.$props.BarCodeList[i].BarCode ==
                                                    res.data.Data.PackageBarCodeScannerVm.BarCode
                                                ) {
                                                    this.showInformation({
                                                        classify: "message",
                                                        msg: "该条码已录入！",
                                                        type: "warning"
                                                    });
                                                    this.input_str = "";
                                                    return;
                                                }
                                            }
                                        }
                                        this.$emit("to-father", res.data.Data, this.input_str);
                                    }
                                } else if (res.data.Code == 300) {
                                    this.alreadyRequested = false;
                                    this.input_str = "";
                                    this.showInformation({
                                        classify: "message",
                                        msg: res.data.Msg,
                                        type: "warning"
                                    });
                                } else {
                                    this.alreadyRequested = false;
                                    this.input_str = "";
                                    this.showInformation({
                                        classify: "message",
                                        msg: res.data.Msg,
                                        type: "error"
                                    });
                                }
                            })
                            .catch(err => {});
                    }
                } else {
                    //先匹配重复再决定是否请求
                    this.$props.BarCodeList.forEach(item => {
                        //发现已录入
                        if (item.BarCode == this.input_str.toUpperCase()) {
                            this.showInformation({
                                classify: "message",
                                msg: "该条码已录入！",
                                type: "warning"
                            });
                            this.input_str = "";
                            return;
                        }
                    });
                    //没有录入
                    if (this.input_str) {
                        if (this.alreadyRequested == false) {
                            this.alreadyRequested = true;
                            axios(`${this.$props.ApiUrl}/${this.input_str}`)
                                .then(res => {
                                    if (res.data.Code == 200) {
                                        if (this.$props.task_index >= 0) {
                                            this.$emit("to-father", {
                                                data: res.data.Data,
                                                index: this.$props.task_index
                                            });
                                        } else {
                                            this.$emit("to-father", res.data.Data, this.input_str);
                                        }
                                    } else if (res.data.Code == 300) {
                                        this.alreadyRequested = false;
                                        this.input_str = "";
                                        this.showInformation({
                                            classify: "message",
                                            msg: res.data.Msg,
                                            type: "warning"
                                        });
                                    } else {
                                        if (this.CustomBarcode) {
                                            this.$emit("to-father", {
                                                BarCode: this.input_str,
                                                IsOldPackageBarCode: true
                                            })
                                        }
                                        this.alreadyRequested = false;
                                        this.input_str = "";
                                        this.showInformation({
                                            classify: "message",
                                            msg: res.data.Msg,
                                            type: "error"
                                        });
                                    }
                                })
                                .catch(err => {});
                        }
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss">
#manual_enter {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 10;

    dl {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 360px;
        height: 200px;
        border-radius: 8px;
        background: #fff;
        padding: 24px 30px;
        box-sizing: border-box;

        dt {
            margin-bottom: 20px;

            .el-input {
                height: 100px;
                font-size: 16px;
                color: #232e41;
                font-weight: bold;
                font-family: Microsoft YaHei;

                .el-input__inner {
                    height: 100px;
                    line-height: 100px;
                    padding: 20px;

                    &:focus {
                        border-color: rgba(0, 193, 107, 1);
                    }
                }
            }
        }

        dd {
            text-align: center;

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
