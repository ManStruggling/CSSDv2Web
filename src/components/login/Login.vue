<template>
<div id="cssd_login">
    <div class="cssd_login_left">
        <p></p>
    </div>
    <div class="cssd_login_right">
        <dl>
            <dt>
                <p></p>
                <h4>医院消毒供应追溯管理软件</h4>
            </dt>
            <dd>
                <p>账号</p>
                <el-input v-model.trim="loginAccount" v-focus @blur="getClinicList" placeholder="请输入账号"></el-input>
            </dd>
            <dd>
                <p>密码</p>
                <el-input type="password" v-model.trim="loginPassword" @keyup.enter.native="loginToStart" placeholder="请输入密码"></el-input>
            </dd>
            <dd>
                <p>科室</p>
                <el-select filterable default-first-option v-model="loginClinicId" :disabled="forbid" placeholder="请选择科室" class="green24x13">
                    <el-option v-for="(item,index) in clinics" :key="index" :label="item.ClinicName" :value="item.ClinicId"></el-option>
                </el-select>
            </dd>
            <dd>
                <el-button type="primary" @click="loginToStart">登录</el-button>
            </dd>
        </dl>
        <h5>
            <a href="\Client\CSSDv2Client.rar" download="CSSDv2Client.rar"><i class="el-icon-download"></i>下载客户端</a>
            <b>云南软博科技有限责任公司</b>
            <s>{{versionMsg.HospitalVersion+" "+versionMsg.Version}}</s>
        </h5>
    </div>
</div>
</template>

<script>
import * as types from "../../store/types";
export default {
    data() {
        return {
            forbid: true,
            loginAccount: "",
            loginClinicId: "",
            loginPassword: "",
            clinics: [],
            versionMsg: {
                HospitalVersion: "",
                Version: ""
            }
        };
    },
    created() {
        CSManager.handleDataThis = this;
        axios({
            url: `/api/Login/CssdVersion`
        }).then(res => {
            if (res.data.Code == 200) {
                this.versionMsg = res.data.Data;
            } else {
                this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                });
            }
        });
    },
    mounted() {},
    beforeDestroy() {
        CSManager.handleDataThis = null;
    },
    methods: {
        //账号失焦获取科室列表
        getClinicList() {
            if (this.loginAccount) {
                axios({
                        url: `/api/Login/Clinic/${this.loginAccount}`
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            this.forbid = false;
                            type = "success";
                            this.clinics = res.data.Data;
                            if (this.clinics.length > 0) {
                                this.loginClinicId = this.clinics[0].ClinicId;
                            }
                        } else {
                            this.forbid = true;
                            type = "warning";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        });
                    })
                    .catch(err => {});
            }
        },
        //登录
        loginToStart() {
            if (
                this.GLOBAL.VerificationHandle([{
                        val: this.loginAccount,
                        type: "StringNotEmpty",
                        msg: "账号不能为空！"
                    },
                    {
                        val: this.loginPassword,
                        type: "StringNotEmpty",
                        msg: "登录密码不能为空！"
                    }
                ])
            ) {
                axios({
                        url: `/api/Login/${this.loginClinicId}/${this.loginAccount}/${this.loginPassword}`
                    })
                    .then(res => {
                        let type;
                        if (res.data.Code == 200) {
                            type = "success";
                            Object.assign(res.data.Data, this.versionMsg)
                            sessionStorage.userInfo = JSON.stringify(res.data.Data);
                            // this.$router.push({path:'/'});
                            window.location.href = '/';
                        } else {
                            type = "warning";
                        }
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg,
                            type: type
                        });
                    })
                    .catch(err => {});
            }
        },
        handleBarCode(msg) {
            axios({
                    url: `/api/Login/ClinicByBarCode/${msg}`
                })
                .then(res => {
                    if (res.data.Code == 200) {
                        this.loginAccount = res.data.Data.Account;
                        this.loginPassword = res.data.Data.Password;
                        this.forbid = false;
                        this.clinics = res.data.Data.Clinics;
                        if (this.clinics.length > 0) {
                            this.loginClinicId = this.clinics[0].ClinicId;
                        }
                        if (this.clinics.length == 1) {
                            //登录
                            this.loginToStart();
                        }
                    } else {
                        this.showInformation({
                            classify: "message",
                            msg: res.data.Msg
                        });
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="scss">
#cssd_login {
    height: 100%;
    min-height: 800px;
    min-width: 1300px;
    height: 100%;
    display: flex;

    .cssd_login_left {
        width: 65%;
        background-image: url("/images/login_background.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;

        p {
            width: 55.3%;
            background-image: url("/images/login_background_img.png");
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;

            &::before {
                content: "";
                padding-top: 100%;
                display: block;
            }
        }
    }

    .cssd_login_right {
        flex: 1;
        position: relative;

        dl {
            position: absolute;
            left: 0;
            right: 0;
            top: 35%;
            margin: auto;
            height: 360px;
            width: 428px;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            dt {
                width: 100%;
                height: 220px;
                position: absolute;
                top: -220px;
                left: 0;

                p {
                    width: 140px;
                    height: 140px;
                    background-image: url("/images/login_logo.png");
                    background-size: 100% 100%;
                    margin: 0 auto;
                }

                h4 {
                    margin-top: 60px;
                    font-size: 30px;
                    font-family: Microsoft YaHei;
                    color: rgba(25, 103, 178, 1);
                    line-height: 40px;
                    text-align: center;
                }
            }

            dd {
                display: flex;
                justify-content: space-between;
                line-height: 50px;

                p {
                    font-size: 24px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(35, 46, 65, 1);
                }

                >div {
                    width: 280px;

                    input {
                        height: 50px;
                        line-height: 50px;
                        font-size: 24px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(35, 46, 65, 1);
                    }
                }

                .el-select {
                    .el-input {
                        &::after {
                            top: 20px;
                        }
                    }
                }

                &:nth-child(5) {
                    justify-content: center;

                    .el-button {
                        width: 212px;
                        line-height: 40px;
                        background: #00c16b;
                        border: 0;
                        font-size: 24px;
                    }
                }
            }
        }

        h5 {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 40px;
            text-align: center;
            font-size: 20px;
            font-family: Microsoft YaHei;
            color: rgba(135, 141, 159, 1);
            line-height: 26px;
            display: flex;
            flex-direction: column;

            a {
                color: #232E41;

                &:hover {
                    color: #00c16b;

                    i {
                        color: #00c16b;
                    }
                }

                i {
                    font-weight: bold;
                    color: #232E41;
                }
            }

            b {
                margin: 20px 0 10px
            }
        }
    }
}
</style>
