import React from "react";
import {TApiReport, TDeviceProfileField} from "../../../api/type";
import {Space, Table} from "antd";
import {Key, TablePaginationConfig} from "antd/lib/table/interface";


interface IMapStateToProps {
    page: Array<TDeviceProfileField>,
    current_value: TDeviceProfileField,
    count: number,
    report: TApiReport,
    size_page: number,
    current_page: number,
    isLoadList: boolean
}

interface IMapDispatchToProps {
    onClickPage: (page: number) => void,
    onClickRow: (id: number) => void,
    onDelete: (id: number) => void
}

export interface IDeviceProfileFieldList extends IMapStateToProps, IMapDispatchToProps {

}

const DeviceProfileFieldList: React.FC<IDeviceProfileFieldList> = (props) => {
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
                        <a onClick={() => onDelete(record.key)}>Delete</a>
                    </Space>
                </>
            )
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name'
        }]
    ;
    type TRecord = {
        key: number,
        name: string
    }
    const data = props.page.map(
        (d: TDeviceProfileField): TRecord => {
            return {
                key: d.id as number,
                name: d.name as string
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

export default DeviceProfileFieldList;