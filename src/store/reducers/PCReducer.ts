//##########Константы##########

import {ApiResultCode, IS_APPLY, IS_NOT_APPLY, NO, TApiReport, TGetListPc, TPc, TReturnPc} from "../../api/type";
import {pcAPI} from "../../api/api";
import {initializedApp} from "./AppReducer";
import {reducer_log} from "../common/logger";
const reducerName = "DepartmentReducer";

export const actions = {
    'setIsLoadListPC': (flag: boolean) => {
        return {type: '/DEVICE/SET_IS_LOAD_LIST_PC', flag} as const
    },
    'setIsLoadSearchPC': (flag: boolean) => {
        return {type: '/DEVICE/SET_IS_LOAD_SEARCH_PC', flag} as const
    },
    'setApiReportPC': (report: TApiReport) => {
        return {type: '/DEVICE/SET_API_REPORT_PC', report} as const
    },
    'setListPC': (pc: Array<TPc>, count: number, size_page: number, current_page: number) => {
        return {type: '/DEVICE/ADD_LIST_PC', pc, count, size_page, current_page} as const
    },
    'setCurrentValuePC': (device: TPc) => {
        return {type: '/DEVICE/ADD_CURRENT_VALUE_PC', device} as const
    },
    'setSearchPC': (device: Array<TPc>) => {
        return {type: '/DEVICE/ADD_LIST_SEARCH_PC', device} as const
    }
};

const initialState = {
    itemsPc:
        {
            page: [] as Array<TPc>,
            current_value: {} as TPc,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 12,
            current_page: 1,
            isLoadList: false
        },
    searchPc:
        {
            list: [] as Array<TPc>,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            isLoadList: false
        },
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const PcReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/DEVICE/SET_IS_LOAD_LIST_PC': {
            return {...state, itemsPc: {...state.itemsPc, isLoadList: action.flag}};
        }
        case '/DEVICE/SET_IS_LOAD_SEARCH_PC': {
            return {...state, searchPc: {...state.searchPc, isLoadList: action.flag}};
        }
        case '/DEVICE/SET_API_REPORT_PC': {
            return {...state, itemsPc: {...state.itemsPc, report: action.report}}
        }
        case '/DEVICE/ADD_CURRENT_VALUE_PC': {
            return {...state, itemsPc: {...state.itemsPc, current_value: action.device}}
        }
        case '/DEVICE/ADD_LIST_PC': {
            return {
                ...state,
                itemsPc: {
                    ...state.itemsPc,
                    page: action.pc,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case '/DEVICE/ADD_LIST_SEARCH_PC': {
            return {
                ...state,
                searchPc: {
                    ...state.searchPc,
                    list: action.device
                }
            }
        }
        default: {
            return state;
        }
    }
};

export const getPagePc = (current_page: number, size_page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListPC(false));
            let data: TGetListPc = await pcAPI.getList(current_page, size_page);
            dispatch(actions.setApiReportPC(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setListPC(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListPC(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListPC(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListPC(true));
            reducer_log(`${reducerName}.getListPC`, {}, error);
        }
    }
};

export const searchPc = (value: string) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadSearchPC(false));
            let param = new Map<string, string>();
            param.set("inventory_number", value);
            let data: TGetListPc = await pcAPI.search(param);
            dispatch(actions.setApiReportPC(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setSearchPC(data.data));
                dispatch(actions.setIsLoadSearchPC(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadSearchPC(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadSearchPC(true));
            reducer_log(`${reducerName}.searchPc`, {}, error);
    }
    }
};

export const getPc = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnPc = await pcAPI.get(id);
            dispatch(actions.setApiReportPC(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValuePC(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}.get`, {device_id: id}, error);
        }
    }
};
export const updatePc = (device: TPc) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnPc = await pcAPI.update(device);
            dispatch(actions.setApiReportPC(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValuePC(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPagePc(
                getState().pc.itemsPc.current_page, getState().pc.itemsPc.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.updatePc`, device, error);
        }
    }
};
export const applyPc = (id: number, flag: boolean) => {
    return async (dispatch: any, getState: any) => {
        let device: TPc = getState().pc.itemsPc.page.filter((pc: TPc) => pc.id===id)[0];
        device.status = flag?IS_APPLY:IS_NOT_APPLY;
        dispatch(updatePc(device));
    }
};