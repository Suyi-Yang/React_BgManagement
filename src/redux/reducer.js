/* 根据[当前状态]和[指定的action] 生成并返回[新的state]的[函数] */
import { combineReducers } from "redux"; //整合多个reducer

import storageUtils from "../utils/storageUtils";
import { SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER } from "./action-type";

//用来管理[头部标题]的reducer函数
const initHeadTitle = '' //若初始化为404 则不应该显示任何title
function headTitle(state=initHeadTitle, action){
  switch (action.type){
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state //返回原状态
  }
}
//用来管理[当前登录用户]的reducer函数
const initUser = storageUtils.getUser()
function user(state=initUser, action){
  switch (action.type){
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      // state.errorMsg = errorMsg //不要直接修改原本状态数据(×)
      return {...state, errorMsg} //原state数据+错误信息(√)
    case RESET_USER: //退出登录时 重置用户信息
      return {} //user置为空对象
    default:
      return state //返回原状态
  }
}

//向外默认暴露的是：合并产生的[总的reducer函数]
export default combineReducers({
  headTitle,
  user
})
//管理的总的state的结构：
// {
//   headTitle: '首页',
//   user: {}
// }