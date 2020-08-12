import React, {Component} from "react"
import {
    Card,
    Form,
    Input,
    Cascader,
    Button, message
} from 'antd'
import LinkButton from "../../components/link-button/link-button"
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined"
import {connect} from 'react-redux'
import {getCategory} from '../../redux/actions'
import {reqCategorys} from '../../api/index'
import PicturesWall from "./pictures-wall";
import Editor from "./editor";
import {addOrUpdateProduct} from '../../redux/actions'

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {

    state = {
        options: []
    }

    constructor(props) {
        super(props);
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        // 根据选中的分类, 请求获取二级分类列表
        const result = await reqCategorys(targetOption.value)
        const subCategorys = result.data
        targetOption.loading = false
        if (subCategorys && subCategorys.length>0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        // 更新options状态
        this.setState({
            options: [...this.state.options],
        })
    }

    onFinish = (values) => {
        const {name, desc, price, categoryIds} = values
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getEditor()
        if (price < 0) {
            message.error('价格必须大于 ￥0 ')
            return
        }
        let categoryId, pCategoryId
        // 如果只有1则说明他是一级分类下的商品
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const product = {
            name, desc, price, detail, imgs, categoryId, pCategoryId
        }
        // 如果是修改/更新，则需要_id
        if (this.isUpdate) {
            product._id = this.product._id
        }
        this.props.addOrUpdateProduct(product, this.props)
    }

    // 获取一级分类列表显示
    getCategorys = (parentId) => {
        this.props.getCategory(parentId)
        setTimeout(async ()=>{
            const {categorys} = this.props
            if (categorys.length>0) {
                const options = categorys.map(categoryList => ({
                    value: categoryList._id,
                    label: categoryList.name,
                    isLeaf: false, // 不是叶子
                }))

                // 如果是一个二级分类商品的更新
                const {isUpdate, product} = this
                const {pCategoryId} = product
                // 如果是更新且父分类ID不为0
                if (isUpdate && pCategoryId!=='0') {
                    // 获取对应的二级分类列表
                    const result = await reqCategorys(pCategoryId)
                    const subCategorys = result.data
                    const childOptions = subCategorys.map(c => ({
                        value: c._id,
                        label: c.name,
                        isLeaf: true
                    }))
                    // 找到当前商品对应的一级option对象
                    const targetOption = options.find(option => option.value===pCategoryId)
                    // 关联对应的一级option上
                    targetOption.children = childOptions
                }

                this.setState({options})
            }
        },500)
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    componentWillMount() {
        // 取出携带过来的数据
        const product = this.props.location.state
        // 保存是否是更新的标识
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        // 用来接收级联分类ID的数组
        const categoryIds = []
        if(isUpdate) {
            // 商品是一个一级分类的商品
            if(pCategoryId==='0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton>
                  <LeftOutlined
                      style={{marginRight: 10, fontSize: 20}}
                      onClick={() => this.props.history.goBack()}
                  />
                </LinkButton>
                <span>{isUpdate ? '修改商品':'添加商品'}</span>
             </span>
        )
        // 指定Item布局的配置对象 栅格系统 24 格
        const formItemLayout = {
            labelCol:{span:2}, // 左侧laber的宽度
            wrapperCol:{span:8} // 右侧label的宽度
        }
        return (
            <Card title={title}>
                <Form {...formItemLayout}
                      onFinish={this.onFinish}
                      initialValues={{
                          name: product.name,
                          desc: product.desc,
                          price: product.price,
                          categoryIds
                      }}
                >
                    <Item
                        label={'商品名称'}
                        name={'name'}
                        rules={[{required: true, message: '必须输入商品名称'}]}>
                        <Input placeholder={'请输入商品名称'}/>
                    </Item>
                    <Item label={'商品描述'}
                          name={'desc'}
                          rules={[{required: true, message: '必须输入商品描述'}]}>
                        <TextArea placeholder={'请输入商品描述'} autosize={{ minRows: 2, maxRows: 6 }}/>
                    </Item>
                    <Item label={'商品价格'}
                          name={'price'}
                          rules={[{required: true, message: '必须输入商品价格'}]}>
                        <Input addonAfter={'元'} type={'number'} placeholder={'请输入商品价格'}/>
                    </Item>
                    <Item label={'商品分类'}
                          name={'categoryIds'}
                          rules={[{required: true, message: '必须选择商品分类'}]}>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label={'商品图片'}>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    {/*
                        labelCol:{span:2}, // 左侧laber的宽度
                        wrapperCol:{span:8} // 右侧label的宽度
                    */}
                    <Item label={'商品详情'} labelCol={{span:2}} wrapperCol={{span:20}}>
                        <Editor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type={'primary'} htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default connect(
    state => ({categorys: state.categorys}),{getCategory, addOrUpdateProduct}
)(ProductAddUpdate)
