import React, {Component} from "react";
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {
    getOption =()=> {
        let option = {
            title:{
                text:'用户骑行订单'
            },
            legend: {
              data: ['订单量']
            },
            tooltip:{   //展示数据
                trigger:'axis'
            },
            xAxis:{
                data:['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis:{
                type:'value'
            },
            series:[
                {
                    name:'订单量',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800]
                }
            ]
        }
        return option;
    }
    render() {
        const title = <Button type={'primary'}>更新</Button>
        return (
            <Card title={title}>
                <Card title={'柱形图'}>
                    <ReactEcharts option={this.getOption()}/>
                </Card>
            </Card>
        )
    }
}
