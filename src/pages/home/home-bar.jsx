/* 首页柱状图 */
import React,{ Component } from "react";
import { Chart, Interval } from 'bizcharts';

export default class HomeBar extends Component {
  showData = ()=>{
    const {isVisited} = this.props
    if(isVisited){
      return ([ //访问趋势 数据
        { year: '2014 年', sales: 38 },
        { year: '2015 年', sales: 52 },
        { year: '2016 年', sales: 61 },
        { year: '2017 年', sales: 45 },
        { year: '2018 年', sales: 48 },
        { year: '2019 年', sales: 38 },
        { year: '2020 年', sales: 38 },
        { year: '2021 年', sales: 24 },
      ])
    }else{
      return ([ //销售趋势 数据
        { year: '2014 年', sales: 2413 },
        { year: '2015 年', sales: 2453 },
        { year: '2016 年', sales: 3345 },
        { year: '2017 年', sales: 3586 },
        { year: '2018 年', sales: 3978 },
        { year: '2019 年', sales: 4332 },
        { year: '2020 年', sales: 4643 },
        { year: '2021 年', sales: 1334 },
      ])
    }
  }
  render(){
    const {isVisited} = this.props
    return (
      <Chart height={300} autoFit data={this.showData()} >
        <Interval position="year*sales" color={isVisited ? '#6395F9':'#62DAAB'} />
      </Chart>
    )
  }
}