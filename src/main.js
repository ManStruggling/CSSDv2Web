import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';
// import './assets/lib/element-ui/index.css';
import 'animate.css'
import $ from 'jquery';
window.$ = $;
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import global from './global/global';
Vue.prototype.GLOBAL = global;
//全局vue
import './global/VuePublic';

import JSManager from './global/JSManager';
window.CSManager = JSManager;
import Common from './global/common';
Vue.use(Common);
import './global/public';
import axios from './plugins/axios'; //引入全局方法 变量
Vue.use(axios);
import { InputNumber, TimePicker, Input, Menu, Submenu, MenuItem, Button, CheckboxGroup, CheckboxButton, Cascader, Select, Option, DatePicker, Table, TableColumn, Tabs, TabPane, Collapse, CollapseItem, Radio, Popover } from "element-ui";
Vue.use(InputNumber);
Vue.use(TimePicker);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Button);
Vue.use(CheckboxGroup);
Vue.use(CheckboxButton);
Vue.use(Cascader);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Radio);
Vue.use(Popover);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')