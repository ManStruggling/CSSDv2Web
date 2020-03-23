<template>
  <div id="app">
    <transition
      name="slide"
      :enter-active-class="`animated  faster ${transitionEnterName}`"
      :leave-active-class="`animated  faster ${transitionLeaveName}`"
    >
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isRouterAlive: true
    };
  },
  computed: {
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  },
  created() {
    window.VueVm = this; //用于beforeRouteEnter钩子函数的消息提示
    if (sessionStorage.userInfo) {
      let UserInfo = JSON.parse(sessionStorage.userInfo);
      window.UserInfo = UserInfo;
      store.dispatch("UserInfo", UserInfo);
      if (UserInfo.Configuration) {
        document.title = UserInfo.Configuration.Company
          ? UserInfo.Configuration.Company.Name
          : "上海倍而纳医疗器械科技有限公司";
        $("link.logo_icon").attr({
          href: UserInfo.Configuration.Company
            ? UserInfo.Configuration.Company.Logo
            : "/images/login_logo.png"
        });
      }
    }
  },
  mounted() {
    CSManager.ListenKeyUpEvent();
  },
  provide() {
    return {
      reload: this.reload,
      UserInfo: this.UserInfo
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  min-width: 1400px;
}
</style>
