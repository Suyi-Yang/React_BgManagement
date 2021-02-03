/* 角色管理路由 */
import React, { Component } from "react";
import { Card, Table, message } from "antd";

import AddRole from "./AddRole";
import UpdateRole from "./UpdateRole";
import { reqRoles,reqAddRole,reqUpdateRole } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";
import memoryUtils from '../../utils/memoryUtils'
import { formatDate } from "../../utils/dateUtils";

export default class Role extends Component{
  state = {
    roles: [], //所有角色的列表
    role: {}, //当前选择的role
  }

  //初始化table列标题的数组
  initColumns = ()=>{
    this.columns = [
      {title:'角色名称',dataIndex:'name',},
      {title:'创建时间',dataIndex:'create_time',render:(create_time)=>formatDate(create_time)},
      {title:'授权时间',dataIndex:'auth_time',render:formatDate}, //render简写
      {title:'授权人',dataIndex:'auth_name',},      
    ]
  }  
  //获取所有角色的列表
  getRoles = async ()=>{
    const result = await reqRoles()
    if(result.status===0){
      const roles = result.data
      this.setState({roles})
    }else{
      message.error('获取角色列表失败！')
    }
  }
  onRow = (role)=>{
    return {
      onClick: event => { //点击行
        // console.log('当前被选中的role：',role);
        this.setState({role}) //更新当前被选中的role
      }, 
    };
  }
  //【创建角色】
  addRole = async (roleName)=>{
    //发送请求
    const result = await reqAddRole(roleName)
    if(result.status===0){
      const role = result.data //新创建的角色
      //更新roles列表显示
      /* 方法1：
        重新获取角色列表(发送请求)---category组件使用的方法 */
      // this.getRoles()
      /* 方法2：
        更新roles状态(直接操作state 改变roles的状态)
        ---react官方不推荐直接操作state以更新状态 */
      // const roles = this.state.roles
      // roles.push(role)
      // this.setState({roles})
      /* 方法3：
        更新roles状态(基于原本状态数据更新)---推荐方法
        [...state.roles, role]:复制原本数据state.roles 添加新数据role */
      this.setState(state => ({roles:[...state.roles, role]}))
      message.success('创建角色成功！')
    }else{
      message.error('创建角色失败！')
    }
  }
  //【设置角色权限】role:_id/menus/auth_time/auth_name
  updateRole = async (role)=>{
    role.auth_time = Date.now() //设置授权时间
    role.auth_name = memoryUtils.user.username //设置授权人为当前登录的用户
    const result = await reqUpdateRole(role) //发送请求 更新当前role的数据
    if(result.status===0){
      this.setState({roles:[...this.state.roles]}) //更新整个roles列表数据
      message.success('角色权限设置成功！')
    }else{
      message.error('角色权限设置失败！')
    }
  }
  
  UNSAFE_componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getRoles()
  }

  render(){
    console.log('render()');
    //取出状态数据
    const {roles,role} = this.state
    const title = (
      <span>
        <AddRole addRole={this.addRole}/>&nbsp;&nbsp;
        <UpdateRole role={role} updateRole={this.updateRole}/>
      </span>
    )
    return (
      <Card title={title}>
        <Table 
          bordered 
          rowKey='_id'
          dataSource={roles} 
          columns={this.columns} 
          pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
          rowSelection={{type:'radio', selectedRowKeys:[role._id]}}
          onRow={this.onRow}
        />
      </Card>
    )
  }
}