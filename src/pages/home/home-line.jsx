/* 首页折线图 */
import React from "react";
import {Chart,Geom,Axis,Tooltip,Legend} from "bizcharts"

// 数据源
const data = [
  {
    month: "Jan",
    city: "City A",
    temperature: 7
  },
  {
    month: "Jan",
    city: "City B",
    temperature: 3.9
  },
  {
    month: "Feb",
    city: "City A",
    temperature: 6.9
  },
  {
    month: "Feb",
    city: "City B",
    temperature: 4.2
  },
  {
    month: "Mar",
    city: "City A",
    temperature: 9.5
  },
  {
    month: "Mar",
    city: "City B",
    temperature: 5.7
  },
  {
    month: "Apr",
    city: "City A",
    temperature: 14.5
  },
  {
    month: "Apr",
    city: "City B",
    temperature: 8.5
  },
  {
    month: "May",
    city: "City A",
    temperature: 18.4
  },
  {
    month: "May",
    city: "City B",
    temperature: 11.9
  },
  {
    month: "Jun",
    city: "City A",
    temperature: 21.5
  },
  {
    month: "Jun",
    city: "City B",
    temperature: 15.2
  },
  {
    month: "Jul",
    city: "City A",
    temperature: 25.2
  },
  {
    month: "Jul",
    city: "City B",
    temperature: 17
  },
  {
    month: "Aug",
    city: "City A",
    temperature: 26.5
  },
  {
    month: "Aug",
    city: "City B",
    temperature: 16.6
  },
  {
    month: "Sep",
    city: "City A",
    temperature: 23.3
  },
  {
    month: "Sep",
    city: "City B",
    temperature: 14.2
  },
  {
    month: "Oct",
    city: "City A",
    temperature: 18.3
  },
  {
    month: "Oct",
    city: "City B",
    temperature: 10.3
  },
  {
    month: "Nov",
    city: "City A",
    temperature: 13.9
  },
  {
    month: "Nov",
    city: "City B",
    temperature: 6.6
  },
  {
    month: "Dec",
    city: "City A",
    temperature: 9.6
  },
  {
    month: "Dec",
    city: "City B",
    temperature: 4.8
  }
];
export default class Curved extends React.Component {
  cols = {
    month: {
      range: [0, 1]
    }
  }
	render() {
    return (
      <Chart 
        className="home-line" 
        padding="auto" appendPadding={[10,10,0,10]}
        width={'65%'} 
        height={215} 
        data={data} 
        scale={this.cols} 
        autoFit
        onAxisLabelClick={console.log}>
        <Legend/>
        <Axis name="month"/>
        <Axis
          name="temperature"
          label={{
            formatter: val => `${val}°C`
          }}
        />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
          itemTpl={`
            <tr data-index={index}>'
              <td><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span></td>
              <td>{name}</td>
              <td>{value}</td>
            </tr>
          `}
        >
          {
            (title, items) => {
              // 配置了 class="g2-tooltip-list" 则会将模版中的内容渲染进来
              // 您也可以根据 items 自行渲染
              return (<table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>名称</th>
                  <th>值</th>
                </tr>
              </thead>
                <tbody
                  className="g2-tooltip-list"
                >
              </tbody>
              </table>);
            }
          }
        </Tooltip>
        <Geom
          type="line"
          position="month*temperature"
          size={2}
          color={"city"}
          shape={"smooth"}
        />
        <Geom
          type="point"
          position="month*temperature"
          size={4}
          shape={"circle"}
          color={"city"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
      </Chart>
    );
  }
}
