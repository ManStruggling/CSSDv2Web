import axios from 'axios';

export default {
    install(Vue) {
        axios.defaults.baseURL = "http://192.168.1.250:31415"
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