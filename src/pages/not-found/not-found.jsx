/* 前台404界面组件 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row,Col,Button } from "antd";

import { setHeadTitle } from "../../redux/actions";
import "./not-found.less";

class NotFound extends Component {
  goHome = ()=>{
    this.props.setHeadTitle('首页')
    this.props.history.replace('/home')
  }
  UNSAFE_componentWillMount(){
    this.props.setHeadTitle('') //进入404界面 则不显示任何title
  }
  render() {
    return (
      <Row className='not-found' align='middle'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，您访问的页面不存在</h2>
          <Button type='primary' onClick={this.goHome}>回到首页</Button>
        </Col>
      </Row>
    );
  }
}
export default connect(
  null, // state => ({}),
  {setHeadTitle}
)(NotFound);