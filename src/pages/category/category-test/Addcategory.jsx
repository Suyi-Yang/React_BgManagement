import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const CustomizedForm = ({ onChange, fields }) => {
  
  return (
    <Form
      name="addCategory"
      layout="horzital"
      fields={fields}
      onFieldsChange={(_, allFields) => {
        onChange(allFields);
        console.log('onFieldsChange');
        console.log(allFields);
        // console.log(allFields[0].value);
        console.log('fields:=====');
        console.log(fields);
        
      }}
    >
      <Form.Item
        name="categoryName" 
        rules={[
          {
            required: true,
            message: '请输入分类名称',
          },
        ]}
      >
        <Input placeholder='请输入分类名称'/>
      </Form.Item>
    </Form>
  );
};


const Addcategory = (props) => {
  const {categorys,parentId,addCategory} = props
  const [form] = Form.useForm();

  const [fields, setFields] = useState([
    {
      name: ['categoryName'],
      value: '',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log('handleOk');
    //console.log(values); //fields
    let category = fields[0].value
    addCategory(category)
    // form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>添加</Button>

      <Modal title="添加分类" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消" >
        <p>所属分类：</p>
        <Form.Item>
          <Select value={parentId}>
            <Select.Option value="0">一级分类</Select.Option>
            {
              categorys.map((c) => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)
            }
          </Select>
        </Form.Item>
       
        <p>分类名称：</p> 
        {/* <Form.Item label="">
          <Input placeholder='请输入分类名称' />
        </Form.Item> */}     
        <CustomizedForm
          fields={fields}
          onChange={(newFields) => {
            setFields(newFields);
          }}
        />          
      </Modal>
    </>
  );
};
export default Addcategory
