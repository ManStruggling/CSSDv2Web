import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/reset.css";
import "./assets/css/public.scss";
import "@/assets/css/element-variables.scss";
import "animate.css";
import $ from "jquery";
window.$ = $;
window.jQuery = $;
import ElementUI from "element-ui";
Vue.use(ElementUI);
import global from "./global/global";
Vue.prototype.GLOBAL = global;
//全局vue
import "./global/VuePublic";

import ClientJSManager from "./global/JSManager";
window.CSManager = ClientJSManager;
import Common from "./global/common";
Vue.use(Common);
import "./global/public";
import axios from "./plugins/axios"; //引入全局方法 变量
window.axios = axios.service;
Vue.prototype.$http = axios.http;

if (window.JSManager && window.JSManager.IsActiveCOMPort) {
  if (JSManager.IsActiveCOMPort === false) {
    CSManager.ListenKeyUpEvent();
  }
} else {
  CSManager.ListenKeyUpEvent();
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
