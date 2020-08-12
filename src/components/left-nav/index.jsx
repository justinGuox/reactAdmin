import React, {Component} from "react";
import {Link, withRouter} from 'react-router-dom'
import {Menu} from 'antd';
import './index.less'
import logo from '../../assets/images/logo.png'
import {
    AreaChartOutlined,
    BarChartOutlined,
    DollarOutlined,
    HomeOutlined,
    LineChartOutlined,
    MenuOutlined,
    PieChartOutlined,
    ShoppingOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import menuList from "../../config/menuConfig";
import Utils from '../../utils/storageUtils'

const {SubMenu} = Menu;
const Icons = {
    'HomeOutlined': <HomeOutlined />,
    'ShoppingOutlined': <ShoppingOutlined />,
    'MenuOutlined': <MenuOutlined />,
    'UserOutlined': <UserOutlined />,
    'UsergroupAddOutlined': <UsergroupAddOutlined />,
    'AreaChartOutlined': <AreaChartOutlined />,
    'BarChartOutlined': <BarChartOutlined />,
    'PieChartOutlined': <PieChartOutlined />,
    'LineChartOutlined': <LineChartOutlined />,
    'DollarOutlined': <DollarOutlined />
}

class Index extends Component {
    hasAuth = (item) => {
        // 1. 如果当前用户是admin
        // 2. 如果当前item是公开的
        // 3. 当前用户有此item的权限: key有没有menus中
        const {key, isPublic} = item
        const menus = Utils.getUser().role.menus
        const username = Utils.getUser().username
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {// 4. 如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }
    getMenuNodes = (menuList) => {
        // eslint-disable-next-line
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key} icon={Icons[item.icon]}>
                            <Link to={item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => this.props.location.pathname.indexOf(cItem.key) === 0)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu key={item.key} icon={Icons[item.icon]} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }

    /*
      在第一次render()之前执行一次
      为第一个render()准备数据(必须同步的)
       */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className={'left-nav'}>
                <Link to={'/'} className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>后台管理</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

export default withRouter(Index);
