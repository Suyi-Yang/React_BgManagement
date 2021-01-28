import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="修改分类"
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => { //点击确认       
        form
          .validateFields()
          .then((values) => { //成功
            form.resetFields(); //清空上次输入的缓存【3】
            onCreate(values);

            let newCategory = values.title //获取输入框中的文本value
            console.log('输入框中的值：'+newCategory);
            //1.读取当前category
            //2.更新当前category(发请求)---传递[newCategory]的值【2】

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
          title: '家用电器', //TODO：动态获取当前行的category【1】
        }}
      >
        <Form.Item name="title">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const UpdaeTest = () => {
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setVisible(false);
  };

  //自定义函数---TODO：从父级传过来  要从父级拿到当前所在行的category！！！
  const updateClick = ()=>{
    setVisible(true);
    console.log('已点击');
  }
  
  return (
    <div>
      <Button type="primary" onClick={updateClick}>修改分类【测试】</Button>
      {/* <Button type="primary" onClick={()=>{setVisible(true);}}>修改分类【测试】</Button> */}
      <CollectionCreateForm visible={visible} onCreate={onCreate} onCancel={()=>{setVisible(false);}}/>
    </div>
  );
};

export default UpdaeTest