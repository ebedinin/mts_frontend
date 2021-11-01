import React from 'react'
import {TAddress, TApiReport, TObject, TPc, TVipNet} from "../../api/type";
import {CloseCircleOutlined, CheckCircleOutlined} from '@ant-design/icons'
import {TablePaginationConfig} from "antd/lib/table";
import {Badge, Popover, Table} from "antd";
import {Key} from "antd/lib/table/interface";


type TEntity = TVipNet;

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
    //onApply: (id: number, flag: boolean) => void
}

export interface IEntityList extends IMapStateToProps, IMapDispatchToProps {

}

const VipNetList: React.FC<IEntityList> = (props) => {
    let pages = [];
    let count_page = props.size_page <= 0 ? 0 : Math.ceil(props.count / props.size_page);
    for (let i = 1; i <= count_page; i++) {
        pages.push(i);
    }

    const columns = [
            {
                title: 'Идентификатор',
                dataIndex: 'identifier',
                key: 'identifier'
            },
            {
                title: 'Имя',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Дата создания',
                dataIndex: 'date_create',
                key: 'date_create'
            },
            {
                title: 'Дата удаления',
                dataIndex: 'date_remove',
                key: 'date_remove'
            },
            {
                title: 'ip реальный',
                dataIndex: 'ip_real',
                key: 'ip_real'
            },
            {
                title: 'ip виртуальный',
                dataIndex: 'ip_virtual',
                key: 'ip_virtual'
            },
            {
                title: 'PC',
                dataIndex: 'pc',
                key: 'pc',
                render: (is: boolean, record: TRecord) => {
                    let address = "";
                    if (record.pc != null && record.pc.object != null) {
                        address = record.pc ? ((record.pc.object as TObject).address as TAddress).address : ""
                    }
                    let content = (
                        <p>
                            <p>Пользователь: {record.pc ? record.pc.user : ""}</p>
                            <p>MAC: {record.pc ? record.pc.mac_address : ""}</p>
                            <p>Хост: {record.pc ? record.pc.host_name : ""}</p>
                            <p>Адрес: {address}</p>
                            <p>Кабинет: {record.pc ? record.pc.room : ""}</p>
                        </p>
                    );
                    return (
                        <Popover title={record.pc ? record.pc.name : ""} content={content}>
                            <div>{record.pc ? record.pc.inventory_number : ""}</div>
                        </Popover>
                    )
                }
            },
            {
                title: 'Дата блокировки',
                dataIndex: 'last_date_locked',
                key: 'last_date_locked'
            },
            {
                title: 'Блокировка',
                dataIndex: 'isLocked',
                key: 'isLocked',
                render: (is: boolean, record: TRecord) => {
                    const block = <Badge>
                                    <CloseCircleOutlined style={{color: 'red'}}/>
                                </Badge>;
                    const unblock =  <Badge>
                                        <CheckCircleOutlined style={{color: 'green'}}/>
                                </Badge>;
                    return record.isLocked?block:unblock;
                }
            },
            {
                title: 'Тип',
                dataIndex: 'vipnet_type',
                key: 'vipnet_type'
            }
        ]
    ;
    type TRecord = {
        key: number,
        identifier: string,
        name: string,
        date_create: string,
        date_remove: string,
        ip_real: string,
        ip_virtual: string,
        pc: TPc | null,
        last_date_locked: string,
        vipnet_type: string,
        isLocked: boolean
    }
    const data = props.page.map(
        (d: TEntity): TRecord => {
            return {
                key: d.id as number,
                name: d.name as string,
                identifier: d.identifier as string,
                date_create: d.date_create as string,
                date_remove: d.date_remove as string,
                ip_real: d.ip_real as string,
                ip_virtual: d.ip_virtual as string,
                pc: d.pc as TPc | null,
                last_date_locked: d.last_date_locked as string,
                vipnet_type: d.vipnet_type ? d.vipnet_type.name as string : "",
                isLocked: d.isLocked as boolean
            }
        }
    );
    const rowSelection = {
        onChange: (selectedRowKeys: Key[], selectedRows: TRecord[]) => {
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
        size={"small"}
        scroll={{y: 440}}
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

export default VipNetList;