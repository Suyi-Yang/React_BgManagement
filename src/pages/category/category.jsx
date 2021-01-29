/* 品类管理路由 */
import React, { Component } from "react";
import { Card, Table, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import Addcategory from "./Addcategory";
import Updatecategory from "./Updatecategory";
import LinkButton from '../../components/link-btn'
import {reqCategorys,reqUpdateCategorys,reqAddCategorys} from '../../api'

export default class Category extends Component {
  state = {
    loading: false, //是否正在获取数据中
    categorys: [], //一级分类列表(数据)
    subCategorys: [], //二级分类列表(数据)
    parentId: '0', //当前需要显示的分类列表的父分类ID(0表示一级分类列表的父id)
    parentName: '', //当前需要显示的分类列表的父分类名称
  }

  //初始化Table所有列的数组
  initColumns = ()=>{
    //表格-列
    this.columns = [
      {title: '分类名称', dataIndex: 'name'}, //dataIndex 显示数据对应的属性名
      {title: '操作', width: 260,
        render: (category) => ( //返回需要显示的界面标签
          <span>
            <Updatecategory category={category} updateCategory={this.updateCategory}></Updatecategory> {/* [修改分类]选项  */}          
            {this.state.parentId==='0' ? <LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton> : null  } {/* 显示二级列表时 不显示[查看子分类]选项 */}
            {/* category：每行代表的分类对象 */}
            {/* 向事件回调函数传递参数：先定义一个匿名函数，再函数调用处理的函数并传入数据 */}
          </span>
        ),
      },
    ];
  }

  //异步获取一级/二级分类列表显示
  getCategorys = async ()=>{
    this.setState({loading: true}) //发送请求前 显示loading
    const {parentId} = this.state
    //发异步ajax请求 获取数据
    const result = await reqCategorys(parentId)
    this.setState({loading: false}) //请求完成后 隐藏loading
    if(result.status===0){
      //取出分类数组categorys(可能是一级的也可能是二级的)
      const categorys = result.data
      if(parentId==='0'){ //父id为'0',则为一级的
        this.setState({categorys}) //更新一级分类状态
      }else{ //父id不为'0',则为二级的
        this.setState({subCategorys:categorys}) //更新二级分类状态
      }
    }else{
      message.error('获取分类列表失败')
    }
  }
  //显示[[指定一级分类对象的]二级子列表]
  showSubCategorys = (category)=>{
    //更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, ()=>{ //(箭头)回调函数在状态更新且重新render()后执行
      this.getCategorys()      
    })
    /* setState()是异步更新状态的 因此执行后不能立即获取到最新的状态
      需要立即获取最新状态 则在第二个参数的回调函数中执行相关操作 */
  }
  //显示一级分类列表
  showCategorys = ()=>{
    //更新为显示一级列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: [],
    })
  }

  //(修改分类后)更新分类
  updateCategory = async (category) => {
    // 得到数据
    const categoryId = category._id
    const categoryName = category.name
    // 异步请求更新分类
    const result = await reqUpdateCategorys({categoryId, categoryName})
    if (result.status === 0) {      
      this.getCategorys() //重新获取列表
    }
  }

  //添加分类
  addCategory = async (categoryNew)=>{
    //=====================TODO：this.parentId需要动态获取
    //现在添加分类，全部会添加到一级分类列表，无法指定添加到其他二级分类列表
    const result = await reqAddCategorys(this.parentId,categoryNew)
    if (result.status === 0) {      
      this.getCategorys() //重新获取列表
    }
  }

  //为第一次render()准备数据
  UNSAFE_componentWillMount(){
    this.initColumns()
  }
  //执行异步任务：发异步ajax请求
  componentDidMount(){
    this.getCategorys()
  }

  render(){
    const {categorys,loading,parentId,subCategorys,parentName} = this.state //读取状态数据
    //card左侧标题
    const title = parentId==='0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{marginLeft:5,marginRight:10,color:'#1DA57A'}} />
        <span>{parentName}</span>
      </span>
    )
    //card右侧按钮
    const extra = <Addcategory categorys={categorys} parentId={parentId} addCategory={this.addCategory}></Addcategory>

    return (
      <Card title={title} extra={extra}>
        <Table bordered rowKey='_id' loading={loading} columns={this.columns} 
        dataSource={parentId==='0' ? categorys:subCategorys}
        pagination={{defaultPageSize:5, showQuickJumper:true}} />
        {/* <Demo></Demo> */}
      </Card>
    )
  }
}