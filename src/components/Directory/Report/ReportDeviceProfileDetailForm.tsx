import React from "react";

import {TDeviceProfileField, TReportDeviceProfileDetail} from "../../../api/type";
import {Button, Form, Input, Select} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../../common/form.module.css'

const {Option} = Select;

interface IState {
    device_profile_field: Array<TDeviceProfileField>,
    reportDeviceProfileDetail: TReportDeviceProfileDetail,
    report_id: number
}

interface IDispatch {
    update: (reportDeviceProfile: TReportDeviceProfileDetail) => void,
    add: (reportDeviceProfile: TReportDeviceProfileDetail) => void,
    delete: (id: number) => void
}

interface IReportDeviceProfileFieldForm extends IState, IDispatch {
}

export const ReportDeviceProfileDetailForm: React.FC<IReportDeviceProfileFieldForm> = (props) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };

    const tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    const getReportDeviceProfileForm: (form: FormInstance) => TReportDeviceProfileDetail = (form: FormInstance) => {
        return {
            report: props.report_id,
            device_profile_field: form.getFieldValue("device_profile_field"),
            value: form.getFieldValue("value")!==""?form.getFieldValue("value"):null
        };
    };/**/
    const onAdd = () => {
        let reportDeviceProfileDetail: TReportDeviceProfileDetail = getReportDeviceProfileForm(form);
        props.add(reportDeviceProfileDetail);
    };
    const onUpdate = (id: number) => {
        let reportDeviceProfileDetail: TReportDeviceProfileDetail = getReportDeviceProfileForm(form);
        reportDeviceProfileDetail.id = id;
        props.update(reportDeviceProfileDetail);
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    const initialValues = {
        device_profile_field: props.reportDeviceProfileDetail.device_profile_field?props.reportDeviceProfileDetail.device_profile_field: undefined,
        value: props.reportDeviceProfileDetail.value
    };
    form.setFieldsValue(initialValues);
    return  <div className={CSS["form-block"]}>
            <Form {...layout}
                  form={form}
                  layout="horizontal"
                  size={'middle'}
            >
                <Form.Item label="Поле" name="device_profile_field">
                    <Select>
                        {props.device_profile_field && props.device_profile_field.map(
                            (item) => {
                                return <Option value={item.id as number} key={item.id}>{item.name}</Option>
                            }
                        )}
                    </Select>
                </Form.Item>
                <Form.Item label="Значение" name="value">
                    <Input/>
                </Form.Item>
                {<Form.Item {...tailLayout}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}/>
                    <Button icon={<CheckOutlined/>}
                            onClick={() => props.reportDeviceProfileDetail.id && onUpdate(props.reportDeviceProfileDetail.id)}/>
                    <Button icon={<MinusOutlined/>}
                            onClick={() => props.reportDeviceProfileDetail.id && onDelete(props.reportDeviceProfileDetail.id)}/>
                </Form.Item>}
            </Form>
        </div>
};