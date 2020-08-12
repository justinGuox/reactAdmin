import React, {Component} from "react";
import {Card,Select,Input,Button,Table} from 'antd'
import {PlusOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import LinkButton from "../../components/link-button/link-button";
import {getProducts, getSearchProducts, receiveUpdateStatus} from '../../redux/actions'
import {PAGE_SIZE} from '../../redux/action-types'
const Option = Select.Option

class ProductHome extends Component {

    state = {
        searchType: 'productName', // 根据哪个字段搜索
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
    }

    // 初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',receiveUpdateStatus
                render: (product) => {
                    const {status, _id} = product
                    const newStatus = status===1 ? 2 : 1
                    return (
                        <span>
                            <Button type='primary' onClick={()=>this.updateStatus(_id, newStatus)}> {status===1 ? '下架' : '上架'} </Button>

                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton
                                onClick={()=>{
                                    this.props.history.push('/product/detail', {product})}
                                }
                            >详情</LinkButton>
                            <LinkButton
                            onClick = {()=>{
                                this.props.history.push('/product/addupdate', product)
                            }}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    // 对商品进行上架/下架处理
    updateStatus = (_id, newStatus) => {
        this.props.receiveUpdateStatus(_id, newStatus)
        this.getProducts(this.pageNum)
    }
    // 获取指定页码的列表数据显示
    getProducts = (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        // 第几页，，每次取几条数据
        this.setState({loading: true})
        const {searchName, searchType} = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        if (searchName) {
            this.props.getSearchProducts({pageNum, PAGE_SIZE, searchName, searchType})
        } else {
            this.props.getProducts(pageNum, PAGE_SIZE)
        }
        setTimeout(()=>{
            // 间隔1秒后关闭动画
            this.setState({loading: false})
        },500)
    }

    UNSAFE_componentWillMount () {
        this.initColumns()
    }
    // 初始化数据
    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        // 取出状态数据
        const {total, list} = this.props.products
        const {searchType, loading, searchName} = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width: 150}}
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder={'关键字'}
                    style={{width: 150, margin: '0 10px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type={'primary'} onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type={'primary'}
                    icon={<PlusOutlined />}
                    onClick = {()=>{
                        this.props.history.push('/product/addupdate')
                    }}>添加商品</Button>
        )
        return (
            <Card
                title={title} extra={extra}
            >
                <Table
                    dataSource={list}
                    columns={this.columns}
                    bordered
                    rowKey={'_id'}
                    loading={loading}
                    pagination={{
                        total, // 总数据
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
export default connect(
    state => ({products: state.getProducts}), {getProducts,getSearchProducts,receiveUpdateStatus}
)(ProductHome)
