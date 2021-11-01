import React from "react";
import {Result} from "antd";

interface IMapStateToProps {
    isAuth: boolean
}
interface  IWithAuthRedirect extends IMapStateToProps{}

export function withAuthRedirect<T extends IWithAuthRedirect>(Child: React.ComponentType<T>){
    return class extends React.Component<T, {}> {
        render() {
            if (!this.props.isAuth) return <Result
                status="error"
                title="В доступе отказано"
                subTitle="Пожалуйста авторизуйтесь в системе."
                />;
            return <Child {...this.props}/>
        }
    }
}