import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';

import LinkButton from '../../components/link-btn'

const CollectionCreateForm = ({ visible, onCreate, onCancel, category }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="修改分类"
      okText="确认"
      cancelText="取消"
      onCancel={()=>{ //点击取消
        form.resetFields(); //清空上次输入的缓存【3】
        onCancel(); //隐藏Modal
      }}
      onOk={() => { //点击确认       
        form
          .validateFields()
          .then((values) => { //成功
            onCreate(values);
          })
          .catch((info) => { //失败
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ //初始值
          title: category.name, //动态获取当前行的category【1】
        }}
      >
        <Form.Item name="title">
          <Input placeholder="请输入分类名称"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Updatecategory = (props) => {  
  const [visible, setVisible] = useState(false);
  let {category,updateCategory} = props

  const onCreate = (values) => {
    // console.log('Received values of form: ', values);
    category.name = values.title //修改后的分类名:values.title
    updateCategory(category) //调用异步更新分类
    setVisible(false); //隐藏Modal
  };  

  return (
    <>
      <LinkButton type="primary" onClick={()=>{setVisible(true);}}>修改分类</LinkButton>
      <CollectionCreateForm visible={visible} onCreate={onCreate} onCancel={()=>{setVisible(false);}} category={category}/>
    </>
  );
};

export default Updatecategory