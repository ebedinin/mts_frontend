import React from "react";
import {TApiReport} from "../../api/type";
import {Col, Divider, Row} from "antd";

interface IMapStateToProps<TEntity extends { id: number }> {
    EntityForm: React.Component,
    EntityList: React.Component,
    entity: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TEntity,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TEntity>
    }
    isAuth: boolean
}

interface IMapDispatchToProps<TEntity> {
    addEntity: (entity: TEntity) => Promise<void>,
    delEntity: (id: number) => Promise<void>,
    getPageEntity: (current_page: number, size_page: number) => Promise<void>,
    getEntity: (entityid: number) => Promise<void>,
    updateEntity: (entity: TEntity) => Promise<void>
}

interface IEntityContainer<TEntity extends { id: number }> extends IMapStateToProps<TEntity>, IMapDispatchToProps<TEntity> {

}

export class EntityContainer<TEntity extends { id: number }> extends React.Component<IEntityContainer<TEntity>> {
    componentDidMount() {
        this.props.isAuth && this.props.getPageEntity(this.props.entity.current_page, this.props.entity.size_page);
    };

    entity = {
        delete: (id: number): void => {
            this.props.delEntity(id);
        },
        add: (value: TEntity): void => {
            this.props.addEntity(value);
        },
        update: (value: TEntity): void => {
            this.props.updateEntity(value);
        },
        onClickPage: (page: number): void => {
            this.props.getPageEntity(page, this.props.entity.size_page);
        },
        onClickRow: (id: number): void => {
            this.props.getEntity(id);
        }
    };
    /*//EForm = EntityForm;
    renderForm = () => {
        const EForm = this.props.EntityForm;
        return (

    }*/

    render() {

        const EList = this.props.EntityList;
        const EForm = this.props.EntityForm;
        return (
            <Row>
                <Col span={24}>
                    <Divider orientation="left">Профиль</Divider>
                    //@ts-ignore
                    <EForm entity={this.props.entity.current_value}
                                    update={this.entity.update}
                                    add={this.entity.add}
                                    delete={this.entity.delete}/>
                    )
                    //@ts-ignore
                    <EList size_page={this.props.entity.size_page}
                                         count={this.props.entity.count}
                                         current_page={this.props.entity.current_page}
                                         current_value={this.props.entity.current_value}
                                         isLoadList={this.props.entity.isLoadList}
                                         report={this.props.entity.report}
                                         page={this.props.entity.page}
                                         onClickPage={this.entity.onClickPage}
                                         onClickRow={this.entity.onClickRow}
                                         onDelete={this.entity.delete}
                    />
                </Col>
            </Row>
        )
    }
}