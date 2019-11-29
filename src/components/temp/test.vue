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
        <li>
            <el-input v-model="obj.Title"></el-input>
            <el-input type="textarea" v-model="obj.Content"></el-input>
            <el-button @click="sendMessage2">发放</el-button>
        </li>
        <li>
            <p>接收</p>
            <span>{{receiveData2}}</span>
        </li>
    </ul>
</div>
</template>

<script>
import * as signalR from "@aspnet/signalr";
export default {
    data() {
        return {
            IsTestMode: false,
            IsSend: false,
            str: "",
            receiveData: "",
            receiveData2: "",
            obj: {
                Title: "",
                Content: ""
            }
        };
    },
    created() {
        if (sessionStorage.IsTestMode) {
            this.IsTestMode = JSON.parse(sessionStorage.IsTestMode);
        }
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/api/WebHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();
        this.connection.start();
        this.connection.on("taskUpdateReminder", data => {
            this.receiveData = data;
        });
        this.connection2 = new signalR.HubConnectionBuilder()
            .withUrl("/api/PdaHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();
        this.connection2.start();
        this.connection2.on("callRecycleNotification", data => {
            this.receiveData2 = JSON.stringify(data);
        });
    },
    mounted() {},
    beforeDestroy() {
        this.connection.stop();
    },
    methods: {
        switchChange(val) {
            sessionStorage.IsTestMode = val;
        },
        sendMessage() {
            this.connection
                .invoke("TaskUpdateNotification", this.str).catch(function (err) {
                    return console.error(err);
                });
        },
        sendMessage2() {
            this.connection2
                .invoke("CallRecycleNotification", JSON.stringify(this.obj)).catch(function (err) {
                    return console.error(err);
                });
        }
    }
};
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
