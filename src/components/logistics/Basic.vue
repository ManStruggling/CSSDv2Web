<template>
  <div id="cssd_table">
    <div class="head_box">
      <router-link to="/" tag="p">上海倍而纳医疗器械科技有限公司</router-link>
      <div class="head_user"><p>{{GLOBAL.UserInfo.ClinicName}}</p><p>{{GLOBAL.UserInfo.UserName}}</p><a @click="GLOBAL.logOut" class="logOut"></a></div>
    </div>
    <transition
        name="slide"
        :enter-active-class="`animated  faster ${transitionEnterName}`"
        :leave-active-class="`animated  faster ${transitionLeaveName}`"
      >
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>
export default {
  //路由前置守卫
  beforeRouteEnter (to, from, next) {
    if(sessionStorage.userInfo){
      next();
    }else{
      next('/login')
    }
  },
  created(){
    
  }
};
</script>

<style lang="scss">
  @import'../../assets/css/tableHead';
</style>