/* 首页路由 */
import React, { Component } from "react";
import { Card,DatePicker,Timeline,Tooltip,Statistic } from "antd";
import { ReloadOutlined,QuestionCircleOutlined,ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import './home.less'
import Curved from './home-line'
import HomeBar from './home-bar'
import LinkButton from "../../components/link-btn";

export default class Home extends Component {
  state = {
    noTitleKey: 'visits',
    isVisited: true,
  };
  tabListNoTitle = [
    { key: 'visits', tab: '访问量', },
    { key: 'sales', tab: '销售量', },
  ];
  contentListNoTitle = {
    visits: <HomeBar isVisited={this.state.isVisited}/>,
    sales: <HomeBar isVisited={this.stateisVisited}/>,
  };
  onTabChange = (key, type, isVisited) => {
    this.setState({ [type]: key, isVisited: !isVisited });
  };

  render(){
    const {isVisited} = this.state
    const extraQuestion = (
      <Tooltip placement="top" title="商品总量统计" arrowPointAtCenter>      
        <LinkButton>
          <QuestionCircleOutlined style={{color:"gray"}}/>
        </LinkButton>      
      </Tooltip>)
    const extraRefresh = (
      <LinkButton>
        <ReloadOutlined style={{color:"gray"}}/>
      </LinkButton>
    )
    const datePicker = (<DatePicker.RangePicker locale={locale}/>)
    return (
      <div className='home'>
        {/* 上半部分 */}
        <Card className="home-card" title="商品总量" extra={extraQuestion}>
          <Statistic
            value={1128163}
            valueStyle={{fontWeight:'bold'}}
            suffix={<span style={{fontSize:15}}>个</span>}
          />
          <Statistic
            value='15%'
            valueStyle={{fontSize:15}}
            prefix="周同比"
            suffix={<ArrowDownOutlined style={{color:'#cf1322',marginLeft:7}}/>}
          />
          <Statistic
            value='10%'
            valueStyle={{fontSize:15}}
            prefix="日同比"
            suffix={<ArrowUpOutlined style={{color:'#3f8600',marginLeft:7}}/>}            
          />
        </Card>
        <Curved/> {/* 折线图组件 */}
        {/* 下半部分 */}
        <Card 
          className="home-content"          
          tabList={this.tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          tabBarExtraContent={datePicker}
          onTabChange={key => {
            this.onTabChange(key, 'noTitleKey', this.state.isVisited);
          }}
        >
          <Card className="home-table-left"
            title={isVisited ? "访问趋势":"销售趋势"}
            extra={extraRefresh}>
            {this.contentListNoTitle[this.state.noTitleKey]}
          </Card>          
          <Card className="home-table-right"
            title="任务" extra={extraRefresh}>
            <Timeline>
              <Timeline.Item color="green">新版本迭代会</Timeline.Item>
              <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
              <Timeline.Item color="red">
                <p>联调接口</p>
                <p>功能验收</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>登录功能设计</p>
                <p>权限验证</p>
                <p>页面排版</p>
              </Timeline.Item>
            </Timeline>
          </Card> 
        </Card>
      </div>
    )
  }
}