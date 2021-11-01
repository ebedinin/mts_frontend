import {authAPI} from "../../api/api";
import {stopSubmit} from 'redux-form'
import Cookies from 'js-cookie';
import {actions as actionsAuth, contents} from "./AppReducer";
import {all} from "q";

const COOKIES_NAME = '/AUTH/COOKIES_AUTH/';


export const actions = {
    'set': (name: string, token: string) => {
        return {
            type: '/AUTH/SET_AUTH/', name, token
        } as const
    },
    'setToken': (token: string) => {
        return {
            type: '/AUTH/SET_TOKEN_AUTH/', token
        } as const
    },
    'setIsLoad': (flag: boolean) => {
        return {
            type: '/AUTH/SET_LOAD/', flag
        } as const
    }
};

const initialState = {
    name: "" as string,
    token: "" as string,
    isLoad: true
};
type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const AuthReducer = (state = initialState, action: TAction):TState => {
    switch (action.type) {
        case '/AUTH/SET_AUTH/': {
            return {...state, name: action.name, token: action.token}
        }
        case '/AUTH/SET_TOKEN_AUTH/': {
            return {...state, token: action.token}
        }
        case '/AUTH/SET_LOAD/': {
            return {...state, isLoad: action.flag}
        }
        default:
            return {...state};
    }
};
export const login = (name: string, password: string) => {
    return async (dispatch:any, getState:any) => {
        dispatch(actions.setIsLoad(false));
        try {
            let data = await authAPI.auth(name, password);
            dispatch(actions.setIsLoad(true));
            dispatch(actions.set(name, data.token));
            setAuthCookies(name, data.token);
            authAPI.setToken(data.token);
            dispatch(actionsAuth.set_content(contents.HOME))
        }
        catch (error) {
            dispatch(actions.setIsLoad(true));
            if (error.response) {
                if (error.response.status === 400) {
                    dispatch(stopSubmit('auth', {_error: "Неверный логин или пароль"}));
                }
            }
            else {
                alert("Сервер REST недоступен");
            }
        }
    }
};
export const authVerify = (name:string, token:string) => {
    return async (dispatch:any, getState:any) => {
        dispatch(actions.setIsLoad(false));
        try {
            await all<any>([authAPI.authVerify(token)]);
            authAPI.setToken(token);
            dispatch(actions.setIsLoad(true));
            dispatch(actions.set(name, token));
            dispatch(actionsAuth.set_content(contents.HOME))
        }
        catch (error) {
            dispatch(actions.setIsLoad(true));
            if (error.response) {
                if (error.response.status === 400) {
                    setAuthCookies("", "");
                    dispatch(actions.set("", ""));
                    authAPI.setToken("");
                }
            }
            else {
                alert("Сервер REST недоступен");
            }
        }
    }
};

export const logout = () => {
    return async (dispatch:any, getState:any) => {
        setAuthCookies("", "");
        dispatch(actions.set("", ""));
        authAPI.setToken("");
    }
};

export const getAuthCookies = () => {
    const strCookiesAuth = Cookies.get(COOKIES_NAME);
    const cookiesAuth = strCookiesAuth && JSON.parse(strCookiesAuth);
    return cookiesAuth ? cookiesAuth : {name: "", token: ""};
};

export const setAuthCookies = (name:string, token:string) => {
    Cookies.set(COOKIES_NAME, {name: name, token: token});
};
