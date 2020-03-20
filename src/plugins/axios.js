import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message, Loading } from "element-ui";
import GLOBAL from "@/global/global";
import store from "@/store";

const service = axios.create({
  baseURL: "http://192.168.1.13", // url = base url + request url
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*"
  },
  responseType: "json",
  // headers: { "Content-Type": "application/x-www-form-urlencoded" },
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
});

let loading;
service.interceptors.request.use(
  config => {
    //loading开始
    NProgress.start();
    loading = Loading.service({
      lock: true,
      text: "加载中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0)"
    });
    if (store.getters.UserInfo.ClinicId && store.getters.UserInfo.UId) {
        config.headers.LocationId = store.getters.UserInfo.ClinicId;
        config.headers.UId = store.getters.UserInfo.UId;
    }
    return config;
  },
  error => {
    //出错，也要loading结束
    NProgress.done();
    loading.close();
    return Promise.reject(error);
  }
);

// 配置响应拦截器
service.interceptors.response.use(
  res => {
    //loading结束
    NProgress.done();
    loading.close();
    return Promise.resolve(res);
  },
  error => {
    NProgress.done();
    loading.close();
    Message({
      message: error || "Error",
      type: "error",
      duration: 2 * 1000,
      showClose: true
    });
    return Promise.reject(error);
  }
);

if (sessionStorage.IsTestMode) {
  if (JSON.parse(sessionStorage.IsTestMode)) {
    service.defaults.headers.IsTestMode = true;
  } else {
    service.defaults.headers.IsTestMode = false;
  }
} else {
  service.defaults.headers.IsTestMode = false;
}
export default {
  service: service,
  http: axios
};
