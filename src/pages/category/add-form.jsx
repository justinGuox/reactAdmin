import React, {Component} from "react";
import {Form, Input, Select} from 'antd';
import {connect} from 'react-redux'
import PubSub from "pubsub-js";

const {Option} = Select;
const Item = Form.Item

class AddForm extends Component {
    formRef = React.createRef();

    // 校验
    validatorInput = (rule, value) => {
        if (!value) {
            return Promise.reject('请输入分类名称')
        } else {
            return Promise.resolve();
        }
    }

    onValuesChange = (values) => {
        let inputFrom = values.inputFrom
        // console.log(inputFrom,text.inputFrom)
        const {parentId}  = this.formRef.current.getFieldsValue()
        if (this.parentId !== parentId) {
            this.parentId = parentId
        }
        if (values.parentId) {
            this.parentId = values.parentId
            //console.log('id已更改'+this.parentId)
        }
        if (inputFrom) {
            const parentId = this.parentId
            //console.log('子组件')
            //console.log({parentId, inputFrom})
            this.props.getAddForm({parentId, inputFrom})
        }
    }

    componentDidMount() {
        this.formRef.current.resetFields()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        PubSub.publish('update', this.formRef)
    }

    componentWillMount() {
        this.parentId =  this.props.parentId
    }

    render() {
        return (
            <Form
                ref={this.formRef}
                onValuesChange={this.onValuesChange}
                initialValues={{parentId: this.props.parentId}}
            >
                所属分类：
                <Item name="parentId"
                      rules={[{required: true, message: '请选择分类'}]}>
                    <Select>
                        <Option value="0">一级分类</Option>
                        {
                            this.props.categorys.map(cItem => (
                                <Option value={cItem._id} key={cItem._id}>{cItem.name}</Option>
                                )
                            )
                        }
                    </Select>
                </Item>
                分类名称：
                <Item name={'inputFrom'}

                      rules={[{// 自定义校验
                          validator: this.validatorInput}]}>
                    <Input placeholder="请输入分类名称" />
                </Item>
            </Form>
        )
    }
}

export default connect(
    state => ({categorys: state.categorys}), {}
)(AddForm)
