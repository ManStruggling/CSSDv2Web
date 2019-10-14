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
      // if(UserInfo.JobAndCompetence.includes('271')||UserInfo.JobAndCompetence.includes('272')||UserInfo.JobAndCompetence.includes('261')||UserInfo.JobAndCompetence.includes('262')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('200')||UserInfo.JobAndCompetence.includes('202')){
      next();
    }else{
      next('/login')
    }
  }
};
</script>

<style lang="scss" scoped>
  @import'../../assets/css/tableHead.scss';
</style>