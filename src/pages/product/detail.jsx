import React, {Component} from "react";
import {Card, List, message} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import './product.less'
import {BASE_IMG_URL} from "../../redux/action-types";
import {getCategoryInfo} from '../../redux/actions'
import {connect} from 'react-redux'
const Item = List.Item

class ProductDetail extends Component {
    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    componentDidMount() {
        // 得到当前商品的分类ID,一级分类和二级分类
        const {pCategoryId, categoryId} = this.props.location.state.product
        this.props.getCategoryInfo({pCategoryId, categoryId})
        setTimeout(()=>{
            const {productsInfo} = this.props
            // console.log(productsInfo)
            if (productsInfo) {
                if (productsInfo.length === 1) {
                    const cName1 = productsInfo[0].name
                    this.setState({cName1})
                } else {
                    // console.log(productsInfo)
                    let cName1
                    let cName2
                    if (productsInfo.length === 3) {
                        cName1 = productsInfo[1].name
                        cName2 = productsInfo[2].name
                    } else {
                        cName1 = productsInfo[0].name
                        cName2 = productsInfo[1].name
                    }
                    this.setState({
                        cName1,
                        cName2
                    })
                }
            } else {
                message.error('未获取到相关信息')
            }
        },500)
    }

    render() {
        // 读取携带过来的state数据
        // console.log(this.props.location.state.product)
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                  <LeftOutlined
                      style={{marginRight: 10, fontSize: 20}}
                      onClick={() => this.props.history.goBack()}
                  />
                </LinkButton>
                <span>商品详情</span>
             </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        className="product-img"
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
                    </Item>

                </List>
            </Card>
        )
    }
}

export default connect (
    state => ({productsInfo: state.productsInfo}), {getCategoryInfo}
)(ProductDetail)
