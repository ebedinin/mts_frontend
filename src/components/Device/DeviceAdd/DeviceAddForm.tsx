import React from 'react'
import {TAddDevice} from "../../../api/type";
import {Button, Form, Input, InputNumber} from "antd";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import CSS from '../../common/form.module.css'
import {FormInstance} from "antd/lib/form/util";

type TEntity = TAddDevice

interface IState {
    entity: TEntity
}

interface IDispatch {
    update: (entity: TEntity) => void,
    add: (entity: TEntity) => void,
    delete: (id: number) => void
}

interface IDeviceAddForm extends IState, IDispatch {
}

const DeviceAddForm: React.FC<IDeviceAddForm> = (props) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };
    const tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    const getDeviceFromForm: (form: FormInstance) => TAddDevice = (form: FormInstance) => {
        return {
            name: form.getFieldValue("name"),
            serial_number: form.getFieldValue("serial_number"),
            price_start_up: form.getFieldValue("price_start_up"),
            provisioner: form.getFieldValue("provisioner"),
            delivery_plan: form.getFieldValue("delivery_plan"),
            invoice: form.getFieldValue("invoice")
        };
    };
    const onAdd = () => {
        props.add(getDeviceFromForm(form));
    };
    const onUpdate = (id: number) => {
        let entity: TEntity = getDeviceFromForm(form);
        entity.id = id;
        props.update(entity);
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    const initialValues = {
        name: props.entity.name,
        serial_number: props.entity.serial_number,
        price_start_up: props.entity.price_start_up,
        provisioner: props.entity.provisioner,
        delivery_plan: props.entity.delivery_plan,
        invoice: props.entity.invoice,

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
                    <Input/>
                </Form.Item>

                <Form.Item label="Серийный номер" name="serial_number">
                    <Input name={'serial_number'}/>
                </Form.Item>
                <Form.Item label="Цена" name="price_start_up">
                    <InputNumber name={'price_start_up'}
                                 formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                    />
                </Form.Item>
                <Form.Item label="Поставщик" name={"provisioner"}>
                    <Input name={'provisioner'}/>
                </Form.Item>
                <Form.Item label="План снабжения" name={"delivery_plan"}>
                    <Input name={'delivery_plan'}/>
                </Form.Item>
                <Form.Item label="Накладная" name={"invoice"}>
                    <Input name={'invoice'}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}>
                        Добавить
                    </Button>
                    <Button icon={<CheckOutlined/>} onClick={() => props.entity.id && onUpdate(props.entity.id)}>
                        Сохранить
                    </Button>
                    <Button icon={<MinusOutlined/>} onClick={() => props.entity.id && onDelete(props.entity.id)}>
                        Удалить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </>
};

export default DeviceAddForm;