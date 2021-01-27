/* 后台管理主路由组件 */
import React,{ Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component{
  render(){
    const user = memoryUtils.user //从内存中读取user
    if(!user || !user._id){ //如果没有user数据
      return <Redirect to='/login'/> //自动跳转到登录界面(在render()中)
    }
    return (      
      <Layout style={{height:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin:20, backgroundColor:'#fff'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign:'center',color:'rgb(170,170,170)'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}