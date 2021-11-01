import React, {useEffect} from 'react';
import './App.css';

import {Layout} from "antd";
import HeaderMts from "./components/Header/Header";
import {compose} from "redux";
import {connect} from "react-redux";
import {TState} from "./store/store";
import {contents, initializedApp, TContents} from "./store/reducers/AppReducer";
import AuthContainer from "./components/Auth/AuthContainer";
import DeviceAddContainer from "./components/Device/DeviceAdd/DeviceAddContainer";
import DeviceProfileContainer from "./components/Directory/DeviceProfile/DeviceProfileContainer";
import ReportContainer from "./components/Directory/Report/ReportContainer";
import OvdContainer from "./components/Directory/Ovd/OvdContainer";
import DepartmentContainer from "./components/Directory/Department/DepartmentContainer";
import Home from "./components/Home/Home";
import PcContainer from "./components/Device/Pc/PcContainer";
import VipNetContainer from "./components/VipNet/VipNetContainer";

const {Header, Content, Footer} = Layout;

interface IMapStateToProps {
    content: TContents,
    initialized: boolean
}

interface IMapDispatchToProps {
    initializedApp: () => Promise<void>;
}

interface IApp extends IMapStateToProps, IMapDispatchToProps {

}

const App: React.FC<IApp> = (props) => {
    let CurrentContent: any;
    switch (props.content) {
        case contents.AUTH: {
            CurrentContent = AuthContainer;
            break;
        }
        case contents.ADD: {
            CurrentContent = DeviceAddContainer;
            break;
        }
        case contents.DEVICE_PROFILE: {
            CurrentContent = DeviceProfileContainer;
            break;
        }
        case contents.REPORT_CONFIGURATION: {
            CurrentContent = ReportContainer;
            break;
        }
        case contents.OVD: {
            CurrentContent = OvdContainer;
            break;
        }
        case contents.DEPARTMENT: {
            CurrentContent = DepartmentContainer;
            break;
        }
        case contents.PC: {
            CurrentContent = PcContainer;
            break;
        }
        case contents.VIPNET: {
            CurrentContent = VipNetContainer;
            break;
        }
        default: {
            CurrentContent = Home;
            //CurrentContent = Home;
        }

    }
    useEffect(() => {
        if (!props.initialized) {
            props.initializedApp()
        }
    });
    return (
        <Layout>
            <Header>
                <HeaderMts/>
            </Header>
            <Content>
                <CurrentContent/>
            </Content>
            <Footer>footer</Footer>
        </Layout>
    );
};

const MapStateToProps = (state: TState) => {
    return {
        content: state.app.content,
        initialized: state.app.initialized
    }
};
export default compose(
    connect(MapStateToProps, {initializedApp})
)(App)

