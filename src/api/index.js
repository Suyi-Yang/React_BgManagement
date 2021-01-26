/* 
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/

import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''

//登录
export const reqLogin = (username,password) => ajax(BASE + '/login', {username,password}, 'POST')
/* 不要写“{}”：箭头函数的箭头有返回作用，如果写大括号则需要添加return */
/* export function reqLogin(username,password){
  return ajax('/login', {username,password}, 'POST')
} */

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')