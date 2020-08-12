import React, {Component} from "react";
import {Form, Input} from 'antd';
import PubSub from "pubsub-js";

const Item = Form.Item

export default class AddForm extends Component {
    formRef = React.createRef();

    // 校验
    validatorInput = (rule, value) => {
        if (!value) {
            return Promise.reject('请输入角色名称')
        } else {
            return Promise.resolve();
        }
    }

    onValuesChange = (values) => {
        let roleName = values.roleName
        if (roleName) {
            this.props.getRoleName(roleName)
        }
    }

    componentDidMount() {
        this.formRef.current.resetFields()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        PubSub.publish('update', this.formRef)
    }

    render() {
        return (
            <Form
                ref={this.formRef}
                initialValues={{}}
                onValuesChange={this.onValuesChange}
            >
                <Item name={'roleName'}
                      label={'角色名称'}
                      rules={[{// 自定义校验
                          validator: this.validatorInput}]}>
                    <Input placeholder="请输入角色名称" />
                </Item>
            </Form>
        )
    }
}
