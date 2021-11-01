import React from 'react'
import {IS_APPLY, IS_NOT_APPLY, TApiReport, TPc, TStatusPc} from "../../../api/type";
import {TablePaginationConfig} from "antd/lib/table";
import {Collapse, List, Space, Table, Tag} from "antd";
import {Key} from "antd/lib/table/interface";

const {Panel} = Collapse;

interface IMapStateToProps {
    page: Array<TPc>,
    current_value: TPc,
    count: number,
    report: TApiReport,
    size_page: number,
    current_page: number,
    isLoadList: boolean
}

interface IMapDispatchToProps {
    onClickPage: (page: number) => void,
    onClickRow: (id: number) => void,
    onApply: (id: number, flag: boolean) => void
}

export interface IDeviceList extends IMapStateToProps, IMapDispatchToProps {

}

const DeviceList: React.FC<IDeviceList> = (props) => {
    let pages = [];
    let count_page = props.size_page <= 0 ? 0 : Math.ceil(props.count / props.size_page);
    for (let i = 1; i <= count_page; i++) {
        pages.push(i);
    }
    const getTextStatus = (status: TStatusPc): string => {
        if (status === IS_APPLY) {
            return "Принят";
        } else if (status === IS_NOT_APPLY) {
            return 'Не принят'
        } else return 'В обработке'

    };
    const getColorStatus = (status: TStatusPc): string => {
        if (status === IS_APPLY) {
            return 'green';
        } else if (status === IS_NOT_APPLY) {
            return 'red'
        } else return 'gold'

    };
    const columns = [
            {
                title: 'Действие',
                dataIndex: 'action',
                key: 'action',
                render: (text: string, record: TRecord) => (
                    <>
                        <Space size="middle">
                            <a onClick={() => onApply(record.key, record.status !== IS_APPLY)}>{record.status === IS_APPLY ? "Отозвать" : "Принять"}</a>
                        </Space>
                    </>
                )
            },
            {
                title: 'Статус',
                key: 'isApply',
                dataIndex: 'isApply',
                render: (isApply: boolean, record: TRecord) => (
                    <Tag color={getColorStatus(record.status)} key={record.key}>
                        {getTextStatus(record.status)}
                    </Tag>)
            },
            {
                title: 'Инвентарный номер',
                dataIndex: 'inventory_number',
                key: 'inventory_number',
                render: (isApply: boolean, record: TRecord) => (
                    <Tag color={!record.isUnknownInventoryNumber ? 'green' : 'volcano'} key={record.key}>
                        {!record.isUnknownInventoryNumber ? record.inventory_number : record.inventory_number_other}
                    </Tag>)
            },
            {
                title: 'Пользователь',
                dataIndex: 'user',
                key: 'user'
            },
            {
                title: 'Кабинет',
                dataIndex: 'room',
                key: 'room'
            },

            {
                title: 'Название',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Параметры',
                dataIndex: 'info',
                key: 'info',
                width: 600,
                render: (is: boolean, record: TRecord) => (
                    <>
                        {(record.mac_address && record.mac_address.length > 1) ?
                            <Collapse accordion>
                                <Panel header={`MAC: ${record.mac_address}; Имя хоста: ${record.host_name}`}
                                       key={record.key}>
                                    <List
                                        size="small"
                                        dataSource={[`MAC: ${record.mac_address}`,
                                            `IP Адрес: ${record.ip_address}`,
                                            `Имя хоста: ${record.host_name}`,
                                            `ДИСК: ${record.hard_name}`,
                                            `ОС: ${record.os}`,
                                            `Secret Net: ${record.secret_net_studio_version}`,
                                            `Crypto Pro: ${record.crypto_pro_version}`,
                                            `Vipnet Client: ${record.vipnet_client_version}`,
                                            `Kaspersky: ${record.kaspersky_version}`]}
                                        renderItem={item => <List.Item>{item}</List.Item>}
                                    />
                                </Panel>
                            </Collapse>
                            :
                            ""
                        }
                    </>
                )
            }
        ]
    ;
    type TRecord = {
        key: number,
        name: string,
        serial_number: string,
        inventory_number: string,
        isUnknownInventoryNumber: boolean,
        price_start_up: string,
        user: string,
        bailee: string,
        note: string,
        object: number,
        inventory_number_other: string,
        room: string,
        mac_address: string,
        ip_address: string,
        host_name: string,
        hard_serial_number: string,
        hard_name: string,
        os: string,
        secret_net_studio_version: string,
        crypto_pro_version: string,
        vipnet_client_version: string,
        kaspersky_version: string,
        status: TStatusPc,
        date_apply: string,
        date_edit: string
    }
    const data = props.page.map(
        (d: TPc): TRecord => {
            return {
                key: d.id as number,
                name: d.name as string,
                serial_number: d.serial_number as string,
                inventory_number: d.inventory_number as string,
                isUnknownInventoryNumber: d.isUnknownInventoryNumber as boolean,
                price_start_up: d.price_start_up as string,
                user: d.user as string,
                bailee: d.bailee as string,
                note: d.note as string,
                object: d.object as number,
                inventory_number_other: d.inventory_number_other as string,
                room: d.room as string,
                mac_address: d.mac_address as string,
                ip_address: d.ip_address as string,
                host_name: d.host_name as string,
                hard_serial_number: d.hard_serial_number as string,
                hard_name: d.hard_name as string,
                os: d.os as string,
                secret_net_studio_version: d.secret_net_studio_version as string,
                crypto_pro_version: d.crypto_pro_version as string,
                vipnet_client_version: d.vipnet_client_version as string,
                kaspersky_version: d.kaspersky_version as string,
                status: d.status as TStatusPc,
                date_apply: d.date_apply as string,
                date_edit: d.date_edit as string
            }
        }
    );
    const onApply = (id: number, flag: boolean) => {
        props.onApply(id, flag);
    };
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

export default DeviceList;