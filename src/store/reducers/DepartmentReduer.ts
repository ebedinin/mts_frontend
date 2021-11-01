//##########Константы##########
import {ApiResultCode, NO, TApiReport, TDepartment, TGetListDepartment, TReturnDepartment} from "../../api/type";
import {initializedApp} from "./AppReducer";
import {departmentAPI} from "../../api/api";
import {reducer_log} from "../common/logger";
import {getAllOvd} from "./OvdReduer";

const API = departmentAPI;
type TEntity = TDepartment;
type TGetList = TGetListDepartment;
type TReturn = TReturnDepartment;

const reducerName = "DepartmentReducer";

export const actions = {
    'setIsLoadList': (flag: boolean) => {
        return {
            type: `/DEPARTMENT/SET_IS_LOAD_LIST/`, flag
        } as const
    },
    'setApiReport': (report: TApiReport) => {
        return {
            type: `/DEPARTMENT/SET_API_REPORT/`, report
        } as const
    },
    'setList': (entity: Array<TEntity>, count: number, size_page: number, current_page: number) => {
        return {
            type: `/DEPARTMENT/ADD_LIST/`, entity, count, size_page, current_page
        } as const
    },
    'setAllList': (entities: Array<TEntity>) => {
        return {
            type: `/DEPARTMENT/ADD_ALL_LIST/`, entities
        } as const
    },
    'setCurrentValue': (entity: TEntity) => {
        return {type: `/DEPARTMENT/SET_CURRENT_VALUE/`, entity} as const
    }
};

const initialState = {
    itemsEntity:
        {
            page: [] as Array<TEntity>,
            allItems: [] as Array<TEntity>,
            current_value: {
                id: undefined,
                name_abbreviation:"",
                name_full:""
            } as TEntity,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 6,
            current_page: 1,
            isLoadList: false
        }
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const DepartmentReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case `/DEPARTMENT/SET_IS_LOAD_LIST/`: {
            return {...state, itemsEntity: {...state.itemsEntity, isLoadList: action.flag}};
        }
        case `/DEPARTMENT/SET_API_REPORT/`: {
            return {...state, itemsEntity: {...state.itemsEntity, report: action.report}}
        }
        case `/DEPARTMENT/SET_CURRENT_VALUE/`: {
            return {...state, itemsEntity: {...state.itemsEntity, current_value: action.entity}}
        }
        case `/DEPARTMENT/ADD_LIST/`: {
            return {
                ...state,
                itemsEntity: {
                    ...state.itemsEntity,
                    page: action.entity,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case `/DEPARTMENT/ADD_ALL_LIST/`: {
            return {
                ...state,
                itemsEntity: {
                    ...state.itemsEntity,
                    allItems: action.entities
                }
            }
        }
        default: {
            return state;
        }
    }
};

export const getPage = (current_page: number, size_page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadList(false));
            let data: TGetList = await API.getList(current_page, size_page) as TGetList;
            dispatch(actions.setApiReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setList(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadList(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadList(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadList(true));
            reducer_log(`${reducerName}.getPage`, {}, error);
        }
    }
};

export const getAll = () => {
    return async (dispatch: any) => {
        try {
            let data: TGetList = await API.getList(0, 0) as TGetList;
            dispatch(actions.setApiReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setAllList(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadList(true));
            reducer_log(`${reducerName}.getPage`, {}, error);
        }
    }
};

export const add = (entity: TEntity) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturn = await API.add(entity) as TReturn;
            dispatch(actions.setApiReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValue(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPage(
                getState().department.itemsEntity.current_page, getState().department.itemsEntity.size_page));
        } catch (error) {
            reducer_log(`${reducerName}:add`, entity, error);
        }
    }
};

export const del = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturn = await API.del(id);
            dispatch(actions.setApiReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                const Clear: TEntity = {
                    id: undefined,
                    name_abbreviation:"",
                    name_full:"",
                    ovd:[]
                };
                dispatch(actions.setCurrentValue(Clear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPage(
                getState().department.itemsEntity.current_page, getState().department.itemsEntity.size_page));
        } catch (error) {
            reducer_log(`${reducerName}:del`, {id}, error);
        }
    }
};


export const get = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturn = await API.get(id);
            dispatch(actions.setApiReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(getAllOvd());
                dispatch(actions.setCurrentValue(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}:get`, {id}, error);
        }
    }
};

export const update = (entity: TEntity) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturn = await API.update(entity);
            dispatch(actions.setApiReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValue(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPage(
                getState().department.itemsEntity.current_page, getState().department.itemsEntity.size_page));
        } catch (error) {
            reducer_log(`${reducerName}:update`, entity, error);
        }
    }
};