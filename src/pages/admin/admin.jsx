/* 后台管理主路由组件 */
import React,{ Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from 'antd';
import { connect } from "react-redux";

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
// import Bar from '../bar/bar-noER'
import Line from '../line/line'
import Pie from '../pie/pie'
import NotFound from "../not-found/not-found";

const { Footer, Sider, Content } = Layout;
class Admin extends Component{
  render(){
    const user = this.props.user //从redux管理的状态中读取user
    if(!user || !user._id){ //如果没有user数据
      return <Redirect to='/login'/> //自动跳转到登录界面(在render()中)
    }
    return (      
      <Layout style={{minHeight:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin:20, backgroundColor:'#fff'}}>
            <Switch>
              <Redirect from='/' to='/home' exact/> {/* exact:精确匹配 */}
              <Route path='/home' component={Home} exact/>
              <Route path='/category' component={Category} exact/>
              <Route path='/product' component={Product} exact/>
              <Route path='/user' component={User} exact/>
              <Route path='/role' component={Role} exact/>
              <Route path='/charts/bar' component={Bar} exact/>
              <Route path='/charts/line' component={Line} exact/>
              <Route path='/charts/pie' component={Pie} exact/>
              <Route component={NotFound}/> {/* 没有匹配到以上任何一个时 显示NotFound组件 */}
            </Switch>
          </Content>
          <Footer style={{textAlign:'center',color:'rgb(170,170,170)'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {}
)(Admin)