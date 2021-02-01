/* Product的[详情]子路由组件 */
import React, { Component } from "react";
import { Card,List } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-btn'
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

export default class ProductDetail extends Component{
  state = {
    cName1: '', //一级分类名称
    cName2: '', //二级分类名称
  }

  async componentDidMount(){
    //得到当前商品的分类ID
    const {pCategoryId,categoryId} = this.props.location.state.product
    if(pCategoryId==='0'){ //如果是一级分类下的商品 则只显示一级列表项名称
      const result = await reqCategory(categoryId) //只需要获取它自己的name
      const cName1 = result.data.name
      this.setState({cName1})
    }else{ //如果是二级分类下的商品 则显示两级的名称 ---需要获取自己的和父级的name
      /* 方法1：result1=await req1;result2=await req2;cName1=result1.xx;cName2=result2.xx
      通过多个await方式发多个请求(后面一个请求是在前一个请求成功返回之后才会发送) */
      /* 方法2：Promise.all([req1,req2,..])
      一次性发送多个请求(只有都成功了 才正常处理) */
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1,cName2})
    }
  }

  render(){
    //读取携带过来的state数据
    const {name,desc,price,detail,imgs} = this.props.location.state.product
    const {cName1,cName2} = this.state

    const title = (
      <LinkButton onClick={()=>this.props.history.goBack()}>
        <ArrowLeftOutlined style={{marginRight:10,color:'#1DA57A'}}/>商品详情
      </LinkButton>
    )
    return (
      <Card title={title} className='product-subpage-title'>
        <List>
          <List.Item className='item'>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </List.Item>
          <List.Item className='item'>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item className='item'>
            <span className='left'>商品价格：</span>
            <span>{price}</span>
          </List.Item>
          <List.Item className='item'>
            <span className='left'>所属分类：</span>
            <span>{cName1}{cName2 ? ' -> '+cName2 : ''}</span>
          </List.Item>
          <List.Item className='item'>
            <span className='left'>商品图片：</span>
            <span>
              {
                imgs.map(img => (
                  <img key={img} className='product-img' src={BASE_IMG_URL+img} alt="img"/>
                ))
              }              
            </span>
          </List.Item>
          <List.Item className='item'>
            <span className='left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </List.Item>
        </List>
      </Card>
    )
  }
}