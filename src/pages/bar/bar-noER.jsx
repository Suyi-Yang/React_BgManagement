/* 柱形图路由 */
import React, { Component } from "react";
import { Card,Button } from "antd";
/* A. 全部引入 */
// import echarts from 'echarts'
/* B. 按需引入 */
// 引入 ECharts 主模块
import * as echarts from 'echarts/core';
// 按需引入Echart模块
import { TitleComponent,TooltipComponent,GridComponent,LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

export default class Bar extends Component {
  state = {
    sales: [5, 20, 36, 10, 10, 20], //销量的数组
    stores: [8, 26, 26, 16, 12, 10] //库存的数组
  }  
  update = ()=>{
    this.setState(state=>({
      sales: state.sales.map(sale=>sale+1),
      // stores: state.stores.map(stores=>stores-1),
      stores: state.stores.reduce((pre,store)=>{
        pre.push(store-1)
        return pre
      },[]),
    }))
  }
  initCharts = ()=>{
    echarts.use(
      [TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]
    );
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: { text: 'ECharts 入门示例' },
      tooltip: {},
      legend: { data:['销量','库存'] },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [
        { name: '销量', type: 'bar', data: this.state.sales },
        { name: '库存', type: 'bar', data: this.state.stores }
      ]
    };
    option && myChart.setOption(option);    
  }  
  componentDidMount(){
    this.initCharts()
  }
  render(){
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <Card title='柱状图一'>          
          <div id="main" style={{ width: "80%", height: 400 }}></div>
        </Card>        
      </div>
    )
  }
}