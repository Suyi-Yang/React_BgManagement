import React, { useState } from 'react';
import { Modal, Form, Input,Button,Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CollectionCreateForm = ({ visible, onCreate, onCancel, categorys, parentId }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="添加分类"
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
            form.resetFields(); //清空上次输入的缓存【3】
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
          title: '', 
        }}
      >
        <p>所属分类：</p>
        <Form.Item>
          <Select defaultValue={parentId}> {/* value/defaultValue={parentId} */}
            <Select.Option value="0">一级分类</Select.Option>
            {
              categorys.map((c) => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)
            }
          </Select>
        </Form.Item>
       
        <p>分类名称：</p>
        <Form.Item name="cateInp">
          <Input placeholder="请输入分类名称"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Addcategory = (props) => {  
  const {categorys,parentId,addCategory} = props
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    // console.log('Received values of form: ', values);
    let categoryNew = values.cateInp //获取输入框中的值
    addCategory(categoryNew) //调用异步更新分类
    setVisible(false); //隐藏Modal
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={()=>{setVisible(true);}}>添加分类</Button>
      <CollectionCreateForm visible={visible} onCreate={onCreate} onCancel={()=>{setVisible(false);}} categorys={categorys} parentId={parentId}/>
    </>
  );
};

export default Addcategory