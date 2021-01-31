/* Product的[默认]子路由组件 */
import React, { Component } from "react";
import { Button, Card, Input, message, Select, Table } from "antd";
import { PlusOutlined } from '@ant-design/icons';

import LinkButton from "../../components/link-btn";
import { reqProducts,reqSearchProducts,reqUpdateStatus } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";

export default class ProductHome extends Component{
  state = {
    total: 0, //商品的总数量
    products: [], //商品的数组
    loading: false, //是否正在加载中    
    searchType: 'productName', //根据哪个字段搜索
    searchName: '', //搜索的关键字
  }

  //初始化table列标题的数组
  initColumns = ()=>{
    this.columns = [
      {title: '商品名称', dataIndex: 'name', width: '18%'},
      {title: '商品描述', dataIndex: 'desc',},
      {title: '商品价格', dataIndex: 'price', width: '10%', render: (price)=>'￥'+price}, //当前指定了对应的属性 传入的是对应的属性值
      {title: '状态', width: '15%', 
        render: (product)=>{
          const {status,_id} = product
          const newStatus = status===1 ? 2:1 //1:在售 2:已下架
          return (
            <span>
              <span style={{marginRight:8}}>{status===1 ? '在售':'已下架'}</span>
              <Button 
                type='primary' 
                onClick={()=>{this.updateStatus(_id,newStatus)}}
              >
                {status===1 ? '下架':'上架'}
              </Button>
            </span>
          )
        }
      },
      {title: '操作', width: '15%', render: (product)=>{
        return (
          <span>
            {/* 将product对象使用state传递给目标路由组件 */}
            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
            <LinkButton>修改</LinkButton>
          </span>
        )
      }},
    ]
  }
  //获取指定页码的列表数据显示
  getProducts = async (pageNum)=>{
    this.pageNum = pageNum //将pageNum保存到this中 使其他方法可以看到并使用
    this.setState({loading:true}) //显示loading

    const {searchName,searchType} = this.state    
    let result
    if(searchName){ //搜索分页请求(搜索关键字input框内有值)
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
    }else{ //一般分页请求
      result = await reqProducts(pageNum,PAGE_SIZE)
    }
    
    this.setState({loading:false}) //隐藏loading
    if(result.status===0){
      //取出分页数据 更新状态 显示分页列表
      const {total,list} = result.data
      this.setState({total,products:list})
    }
  }
  //更新指定商品的状态
  updateStatus = async (productId,status)=>{
    const result = await reqUpdateStatus(productId,status)
    if(result.status===0){
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }

  UNSAFE_componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getProducts(1)
  }

  render(){
    //取出状态数据
    const {products,total,loading,searchType,searchName} = this.state
    const title = (
      <span>
        <Select 
          value={searchType} 
          onChange={value=>this.setState({searchType:value})}
        >
          <Select.Option value='productName'>按名称搜索</Select.Option>
          <Select.Option value='productDesc'>按描述搜索</Select.Option>
        </Select>
        <Input 
          placeholder='关键字' 
          style={{width:180,margin:'0 5px'}} 
          value={searchName}
          onChange={e=>this.setState({searchName:e.target.value})}
        ></Input>
        <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>
      </span>
    )
    const extra = (<Button type='primary'><PlusOutlined />添加商品</Button>)
    return (
      <Card title={title} extra={extra}>
        <Table 
          bordered 
          rowKey='_id' 
          loading={loading}
          dataSource={products} 
          columns={this.columns} 
          pagination={{
            total, 
            defaultPageSize:PAGE_SIZE, 
            showQuickJumper:true,
            onChange: this.getProducts //简写(传入的实参就是要接收的参数)
          }}
        />
      </Card>
    )
  }
}