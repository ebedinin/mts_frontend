import React from "react";
import {Space, Table} from "antd";
import {Key, TablePaginationConfig} from "antd/lib/table/interface";
import {TDepartment,TApiReport} from "../../../api/type";

type TEntity = TDepartment;

interface IMapStateToProps {
    page: Array<TEntity>,
    current_value: TEntity,
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

export interface IEntityList extends IMapStateToProps, IMapDispatchToProps {

}

const DepartmentList: React.FC<IEntityList> = (props) => {
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
            width: 50,
            render: (text: string, record: TRecord) => (
                <>
                    <Space size="middle">
                        <a href={"./#"} onClick={() => onDelete(record.key)}>Delete</a>
                    </Space>
                </>
            )
        },
        {
            title: 'Короткое название',
            dataIndex: 'name_abbreviation',
            key: 'name_abbreviation'
        },
        {
            title: 'Полное название',
            dataIndex: 'name_full',
            key: 'name_full'
        }]
    ;
    type TRecord = {
        key: number,
        name_full: string,
        name_abbreviation: string
    }
    const data = props.page.map(
        (d: TEntity): TRecord => {
            return {
                key: d.id as number,
                name_full: d.name_full as string,
                name_abbreviation: d.name_abbreviation as string
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

export default DepartmentList;