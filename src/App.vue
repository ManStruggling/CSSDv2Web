<template>
<div id="app">
    <transition name="slide" :enter-active-class="`animated  faster ${transitionEnterName}`" :leave-active-class="`animated  faster ${transitionLeaveName}`">
        <router-view></router-view>
    </transition>
</div>
</template>

<script>
import Vue from 'vue';
import {
    mapGetters
} from 'vuex';
export default {
    data() {
        return {
            fullscreenLoading: false
        }
    },
    computed: mapGetters(["UId", "CssdId"]),
    created() {
        window.VueVm = new Vue(); //用于beforeRouteEnter钩子函数的消息提示
        let loading;
        //配置发送请求前的拦截器 可以设置token信息 
        axios.interceptors.request.use(config => {
            //loading开始
            loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0)'
            });
            return config;
        }, error => {
            //出错，也要loading结束
            loading.close();
            this.showInformation({
                classify: "message",
                msg: error
            });
            return Promise.reject(error);
        });
        // 配置响应拦截器 
        axios.interceptors.response.use(res => {
            //loading结束
            loading.close();
            return Promise.resolve(res);
        }, error => {
            loading.close();
            this.showInformation({
                classify: "message",
                msg: error
            });
            return Promise.reject(error);
        })

        //为请求加上UId 和 CssdId
        if (sessionStorage.userInfo) {
            window.UserInfo = JSON.parse(sessionStorage.userInfo);
            this.GLOBAL.UserInfo = UserInfo;
            axios.defaults.headers.LocationId = UserInfo.ClinicId;
            axios.defaults.headers.UId = UserInfo.UId;
            if (sessionStorage.IsTestMode) {
              if (JSON.parse(sessionStorage.IsTestMode)) {
                  axios.defaults.headers.IsTestMode = true;
              } else {
                  axios.defaults.headers.IsTestMode = false;
              }
            } else {
                  axios.defaults.headers.IsTestMode = false;
            }
        }
    },
    mounted() {
        CSManager.ListenKeyDownEvent();
    },
}
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
    min-width: 1400px;
}
</style>
