import React from "react";
import {TApiReport} from "../../api/type";
import {Table} from "antd";
import {Key, TablePaginationConfig} from "antd/lib/table/interface";


interface IMapStateToProps<TEntity> {
    page: Array<TEntity>,
    current_value: TEntity,
    count: number,
    report: TApiReport,
    size_page: number,
    current_page: number,
    isLoadList: boolean
}

interface IMapDispatchToProps<TEntity> {
    onClickPage: (page: number) => void,
    onClickRow: (id: number) => void,
    onDelete: (id: number) => void
}

export interface IEntityList<TEntity> extends IMapStateToProps<TEntity>, IMapDispatchToProps<TEntity> {

}

export class EntityList<TEntity extends { id: number }> extends React.Component<IEntityList<TEntity>> {
    pages: Array<number> = [];
    count_page = this.props.size_page <= 0 ? 0 : Math.ceil(this.props.count / this.props.size_page);

    componentDidMount(): void {
        for (let i = 1; i <= this.count_page; i++) {
            this.pages.push(i);
        }
    }

    columns = [];
    data: any = [];

    //Инициализация. Реализация в дочернем классе.
    initial<TRecord>() {
        //Инициализация столбцов.
        this.columns = [/*
            {
                title: 'Действие',
                dataIndex: 'action',
                key: 'action',
                render: (text: string, record: TRecord) => (
                    <>
                        <Space size="middle">
                            <a href={"./#"} onClick={() => this.onDelete(record.key)}>Delete</a>
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
            }*/];
        //Инициализация данных
        this.data = this.props.page.map(
            (d: TEntity): TRecord => {
                return {/*
                    key: d.id as number,
                    name_full: d.name_full as string,
                    name_abbreviation: d.name_abbreviation as string
                */
                } as TRecord
            }
        );
    }
    onDelete = (id: number) => {
        this.props.onDelete(id);
    };
    rowSelection = {
        onChange: (selectedRowKeys: Key[]) => {
            (typeof selectedRowKeys[0] === "number") && this.props.onClickRow(selectedRowKeys[0]);
        },
    };
    paginationConfig: TablePaginationConfig = {
        position: ['topLeft'],
        pageSize: this.props.size_page,
        total: this.props.count,
        current: this.props.current_page,
        showQuickJumper: true,
        onChange: this.props.onClickPage
    };

    render() {
        return (
            <Table
                rowSelection={{
                    type: 'radio',
                    ...this.rowSelection,
                }}
                loading={!this.props.isLoadList}
                pagination={{...this.paginationConfig}}
                dataSource={this.data}
                columns={this.columns}
            />
        )
    }
}

//export default EntityList;