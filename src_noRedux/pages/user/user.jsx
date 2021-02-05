/* 用户管理路由 */
import React, { Component } from "react";
import { Card, Table, message, Modal, Button } from 'antd';
import Draggable from 'react-draggable';

import LinkButton from '../../components/link-btn';
import { formatDate } from "../../utils/dateUtils";
import { PAGE_SIZE } from "../../utils/constants";
import {reqUsers,reqDeleteUsers,reqAddOrUpdateUsers} from '../../api'
import UserAddUpdate from "./user-form";

export default class User extends Component {
  state = {
    users: [], //列表中的所有用户
    roles: [], //所有角色的数组

    visible: false,
    disabled: true,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
  }
  draggleRef = React.createRef(); //Modal的拖拽  
  userFormRef = React.createRef(); //创建一个Ref 指定给form

  //根据role的数组 生成包含所有角色名称的对象(属性名用角色id值)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre,role)=>{
      pre[role._id] = role.name
      return pre
    },{})
    //将角色name的数组保存到this中
    this.roleNames = roleNames
  }
  //初始化Table所有列的数组
  initColumns = ()=>{
    //表格-列
    this.columns = [
      {title: '用户名', dataIndex: 'username'}, //dataIndex 显示数据对应的属性名
      // {title: '密码', dataIndex: 'password'},
      {title: '电话', dataIndex: 'phone'},
      {title: '邮箱', dataIndex: 'email'},
      {title: '所属角色', dataIndex: 'role_id',render:role_id=>this.roleNames[role_id]},
      {title: '注册时间', dataIndex: 'create_time', render: formatDate},
      {title: '操作',
        render: (user) => ( //返回需要显示的界面标签
          <span>
            <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={()=>this.deleteUsers(user)}>删除</LinkButton>
          </span>
        ),
      },
    ];
  }
  //获取用户列表并显示
  getUsers = async ()=>{
    const result = await reqUsers()
    if(result.status===0){
      const {users,roles} = result.data
      //初始化生成一个包含所有角色名的对象容器{_id1:name1,_id2:name2}
      this.initRoleNames(roles)
      this.setState({users,roles})
    }else{
      message.error('获取用户列表失败！')
    }
  }
  //创建/修改用户
  addOrUpdateUsers = async (user)=>{
    // console.log('user.addOrUpdateUsers()',user);
    if(this.user){ //【修改】时 需要给user指定_id属性
      user._id = this.user._id
    }
    const result = await reqAddOrUpdateUsers(user)
    if (result.status === 0) {
      this.getUsers() //更新列表并显示
      this.setState({visible: false,}) //隐藏Modal
      message.success(`${this.user ? '修改':'创建'}用户成功！`)
    }else{
      message.error(`${this.user ? '修改':'创建'}用户失败！`)
    }
  }
  //删除用户
  deleteUsers = (user)=>{
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async ()=>{
        const result = await reqDeleteUsers(user._id)
        if(result.status===0){
          message.success('删除用户成功！')
          this.getUsers() //重新获取列表并显示
        }else{
          message.error('删除用户失败！')
        }
      }
    })
  }

  /* 显示Modal的两种情况 */  
  showAdd = () => { //点击【创建】显示Modal
    this.user = null //将this中的user重置为null
    this.setState({visible: true,});
  };
  showUpdate = (user) => { //点击【修改】显示Modal
    this.setState({visible: true,});
    this.user = user //将user保存到this中    
    this.userFormRef.current.showUser(user) //调用form中自定义的方法 显示当前user的数据
  };

  handleOk = () => { //点击【确认】
    this.userFormRef.current.addUser() //调用form中自定义的方法 获取表单数据并发送请求
  };
  handleCancel = () => { //点击【取消】
    this.userFormRef.current.resetForm() //调用form中自定义的方法 清空输入缓存
    this.setState({visible: false,}); //隐藏Modal
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
  
  UNSAFE_componentWillMount(){ //为第一次render()准备数据
    this.initColumns()
  }  
  componentDidMount(){ //执行异步任务：发异步ajax请求
    this.getUsers()
  }

  render(){
    const { bounds,disabled,visible, users,roles } = this.state;
    const user = this.user || {} //user可能有值(修改) 可能为空(创建)
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table bordered rowKey='_id'
          columns={this.columns} dataSource={users}
          pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}} 
        />
        <Modal forceRender={true}
          title={
            <div style={{ width: '100%', cursor: 'move', }}
              onMouseOver={() => {if (disabled) {this.setState({disabled: false,});}}}
              onMouseOut={() => {this.setState({disabled: true,});}} >
              {user._id ? '修改用户' : '创建用户'}
            </div>}
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
          <UserAddUpdate ref={this.userFormRef} 
            roles={roles} user={user} addOrUpdateUsers={this.addOrUpdateUsers}
          />
        </Modal>
      </Card>
    )
  }
}