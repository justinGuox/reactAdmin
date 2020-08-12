import React, {Component} from "react";
import {Button, Card, message, Modal, Table} from 'antd';
import {connect} from 'react-redux'
import {PlusOutlined, RightOutlined} from '@ant-design/icons'
import LinkButton from "../../components/link-button/link-button";
import {addCategory, getCategory, UpdateCategory} from '../../redux/actions'
import AddForm from "./add-form";
import UpdateForm from "./update-form";
import PubSub from 'pubsub-js'

class Category extends Component {

    state = {
        loading: false, // 是否正在获取数据
        parentId: '0', // 当前需要显示的分类列表parentId
        parentName: '', // 当前需要显示的分类列表父分类名称
        twoCategorys: [], //子分类的数据
        showStatus: 0 // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    // 刷新二级分类列表
    updateTwoList = () => {
        setTimeout(() => {
            const {twoCategorys} = this.props
            if (twoCategorys.length > 0) {
                this.setState({twoCategorys})
            }
            this.setState({loading: false})
        }, 50)
    }

    // 响应点击取消: 隐藏确定框
    handleCancel = () => {
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
        PubSub.subscribe('update', (msg, form) => {
            form.current.resetFields()
        })
    }
    // 显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    // 添加分类
    addCategory = () => {
        //this.props.addCategory('测试2', '5f152d729c859a1298c3915e')
        // 更新状态
        this.setState({
            showStatus: 0
        })
        PubSub.subscribe('update', (msg, form) => {
            form.current.resetFields()
            this.addForm = {}
        })
        if (this.addForm) {
            const {parentId, inputFrom} = this.addForm
            if (parentId || inputFrom) {
                //console.log('父组件')
                //console.log({parentId, inputFrom})
                const categoryName = inputFrom
                this.props.addCategory({parentId, categoryName})
                setTimeout(() => {
                    this.props.getCategory(parentId)
                    if (parentId !== '0') {
                        // 刷新二级分类列表
                        this.updateTwoList()
                    }
                }, 100)
            } else {
                message.error('未更改任何内容')
                this.addForm = {}
            }
        } else {
            message.error('未更改任何内容')
            this.addForm = {}
        }
    }

    // 显示修改的确认框
    showUpdate = (category) => {
        this.category = category
        this.categoryName = category.name || {}
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }
    // 修改分类
    updateCategory = () => {
        const categoryName = this.categoryName
        const categoryId = this.category._id
        if (categoryName === '错误') {
            return
        }
        //console.log('实时数据'+categoryName)
        this.props.UpdateCategory({categoryId, categoryName})
        // 更新状态
        this.setState({
            showStatus: 0
        })
        const {parentId} = this.state
        setTimeout(() => {
            this.props.getCategory(parentId)
            if (parentId !== '0') {
                // 刷新二级分类列表
                this.updateTwoList()
            }
        }, 100)
    }


    // 获取二级分类列表
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            const {parentId} = this.state
            this.setState({loading: true})
            this.props.getCategory(parentId)
            // 刷新二级分类列表
            this.updateTwoList()
        })
    }
    // 显示一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            twoCategorys: []
        })
    }

    // 初始化列表数据
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => {
                            this.showUpdate(category)
                        }}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => {
                                this.showSubCategorys(category)
                            }}>查看子分类</LinkButton> : null
                        }

                    </span>
                )
            }

        ]
    }

    // 第一次render之前
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.setState({loading: true})
        // 异步获取一级分类列表
        const {parentId} = this.state
        //console.log(parentId)
        this.props.getCategory(parentId)
        setTimeout(() => {
            this.setState({loading: false})
        }, 500)
    }

    render() {
        const {categorys} = this.props
        // console.log(categorys)
        // console.log('二级')
        const {twoCategorys, showStatus} = this.state
        // console.log(twoCategorys)
        const {loading, parentId, parentName} = this.state
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <RightOutlined /> {parentName}
            </span>
        )
        const extra = (
            <Button
                icon={<PlusOutlined />}
                type={"primary"}
                onClick={this.showAdd}
            >添加</Button>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        dataSource={parentId === '0' ? categorys : twoCategorys}
                        columns={this.columns}
                        bordered
                        rowKey={'_id'}
                        loading={loading}
                        pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    />
                </Card>
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    okText={'确认'}
                    cancelText={'取消'}
                >
                    <AddForm parentId={parentId}
                             getAddForm={(addForm) => {
                                 this.addForm = addForm
                             }}
                    />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    okText={'确认'}
                    cancelText={'取消'}
                >
                    <UpdateForm
                        categoryName={this.categoryName}
                        getCategoryName={(categoryName) => {
                            this.categoryName = categoryName
                        }}
                    />
                </Modal>
            </div>
        )
    }
}

export default connect(
    state => ({categorys: state.categorys, twoCategorys: state.twoCategorys}), {
        getCategory,
        addCategory,
        UpdateCategory
    }
)(Category)
