import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tree } from 'antd';

import menuList from "../../config/menuConfig";

const UpdateRole = (props) => {
  const {role,updateRole} = props
  const [visible, setVisible] = useState(false); //设置Modal的可见状态  
  const [checkedKeys, setCheckedKeys] = useState([]); //设置[被选项]的状态
  
  const onClick = ()=>{ //点击【设置角色权限】按钮
    setVisible(true); //显示Modal 
    setCheckedKeys(role.menus); //初始化显示 当前role的权限menus
  }
  const onCheck = (checkedKeys) => { //点击[复选框]触发
    // console.log('onCheck', checkedKeys); //打印当前选中的值(权限菜单项)
    setCheckedKeys(checkedKeys); //实时更新[当前选中值(checkedKeys)]的状态
  };
  const onCreate = (checkedKeys) => { //点击【确认】时的回调
    role.menus = checkedKeys //将[选中的值]设置为[role.menus的属性值]
    updateRole(role) //根据[选中的值] 更新[角色权限]
    setVisible(false); //隐藏Modal
  };  

  return (
    <>      
      <Button type="primary" onClick={onClick} disabled={!role._id}>
        设置角色权限
      </Button>
      <Modal visible={visible} centered={true}
        title="设置角色权限" okText="确认" cancelText="取消"
        onCancel={()=>{setVisible(false);}} //点击取消 隐藏Modal       
        onOk={() => {onCreate(checkedKeys);}}
      >
        <Form.Item label='角色名称'>
          <Input value={role.name} disabled/>
        </Form.Item>
        <Tree
          checkable //节点前添加 Checkbox 复选框
          treeData={menuList} //treeNodes 数据 =>左侧导航列表数据
          defaultExpandAll={true} //默认展开所有树节点
          onCheck={onCheck} //点击复选框触发
          checkedKeys={checkedKeys} //（受控）选中复选框的树节点
        />
      </Modal>
    </>
  );
};
export default UpdateRole