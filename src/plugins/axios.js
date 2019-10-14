import axios from 'axios';

export default {
    install(Vue) {
        Vue.prototype.$http = axios;
        window.axios = axios.create({
            baseURL: 'http://192.168.1.24',
            timeout: 30000,
            headers: {
                // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            responseType: 'json'
        })
    }
}