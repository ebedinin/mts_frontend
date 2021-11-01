import React from "react";

import {reportType, TDeviceProfile, TReport} from "../../../api/type";
import {Button, Form, Input, Select} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../../common/form.module.css'

const {Option} = Select;

interface IState {
    report: TReport,
    deviceProfiles: Array<TDeviceProfile>
}

interface IDispatch {
    update: (report: TReport) => void,
    add: (report: TReport) => void,
    delete: (id: number) => void
}

interface IReportForm extends IState, IDispatch {
}

const ReportForm: React.FC<IReportForm> = (props) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };
    const tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    const getReportForm: (form: FormInstance) => TReport = (form: FormInstance) => {
        return {
            name: form.getFieldValue("name"),
            type: form.getFieldValue("type"),
            device_profile: form.getFieldValue("device_profile")
        };
    };
    const onAdd = () => {
        props.add(getReportForm(form));
    };
    const onUpdate = (id: number) => {
        let report: TReport = getReportForm(form);
        report.id = id;
        props.update(report);
    };
    const onDelete = (id: number) => {
        props.delete(id);
    };
    const initialValues = {
        name: props.report.name,
        type: props.report.type,
        device_profile: props.report.device_profile
    };

    /*const onSelect = (value:TReportType) =>{
        switch (value) {
            case reportType.REPORT_DEVICE_PROFILE:{
                th
            }

        }
    };*/
    form.setFieldsValue(initialValues);
    return <>
        <div className={CSS["form-block"]}>
            <Form {...layout}
                  form={form}
                  layout="horizontal"
                  size={'middle'}
            >
                <Form.Item label="Название" name="name" style={{width: '100%'}}>
                    <Input style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item label="Тип отчёта" name="type" style={{width: '100%'}}>
                    <Select style={{width: '100%'}} >
                        <Option value={"REPORT_DEVICE_PROFILE"}>По профилям устройств</Option>
                        <Option value={"REPORT_DEVICE_AVAILABLE"}>По наличию устройств</Option>
                    </Select>
                </Form.Item>
                {props.report.type === reportType.REPORT_DEVICE_PROFILE ?
                    <Form.Item label="Профили устройств" name="device_profile">
                        <Select mode="multiple">
                            {props.deviceProfiles.map(
                                (item) => {
                                    return <Option value={item.id as number} key={item.id}>{item.name}</Option>
                                }
                            )}
                        </Select>
                    </Form.Item>:
                    <div>

                    </div>
                }
                <Form.Item {...tailLayout} style={{width: '100%'}}>
                    <Button icon={<PlusOutlined/>} onClick={() => onAdd()}/>
                    <Button icon={<CheckOutlined/>} onClick={() => props.report.id && onUpdate(props.report.id)}/>
                    <Button icon={<MinusOutlined/>} onClick={() => props.report.id && onDelete(props.report.id)}/>
                </Form.Item>
            </Form>
        </div>
    </>
};

export default ReportForm