import React from "react";

import {TOvd} from "../../../api/type";
import {Button, Form, Input} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../../common/form.module.css'

type TEntity = TOvd;
interface IState {
    entity: TEntity
}

interface IDispatch {
    update: (entity: TEntity) => void,
    add: (entity: TEntity) => void,
    delete: (id: number) => void
}

interface IEntityForm extends IState, IDispatch {
}
const OvdForm: React.FC<IEntityForm> = (props) =>{
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };
    const tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    const getEntityForm: (form: FormInstance) => TEntity = (form: FormInstance) => {
        return {
            name_abbreviation: form.getFieldValue("name_abbreviation"),
            name_full: form.getFieldValue("name_full")
        };
    };
    const onAdd = () => {
        props.add(getEntityForm(form));
    };
    const onUpdate = (id: number) => {
        let entity: TEntity = getEntityForm(form);
        entity.id = id;
        props.update(entity);
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    const initialValues ={
        name_abbreviation: props.entity.name_abbreviation,
        name_full: props.entity.name_full
    };
    form.setFieldsValue(initialValues);
    return <>
        <div className={CSS["form-block"]}>
            <Form {...layout}
                  form={form}
                  layout="horizontal"
                  size={'middle'}
            >
                <Form.Item label="Сокращенное название" name="name_abbreviation">
                    <Input />
                </Form.Item>
                <Form.Item label="Полное название" name="name_full">
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}/>
                    <Button icon={<CheckOutlined/>} onClick={() => props.entity.id && onUpdate(props.entity.id)}/>
                    <Button icon={<MinusOutlined/>} onClick={() => props.entity.id && onDelete(props.entity.id)}/>
                </Form.Item>
            </Form>
        </div>
        </>
};
export default OvdForm