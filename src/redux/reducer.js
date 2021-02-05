/* 根据[当前状态]和[指定的action] 生成并返回[新的state]的[函数] */
import { combineReducers } from "redux"; //整合多个reducer

import storageUtils from "../utils/storageUtils";
import { SET_HEAD_TITLE } from "./action-type";

//用来管理[头部标题]的reducer函数
const initHeadTitle = '首页'
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