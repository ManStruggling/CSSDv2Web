import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state from './state';

Vue.use(Vuex);//安装vue状态管理插件

let store = new Vuex.Store({
    actions,getters,mutations,state
})

export default store;
