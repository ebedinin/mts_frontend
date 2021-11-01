import React from "react";
import {TApiReport, TDeviceProfile, TDeviceProfileField} from "../../../api/type";
import {TState} from "../../../store/store";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../Auth/withAuthRedirect";
import {
    addDeviceProfile,
    addDeviceProfileField,
    delDeviceProfile,
    delDeviceProfileField,
    getDeviceProfile,
    getDeviceProfileField,
    getPageDeviceProfile,
    getPageDeviceProfileField,
    updateDeviceProfile,
    updateDeviceProfileField
} from "../../../store/reducers/DeviceProfileReduer";
import DeviceProfileForm from "./DeviceProfileForm";
import DeviceProfileList from "./DeviceProfileList";
import {Col, Divider, Row} from "antd";
import DeviceProfileFieldForm from "./DeviceProfileFieldForm";
import DeviceProfileFieldList from "./DeviceProfileFieldList";

interface IMapStateToProps {
    deviceProfile: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TDeviceProfile,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TDeviceProfile>
    },
    deviceProfileField: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TDeviceProfileField,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TDeviceProfileField>
    },
    isAuth: boolean
}

interface IMapDispatchToProps {
    addDeviceProfile: (deviceProfile: TDeviceProfile) => Promise<void>,
    delDeviceProfile: (id: number) => Promise<void>,
    getPageDeviceProfile: (current_page: number, size_page: number) => Promise<void>,
    getDeviceProfile: (deviceProfileid: number) => Promise<void>,
    updateDeviceProfile: (deviceProfile: TDeviceProfile) => Promise<void>,
    addDeviceProfileField: (deviceProfileField: TDeviceProfileField) => Promise<void>,
    delDeviceProfileField: (id: number) => Promise<void>,
    getPageDeviceProfileField: (current_page: number, size_page: number, device_profile: number) => Promise<void>,
    getDeviceProfileField: (deviceProfileFieldid: number) => Promise<void>,
    updateDeviceProfileField: (deviceProfileField: TDeviceProfileField) => Promise<void>
}

interface IDeviceProfileContainer extends IMapStateToProps, IMapDispatchToProps {

}

class DeviceProfileContainer extends React.Component<IDeviceProfileContainer> {
    componentDidMount() {
        this.props.isAuth && this.props.getPageDeviceProfile(this.props.deviceProfile.current_page, this.props.deviceProfile.size_page);
    };

    deviceProfile = {
        delete: (id: number): void => {
            this.props.delDeviceProfile(id);
        },
        add: (value: TDeviceProfile): void => {
            this.props.addDeviceProfile(value);
        },
        update: (value: TDeviceProfile): void => {
            this.props.updateDeviceProfile(value);
        },
        onClickPage: (page: number): void => {
            this.props.getPageDeviceProfile(page, this.props.deviceProfile.size_page);
        },
        onClickRow: (id: number): void => {
            this.props.getDeviceProfile(id);
            this.props.getPageDeviceProfileField(this.props.deviceProfileField.current_page, this.props.deviceProfileField.size_page, id)
            //this.props.history.push(`/DeviceAdd/${id}/`);
        }
    };
    deviceProfileField = {
        delete: (id: number): void => {
            this.props.delDeviceProfileField(id);
        },
        add: (value: TDeviceProfileField): void => {
            this.props.addDeviceProfileField(value);
        },
        update: (value: TDeviceProfileField): void => {
            this.props.updateDeviceProfileField(value);
        },
        onClickPage: (page: number): void => {
            this.props.getPageDeviceProfileField(page, this.props.deviceProfileField.size_page, this.props.deviceProfile.current_value.id as number);
        },
        onClickRow: (id: number): void => {
            this.props.getDeviceProfileField(id);
            //this.props.history.push(`/DeviceAdd/${id}/`);
        }
    };

    render() {
        return (
            <Row>
                <Col span={10}>
                    <Divider orientation="left">Профиль</Divider>
                    <DeviceProfileForm deviceProfile={this.props.deviceProfile.current_value}
                                       update={this.deviceProfile.update}
                                       add={this.deviceProfile.add}
                                       delete={this.deviceProfile.delete}/>
                    <DeviceProfileList size_page={this.props.deviceProfile.size_page}
                                       count={this.props.deviceProfile.count}
                                       current_page={this.props.deviceProfile.current_page}
                                       current_value={this.props.deviceProfile.current_value}
                                       isLoadList={this.props.deviceProfile.isLoadList}
                                       report={this.props.deviceProfile.report}
                                       page={this.props.deviceProfile.page}
                                       onClickPage={this.deviceProfile.onClickPage}
                                       onClickRow={this.deviceProfile.onClickRow}
                                       onDelete={this.deviceProfile.delete}
                    />
                </Col>
                {this.props.deviceProfile.current_value.id &&
                <Col span={10} offset={2}>
                    <Divider orientation="left">Параметры профиля "{this.props.deviceProfile.current_value.name}"</Divider>
                    <DeviceProfileFieldForm deviceProfileField={this.props.deviceProfileField.current_value}
                                            deviceProfile={this.props.deviceProfile.current_value.id}
                                            update={this.deviceProfileField.update}
                                            add={this.deviceProfileField.add}
                                            delete={this.deviceProfileField.delete}/>
                    <DeviceProfileFieldList size_page={this.props.deviceProfileField.size_page}
                                            count={this.props.deviceProfileField.count}
                                            current_page={this.props.deviceProfileField.current_page}
                                            current_value={this.props.deviceProfileField.current_value}
                                            isLoadList={this.props.deviceProfileField.isLoadList}
                                            report={this.props.deviceProfileField.report}
                                            page={this.props.deviceProfileField.page}
                                            onClickPage={this.deviceProfileField.onClickPage}
                                            onClickRow={this.deviceProfileField.onClickRow}
                                            onDelete={this.deviceProfileField.delete}
                    />
                </Col>
                }
            </Row>

        )
    }
}

const MapStateToProps = (state: TState) => {
    return {
        deviceProfile: {
            size_page: state.deviceProfile.itemsDeviceProfile.size_page,
            count: state.deviceProfile.itemsDeviceProfile.count,
            current_page: state.deviceProfile.itemsDeviceProfile.current_page,
            current_value: state.deviceProfile.itemsDeviceProfile.current_value,
            isLoadList: state.deviceProfile.itemsDeviceProfile.isLoadList,
            report: state.deviceProfile.itemsDeviceProfile.report,
            page: state.deviceProfile.itemsDeviceProfile.page
        },
        deviceProfileField: {
            size_page: state.deviceProfile.itemsDeviceProfileField.size_page,
            count: state.deviceProfile.itemsDeviceProfileField.count,
            current_page: state.deviceProfile.itemsDeviceProfileField.current_page,
            current_value: state.deviceProfile.itemsDeviceProfileField.current_value,
            isLoadList: state.deviceProfile.itemsDeviceProfileField.isLoadList,
            report: state.deviceProfile.itemsDeviceProfileField.report,
            page: state.deviceProfile.itemsDeviceProfileField.page
        },
        isAuth: state.auth.name !== ""
    }
};

export default compose(connect(MapStateToProps, {
    addDeviceProfile,
    delDeviceProfile,
    getPageDeviceProfile,
    getDeviceProfile,
    updateDeviceProfile,
    addDeviceProfileField,
    delDeviceProfileField,
    getPageDeviceProfileField,
    getDeviceProfileField,
    updateDeviceProfileField,
}), withAuthRedirect)(DeviceProfileContainer);