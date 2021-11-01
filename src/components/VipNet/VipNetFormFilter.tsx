import React from "react";

import {TVipnetFilter, TVipnetType} from "../../api/type";
import {Button, Checkbox, Form, Input, Row, Select} from "antd";
import {FormInstance} from "antd/lib/form";
import CSS from '../common/form.module.css'
import {RedoOutlined} from '@ant-design/icons'

type TEntity = TVipnetFilter;

interface IState {
    entity: TEntity
    vipnet_type: {
        list: Array<TVipnetType>
    }
}

interface IDispatch {
    setFilter: (filter: TEntity) => void
}

interface IEntityForm extends IState, IDispatch {
}


const VipNetFormFilter: React.FC<IEntityForm> = (props) => {
    const [form] = Form.useForm();
    const layout = {
    };
    const getEntityForm: (form: FormInstance) => TEntity = (form: FormInstance) => {
        return {
            isUseFilter: form.getFieldValue("isUseFilter"),
            search: form.getFieldValue("search"),
            isLocked: form.getFieldValue("isLocked"),
            isServices: form.getFieldValue("isServices"),
            vipnet_type: form.getFieldValue("vipnet_type"),
        };
    };
    const setFilter = () => {
        props.setFilter(getEntityForm(form));
    };
    const initialValues = {
        isUseFilter: props.entity.isUseFilter,
        search: props.entity.search,
        isLocked: props.entity.isLocked,
        isServices: props.entity.isServices,
        vipnet_type: props.entity.vipnet_type ? props.entity.vipnet_type.id : props.entity.vipnet_type,
    };
    form.setFieldsValue(initialValues);
    // @ts-ignore
    let optionsListVipNetType: OptionsType = props.vipnet_type.list.map((vipnet_type) => {
            return {value: vipnet_type.id, key: vipnet_type.id, label: vipnet_type.name}
        }
    );
    const s = {padding: "4px"};
    /*className={CSS["form-block"]}{...layout}*/
    return <>
        <div className={CSS["form-block"]}>
            <Form {...layout}
                form={form}
                layout="horizontal"
                size="large"
            >
                <Row gutter={24}>
                    <Form.Item>
                        <Button disabled={!props.entity.isUseFilter} icon={<RedoOutlined/>} onClick={() => setFilter()}/>
                    </Form.Item>
                    <Form.Item label="Применить" name="isUseFilter" valuePropName="checked">
                        <Checkbox style={s} onChange={()=> setFilter()}/>
                    </Form.Item>
                    <Form.Item label="Поиск" name="search">
                        <Input style={{width: "300px",padding: "4px"}} />
                    </Form.Item>
                    <Form.Item label="Заблокирован" name="isLocked" valuePropName="checked">
                        <Checkbox style={s}/>
                    </Form.Item>
                    <Form.Item label="Служебный" name="isServices" valuePropName="checked">
                        <Checkbox style={s}/>
                    </Form.Item>
                    <Form.Item label="Тип дистрибутива" name="vipnet_type">
                        <Select style={{width: "300px"}} options={optionsListVipNetType}/>
                    </Form.Item>
                </Row>
            </Form>
        </div>
    </>
};

export default VipNetFormFilter