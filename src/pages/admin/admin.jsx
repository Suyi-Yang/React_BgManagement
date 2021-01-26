/* 后台管理主路由组件 */
import React,{ Component } from "react";
import { Redirect } from "react-router-dom";

import memoryUtils from '../../utils/memoryUtils'

export default class Admin extends Component{
  render(){
    const user = memoryUtils.user //从内存中读取user
    if(!user || !user._id){ //如果没有user数据
      return <Redirect to='/login'/> //自动跳转到登录界面(在render()中)
    }
    return (
      <div>Hello {user.username}</div>
    )
  }
}