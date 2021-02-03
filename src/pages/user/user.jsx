/* 用户管理路由 */
import React, { Component } from "react";
import { Card, Table, Button, message, Modal } from 'antd';

import LinkButton from '../../components/link-btn';
import { formatDate } from "../../utils/dateUtils";
import { PAGE_SIZE } from "../../utils/constants";
import {reqUsers,reqDeleteUsers,reqAddOrUpdateUsers, reqDeleteImg} from '../../api'

export default class User extends Component {
  state = {
    users: [], //列表中的所有用户
  }

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
            <LinkButton>修改</LinkButton>
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
  addOrUpdateUsers = async ()=>{
    // const result = await reqAddCategorys(parentId,categoryName)
    // if (result.status === 0) {      
    //   if(parentId===this.state.parentId){ //如果是为当前分类列表添加
    //     this.getCategorys() //重新获取当前分类列表 并刷新显示
    //   }else if(parentId==='0'){ //如果是为一级分类列表添加(刷新后仍然显示当前分类列表)
    //     this.getCategorys('0') //重新获取一级分类列表 但不跳转显示为一级列表
    //   }
    //   //弹出提示框 表示添加成功
    //   message.success('已成功添加新分类：' + categoryName);
    // }
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

  //为第一次render()准备数据
  UNSAFE_componentWillMount(){
    this.initColumns()
  }
  //执行异步任务：发异步ajax请求
  componentDidMount(){
    this.getUsers()
  }

  render(){
    const {users} = this.state //读取状态数据
    const title = <Button type='primary'>创建用户</Button> //card左侧标题=>按钮
    return (
      <Card title={title}>
        <Table bordered rowKey='_id'
          columns={this.columns} dataSource={users}
          pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}} 
        />
      </Card>
    )
  }
}