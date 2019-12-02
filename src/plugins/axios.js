import axios from 'axios';

export default {
    install(Vue) {
        // axios.defaults.baseURL = "http://192.168.1.24"
        axios.defaults.baseURL = "http://192.168.1.19:7777"
        Vue.prototype.$http = axios;
        window.axios = axios.create({
            timeout: 30000,
            headers: {
                // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            responseType: 'json'
        })
    }
}