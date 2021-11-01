import {ApiResultCode, NO, TApiReport, TGetListOvd, TOvd, TReturnOvd} from "../../api/type";
import {initializedApp} from "./AppReducer";
import {ovdAPI} from "../../api/api";
import {reducer_log} from "../common/logger";
const reducerName = "OvdReducer";

export const actions = {
    'setIsLoadListOvd': (flag: boolean) => {
        return {
            type: '/OVD/SET_IS_LOAD_LIST/', flag
        } as const
    },
    'setApiReportOvd': (report: TApiReport) => {
        return {
            type: '/OVD/SET_API_REPORT/', report
        } as const
    },
    'setListOvd': (ovd: Array<TOvd>, count: number, size_page: number, current_page: number) => {
        return {
            type: '/OVD/ADD_LIST/', ovd, count, size_page, current_page
        } as const
    },
    'setAllListOvd': (ovd: Array<TOvd>) => {
        return {
            type: '/OVD/ADD_ALL_LIST/', ovd
        } as const
    },
    'setCurrentValueOvd': (device_profile: TOvd) => {
        return {type: '/OVD/ADD_CURRENT_VALUE/', device_profile} as const
    }
};

const initialState = {
    itemsOvd:
        {
            page: [] as Array<TOvd>,
            allItems: [] as Array<TOvd>,
            current_value: {
                id: undefined,
                name_abbreviation:"",
                name_full:""
            } as TOvd,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 7,
            current_page: 1,
            isLoadList: false
        }
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const OvdReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/OVD/SET_IS_LOAD_LIST/': {
            return {...state, itemsOvd: {...state.itemsOvd, isLoadList: action.flag}};
        }
        case '/OVD/SET_API_REPORT/': {
            return {...state, itemsOvd: {...state.itemsOvd, report: action.report}}
        }
        case '/OVD/ADD_CURRENT_VALUE/': {
            return {...state, itemsOvd: {...state.itemsOvd, current_value: action.device_profile}}
        }
        case '/OVD/ADD_LIST/': {
            return {
                ...state,
                itemsOvd: {
                    ...state.itemsOvd,
                    page: action.ovd,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case '/OVD/ADD_ALL_LIST/': {
            return {
                ...state,
                itemsOvd: {
                    ...state.itemsOvd,
                    allItems: action.ovd
                }
            }
        }
        default: {
            return state;
        }
    }
};

export const getPageOvd = (current_page: number, size_page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListOvd(false));
            let data: TGetListOvd = await ovdAPI.getList(current_page, size_page) as TGetListOvd;
            dispatch(actions.setApiReportOvd(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setListOvd(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListOvd(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListOvd(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListOvd(true));
            reducer_log(`${reducerName}.getPageOvd`, {}, error);
        }
    }
};

export const getAllOvd = () => {
    return async (dispatch: any) => {
        try {
            let data: TGetListOvd = await ovdAPI.getList(0, 0) as TGetListOvd;
            dispatch(actions.setApiReportOvd(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setAllListOvd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListOvd(true));
            reducer_log(`${reducerName}.getPageOvd`, {}, error);
        }
    }
};

export const addOvd = (ovd: TOvd) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnOvd = await ovdAPI.add(ovd) as TReturnOvd;
            dispatch(actions.setApiReportOvd(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValueOvd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageOvd(
                getState().ovd.itemsOvd.current_page, getState().ovd.itemsOvd.size_page));
        } catch (error) {
            reducer_log(`${reducerName}:addOvd`, ovd, error);
        }
    }
};

export const delOvd = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnOvd = await ovdAPI.del(id);
            dispatch(actions.setApiReportOvd(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                const ovdClear: TOvd = {
                    id: undefined,
                    name_abbreviation:"",
                    name_full:""
                };
                dispatch(actions.setCurrentValueOvd(ovdClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageOvd(
                getState().ovd.itemsOvd.current_page, getState().ovd.itemsOvd.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.delOvd`, {Ovd_id: id}, error);
        }
    }
};


export const getOvd = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnOvd = await ovdAPI.get(id);
            dispatch(actions.setApiReportOvd(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValueOvd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}.getOvd`, {Ovd_id: id}, error);
        }
    }
};

export const updateOvd = (ovd: TOvd) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnOvd = await ovdAPI.update(ovd);
            dispatch(actions.setApiReportOvd(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValueOvd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageOvd(
                getState().ovd.itemsOvd.current_page, getState().ovd.itemsOvd.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.updateOvd`, ovd, error);
        }
    }
};