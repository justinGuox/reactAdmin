import React, {Component} from "react";
import {Form, Input, Tree} from 'antd';
import menuList from '../../config/menuConfig'

const Item = Form.Item

export default class AuthForm extends Component {

    constructor(props) {
        super(props);
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    // 为父组件提交最新menus的方法
    getMenus = () => this.state.checkedKeys

    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys);
        this.setState({checkedKeys})
    };

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(item)
            return pre
        }, [])
    }

    // 但组件接收到新的属性时自动调用，在render之前
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    UNSAFE_componentWillMount() {
        this.treeData = this.getTreeNodes(menuList)
    }

    render() {
        const {role} = this.props
        // console.log(role)
        const {checkedKeys} = this.state
        return (
            <Form>
                <Item name={'roleName'}
                      label={'角色名称'}>
                    <Input placeholder={role.name} disabled />
                </Item>
                设置角色权限
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={this.onCheck}
                    treeData={this.treeData}
                    checkedKeys={checkedKeys}
                />
            </Form>
        )
    }
}
