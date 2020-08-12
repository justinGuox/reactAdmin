import React, {PureComponent} from "react";
import {Form, Input, Select} from 'antd';
import PubSub from "pubsub-js";

const {Option} = Select;
const Item = Form.Item

export default class UserForm extends PureComponent {
    formRef = React.createRef();

    componentWillMount() {
        this.props.setForm(this.formRef)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        PubSub.publish('update', this.formRef)
    }

    render() {
        const {roles,user} = this.props
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 18 }, // 右侧包裹的宽度
        }
        return (
            <Form
                {...formItemLayout}
                ref={this.formRef}
                onValuesChange={this.onValuesChange}
                initialValues={{username:user.username,password:user.password,phone:user.phone,email:user.email,role_id:user.role_id}}
            >
                <Item
                    label={'用户名：'}
                    name={'username'}
                    rules={[
                        {required: true, message:'请输入用户名'},
                        {min: 4, message: '用户名至少4位'},
                        {max: 12, message: '用户名最多12位'}
                    ]}>
                    <Input placeholder="请输入用户名" />
                </Item>
                {
                    user._id ? null : (
                        <Item
                            label={'用户密码：'}
                            name={'password'}
                            rules={[{required: true, message: '请输入密码'},
                                {min: 4, message: '密码至少4位'},
                                {max: 12, message: '密码最多12位'}]}>
                            <Input placeholder="请输入用户密码" />
                        </Item>
                    )
                }
                <Item
                    label={'手机号：'}
                    name={'phone'}
                    rules={[{required: true, message:'请输入手机号'}]}>
                    <Input placeholder="请输入手机号" />
                </Item>
                <Item
                    label={'邮箱：'}
                    name={'email'}
                    rules={[{required: true, message:'请输入邮箱'}]}>
                    <Input placeholder="请输入邮箱" />
                </Item>
                <Item name="role_id"
                      label={'角色'}
                      rules={[{required: true, message: '请选择分类'}]}>
                    <Select>
                        {
                            roles.map(role => (
                                    <Option value={role._id} key={role._id}>{role.name}</Option>
                                )
                            )
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}

