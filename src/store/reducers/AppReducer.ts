import {authVerify, getAuthCookies} from "./AuthReducer";
import {all} from "q";
import {reducer_log} from '../common/logger'
import {getAllDeviceProfile} from "./DeviceProfileReduer";
import {getAllOvd} from "./OvdReduer";
import {getAllVipNetType} from "./VipNetReducer";

export const contents = {
    HOME: 'HOME' as const,
    AUTH: 'AUTH' as const,
    ADD: 'ADD' as const,
    OVD: 'OVD' as const,
    DEPARTMENT: 'DEPARTMENT' as const,
    REPORT_CONFIGURATION: 'REPORT_CONFIGURATION' as const,
    DEVICE_PROFILE: 'DEVICE_PROFILE' as const,
    PC: 'PC' as const,
    VIPNET: 'VIPNET' as const
};
type InferValuesContentType<T> = T extends { [key: string]: infer U } ? U : never;
export type TContents = InferValuesContentType<typeof contents>

export const actions = {
    'set_content': (content: TContents) => {
        return {
            type: '/APP/SET_CONTENT/', content
        } as const
    },
    'set_initialized': (initialized: boolean) => {
        return {
            type: '/APP/INITIALIZED/', initialized
        } as const
    }
};

const initialState = {
    initialized: false,
    content: contents.HOME as TContents
};
type TState = typeof initialState
//export type TActions = ReturnType<InferValuesType<typeof actions>>
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
//export type TActionsCreator = InferValuesType<typeof actions>
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const AppReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/APP/SET_CONTENT/': {
            return {...state, content: action.content}
        }
        case '/APP/INITIALIZED/': {
            return {...state, initialized: action.initialized}
        }
        default:
            return {...state};
    }
};

export const initializedApp = () => {
    return async (dispatch: any, getState: any) => {
        const auth_data = getState().auth.token
            ? {name: getState().auth.name, token: getState().auth.token}
            : getAuthCookies();
        try {
            await all<any>([dispatch(authVerify(auth_data.name, auth_data.token))]);
            const token: string = getState().auth.token;
            try {
                if (token) {
                    await all<any>([dispatch(getAllDeviceProfile()),dispatch(getAllOvd()),dispatch(getAllVipNetType())]);
                    dispatch(actions.set_initialized(true));
                    return dispatch(actions.set_content(contents.HOME))
                }
            } catch (error) {
                reducer_log("InitializedApp.initializedApp", {}, error);
            }
        } catch (error) {
            reducer_log("InitializedApp.initializedApp", {}, error);
        }

    }
};