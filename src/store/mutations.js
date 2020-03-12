import { VIEW_LOADING, CAR_NUM, VIEW_NAV, ADD_NUM, CAR_LIST, UserInfo, UId, CssdId } from './types'

let mutations = {
    [VIEW_LOADING]: (state, payload) => state.bLoading = payload,
    [CAR_NUM]: (state, payload) => state.carNum = payload,
    [VIEW_NAV]: (state, payload) => state.bNav = payload,
    [ADD_NUM]: (state, payload) => state.carNum = parseInt(state.carNum) + parseInt(payload),
    [CAR_LIST]: (state, payload) => state.carList = payload,
    [UserInfo]: (state, payload) => state.UserInfo = payload,
    [UId]: (state, payload) => state.UId = payload,
    [CssdId]: (state, payload) => state.CssdId = payload,
}

export default mutations;