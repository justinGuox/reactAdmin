/*用户登陆的路由组件 */
import React, {Component} from 'react'
import './login.less'
import {Button, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import {Redirect} from "react-router-dom";


class Login extends Component {

    onFinish = (values) => {
        // 请求登陆
        const {username, password} = values
        this.props.login(username, password)
        setTimeout(() => {
            // console.log(this.props.user)
            if (this.props.user) {
                this.props.history.replace('/')
            } else {
                // message.error('请求出错')
            }
        }, 500)

    };

    // 密码校验
    validatorPwd = (rule, value) => {
        if (!value) {
            return Promise.reject('密码必须输入')
        } else if (value.length < 4) {
            return Promise.reject('密码长度不能小于4位')
        } else if (value.length > 12) {
            return Promise.reject('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject('密码必须是英文、数字或下划线组成')
        } else {
            // callback() // 验证通过
            return Promise.resolve();
        }
    }

    render() {
        const user = this.props.user
        if (user && user._id) { // 如果有用户，则跳转到主页
            return <Redirect to={'/'} />
        }
        return (
            <div className="login">
                <div className="loginHeader">
                    <img src={logo} alt="loginLogo" />
                    <h1>React项目：后台管理系统</h1>
                </div>
                <div className="loginContent">
                    <h2>用户登陆</h2>
                    <div className="loginForm">
                        <Form
                            name="normal_login"
                            className="login-form"
                            onFinish={this.onFinish}
                            initialValues={{
                                remember: true,
                            }}
                        >
                            {
                                /*
                              用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于4位
                                3). 必须小于等于12位
                                4). 必须是英文、数字或下划线组成
                               */
                            }
                            <Form.Item
                                name="username"
                                rules={[
                                    {required: true, message: '请输入您的用户名'},
                                    {min: 4, message: '用户名至少4位'},
                                    {max: 12, message: '用户名最多12位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />}
                                       placeholder="用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        // 自定义校验
                                        validator: this.validatorPwd
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登陆
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}), {login}
)(Login)
