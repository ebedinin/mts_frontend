import React from "react";

import {TDeviceProfileField} from "../../../api/type";
import {Button, Form, Input} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../../common/form.module.css'

interface IState {
    deviceProfileField: TDeviceProfileField,
    deviceProfile:number
}

interface IDispatch {
    update: (deviceProfileField: TDeviceProfileField) => void,
    add: (deviceProfileField: TDeviceProfileField) => void,
    delete: (id: number) => void
}

interface IDeviceProfileFieldForm extends IState, IDispatch {
}

const DeviceProfileFieldForm: React.FC<IDeviceProfileFieldForm> = (props) =>{
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };
    const tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    const getDeviceProfileFieldForm: (form: FormInstance) => TDeviceProfileField = (form: FormInstance) => {
        return {
            name: form.getFieldValue("name"),
            device_profile: form.getFieldValue("device_profile")
        };
    };
    const onAdd = () => {
        let deviceProfileField: TDeviceProfileField = getDeviceProfileFieldForm(form);
        deviceProfileField.device_profile = props.deviceProfile;
        props.add(deviceProfileField);
    };
    const onUpdate = (id: number) => {
        let deviceProfileField: TDeviceProfileField = getDeviceProfileFieldForm(form);
        deviceProfileField.id = id;
        deviceProfileField.device_profile = props.deviceProfile;
        props.update(deviceProfileField);
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    const initialValues ={
        name: props.deviceProfileField.name,

    };
    form.setFieldsValue(initialValues);
    return <>
        <div className={CSS["form-block"]}>
            <Form {...layout}
                  form={form}
                  layout="horizontal"
                  size={'middle'}
            >
                <Form.Item label="Название" name="name">
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}/>
                    <Button icon={<CheckOutlined/>} onClick={() => props.deviceProfileField.id && onUpdate(props.deviceProfileField.id)}/>
                    <Button icon={<MinusOutlined/>} onClick={() => props.deviceProfileField.id && onDelete(props.deviceProfileField.id)}/>
                </Form.Item>
            </Form>
        </div>
        </>
};

export default  DeviceProfileFieldForm