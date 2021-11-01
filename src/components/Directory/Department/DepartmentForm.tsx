import React from "react";

import {Button, Form, Input, Select} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../../common/form.module.css'
import {TDepartment, TOvd} from "../../../api/type";
const {Option} = Select;

type TEntity = TDepartment;
interface IState {
    entity: TEntity,
    ovd:Array<TOvd>
}

interface IDispatch {
    update: (entity: TEntity) => void,
    add: (entity: TEntity) => void,
    delete: (id: number) => void
}

interface IEntityForm extends IState, IDispatch {
}
const DepartmentForm: React.FC<IEntityForm> = (props) =>{
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
            name_full: form.getFieldValue("name_full"),
            ovd: form.getFieldValue("ovd")

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
        name_full: props.entity.name_full,
        ovd: props.entity.ovd
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
                <Form.Item label="ОВД" name="ovd">
                    <Select mode="multiple">
                        {props.ovd.map(
                            (item) => {
                                return <Option value={item.id as number} key={item.id}>{item.name_abbreviation}</Option>
                            }
                        )}
                    </Select>
                </Form.Item>:
                <Form.Item {...tailLayout}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}/>
                    <Button icon={<CheckOutlined/>} onClick={() => props.entity.id && onUpdate(props.entity.id)}/>
                    <Button icon={<MinusOutlined/>} onClick={() => props.entity.id && onDelete(props.entity.id)}/>
                </Form.Item>
            </Form>
        </div>
        </>
};
export default DepartmentForm