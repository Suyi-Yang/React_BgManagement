/* 商品管理路由 */
import React, { Component } from "react";
import { Switch,Route,Redirect } from "react-router-dom";

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'

export default class Product extends Component {
  render(){
    return (      
      <Switch>
        <Route path='/product' component={ProductHome} exact/> {/* exact:路径完全匹配 */}
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}