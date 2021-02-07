/* 包含n个action creator函数的模块
同步action：对象 {type:'xxx', data:数据值}
异步action：函数 dispatch=>{} */
import { SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER } from "./action-type";
import { reqLogin } from "../api";
import storageUtils from "../utils/storageUtils";
import { message } from "antd";

//设置头部标题的同步action
export const setHeadTitle = (headTitle)=>({type:SET_HEAD_TITLE, data:headTitle})

//接收用户信息的同步action
export const receiveUser = (user)=>({type:RECEIVE_USER, user})
//显示错误信息的同步action
export const showErrorMsg = (errorMsg)=>({type:SHOW_ERROR_MSG, errorMsg})
//登录的异步action
export const login = (username,password)=>{
  return async dispatch=>{
    //1.执行异步ajax请求
    const result = await reqLogin(username,password)    
    if(result.status===0){ //2-1.成功{status:0, data:user}:分发成功的同步action 
      const user = result.data
      storageUtils.saveUser(user) //将user保存到local中
      dispatch(receiveUser(user)) //将user保存到状态内存中(分发[接收用户信息]的同步action)
    }else{ //2-2.失败{status:1, msg:'xxx'}:分发失败的同步action 
      const msg = result.msg
      // message.error(msg) //之前的做法
      dispatch(showErrorMsg(msg)) //使用dispatch的做法
    }    
  }
}
//退出登录的同步action
export const logout = ()=>{
  storageUtils.removeUser() //删除local中的user
  return {type:RESET_USER} //返回action对象
}