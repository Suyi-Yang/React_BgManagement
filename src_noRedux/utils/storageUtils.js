/* 进行local数据存储管理的工具模块 */
import store from 'store'

const USER_KEY = 'user_key'
export default {  
  saveUser(user){ //保存user
    store.set(USER_KEY, user)
  },  
  getUser(){ //读取user
    return store.get(USER_KEY) || {}
  },  
  removeUser(){ //删除user
    store.remove(USER_KEY)
  }
}

//原生写法
/* export default {  
  saveUser(user){ //保存user
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },  
  getUser(){ //读取user
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  },  
  removeUser(){ //删除user
    localStorage.removeItem(USER_KEY)
  }
} */