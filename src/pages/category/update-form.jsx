import React, {Component} from "react";
import {Form, Input} from 'antd';
import PubSub from "pubsub-js";

export default class UpdateForm extends Component {
    formRef = React.createRef();

    onValuesChange = (values) => {
        let categoryName = values.categoryName
        if (!categoryName) {
            categoryName = '错误'
            this.props.getCategoryName(categoryName)
        }
        this.props.getCategoryName(categoryName)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        PubSub.publish('update', this.formRef)
    }

    render() {
        return (
            <Form ref={this.formRef}
                  onValuesChange={this.onValuesChange}
                  initialValues={{ categoryName: this.props.categoryName }}
            >
                <Form.Item name={'categoryName'}
                           rules={[{required: true,message: '请输入修改分类名称'}]}
                >
                    <Input placeholder="请输入修改分类名称" />
                </Form.Item>
            </Form>
        )
    }
}
