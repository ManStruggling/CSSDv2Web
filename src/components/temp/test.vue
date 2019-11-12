<template>
<div id="cssdTest">
    <ul>
        <li>
            <p>请求头测试模式</p>
            <el-switch v-model="IsTestMode" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false" @change="switchChange"></el-switch>
        </li>
        <li>
            <el-input v-model="str"></el-input>
            <el-button @click="sendMessage">发送</el-button>
        </li>
        <li>
            <p>接收</p>
            <span>{{receiveData}}</span>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    data() {
        return {
            IsTestMode: false,
            IsSend: false,
            str: "",
            receiveData: ""
        }
    },
    created() {
        if (sessionStorage.IsTestMode) {
            this.IsTestMode = JSON.parse(sessionStorage.IsTestMode);
        }
    },
    mounted() {
        this.GLOBAL.initWebSorcket(this, "test");
    },
    beforeDestroy() {
        this.websocket.close();
    },
    methods: {
        switchChange(val) {
            sessionStorage.IsTestMode = val;
        },
        sendMessage() {
            this.websocket.send(JSON.stringify({
                Istest:true,
                test: this.str
            }));
        },
        receiveMessage(data){
            this.receiveData = JSON.stringify(data);
        }
    },
}
</script>

<style lang="scss" scoped>
#cssdTest {
    padding: 30px 40px;

    ul {
        li {
            display: flex;
            margin: 10px 0;

            p {
                margin-right: 20px;
            }

            .el-input {
                width: 200px;
            }

            .el-button {
                padding: 0 10px;
                margin-left: 20px;
            }
        }
    }
}
</style>
