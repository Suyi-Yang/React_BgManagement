/* 头部的组件 */
import React, {Component} from 'react'
import './index.less'

import logo from '../../assets/images/logo.png'

export default class Header extends Component {
  render(){
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，admin</span>
          <a href="http://www.baidu.com">退出</a>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>首页</div>
          <div className='header-bottom-right'>
            <span>2021-1-27 16:05:26</span>
            <img src={logo} alt="weather"/>
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}