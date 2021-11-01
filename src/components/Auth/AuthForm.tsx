import React from 'react'
import CSS from '../common/form.module.css'
import {Button, Form, Input} from "antd";

export interface IMapStateToProps {
    isLoad: boolean
}

export interface IMapDispatchToProps {
    submitLogin: (name: string, password: string) => void
}

export interface IAuthForm extends IMapDispatchToProps, IMapStateToProps {
}

export const AuthForm: React.FC<IAuthForm> = (props) => {
    const layout = {
        labelCol: {span: 9},
        wrapperCol: {span: 5},
    };
    const tailLayout = {
        wrapperCol: {offset: 9, span: 16},
    };
    const onFinish = (values: any) => {
        props.submitLogin(values.name, values.password);
    };
    return <>
        <div className={CSS["form-block"]}>
            <Form
                {...layout}
                name="auth"
                initialValues={{remember: true}}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Пользователь"
                    name="name"
                    rules={[{required: true, message: 'Пожалуйтса, введите имя!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{required: true, message: 'Пожалуйста, введите пароль!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </>
};