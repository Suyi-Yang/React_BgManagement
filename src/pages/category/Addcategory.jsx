import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Addcategory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>添加</Button>

      <Modal title="添加分类" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消" >
        <p>所属分类：</p>
        <Form.Item label="">
          <Select defaultValue="firstCategory">
            <Select.Option value="firstCategory">一级分类</Select.Option>
            <Select.Option value="computers">电脑</Select.Option>
            <Select.Option value="books">图书</Select.Option>
          </Select>
        </Form.Item>        
        <p>分类名称：</p> 
        <Form.Item label="">
          <Input placeholder='请输入分类名称' />
        </Form.Item>               
      </Modal>
    </>
  );
};
export default Addcategory
