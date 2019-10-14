<template>
  <div id="cssd_table">
    <div class="head_box">
      <router-link to="/" tag="p">上海倍而纳医疗器械科技有限公司</router-link>
      <div class="head_user"><p>{{GLOBAL.UserInfo.ClinicName}}</p><p>{{GLOBAL.UserInfo.UserName}}</p><a @click="GLOBAL.logOut" class="logOut"></a></div>
    </div>
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
export default {
  beforeRouteEnter (to, from, next) {
    if(sessionStorage.userInfo){
      if(UserInfo.JobAndCompetence.includes('121')||UserInfo.JobAndCompetence.includes('122')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')){
        next();
      }else{
        next(from.path);
        VueVm.$message({
          type:'warning',
          message:'您没有清洗模块访问权限！',
          center:true,
          duration:2000,
          showClose:true
        })    
      }
    }else{
      next('/login')
    }
  }
};
</script>

<style lang="scss" scoped>
  @import'../../assets/css/tableHead.scss';
</style>