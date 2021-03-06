/* 入口js */

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

//读取local中保存的user 保存到内存中
const user = storageUtils.getUser() //从本地存储中读取
memoryUtils.user = user //存储到内存中

//将App组件标签渲染到index页面的div上
ReactDOM.render(<App/>, document.getElementById('root'))