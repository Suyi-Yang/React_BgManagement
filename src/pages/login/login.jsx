/* 用户登录的路由组件 */
import React, { Component } from 'react'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less' /* 引入login.less */
import logo from '../../assets/images/logo192.png' /* 引入logo图片 */
// import {reqLogin} from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import { login } from "../../redux/actions";

class Login extends Component {
  validatePwd = (rule,value)=>{
    if (!value) {
      return Promise.reject('密码必须输入');
    }else if(value.length < 4){
      return Promise.reject('密码长度不能小于4位');
    }else if(value.length > 12){
      return Promise.reject('密码长度不能大于12位');
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      return Promise.reject('密码必须是英文、数字或下划线组成');
    }else{
      return Promise.resolve(); // 验证通过
    }
  }

  onFinish = (values) => {
    const {username,password} = values    
    // 调用分发异步action的函数=>发登录的异步请求=>更新状态
    this.props.login(username,password)    
  };

  render() {
    //(刷新页面时)如果用户已经登录 则自动跳转到管理界面(即不会进入登录页面)
    const user = this.props.user
    if(user && user._id){
      return <Redirect to='/home'/> //如果登陆成功 跳转到首页
    }
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>          
          <h2>用户登录</h2>
          <Form name="normal_login" className="login-form" onFinish={this.onFinish}>
            <Form.Item name="username" rules={[ /* 声明式验证:直接使用别人定义好的验证规则进行验证 */
                {required: true, message: '用户名必须输入'},
                {min: 4, message: '用户名至少4位'},
                {max: 12, message: '用户名最多12位'},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                /* 正则：[a-zA-Z0-9_]:匹配一个字符；[...]+:匹配多个字符 */
              ]} initialValue='admin' /* initialValue指定初始值 */ >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{validator: this.validatePwd}]}>             
              <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
            </Form.Item>            
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form.Item>            
          </Form>
          {/* 如果登录失败 显示错误信息 */}
          <span style={{float:'right',color:'red'}}>{user.errorMsg}</span>
        </section>
      </div>
    )
  }
}
export default connect(
  state => ({user:state.user}),
  {login}
)(Login)

/* 
  async和await
    1.作用？
      简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
      以同步编码(没有回调函数了)方式实现异步流程
    2.哪里写await？
      在返回promise的表达式左侧写await
        ---不想要promise，想要的是promise异步执行的 成功的 value数据
    3.哪里写async？
      await所在函数(最近的)定义的左侧写async
*/