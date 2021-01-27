/* 左侧导航的组件 */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from 'antd';

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const { SubMenu } = Menu;
class LeftNav extends Component {
  
  /* 根据menu的[数据数组] 生成对应的[标签数组] */
  /* 方法1：使用map() + 递归调用 */
  getMenuNodesMap = (menuList)=>{
    return menuList.map(item => {
      if(!item.children){ //没有子菜单列表时
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>            
          </Menu.Item>
        )
      }else{ //有子菜单列表时
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.getMenuNodes(item.children)} {/* 递归调用:遍历子项 */}
          </SubMenu>
        )
      }
    })
  }
  /* 方法2：使用reduce() + 递归调用 */
  getMenuNodes = (menuList)=>{
    const path = this.props.location.pathname //得到当前请求的路由路径
    return menuList.reduce((pre,item)=>{
      if(!item.children){
        pre.push(( //没有子菜单列表时 向pre中添加<Menu.Item>
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>            
          </Menu.Item>
        ))
      }else{
        //查找一个与[当前请求路径]匹配的子Item
        const cItem = item.children.find(cItem => cItem.key===path)
        if(cItem){ //如果存在 则当前item的子列表需要打开          
          this.openKey = item.key
        }
        pre.push(( //有子菜单列表时 向pre中添加<SubMenu>
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.getMenuNodes(item.children)} {/* 递归调用:遍历子项 */}
          </SubMenu>
        ))
      }
      return pre //返回生成的[标签数组]
    }, [])
  }

  /* 在第一次render()之前执行一次
      为第一次render()准备数据(必须是同步的 而非异步的) */
  // componentWillMount(){ //不建议使用componentWillMount 将要弃用
  UNSAFE_componentWillMount(){ //使用"UNSAFE_"以禁止控制台警告
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render(){
    // const menuNodes = this.getMenuNodes(menuList)
    const path = this.props.location.pathname //得到当前请求的路由路径
    const openKey = this.openKey //得到需要打开子菜单项的key
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]} //selectedKeys:当前选中的菜单项key数组                    
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {this.menuNodes}
          {/* {menuNodes} */}
        </Menu>
      </div>
    )
  }
}
/* withRouter高阶组件：
    包装非路由组件(LeftNav) 返回一个新的组件
    新的组件 向非路由组件传递3个属性:history/location/match */
export default withRouter(LeftNav)