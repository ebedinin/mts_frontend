import React from "react";

import {TDeviceProfile} from "../../../api/type";
import {Button, Form, Input} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../../common/form.module.css'

interface IState {
    deviceProfile: TDeviceProfile
}

interface IDispatch {
    update: (deviceProfile: TDeviceProfile) => void,
    add: (deviceProfile: TDeviceProfile) => void,
    delete: (id: number) => void
}

interface IDeviceProfileForm extends IState, IDispatch {
}

const DeviceProfileForm: React.FC<IDeviceProfileForm> = (props) =>{
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };
    const tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    const getDeviceProfileForm: (form: FormInstance) => TDeviceProfile = (form: FormInstance) => {
        return {
            name: form.getFieldValue("name")
        };
    };
    const onAdd = () => {
        props.add(getDeviceProfileForm(form));
    };
    const onUpdate = (id: number) => {
        let deviceProfile: TDeviceProfile = getDeviceProfileForm(form);
        deviceProfile.id = id;
        props.update(deviceProfile);
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    const initialValues ={
        name: props.deviceProfile.name

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
                    <Button icon={<CheckOutlined/>} onClick={() => props.deviceProfile.id && onUpdate(props.deviceProfile.id)}/>
                    <Button icon={<MinusOutlined/>} onClick={() => props.deviceProfile.id && onDelete(props.deviceProfile.id)}/>
                </Form.Item>
            </Form>
        </div>
        </>
};

export default  DeviceProfileForm