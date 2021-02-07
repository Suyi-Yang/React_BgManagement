import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddRole = (props) => {
  const {addRole} = props
  const [visible, setVisible] = useState(false);
  
  const [form] = Form.useForm();
  const onClick = ()=>{ //点击【创建角色】按钮
    setVisible(true); //显示Modal 
  }

  const onCreate = (values) => {
    // console.log('form接收到的values:', values); //roleInp:xxx
    addRole(values.roleInp) //根据输入的值 创建角色
    setVisible(false); //隐藏Modal
  };

  return (
    <>      
      <Button type="primary" onClick={onClick}>创建角色</Button>
      <Modal visible={visible} centered={true}
        title="创建角色" okText="确认" cancelText="取消"
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
          <p>角色名称：</p>
          <Form.Item name="roleInp" rules={[{required:true,message:'请输入角色名称!'}]}>
            <Input placeholder="请输入角色名称"/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddRole