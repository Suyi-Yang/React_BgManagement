import React, { useState } from 'react';
import { Modal, Form, Input,Button,Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Addcategory = (props) => {      
  const {categorys,parentId,addCategory} = props
  const [visible, setVisible] = useState(false);
  
  const [form] = Form.useForm();
  const onClick = ()=>{ //点击【添加分类】按钮
    setVisible(true); //显示Modal  
    form.setFieldsValue({ //setFieldsValue:设置表单的值
      cateSel: parentId, //动态设置Form中cateSel的初始值为当前parentId
    });
  }

  const onCreate = (values) => {
    // console.log('form接收到的values: ', values);
    //调用异步更新分类
    if(!values.cateSel){ //如果values.cateSel为undefined(即 父id没有改变)
      addCategory(parentId,values.cateInp) //传入 原父id+当前输入框的值
    }else{ //如果values.cateSel有值(即 父id改变了)
      addCategory(values.cateSel,values.cateInp) //传入 选项的id+当前输入框的值
    }
    setVisible(false); //隐藏Modal
  };

  return (
    <>      
      <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>添加分类</Button>
      <Modal visible={visible} title="添加分类" okText="确认" cancelText="取消" centered={true}
        onCancel={()=>{setVisible(false);}} //点击取消 隐藏Modal       
        onOk={() => { //点击确认
          form
            .validateFields()
            .then((values) => { //成功
              onCreate(values);
              form.resetFields(); //清空上次输入的缓存【3】
            })
            .catch((info) => { //失败
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout="vertical" name="formModal">
          <p>所属分类：</p>
          <Form.Item name="cateSel">
            <Select>
              <Select.Option value="0">一级分类</Select.Option>
              {categorys.map((c) => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)}
            </Select>
          </Form.Item>        
          <p>分类名称：</p>
          <Form.Item name="cateInp" rules={[{required: true, message: '请输入分类名称!',},]}>
            <Input placeholder="请输入分类名称"/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Addcategory