import React from "react";
import {TState} from "../../../store/store";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../Auth/withAuthRedirect";
import {
    add,
    del,
    get,
    getPage,
    update
} from "../../../store/reducers/DepartmentReduer";
import Form from "./DepartmentForm"
import List from "./DepartmentList"
import {Col, Divider, Row} from "antd";
import {TDepartment, TApiReport, TOvd} from "../../../api/type";

type TEntity = TDepartment;
const EntityForm = Form;
const EntityList = List;

interface IMapStateToProps {
    entity: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TEntity,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TEntity>
    },
    ovd: Array<TOvd>,
    isAuth: boolean
}

interface IMapDispatchToProps {
    addEntity: (entity: TEntity) => Promise<void>,
    delEntity: (id: number) => Promise<void>,
    getPageEntity: (current_page: number, size_page: number) => Promise<void>,
    getEntity: (entityid: number) => Promise<void>,
    updateEntity: (entity: TEntity) => Promise<void>
}

interface IEntityContainer extends IMapStateToProps, IMapDispatchToProps {

}

class EntityContainer extends React.Component<IEntityContainer> {
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

    render() {
        return (
            <Row>
                <Col span={24}>
                    <Divider orientation="left">Подразделения</Divider>
                    <EntityForm entity={this.props.entity.current_value}
                                update={this.entity.update}
                                add={this.entity.add}
                                delete={this.entity.delete}
                                ovd={this.props.ovd}
                    />
                    <EntityList size_page={this.props.entity.size_page}
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

const MapStateToProps = (state: TState) => {
    let entity = state.department.itemsEntity;
    return {
        entity: {
            size_page: entity.size_page,
            count: entity.count,
            current_page: entity.current_page,
            current_value: entity.current_value,
            isLoadList: entity.isLoadList,
            report: entity.report,
            page: entity.page
        },
        ovd: state.ovd.itemsOvd.allItems,
        isAuth: state.auth.name !== ""
    }
};

export default compose(connect(MapStateToProps, {
    addEntity: add,
    delEntity: del,
    getPageEntity: getPage,
    getEntity: get,
    updateEntity: update
}), withAuthRedirect)(EntityContainer);