import React, {Component} from "react";
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {
    getOption =()=> {
        let option = {
            legend: {
                data: ['订单量']
            },
            xAxis: {
                type: 'category',
                data:['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name:'订单量',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }]
        };
        return option;
    }
    render() {
        const title = <Button type={'primary'}>更新</Button>
        return (
            <Card title={title}>
                <Card title={'折线图'}>
                    <ReactEcharts option={this.getOption()}/>
                </Card>
            </Card>
        )
    }
}
