import React from 'react'
import {TApiReport, TPc, TVipNet, TVipnetFilter, TVipnetType} from "../../api/type";
import {TState} from "../../store/store";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../Auth/withAuthRedirect";
import Form from "./VipNetForm"
import VipNetList from "./VipNetList";
import {addVipNet, delVipNet, getPageVipNet, getVipNet, updateVipNet} from "../../store/reducers/VipNetReducer";
import {Col, Divider, Row} from "antd";
import {searchPc} from "../../store/reducers/PCReducer";
import VipNetFormFilter from "./VipNetFormFilter";

type TEntity = TVipNet;
const EntityForm = Form;
const EntityList = VipNetList;
type EntityFilter = TVipnetFilter;

interface IMapStateToProps {
    entity: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TVipNet,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TVipNet>
    },
    pc: {
        list: Array<TPc>,
        isLoadList: boolean
    },
    vipnet_type: {
        list: Array<TVipnetType>
    },
    filter: TVipnetFilter,
    isAuth: boolean
}

interface IMapDispatchToProps {
    addEntity: (entity: TEntity) => Promise<void>,
    delEntity: (id: number) => Promise<void>,
    getPageEntity: (current_page: number, size_page: number, filter?: EntityFilter) => Promise<void>,
    getEntity: (entityid: number) => Promise<void>,
    updateEntity: (entity: TEntity) => Promise<void>,
    searchPc: (value: string) => Promise<void>
}

interface IEntityContainer extends IMapStateToProps, IMapDispatchToProps {

}

class EntityContainer extends React.Component<IEntityContainer> {
    componentDidMount() {
        this.props.isAuth && this.props.getPageEntity(this.props.entity.current_page, this.props.entity.size_page);
    };

    apply = (id: number, flag: boolean): void => {

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
        },
        onSearch: (value: string): void => {
            value.length >= 4 && this.props.searchPc(value);
        }
    };

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Divider orientation="center">Дистрибутивы VipNet</Divider>
                        <Divider orientation="center">Фильтр</Divider>
                        <VipNetFormFilter entity={this.props.filter}
                                          vipnet_type={this.props.vipnet_type}
                                          setFilter={(filter: TVipnetFilter) => {
                                              this.props.getPageEntity(1, this.props.entity.size_page, filter)
                                          }}
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
                        />

                        <EntityForm entity={this.props.entity.current_value}
                                    update={this.entity.update}
                                    add={this.entity.add}
                                    delete={this.entity.delete}
                                    search={this.entity.onSearch}
                                    pc={this.props.pc}
                                    vipnet_type={this.props.vipnet_type}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}

const MapStateToProps = (state: TState) => {
    let entity = state.vipnet.itemsVipNet;
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
        pc: {
            list: state.pc.searchPc.list,
            isLoadList: state.pc.searchPc.isLoadList
        },
        vipnet_type: {
            list: state.vipnet.itemsVipNetType.allItems
        },
        filter: state.vipnet.filter,
        isAuth: state.auth.name !== ""
    }
};

export default compose(connect(MapStateToProps, {
    addEntity: addVipNet,
    delEntity: delVipNet,
    getPageEntity: getPageVipNet,
    getEntity: getVipNet,
    updateEntity: updateVipNet,
    searchPc: searchPc
}), withAuthRedirect)(EntityContainer);