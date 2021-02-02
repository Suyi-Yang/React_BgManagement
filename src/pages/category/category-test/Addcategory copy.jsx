import React, { useState } from 'react';
import { Modal, Form, Input,Button,Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CollectionCreateForm = ({ visible, onCreate, onCancel, categorys, parentId }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      // visible={()=>{
      //   // visible=!!visible
      //   // setVisible(!!visible);
      // }}
      title="添加分类"
      okText="确认"
      cancelText="取消"
      onCancel={()=>{ //点击取消
        form.resetFields(); //清空上次输入的缓存【3】
        onCancel(); //隐藏Modal
        console.log('onCancel()-Modal',parentId);
        // parentId=''
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
          cateSel: parentId,
        }}

        preserve={false}
      >
        <p>所属分类：</p>
        <Form.Item name="cateSel" >
          <Select /* key={parentId} defaultValue={parentId} */>
            <Select.Option value="0">一级分类</Select.Option>
            {
              categorys.map((c) => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)
            }
          </Select>
        </Form.Item>
       
        <p>分类名称：</p>
        <Form.Item 
          name="cateInp" 
          rules={[
            {
              required: true,
              message: '请输入分类名称!',
            },
          ]}
        >
          <Input placeholder="请输入分类名称"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Addcategory = (props) => {    
  const {categorys,parentId,addCategory} = props
  const [visible, setVisible] = useState(false);

  const onClick = ()=>{
    setVisible(true);
    // this.parentId = parentId
    console.log('onClick()',parentId);
  }
  const onCancel = (values)=>{
    setVisible(false);
    console.log('onCancel()-CollectionCreateForm',values);
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
      {/* <Button type="primary" icon={<PlusOutlined />} onClick={()=>{setVisible(true);}}>添加分类</Button> */}
      <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>添加分类</Button>
      {/* <CollectionCreateForm visible={visible} onCreate={onCreate} onCancel={()=>{setVisible(false);}} categorys={categorys} parentId={parentId}/> */}
      <CollectionCreateForm visible={visible} onCreate={onCreate} onCancel={onCancel} categorys={categorys} parentId={parentId}/>
    </>
  );
};

export default Addcategory