/* 
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
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
        const {city,weather,temperature} = data.lives //取出需要的数据
        resolve({city,weather,temperature}) //调用resolve()来确定成功，并且指定成功的数据
      }else{//如果失败了
        message.error('获取天气信息失败！') //不调用reject=>统一处理错误message.error()
      }
    })
  })
}
reqWeather(420100) //武汉
//jsonp(url, opts, fn)：第2个参数opts为可选的,传入空对象{}即表示都为默认值
/* jsonp本质不是ajax请求，而是一般的get请求 */

//百度：http://api.map.baidu.com/weather/v1/?district_id=420100&data_type=all&ak=VEK5FmWYxUCvPykqYzmuYR1hSFxSmxFB
//百度Web服务API--->存在跨域问题(需要后端解决) 能成功发送请求 但返回超时

//高德：https://restapi.amap.com/v3/weather/weatherInfo?key=10dd50aaf118cfbd72dd00c1b5680272&city=420100