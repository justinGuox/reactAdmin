/*用户登陆的路由组件 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect, Switch, Route} from 'react-router-dom'
import {Layout} from 'antd';
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home/Home";
import Category from "../category/Category";
import Bar from "../charts/bar/Bar";
import Line from "../charts/line/Line";
import Pie from "../charts/pie/Pie";
import Product from "../product/Product";
import Role from "../role/Role";
import User from "../user/User";

const {Footer, Sider, Content} = Layout;

class Admin extends Component {
    render() {
        const user = this.props.user
        if (!user || !user._id) { // 如果没有用户，则跳转到登录界面
            return <Redirect to={'/login'} />
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{margin: 20, backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({user: state.user}), {}
)(Admin)
