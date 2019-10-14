<template>
  <div id="cssd_table">
    <div class="head_box">
      <router-link to="/" tag="p">上海倍而纳医疗器械科技有限公司</router-link>
      <div class="head_user"><p>{{GLOBAL.UserInfo.ClinicName}}</p><p>{{GLOBAL.UserInfo.UserName}}</p><a @click="GLOBAL.logOut" class="logOut"></a></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    if(sessionStorage.userInfo){
      next();
    }else{
      next('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import'../../assets/css/tableHead';
</style>