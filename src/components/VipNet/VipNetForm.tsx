import React from "react";

import {TPc, TVipNet, TVipnetType} from "../../api/type";
import {Button, Checkbox, DatePicker, Form, Input, Select} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../common/form.module.css'
import moment from "moment";

type TEntity = TVipNet;

interface IState {
    entity: TEntity,
    pc: {
        list: Array<TPc>,
        isLoadList: boolean
    },
    vipnet_type: {
        list: Array<TVipnetType>
    },
}

interface IDispatch {
    update: (entity: TEntity) => void,
    add: (entity: TEntity) => void,
    delete: (id: number) => void
    search: (value: string) => void
}

interface IEntityForm extends IState, IDispatch {
}


const TEntityForm: React.FC<IEntityForm> = (props) => {
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
            id: form.getFieldValue("id"),
            identifier: form.getFieldValue("identifier"),
            name: form.getFieldValue("name"),
            date_create: form.getFieldValue("date_create") ? moment(form.getFieldValue("date_create")).format("YYYY-MM-DD") : null,
            date_remove: form.getFieldValue("date_remove") ? moment(form.getFieldValue("date_remove")).format("YYYY-MM-DD") : null,
            ip_real: form.getFieldValue("ip_real"),
            ip_virtual: form.getFieldValue("ip_virtual"),
            pc: form.getFieldValue("pc"),
            last_date_locked: form.getFieldValue("last_date_locked") ? moment(form.getFieldValue("last_date_locked")).format("YYYY-MM-DD") : null,
            vipnet_type: form.getFieldValue("vipnet_type"),
            isLocked: form.getFieldValue("isLocked")
        };
    };
    const onAdd = () => {
        props.add(getEntityForm(form));
    };
    const onUpdate = (id: number) => {
        let entity: TEntity = getEntityForm(form);
        entity.id = id;
        props.update(entity)
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    let timeout: any;
    const onSearch = (value: string) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => props.search(value), 1000)

    };
    const dateFormat = "YYYY-MM-DD";
    const initialValues = {
        id: props.entity.id,
        identifier: props.entity.identifier,
        name: props.entity.name,
        date_create: props.entity.date_create ? moment(props.entity.date_create, dateFormat) : null,
        date_remove: props.entity.date_remove ? moment(props.entity.date_remove, dateFormat) : null,
        ip_real: props.entity.ip_real,
        ip_virtual: props.entity.ip_virtual,
        pc: props.entity.pc ? props.entity.pc.id : props.entity.pc,
        last_date_locked: props.entity.last_date_locked ? moment(props.entity.last_date_locked, dateFormat) : null,
        vipnet_type: props.entity.vipnet_type ? props.entity.vipnet_type.id : props.entity.vipnet_type,
        isLocked: props.entity.isLocked
    };
    form.setFieldsValue(initialValues);
    // @ts-ignore
    let optionsListPC: OptionsType = props.pc.list.map((pc) => {
            return {value: pc.id, key: pc.id, label: pc.inventory_number}
        }
    );
    // @ts-ignore
    let optionsListVipNetType: OptionsType = props.vipnet_type.list.map((vipnet_type) => {
            return {value: vipnet_type.id, key: vipnet_type.id, label: vipnet_type.name}
        }
    );
    return <>
        <div className={CSS["form-block"]}>
            <Form {...layout}
                  form={form}
                  layout="horizontal"
                  size={'middle'}
            >
                <Form.Item label="Идентификатор" name="identifier">
                    <Input/>
                </Form.Item>
                <Form.Item label="Имя" name="name">
                    <Input/>
                </Form.Item>
                <Form.Item label="Дата создания" name="date_create">
                    <DatePicker/>
                </Form.Item>
                <Form.Item label="Дата удаления" name="date_remove">
                    <DatePicker/>
                </Form.Item>
                <Form.Item label="IP реальный" name="ip_real">
                    <Input/>
                </Form.Item>
                <Form.Item label="IP виртуальный" name="ip_virtual">
                    <Input/>
                </Form.Item>
                <Form.Item label="Блокировка" name="isLocked" valuePropName="checked">
                    <Checkbox/>
                </Form.Item>
                <Form.Item label="Дата блокировки" name="last_date_locked">
                    <DatePicker/>
                </Form.Item>
                <Form.Item label="Тип дистрибутива" name="vipnet_type">
                    <Select options={optionsListVipNetType}/>
                </Form.Item>
                <Form.Item label="ПЭВМ" name="pc">
                    <Select showSearch onSearch={onSearch} options={optionsListPC}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}/>
                    <Button icon={<CheckOutlined/>} onClick={() => props.entity.id && onUpdate(props.entity.id)}/>
                    <Button icon={<MinusOutlined/>}
                            onClick={() => props.entity.id && onDelete(props.entity.id)}/>
                </Form.Item>
            </Form>
        </div>
    </>
};

export default TEntityForm