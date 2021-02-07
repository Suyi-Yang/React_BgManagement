/* 头部的组件 */
import React, {Component} from 'react'
import { withRouter } from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from "react-redux";

import LinkButton from '../link-btn'
import menuList from '../../config/menuConfig'
import { formatDate } from "../../utils/dateUtils";
import { reqWeather } from "../../api";
import './index.less'
import { logout } from "../../redux/actions";

class Header extends Component {
  state = {
    currentTime: formatDate(Date.now()), //当前时间字符串
    city: '', //城市
    weather: '', //天气情况
    temperature: '' //温度
  }
  //获取标题(当前选中的导航菜单项)
  getTitle = ()=>{
    const path = this.props.location.pathname //得到当前请求路径
    let title
    menuList.forEach(item => {
      if(item.key===path){ //若当前item对象的key与path一样
        title = item.title //需要显示的title即为该item的title
      }else if(item.children){ //如果当前item对象有children
        //在item的children中 查找匹配的子item
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        if(cItem){ //如果存在匹配的子item
          title = cItem.title //需要显示的title即为该子item的title
        }
      }
    })
    return title //返回title
  }
  //获取当前时间
  getTime = ()=>{
    //每隔1s 获取当前时间 并更新状态数据currentTime
    this.intervalId = setInterval(()=>{
      const currentTime = formatDate(Date.now())
      this.setState({currentTime})
    },1000)
  }
  //获取某地天气
  getWeather = async ()=>{
    //调用接口请求异步获取数据
    const {city,weather,temperature} = await reqWeather(420100) //武汉420100
    this.setState({city,weather,temperature}) //更新状态
  }
  //退出登录
  logout = ()=>{
    Modal.confirm({ //弹出确认框
      icon: <ExclamationCircleOutlined />,
      title: '您确定要退出登录吗?',
      okText: '确认', cancelText: '取消',
      onOk: ()=>{
        this.props.logout()
      }
    })
  }

  /* 第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器 */
  componentDidMount(){
    this.getTime() //获取当前时间
    this.getWeather() //获取当前天气
  }
  /* 当前组件卸载之前调用 */
  componentWillUnmount(){
    clearInterval(this.intervalId) //清除[获取时间]定时器
  }

  render(){
    const {currentTime,city,weather,temperature} = this.state
    const username = this.props.user.username
    //得到当前需要显示的title
    const title = this.props.headTitle //通过redux
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span>{city+' '+weather+' '+temperature+'℃'}</span>
          </div>
        </div>
      </div>
    )
  }
}

/* UI组件 */
// export default withRouter(Header)
/* 生成容器组件 */
export default connect(
  state => ({headTitle: state.headTitle, user: state.user}), //一般属性
  {logout} //函数属性
)(withRouter(Header))