<template>
  <div id="cssd_table">
    <div class="head_box">
      <router-link to="/" tag="p">{{UserInfo.Configuration.Company?UserInfo.Configuration.Company.Name:'上海倍而纳医疗器械科技有限公司'}}</router-link>
      <div class="head_user"><p>{{UserInfo.ClinicName}}</p><p>{{UserInfo.UserName}}</p><a @click="GLOBAL.logOut" class="logOut"></a></div>
    </div>
    <transition
        name="slide"
        :enter-active-class="`animated  faster ${transitionEnterName}`"
        :leave-active-class="`animated  faster ${transitionLeaveName}`"
    >
      <router-view :UserInfo="UserInfo"></router-view>
    </transition>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  //路由前置守卫
  beforeRouteEnter (to, from, next) {
    if(sessionStorage.userInfo){
      next();
    }else{
      next('/login')
    }
  },
  computed: {
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  }
}
</script>

<style lang="scss" scoped>
  @import'../../assets/css/tableHead';
</style>