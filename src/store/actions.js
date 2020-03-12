import * as types from './types';

let actions = {
    [types.VIEW_LOADING]: ({ commit, state }, payload) => commit(types.VIEW_LOADING, payload),
    [types.CAR_NUM]: ({ commit, state }, payload) => commit(types.CAR_NUM, payload),
    [types.VIEW_NAV]: ({ commit, state }, payload) => commit(types.VIEW_NAV, payload),
    [types.ADD_NUM]: ({ commit, state }, payload) => commit(types.ADD_NUM, payload),
    [types.CAR_LIST]: ({ commit, state }, payload) => commit(types.CAR_LIST, payload),
    [types.UserInfo]: ({ commit, state }, payload) => commit(types.UserInfo, payload),
    [types.UId]: ({ commit, state }, payload) => commit(types.UId, payload),
    [types.CssdId]: ({ commit, state }, payload) => commit(types.CssdId, payload)
}

export default actions;