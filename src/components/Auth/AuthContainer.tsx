import React from 'react'
import {connect} from "react-redux";
import {AuthForm} from "./AuthForm";
import {login} from "../../store/reducers/AuthReducer";
import {compose} from "redux";
import {TState} from "../../store/store";

interface IMapStateToProps {
    name: string | null,
    isLoad: boolean
}

interface TMapDispatchToProps {
    login: (name: string, password: string) => Promise<void>
}

interface IAuthContainer extends IMapStateToProps, TMapDispatchToProps {
}

class AuthContainer extends React.Component<IAuthContainer> {
    render = () => {
        return (
            <div>
                <AuthForm submitLogin={this.props.login}
                          isLoad={this.props.isLoad}
                />
            </div>
        )
    }
}

let mapStateToProps = (store: TState) => {
    return {
        name: store.auth.name,
        isLoad: store.auth.isLoad
    }
};

export default compose(connect(mapStateToProps, {login}))(AuthContainer);
