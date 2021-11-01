import React from "react";
import {TApiReport, TDeviceProfileField, TReportDeviceProfileDetail} from "../../../api/type";
import {Space, Table} from "antd";
import {Key, TablePaginationConfig} from "antd/lib/table/interface";


interface IMapStateToProps {
    page: Array<TReportDeviceProfileDetail>,
    current_value: TReportDeviceProfileDetail,
    count: number,
    report: TApiReport,
    size_page: number,
    current_page: number,
    isLoadList: boolean,
    device_profile_field: Array<TDeviceProfileField>,
}

interface IMapDispatchToProps {
    onClickPage: (page: number) => void,
    onClickRow: (id: number) => void,
    onDelete: (id: number) => void
}

export interface IReportDeviceProfileDetailList extends IMapStateToProps, IMapDispatchToProps {

}

const ReportDeviceProfileDetailList: React.FC<IReportDeviceProfileDetailList> = (props) => {
    let pages = [];
    let count_page = props.size_page <= 0 ? 0 : Math.ceil(props.count / props.size_page);
    for (let i = 1; i <= count_page; i++) {
        pages.push(i);
    }
    const columns = [
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: TRecord) => (
                <>
                    <Space size="middle">
                        <a href={"./#"} onClick={() => onDelete(record.key)}>Delete</a>
                    </Space>
                </>
            )
        },
        {
            title: 'Поле',
            dataIndex: 'device_profile_field',
            key: 'device_profile_field'
        },
        {
            title: 'Значение',
            dataIndex: 'value',
            key: 'value'
        }]
    ;
    type TRecord = {
        key: number,
        device_profile_field: string,
        value: string
    }
    const data = props.page.map(
        (d: TReportDeviceProfileDetail): TRecord => {
            let deviceProfileFields = props.device_profile_field.filter(item => item.id === d.device_profile_field);
            let device_profile_field = deviceProfileFields.length === 1? deviceProfileFields[0].name:"";
            return {
                key: d.id as number,
                device_profile_field: device_profile_field,
                value: d.value as string
            }
        }
    );
    const onDelete = (id: number) => {
        props.onDelete(id);
    };
    const rowSelection = {
        onChange: (selectedRowKeys: Key[]) => {
            (typeof selectedRowKeys[0] === "number") && props.onClickRow(selectedRowKeys[0]);
        },
    };
    let paginationConfig: TablePaginationConfig = {
        position: ['topLeft'],
        pageSize: props.size_page,
        total: props.count,
        current: props.current_page,
        showQuickJumper: true,
        onChange: props.onClickPage
    };
    return <Table
        rowSelection={{
            type: 'radio',
            ...rowSelection,
        }}
        loading={!props.isLoadList}
        pagination={{...paginationConfig}}
        dataSource={data}
        columns={columns}
    />
};

export default ReportDeviceProfileDetailList;