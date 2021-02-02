/* Product的[添加和更新的]子路由组件 */
import React, { Component } from "react";
import { Card, Form, Input, Button, Cascader, message } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-btn'
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'

export default class ProductAddUpdate extends Component {
  state = {
    options: [], //一级列表项
  }
  constructor(props){
    super(props)
    //创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef() //商品图片
    this.editor = React.createRef() //商品详情
  }
  //【分类】初始化选项列表(一级)
  initOptions = async (categorys)=>{
    //根据categorys生成options的数组
    const options = categorys.map(c=>({
      value: c._id,
      label: c.name,
      isLeaf: false, //不是叶子(即不是最后一级)
    }))

    //【修改商品】[二级分类商品]的[更新]
    const {isUpdate,product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0'){ //如果是一个[二级分类商品]的[更新]
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级下拉列表的options
      const childOptions = subCategorys.map(c=>({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)
      //关联到对应的一级option上
      targetOption.children = childOptions
    }

    //更新options的状态
    this.setState({options})
  }
  //【分类】异步获取一级/二级分类列表 并显示
  getCategorys = async (parentId)=>{
    const result = await reqCategorys(parentId) //{status:0,data:categorys}
    if(result.status===0){
      const categorys = result.data
      if(parentId==='0'){ //一级分类列表
        this.initOptions(categorys) //初始化选项列表(一级) 并显示
      }else{ //二级分类列表
        return categorys //返回二级列表的categorys
        /* 当前async函数返回的promise会成功 且value为categorys */
      }
    }
  }
  //【分类】选项变化
  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
  };
  //【分类】用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    const {options} = this.state
    const targetOption = selectedOptions[0]; //选中的option对象
    targetOption.loading = true; //显示loading

    //根据选中的一级分类 请求获取对应的二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false; //隐藏loading
    if(subCategorys && subCategorys.length>0){ //如果二级分类数组有数据 且数量大于0
      //生成一个二级列表的options
      const childOptions = subCategorys.map(c=>({
        value: c._id,
        label: c.name,
        isLeaf: true, //是叶子(即是最后一级)
      }))
      //关联到上一级的option上
      targetOption.children = childOptions //二级列表项
    }else{ //如果没有二级列表
      targetOption.isLeaf = true //则是叶子 不显示箭头
    }
    this.setState({options:[...options]}) //更新options状态    
  };

  //【提交】表单
  onFinish = async (values) => {
    // console.log(values); //查看方法本身能收集到的数据values
    //【1】收集数据
    //获取[商品图片]的数据
    const imgs = this.pw.current.getImgs()
    values.product.imgs = imgs
    //获取[商品详情]的数据    
    const detail = this.editor.current.getDetail()
    values.product.detail = detail
    //获取[分类id]的数据
    const {categoryIds} = values.product
    let pCategoryId,categoryId
    if(categoryIds.length===1){ //如果categoryIds中只有一个数据
      pCategoryId = '0' //则父id为0 即一级分类列表
      categoryId = categoryIds[0] //此数据为:当前分类id
    }else{ //如果categoryIds中有两个数据
      pCategoryId = categoryIds[0] //第一个数据:父id
      categoryId = categoryIds[1] //第二个数据:当前分类id
    }
    values.product.pCategoryId = pCategoryId //将父id添加到product对应属性上
    values.product.categoryId = categoryId //将分类id添加到product对应属性上
    //获取[_id]的数据
    if(this.isUpdate){ //如果是【修改分类】才需要添加_id属性(【添加分类】不需要该属性)
      values.product._id = this.product._id
    }    
    console.log(values); //查看自定义方法后 可收集到的数据values

    //【2】调用接口请求函数去[添加/修改]
    const result = await reqAddOrUpdateProduct(values.product)

    //【3】根据结果 显示提示信息
    if(result.status===0){
      message.success(`${this.isUpdate ? '修改':'添加'}商品成功！`)
      this.props.history.goBack()
    }else{
      message.error(`${this.isUpdate ? '修改':'添加'}商品失败！`)
    }
  };

  UNSAFE_componentWillMount(){
    //取出携带的state
    const product = this.props.location.state //如果是[添加商品]则没有值 否则有值
    //保存[是否为'修改商品']的标识
    this.isUpdate = !!product //!product:取反变成布尔值 !!product:再次取反 变为原值
    //取出当前product 保存到this中(如果没有则保存的是{})
    this.product = product || {}
  }
  componentDidMount(){
    this.getCategorys('0') //请求一级分类列表
  }

  render() {
    const {isUpdate, product} = this
    const {pCategoryId,categoryId,imgs,detail} = product
    const categoryIds = [] //接收级联分类ID的数组
    if(isUpdate){ //【修改商品】
      if(pCategoryId==='0'){ //如果商品是一级分类
        categoryIds.push(categoryId) //只显示当前商品分类
      }else{ //如果商品是二级分类
        categoryIds.push(pCategoryId) //当前商品分类 父级的id
        categoryIds.push(categoryId) //当前商品分类 自身的id
      }
    }
    const {options} = this.state

    const title = (
      <LinkButton onClick={() => this.props.history.goBack()}>
        <ArrowLeftOutlined style={{ marginRight: 10, color: '#1DA57A' }} />
        {isUpdate ? '修改商品' : '添加商品'}
      </LinkButton>)

    //指定Form布局的配置对象
    const layout = {
      labelCol: {span: 4,}, //左侧label的宽度
      wrapperCol: {span: 12,}, //右侧包裹的宽度
    };
    const validateMessages = {required: '${label}必须输入！',};

    return (
      <Card title={title} className='product-subpage-title'>
        <Form {...layout} name="addupdateProduct" onFinish={this.onFinish} 
          validateMessages={validateMessages} 
          initialValues={{ 
            product:{
              name: product.name,
              desc: product.desc,
              price: product.price,
              categoryIds: categoryIds,
              imgs: product.imgs,
              detail: product.detail,
            }
          }}
        >
          <Form.Item name={['product', 'name']} label="商品名称" rules={[{required: true,},]}>
            <Input placeholder='输入商品名称'/>
          </Form.Item>
          <Form.Item name={['product', 'desc']} label="商品描述" rules={[{required: true,},]}>
            <Input.TextArea placeholder='输入商品描述' autoSize={{minRows:2,maxRows:6}} allowClear={true}/>
          </Form.Item>
          <Form.Item name={['product', 'price']} label="商品价格"
           rules={[
             {required: true,},
             {validator: (_, value) => value>0 ? Promise.resolve() : Promise.reject('商品价格必须大于0'),}
           ]}>
            <Input placeholder='输入商品价格' type='number' addonAfter="元"/>
          </Form.Item>
          <Form.Item name={['product', 'categoryIds']} label="商品分类" rules={[{required: true,},]}>
            <Cascader placeholder={'选择商品分类'}
              options={options} loadData={this.loadData} onChange={this.onChange} changeOnSelect />
            {/* options：需要显示的列表数据数组
            loadData(实现动态加载选项)：选择某个列表项时 加载下一集列表的监听回调 */}
          </Form.Item>
          <Form.Item name={['product', 'imgs']} label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Form.Item>
          <Form.Item name={['product', 'detail']} label="商品详情">
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}