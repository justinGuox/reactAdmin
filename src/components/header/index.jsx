import React, {Component} from "react";
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import './index.less'
import {login, loginOut} from "../../redux/actions";
import {formateDate} from '../../utils/dateUtils'
import Weather from "../weather/weather";
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button/link-button";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils'

class Index extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        // dayPictureUrl: '', // 天气图片url
        // weather: '', // 天气的文本
    }

    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    // getWeather =  async () => {
    //     // 调用接口请求异步获取数据
    //     const {dayPictureUrl, weather} = await reqWeather('万载')
    //     // 更新状态
    //     this.setState({dayPictureUrl, weather})
    // }]
    getTitle = () => {
        let title = ''
        const path = this.props.location.pathname
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    outLogin = () => {
        Modal.confirm(
            {
                title: '确认要退出么？',
                icon: <ExclamationCircleOutlined />,
                // content: 'Some descriptions',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    storageUtils.removeUser()
                    this.props.loginOut()
                }
            }
        )
    }

    componentDidMount() {
        // 获取当前的时间
        this.getTime()
        // 获取当前天气
        // this.getWeather()
    }

    // 当前组件卸载（关闭之后），关闭获取时间定时器
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const {username} = this.props.user
        const {currentTime} = this.state
        const title = this.getTitle()
        return (
            <div className={'header'}>
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.outLogin}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {/*<img src={dayPictureUrl} alt="weather"/>*/}
                        {/*<span>{weather}</span>*/}
                        <Weather />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(
    connect(
        state => ({user: state.user}), {login, loginOut}
    )(Index)
)

