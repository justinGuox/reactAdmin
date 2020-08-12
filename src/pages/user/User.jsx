import React, {Component} from "react";
import {Card, Button, Table, message,Modal} from 'antd'
import {PAGE_SIZE} from "../../redux/action-types";
import LinkButton from "../../components/link-button/link-button";
import {reqAddOrUpdateUser, reqDeleteUser, reqGetUsers} from "../../api";
import UserForm from "./user-form";
import {formateDate} from "../../utils/dateUtils";
import PubSub from "pubsub-js";

export default class User extends Component {

    state = {
        users: [], // 用户列表
        roles: [], // 所有角色列表
        isShow: false
    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    getUsers = async () => {
        const result = await reqGetUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        } else {
            message.error('获取用户列表失败')
        }
    }

    initColumns =() =>{
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },{
                title: '邮箱',
                dataIndex: 'email',
            },{
                title: '电话',
                dataIndex: 'phone',
            },{
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },{
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },{
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({
            isShow: true
        })
    }

    deleteUser = (user) => {
        Modal.confirm({
            title:`确定删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                } else {
                    message.error('删除用户失败')
                }
            },
            okText:'确认',
            cancelText:'取消',
        })
    }

    addOrUpdateUser= async () => {
        const user = this.form.current.getFieldsValue()
        // 如果是更新, 需要给user指定_id属性
        if (this.user) {
            user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        if (result.status===0) {
            message.success('用户添加成功')
        } else {
            message.error('用户添加失败')
        }
        this.setState({
            isShow: false
        })
        PubSub.subscribe('update', (msg, form) => {
            form.current.resetFields()
        })
        this.getUsers()
    }

    showAdd = () => {
        this.user = null
        this.setState({isShow:true})
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users,isShow,roles} = this.state
        const user = this.user || {}
        const title = <Button type={'primary'} onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey={'_id'}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                />
                <Modal
                    title={this.user ? '修改用户':'创建用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        PubSub.subscribe('update', (msg, form) => {
                            form.current.resetFields()
                        })
                        this.setState({isShow: false})
                    }}
                    okText={'确认'}
                    cancelText={'取消'}
                >
                    <UserForm roles={roles}
                              setForm={form => this.form = form}
                              user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
