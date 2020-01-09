<template>
  <div id="cssd_table">
    <div class="head_box">
      <router-link to="/" tag="p">{{GLOBAL.UserInfo.Configuration?GLOBAL.UserInfo.Configuration.Company.Name:'上海倍而纳医疗器械科技有限公司'}}</router-link>
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
      if(UserInfo.JobAndCompetence.includes('151')||UserInfo.JobAndCompetence.includes('152')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')){
        next();
      }else{
        next(from.path);
        VueVm.$message({
          type:'warning',
          message:'您没有发放模块访问权限！',
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