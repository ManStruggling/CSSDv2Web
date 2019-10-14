<template>
  <div id="app">
    <transition
        name="fade"
        enter-active-class="animated  faster fadeInRight"
        leave-active-class="animated  faster fadeOutLeft"
      >
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      fullscreenLoading:false
    }
  },
  computed: mapGetters(["UId", "CssdId"]),
  created() {
    window.VueVm = new Vue();//用于beforeRouteEnter钩子函数的消息提示
    let loading;
    //配置发送请求前的拦截器 可以设置token信息 
   axios.interceptors.request.use(config => {
          //loading开始
           loading = this.$loading({
              lock: true,
              text: '加载中...',
              spinner: 'el-icon-loading',
              background: 'rgba(255, 255, 255, 0)'
            });
           return config;
       }, error => {
           //出错，也要loading结束
           loading.close();
           this.showInformation({classify:"message",msg:error});
           return Promise.reject(error);
       });
    // 配置响应拦截器 
    axios.interceptors.response.use(res => {
        //loading结束
        loading.close();
        return Promise.resolve(res);
    }, error => {
        loading.close();
        this.showInformation({classify:"message",msg:error});
        return Promise.reject(error);
    })
    
    if(sessionStorage.userInfo){
      window.UserInfo=JSON.parse(sessionStorage.userInfo);
      this.GLOBAL.UserInfo = UserInfo;
      axios.defaults.headers.CssdId=UserInfo.ClinicId;
      axios.defaults.headers.UId=UserInfo.UId;
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
}
</style>
