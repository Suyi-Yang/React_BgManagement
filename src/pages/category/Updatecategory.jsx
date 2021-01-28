import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import LinkButton from '../../components/link-btn'

const Updatecategory = () => {
  

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
    console.log('showModal');
  };
  const handleOk = () => {
    setIsModalVisible(false);
    console.log('handleOk');
    //1.读取当前category
    //let newCategory = this.value
    //console.log(this);
    //2.更新当前category(发请求)
    //3.清除缓存数据?
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    console.log('handleCancel');
  };

  return (
    <>
      <LinkButton type="primary" onClick={showModal}>修改分类</LinkButton>

      <Modal title="修改分类" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">       
        <Form.Item label="">
          <Input placeholder='家用电器'/>
        </Form.Item>               
      </Modal>
    </>
  );
};
export default Updatecategory
