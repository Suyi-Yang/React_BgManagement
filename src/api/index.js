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

/* login组件 */
//登录
export const reqLogin = (username,password) => ajax(BASE + '/login', {username,password}, 'POST')
/* 不要写“{}”：箭头函数的箭头有返回作用，如果写大括号则需要添加return */
/* export function reqLogin(username,password){
  return ajax('/login', {username,password}, 'POST')
} */
//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')
//[jsonp请求]的接口请求函数 ---获取天气(20)
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

/* category组件 */
//获取[一级/二级]分类的列表(06)
export const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list', {parentId})
//添加分类
export const reqAddCategorys = (parentId,categoryName) => ajax(BASE+'/manage/category/add', {parentId,categoryName}, 'POST')
//更新分类
export const reqUpdateCategorys = ({categoryId,categoryName}) => ajax(BASE+'/manage/category/update', {categoryId,categoryName}, 'POST')

/* product组件 */
//获取商品分页列表(10)
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})
//搜索商品分页列表(11) searchType:搜索类型=>searchName:productName或productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchType,searchName}) => ajax(BASE+'/manage/product/search',{pageNum,pageSize,[searchType]:searchName})
//获取一个分类(09_根据分类ID获取分类)
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})
//更新商品的状态(上架/下架)(14)
export const reqUpdateStatus = (productId,status) => ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')
//删除指定名称的图片(16)
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')
//添加/修改商品(12/13)
export const reqAddOrUpdateProduct = (product) => ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')
//add和update的区别：是否有商品id(product._id)
// export const reqAddProduct = (product) => ajax(BASE+'/manage/product/add',product,'POST')
// export const reqUpdateProduct = (product) => ajax(BASE+'/manage/product/update',product,'POST')

/* role组件 */
//获取所有角色的列表(18)
export const reqRoles = () => ajax(BASE+'/manage/role/list')
//添加角色(17)
export const reqAddRole = (roleName) => ajax(BASE+'/manage/role/add',{roleName},'POST')
//更新角色/设置角色权限(19) role:_id/menus/auth_time/auth_name
export const reqUpdateRole = (role) => ajax(BASE+'/manage/role/update',role,'POST')