<template>
  <div id="cssd_table">
    <div class="head_box">
      <router-link to="/" tag="p">云南软博科技有限责任公司</router-link>
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
      if(UserInfo.JobAndCompetence.includes('161')||UserInfo.JobAndCompetence.includes('162')||UserInfo.JobAndCompetence.includes('261')||UserInfo.JobAndCompetence.includes('262')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('200')||UserInfo.JobAndCompetence.includes('202')||UserInfo.JobAndCompetence.includes('102')){
        next();
      }else{
        next(from.path);
        VueVm.$message({
          type:'warning',
          message:'您没有库存模块访问权限！',
          center:true,
          duration:2000,
          showClose:true
        })         
      }
    }else{
      next('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import'../../assets/css/tableHead';
</style>