//##########Константы##########
import {
    ApiResultCode,
    NO,
    TApiReport,
    TGetListVipNet,
    TGetListVipnetType,
    TPc,
    TReturnVipNet,
    TVipNet,
    TVipnetFilter,
    TVipnetType
} from "../../api/type";
import {initializedApp} from "./AppReducer";
import {vipnetAPI} from "../../api/api";
import {reducer_log} from "../common/logger";
import {all} from "q";
import {searchPc} from "./PCReducer";

const reducerName = "VipNetReducer";

export const actions = {
    'setIsLoadListVipNet': (flag: boolean) => {
        return {
            type: '/VIPNET/SET_IS_LOAD_LIST/', flag
        } as const
    },
    'setApiReportVipNet': (report: TApiReport) => {
        return {
            type: '/VIPNET/SET_API_REPORT/', report
        } as const
    },
    'setListVipNet': (vipnet: Array<TVipNet>, count: number, size_page: number, current_page: number) => {
        return {
            type: '/VIPNET/ADD_LIST/', vipnet, count, size_page, current_page
        } as const
    },
    'setAllListVipNet': (vipnet: Array<TVipNet>) => {
        return {
            type: '/VIPNET/ADD_ALL_LIST/', vipnet
        } as const
    },
    'setAllListVipNetType': (vipnettype: Array<TVipnetType>) => {
        return {
            type: '/VIPNET/TYPE/ADD_ALL_LIST/', vipnettype
        } as const
    },
    'setCurrentValueVipNet': (device_profile: TVipNet) => {
        return {type: '/VIPNET/ADD_CURRENT_VALUE/', device_profile} as const
    },
    'setPcSearch': (pc: Array<TPc>) => {
        return {type: '/VIPNET/ADD_SEARCH_PC_LIST/', pc} as const
    },
    'setFilter': (filter: TVipnetFilter) => {
        return {type: '/VIPNET/SET_FILTER/', filter} as const
    }
};

const initialState = {
    itemsVipNet:
        {
            page: [] as Array<TVipNet>,
            allItems: [] as Array<TVipNet>,
            current_value: {
                id: undefined,
                identifier: "",
                name: "",
                date_create: "",
                date_remove: "",
                ip_real: "",
                ip_virtual: "",
                pc: null,
                last_date_locked: null,
                vipnet_type: null,
                isLocked: false
            } as TVipNet,
            pc: [] as Array<TPc>,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 20,
            current_page: 1,
            isLoadList: false
        },
    itemsVipNetType: {
        allItems: [] as Array<TVipnetType>
    },
    filter: {
        isUseFilter: false,
        search: "",
        isLocked: false,
        isServices: false,
        vipnet_type: null
    } as TVipnetFilter
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const VipNetReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/VIPNET/SET_IS_LOAD_LIST/': {
            return {...state, itemsVipNet: {...state.itemsVipNet, isLoadList: action.flag}};
        }
        case '/VIPNET/SET_API_REPORT/': {
            return {...state, itemsVipNet: {...state.itemsVipNet, report: action.report}}
        }
        case '/VIPNET/ADD_CURRENT_VALUE/': {
            return {...state, itemsVipNet: {...state.itemsVipNet, current_value: action.device_profile}}
        }
        case '/VIPNET/ADD_LIST/': {
            return {
                ...state,
                itemsVipNet: {
                    ...state.itemsVipNet,
                    page: action.vipnet,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case '/VIPNET/ADD_ALL_LIST/': {
            return {
                ...state,
                itemsVipNet: {
                    ...state.itemsVipNet,
                    allItems: action.vipnet
                }
            }
        }
        case '/VIPNET/TYPE/ADD_ALL_LIST/': {
            return {
                ...state,
                itemsVipNetType: {
                    ...state.itemsVipNetType,
                    allItems: action.vipnettype
                }
            }
        }
        case "/VIPNET/ADD_SEARCH_PC_LIST/": {
            return {
                ...state,
                itemsVipNet: {
                    ...state.itemsVipNet,
                    pc: action.pc
                }
            }
        }
        case "/VIPNET/SET_FILTER/": {
            return {
                ...state,
                filter: action.filter
            }
        }
        default: {
            return state;
        }
    }
};

export const getPageVipNet = (current_page: number, size_page: number, vipnet_filter: TVipnetFilter= {isUseFilter: false,
    search: "",
    isLocked: false,
    isServices: false,
    vipnet_type:  null}) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListVipNet(false));
            dispatch(actions.setFilter(vipnet_filter));
            let data: TGetListVipNet = await vipnetAPI.getListFilter(current_page, size_page,vipnet_filter) as TGetListVipNet;
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setListVipNet(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListVipNet(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListVipNet(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListVipNet(true));
            reducer_log(`${reducerName}.getPageVipNet`, {}, error);
        }
    }
};

export const getAllVipNet = () => {
    return async (dispatch: any) => {
        try {
            let data: TGetListVipNet = await vipnetAPI.getList(0, 0) as TGetListVipNet;
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setAllListVipNet(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListVipNet(true));
            reducer_log(`${reducerName}.getPageVipNet`, {}, error);
        }
    }
};

export const getAllVipNetType = () => {
    return async (dispatch: any) => {
        try {
            let data: TGetListVipnetType = await vipnetAPI.getAllTypeList(0, 0) as TGetListVipnetType;
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setAllListVipNetType(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListVipNet(true));
            reducer_log(`${reducerName}.getAllVipNetType`, {}, error);
        }
    }
};

export const addVipNet = (vipnet: TVipNet) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnVipNet = await vipnetAPI.add(vipnet) as TReturnVipNet;
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValueVipNet(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageVipNet(
                getState().vipnet.itemsVipNet.current_page, getState().vipnet.itemsVipNet.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.addVipNet`, vipnet, error);
        }
    }
};

export const delVipNet = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnVipNet = await vipnetAPI.del(id);
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                const VipNetClear: TVipNet = {
                    id: undefined,
                    identifier: "",
                    name: "",
                    date_create: "",
                    date_remove: "",
                    ip_real: "",
                    ip_virtual: "",
                    pc: null,
                    last_date_locked: null,
                    vipnet_type: null,
                    isLocked: false
                };
                dispatch(actions.setCurrentValueVipNet(VipNetClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageVipNet(
                getState().vipnet.itemsVipNet.current_page, getState().vipnet.itemsVipNet.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.delVipNet`, {VipNet_id: id}, error);
        }
    }
};


export const getVipNet = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnVipNet = await vipnetAPI.get(id);
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                if (data.data) {
                    all<any>([dispatch(searchPc(data.data.pc ? data.data.pc.inventory_number : ""))]);
                    dispatch(actions.setCurrentValueVipNet(data.data));
                }
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}.getVipNet`, {VipNet_id: id}, error);
        }
    }
};

export const updateVipNet = (vipnet: TVipNet) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnVipNet = await vipnetAPI.update(vipnet);
            dispatch(actions.setApiReportVipNet(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValueVipNet(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageVipNet(
                getState().vipnet.itemsVipNet.current_page, getState().vipnet.itemsVipNet.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.updateVipNet`, vipnet, error);
        }
    }
};