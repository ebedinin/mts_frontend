import React from 'react';
import {Button, Col, Row} from "antd";
import {LoginOutlined, LogoutOutlined} from '@ant-design/icons'

import Menu from "../../components/menu/Menu";
import {compose} from "redux";
import {connect} from "react-redux";
import {TState} from "../../store/store";
import {actions as actionsApp, contents, TContents} from "../../store/reducers/AppReducer";
import {logout} from "../../store/reducers/AuthReducer";

interface IMapStateToProps {
    isAuth?: boolean
}

interface IMapDispatchToProps {
    set_content?: typeof actionsApp.set_content
    logout: ()=> Promise<void>
}

interface IHeader extends IMapStateToProps, IMapDispatchToProps {

}

const Header: React.FC<IHeader> = (props) => {
    let label = "Выйти";
    let Icon = LogoutOutlined;
    let content : TContents = contents.HOME;
    if (props.set_content) {
        content = contents.HOME;
        if (props.isAuth) {
            label = "Выйти";
            Icon = LogoutOutlined;
            content = contents.HOME;
        }
        else {
            label = "Войти";
            Icon = LoginOutlined;
            content = contents.AUTH;
        }
    }
    return <>
        <Row justify="space-between">
            <Col span={23}>
                <Menu/>
            </Col>
            <Col span={1}>
                <Button type="link" icon={<Icon/>} onClick={!props.isAuth ?
                    () => props.set_content&&props.set_content(content) :
                    ()=> props.logout()}>
                    {label}
                </Button>
            </Col>
        </Row>
    </>
};
const MapStateToProps = (state: TState) => {
    return {
        isAuth: !!state.auth.name && state.auth.name!==""
    }
};
export default compose(connect(MapStateToProps, {set_content: actionsApp.set_content,logout}))(Header)