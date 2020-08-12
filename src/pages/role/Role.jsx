import React, {Component} from "react";
import {Button, Card, message, Modal, Table} from 'antd';
import {PAGE_SIZE} from '../../redux/action-types'
import {connect} from 'react-redux'
import {addRole, getRoles,updateRole} from '../../redux/actions'
import AddForm from "./add-form";
import AuthForm from './auth-form'
import PubSub from "pubsub-js";
import storageUtils from "../../utils/storageUtils";
import {formateDate} from "../../utils/dateUtils";

class Role extends Component {
    state = {
        loading: false, // 是否正在获取数据
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth:false
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef()
    }
    // 初始化列表数据
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            }, {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            }, {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    //initRoles = (roles) => {
    // roles = [
    //     {
    //         "menus": [],
    //         "_id": "5ca9eaa1b49ef916541160d3",
    //         "name": "测试",
    //         "create_time": 1554639521749,
    //         "__v": 0,
    //         "auth_time": 1558679920395,
    //         "auth_name": "test007"
    // //     }]
    // console.log(roles)
    // roles.map((role)=>{
    //     console.log(role)
    //     if (role.auth_time) {
    //         console.log('没有auth_time')
    //     }
    //     if (role.auth_name) {
    //         console.log('没有auth_name')
    //     }
    // })
    //}
    getRoles = () => {
        this.setState({loading: true})
        this.props.getRoles()
        setTimeout(() => {
            this.roles = this.props.roles[0]
            this.setState({loading: false})
        }, 200)
    }

    onRow = (role) => {
        return {
            onClick: event => { // 点击行
                // console.log('row onClick()', role)
                // alert('点击行')
                this.setState({
                    role
                })
            },
        }
    }

    // 添加角色
    addRole = () => {
        // 收集输入数据
        const roleName = this.roleName
        if (roleName === undefined) {
            message.error('请输入角色名称')
            return
        }
        PubSub.subscribe('update', (msg, form) => {
            form.current.resetFields()
        })
        // 请求添加
        this.props.addRole(roleName)
        this.getRoles()
        //this.setState({loading: true})
        // setTimeout(() => {
        //     const roles = this.props.roles[0]
        //     this.roles = roles
        //     console.log(this.roles)
        //     this.setState({loading: false})
        // }, 500)
        this.setState({
            isShowAdd: false
        })
    }

    updateRole = () => {
        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = storageUtils.getUser().username
        this.props.updateRole(role, this.props)
        this.getRoles()
        this.setState({
            isShowAuth: false
        })
    }

    // 第一次render之前
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {loading, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type={'primary'} onClick={() => {
                    this.setState({
                        isShowAdd: true
                    })
                }}>创建角色</Button>&nbsp;&nbsp;&nbsp;
                <Button type={'primary'} disabled={!role._id} onClick={() => {
                    this.setState({
                        isShowAuth: true
                    })
                }}>设置角色权限</Button>
            </span>
        )
        return (
            <Card
                title={title}
            >
                <Table
                    bordered
                    dataSource={this.roles}
                    rowKey='_id'
                    columns={this.columns}
                    loading={loading}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({role})
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title={'添加角色'}
                    visible={isShowAdd}
                    onOk={this.addRole}
                    okText={'确认'}
                    cancelText={'取消'}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false
                        })
                    }}
                >
                    <AddForm
                        getRoleName={(roleName) => {
                            this.roleName = roleName
                        }}
                    />
                </Modal>
                <Modal
                    title={'设置角色权限'}
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    okText={'确认'}
                    cancelText={'取消'}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false
                        })
                    }}
                >
                    <AuthForm
                        role = {role}
                        ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({
        roles: state.initRoles
    }), {getRoles, addRole,updateRole}
)(Role)
