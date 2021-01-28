/* 
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求：能根据接口文档定义接口请求函数
*/
import { message } from 'antd'
import jsonp from 'jsonp'
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

//[jsonp请求]的接口请求函数 ---获取天气
export const reqWeather = (cityId)=>{
  //所有接口请求函数都要返回promise对象
  return new Promise((resolve, reject)=>{
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=10dd50aaf118cfbd72dd00c1b5680272&city=${cityId}`
    //发送jsonp请求
    jsonp(url, {}, (err,data)=>{
      //console.log('jsonp()', err, data);
      if(!err && data.info==='OK'){ //如果成功了    
        const {city,weather,temperature} = data.lives[0] //取出需要的数据
        resolve({city,weather,temperature}) //调用resolve()来确定成功，并且指定成功的数据
      }else{//如果失败了
        message.error('获取天气信息失败！') //不调用reject=>统一处理错误message.error()
      }
    })
  })
}
//jsonp(url, opts, fn)：第2个参数opts为可选的,传入空对象{}即表示都为默认值
//高德：https://restapi.amap.com/v3/weather/weatherInfo?key=10dd50aaf118cfbd72dd00c1b5680272&city=420100

//获取[一级/二级]分类的列表
export const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list', {parentId})
//添加分类
export const reqAddCategorys = (parentId,categoryName) => ajax(BASE+'/manage/category/add', {parentId,categoryName}, 'POST')
//更新分类
export const reqUpdateCategorys = ({categoryId,categoryName}) => ajax(BASE+'/manage/category/update', {categoryId,categoryName}, 'POST')