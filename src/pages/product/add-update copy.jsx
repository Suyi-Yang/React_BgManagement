/* Product的[添加和更新的]子路由组件 */
import React, { Component } from "react";
import { Card, Form, Input, Button, Cascader } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-btn'
import {reqCategorys} from '../../api'

const optionLists = [ //一级列表项
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];
const LazyOptions = () => {
  const [options, setOptions] = React.useState(optionLists);

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
  //用于加载下一级列表的回调函数
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[0]; //选中的option对象
    targetOption.loading = true; //显示loading

    //模拟请求异步获取二级列表数据 并更新
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [ //二级列表项
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ];
      setOptions([...options]); //更新options状态
    }, 1000); //定时器模拟加载1s
  };

  return <Cascader placeholder={'选择商品分类'}
   options={options} loadData={loadData}
   onChange={onChange} changeOnSelect />;
  //options：需要显示的列表数据数组
  //loadData(实现动态加载选项)：选择某个列表项时 加载下一集列表的监听回调
};

export default class ProductAddUpdate extends Component {
  onFinish = (values) => {
    console.log(values);
  };

  render() {
    const title = (
      <LinkButton onClick={() => this.props.history.goBack()}>
        <ArrowLeftOutlined style={{ marginRight: 10, color: '#1DA57A' }} />添加商品
      </LinkButton>)

    //指定Form布局的配置对象
    const layout = {
      labelCol: {span: 4,}, //左侧label的宽度
      wrapperCol: {span: 12,}, //右侧包裹的宽度
    };
    const validateMessages = {required: '${label}必须输入！',};

    return (
      <Card title={title} className='product-subpage-title'>
        <Form {...layout} name="addupdateProduct" onFinish={this.onFinish} validateMessages={validateMessages} initialValues={{ name:'商品',categoryIds: [] }}>
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
            {/* <Cascader options={options} loadData={loadData} onChange={onChange} changeOnSelect /> */}
            <LazyOptions />
          </Form.Item>
          <Form.Item name={['product', 'imgs']} label="商品图片">
            <Input />
          </Form.Item>
          <Form.Item name={['product', 'detail']} label="商品详情">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}