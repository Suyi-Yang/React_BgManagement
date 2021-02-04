/* 创建/修改用户 */
import React,{ Component } from "react";
import { Modal, Form, Input, Button, Select } from 'antd';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types'

export default class UserAddUpdate extends Component {
  static propTypes = { //声明接收(可以不进行说明接收 但做了更好)
    roles: PropTypes.array.isRequired,
    addOrUpdateUsers: PropTypes.func.isRequired,
  }
  state = {
    visible: false,
    disabled: true,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
  };
  //从props属性中拿到父组件传递的方法
  addOrUpdateUsers = this.props.addOrUpdateUsers
  //创建一个Ref 指定给form
  formRef = React.createRef();
  /* Modal */
  draggleRef = React.createRef();
  showModal = () => { //显示Modal
    this.setState({
      visible: true,
    });
  };
  handleOk = () => { //点击【确认】
    const form = this.formRef.current
    form.validateFields().then((values) => { //成功
      //从form的values中拿到user数据 传递到父组件方法中发送请求
      this.addOrUpdateUsers(values.user) 
      form.resetFields(); //清空输入的缓存
      this.setState({visible: false,}); //隐藏Modal
    }).catch((info) => { //失败
      console.log('Validate Failed:', info);
    });
  };
  handleCancel = () => { //点击【取消】
    this.setState({visible: false,}); //隐藏Modal
    this.formRef.current.resetFields() //清空表单数据
  };
  onStart = (event, uiData) => { //开始拖拽Modal
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
      },
    });
  };
  /* Form */
  // onFinish = (values) => {
  //   // console.log('onFinish()',values);
  //   console.log('Success:', values);
  // };

  render() {
    const { bounds, disabled, visible } = this.state;
    const {roles} = this.props
    return (
      <>
        <Button type='primary' onClick={this.showModal}>创建用户</Button>
        <Modal
          title={
            <div
              style={{ width: '100%', cursor: 'move', }}
              onMouseOver={() => {if (disabled) {this.setState({disabled: false,});}}}
              onMouseOut={() => {this.setState({disabled: true,});}}
              onFocus={() => {}}
              onBlur={() => {}}
            >创建用户</div>}
          visible={visible} okText='确认' cancelText='取消' cancle
          onOk={this.handleOk} onCancel={this.handleCancel}
          modalRender={modal => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => this.onStart(event, uiData)}
            >
              <div ref={this.draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <Form name="basic" ref={this.formRef}
            labelCol={{span: 5}} wrapperCol={{span: 16}}
            initialValues={{
              // remember: true,
            }}
            // onFinish={this.onFinish}
            requiredMark={false} //必选样式(*) false则不显示(*)
            validateMessages={{
              required: '${label}为必填项!',
              types: { email: '请填写一个有效的${label}!', },
            }}
          >
            <Form.Item name={['user', 'username']} label="用户名" rules={[{required: true,},]}>
              <Input placeholder='请输入用户名'/>
            </Form.Item>
            <Form.Item name={['user', 'password']} label="密码" rules={[{required: true,},]}>
              <Input.Password placeholder='请输入密码'/>
            </Form.Item>
            <Form.Item name={['user', 'phone']} label="手机号" rules={[{required: true,},]}>
              <Input placeholder='请输入用手机号'/>
            </Form.Item>
            <Form.Item name={['user', 'email']} label="邮箱" rules={[{type: 'email',required: true,},]}>
              <Input placeholder='请输入邮箱'/>
            </Form.Item>
            <Form.Item name={['user', 'role_id']} label="角色" rules={[{required: true,},]}>
              <Select placeholder='请选择角色' /* defaultValue="manager" */>
                {
                  roles.map((role)=>
                    <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}