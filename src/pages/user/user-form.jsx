/* 创建/修改用户 */
import React,{ Component } from "react";
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'

export default class UserAddUpdate extends Component {
  static propTypes = { //声明接收(可以不进行说明接收 但做了更好)
    roles: PropTypes.array.isRequired,
    addOrUpdateUsers: PropTypes.func.isRequired,
    user: PropTypes.object
  } 
  //从props属性中拿到父组件传递的方法
  addOrUpdateUsers = this.props.addOrUpdateUsers
  //创建一个Ref 指定给form
  formRef = React.createRef();

  addUser = ()=>{
    const form = this.formRef.current
    form.validateFields().then((values) => { //成功(验证form数据)
      //从form的values中拿到user数据 传递到父组件方法中发送请求
      this.addOrUpdateUsers(values.user)
      form.resetFields(); //清空输入的缓存
    }).catch((info) => { //失败(验证form数据)
      console.log('Validate Failed:', info);
    });
  }
  resetForm = ()=>{ //清空表单缓存数据
    this.formRef.current.resetFields() //重置form数据
  }
  showUser = (user)=>{ //根据当前选中的user 显示对应数据
    this.formRef.current.setFieldsValue({
      user: {
        username: user.username,
        password: user.password,
        phone: user.phone,
        email: user.email,
        role_id: user.role_id,
      }
    })
  }

  render() {
    const {roles,user} = this.props
    return (
      <>       
        <Form name="basic" ref={this.formRef}
          labelCol={{span: 5}} wrapperCol={{span: 16}}
          requiredMark={false} //是否显示[必选样式(*)] false则不显示(*)
          validateMessages={{
            required: '${label}为必填项!',
            types: { email: '请填写一个有效的${label}!', },
          }}
        >
          <Form.Item name={['user', 'username']} label="用户名" rules={[{required: true,},]}>
            <Input placeholder='请输入用户名'/>
          </Form.Item>
          { //【修改用户】不显示密码input,【创建用户】显示密码input
            user._id ? null : (
            <Form.Item name={['user', 'password']} label="密码" rules={[{required: true,},]}>
              <Input.Password placeholder='请输入密码'/>
            </Form.Item>)
          }
          <Form.Item name={['user', 'phone']} label="手机号" rules={[{required: true,},]}>
            <Input placeholder='请输入用手机号'/>
          </Form.Item>
          <Form.Item name={['user', 'email']} label="邮箱" rules={[{type: 'email',required: true,},]}>
            <Input placeholder='请输入邮箱'/>
          </Form.Item>
          <Form.Item name={['user', 'role_id']} label="角色" rules={[{required: true,},]}>
            <Select placeholder='请选择角色' /* defaultValue="manager" */>
              {roles.map((role)=><Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </>
    );
  }
}