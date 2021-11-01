import React from 'react'
import {addDevice, delDevice, getDevice, getPageDeviceAdd, updateDevice} from "../../../store/reducers/DeviceReducer";
import {TAddDevice, TApiReport} from "../../../api/type";
import DeviceList from "./DeviceList";
import {TState} from "../../../store/store";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../Auth/withAuthRedirect";
import Form from "./DeviceAddForm";

type TEntity = TAddDevice
const EntityForm = Form;
const EntityList = DeviceList;

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
    isAuth: boolean
}

interface IMapDispatchToProps {
    addEntity: (entity: TEntity) => Promise<void>,
    delEntity: (id: number) => Promise<void>,
    getPageEntity: (current_page: number, size_page: number) => Promise<void>,
    getEntity: (id: number) => Promise<void>,
    updateEntity: (entity: TEntity) => Promise<void>
}

interface IEntityContainer extends IMapStateToProps, IMapDispatchToProps {

}

class DeviceAddContainer extends React.Component<IEntityContainer> {
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
            <div>
                <EntityForm entity={this.props.entity.current_value}
                            update={this.entity.update}
                            add={this.entity.add}
                            delete={this.entity.delete}/>

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
            </div>

        )
    }
}

const MapStateToProps = (state: TState) => {
    return {
        entity: {
            size_page: state.device.itemsDeviceAdd.size_page,
            count: state.device.itemsDeviceAdd.count,
            current_page: state.device.itemsDeviceAdd.current_page,
            current_value: state.device.itemsDeviceAdd.current_value,
            isLoadList: state.device.itemsDeviceAdd.isLoadList,
            report: state.device.itemsDeviceAdd.report,
            page: state.device.itemsDeviceAdd.page,
        },
        isAuth: state.auth.name !== ""
    }
};

export default compose(connect(MapStateToProps, {
    addEntity: addDevice,
    delEntity: delDevice,
    getPageEntity: getPageDeviceAdd,
    getEntity: getDevice,
    updateEntity: updateDevice
}), withAuthRedirect)(DeviceAddContainer);