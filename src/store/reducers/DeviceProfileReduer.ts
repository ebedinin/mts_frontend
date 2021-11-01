//##########Константы##########
import {
    ApiResultCode,
    NO,
    TApiReport,
    TDeviceProfile,
    TDeviceProfileField,
    TGetListDeviceProfile, TGetListDeviceProfileField,
    TReturnDeviceProfile, TReturnDeviceProfileField
} from "../../api/type";
import {initializedApp} from "./AppReducer";
import {deviceProfileAPI, deviceProfileFieldAPI} from "../../api/api";
import {reducer_log} from "../common/logger";


export const actions = {
    'setIsLoadListDeviceProfile': (flag: boolean) => {
        return {
            type: '/DEVICE/PROFILE/SET_IS_LOAD_LIST/', flag
        } as const
    },
    'setApiReportDeviceProfile': (report: TApiReport) => {
        return {
            type: '/DEVICE/PROFILE/SET_API_REPORT/', report
        } as const
    },
    'setListDeviceProfile': (device_profiles: Array<TDeviceProfile>, count: number, size_page: number, current_page: number) => {
        return {
            type: '/DEVICE/PROFILE/ADD_LIST/', device_profiles, count, size_page, current_page
        } as const
    },
    'setAllListDeviceProfile': (device_profiles: Array<TDeviceProfile>) => {
        return {
            type: '/DEVICE/PROFILE/ADD_ALL_LIST/', device_profiles
        } as const
    },
    'setCurrentValueDeviceProfile': (device_profile: TDeviceProfile) => {
        return {type: '/DEVICE/PROFILE/ADD_CURRENT_VALUE/', device_profile} as const
    },
    'setIsLoadListDeviceProfileField': (flag: boolean) => {
        return {type: '/DEVICE/PROFILE/FIELD/SET_IS_LOAD_LIST/', flag} as const
    },
    'setApiReportDeviceProfileField': (report: TApiReport) => {
        return {type: '/DEVICE/PROFILE/FIELD/SET_API_REPORT/', report} as const
    },
    'setListDeviceProfileField': (device_profile_fields: Array<TDeviceProfileField>, count: number, size_page: number, current_page: number) => {
        return {type: '/DEVICE/PROFILE/FIELD/ADD_LIST/', device_profile_fields, count, size_page, current_page} as const
    },
    'setCustomListDeviceProfileField': (device_profile_fields: Array<TDeviceProfileField>) => {
        return {type: '/DEVICE/PROFILE/FIELD/ADD_CUSTOM_LIST/', device_profile_fields} as const
    },
    'setCurrentValueDeviceProfileField': (device_profile_field: TDeviceProfileField) => {
        return {type: '/DEVICE/PROFILE/FIELD/ADD_CURRENT_VALUE/', device_profile_field} as const
    }
};

const initialState = {
    itemsDeviceProfile:
        {
            page: [] as Array<TDeviceProfile>,
            allItems: [] as Array<TDeviceProfile>,
            current_value: {
                id: undefined,
                name: ""
            } as TDeviceProfile,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 3,
            current_page: 1,
            isLoadList: false
        },
    itemsDeviceProfileField:
        {
            page: [] as Array<TDeviceProfileField>,
            current_value: {
                id: undefined,
                name: ""
            } as TDeviceProfileField,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 3,
            current_page: 1,
            custemItems: [] as Array<TDeviceProfileField>,
            isLoadList: false
        },
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const DeviceProfileReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/DEVICE/PROFILE/SET_IS_LOAD_LIST/': {
            return {...state, itemsDeviceProfile: {...state.itemsDeviceProfile, isLoadList: action.flag}};
        }
        case '/DEVICE/PROFILE/SET_API_REPORT/': {
            return {...state, itemsDeviceProfile: {...state.itemsDeviceProfile, report: action.report}}
        }
        case '/DEVICE/PROFILE/ADD_CURRENT_VALUE/': {
            return {...state, itemsDeviceProfile: {...state.itemsDeviceProfile, current_value: action.device_profile}}
        }
        case '/DEVICE/PROFILE/ADD_LIST/': {
            return {
                ...state,
                itemsDeviceProfile: {
                    ...state.itemsDeviceProfile,
                    page: action.device_profiles,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case '/DEVICE/PROFILE/ADD_ALL_LIST/': {
            return {
                ...state,
                itemsDeviceProfile: {
                    ...state.itemsDeviceProfile,
                    allItems: action.device_profiles
                }
            }
        }
        case '/DEVICE/PROFILE/FIELD/SET_IS_LOAD_LIST/': {
            return {...state, itemsDeviceProfileField: {...state.itemsDeviceProfileField, isLoadList: action.flag}};
        }
        case '/DEVICE/PROFILE/FIELD/SET_API_REPORT/': {
            return {...state, itemsDeviceProfileField: {...state.itemsDeviceProfileField, report: action.report}}
        }
        case '/DEVICE/PROFILE/FIELD/ADD_CURRENT_VALUE/': {
            return {
                ...state,
                itemsDeviceProfileField: {...state.itemsDeviceProfileField, current_value: action.device_profile_field}
            }
        }
        case '/DEVICE/PROFILE/FIELD/ADD_LIST/': {
            return {
                ...state,
                itemsDeviceProfileField: {
                    ...state.itemsDeviceProfileField,
                    page: action.device_profile_fields,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case "/DEVICE/PROFILE/FIELD/ADD_CUSTOM_LIST/": {
            return {
                ...state,
                itemsDeviceProfileField: {
                    ...state.itemsDeviceProfileField,
                    custemItems: action.device_profile_fields
                }
            }
        }
        default: {
            return state;
        }
    }
};

export const getPageDeviceProfile = (current_page: number, size_page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListDeviceProfile(false));
            let data: TGetListDeviceProfile = await deviceProfileAPI.getList(current_page, size_page);
            dispatch(actions.setApiReportDeviceProfile(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setListDeviceProfile(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListDeviceProfile(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListDeviceProfile(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListDeviceProfile(true));
            reducer_log("DeviceProfileReducer.getPageDeviceProfile", {}, error);
        }
    }
};

export const getAllDeviceProfile = () => {
    return async (dispatch: any) => {
        try {
            let data: TGetListDeviceProfile = await deviceProfileAPI.getList(0, 0);
            dispatch(actions.setApiReportDeviceProfile(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setAllListDeviceProfile(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListDeviceProfile(true));
            reducer_log("DeviceProfileReducer.getPageDeviceProfile", {}, error);
        }
    }
};

export const addDeviceProfile = (deviceProfile: TDeviceProfile) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnDeviceProfile = await deviceProfileAPI.add(deviceProfile);
            dispatch(actions.setApiReportDeviceProfile(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceProfile(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceProfile(
                getState().deviceProfile.itemsDeviceProfile.current_page, getState().deviceProfile.itemsDeviceProfile.size_page));
        } catch (error) {
            reducer_log("DeviceProfileReducer:addDeviceProfile", deviceProfile, error);
        }
    }
};

export const delDeviceProfile = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnDeviceProfile = await deviceProfileAPI.del(id);
            dispatch(actions.setApiReportDeviceProfile(data.report));
            if (data.report.code === ApiResultCode.OK) {
                const deviceProfileClear: TDeviceProfile = {
                    id: undefined,
                    name: ""
                };
                dispatch(actions.setCurrentValueDeviceProfile(deviceProfileClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceProfile(
                getState().deviceProfile.itemsDeviceProfile.current_page, getState().deviceProfile.itemsDeviceProfile.size_page));
        } catch (error) {
            reducer_log("DeviceProfileReducer:delDeviceProfile", {deviceProfile_id: id}, error);
        }
    }
};


export const getDeviceProfile = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnDeviceProfile = await deviceProfileAPI.get(id);
            dispatch(actions.setApiReportDeviceProfile(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceProfile(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log("DeviceProfileReducer:getDeviceProfile", {deviceProfile_id: id}, error);
        }
    }
};

export const updateDeviceProfile = (deviceProfile: TDeviceProfile) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnDeviceProfile = await deviceProfileAPI.update(deviceProfile);
            dispatch(actions.setApiReportDeviceProfile(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceProfile(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceProfile(
                getState().deviceProfile.itemsDeviceProfile.current_page, getState().deviceProfile.itemsDeviceProfile.size_page));
        } catch (error) {
            reducer_log("DeviceProfileReducer:updateDeviceProfile", deviceProfile, error);
        }
    }
};

//####

export const getPageDeviceProfileField = (current_page: number, size_page: number, device_profile: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListDeviceProfileField(false));
            let data: TGetListDeviceProfileField = await deviceProfileFieldAPI.getList(current_page, size_page, [device_profile]);
            dispatch(actions.setApiReportDeviceProfileField(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setListDeviceProfileField(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListDeviceProfileField(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListDeviceProfileField(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListDeviceProfile(true));
            reducer_log("DeviceProfileReducer.getPageDeviceProfileField", {}, error);
        }
    }
};
export const getCustomDeviceProfileField = (device_profile?: Array<number>) => {
    return async (dispatch: any) => {
        try {
            device_profile = device_profile ? device_profile : [];
            let data: TGetListDeviceProfileField = await deviceProfileFieldAPI.getList(1, 100, device_profile);
            dispatch(actions.setApiReportDeviceProfileField(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setCustomListDeviceProfileField(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                //dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log("DeviceProfileReducer.getCustomDeviceProfileField", {device_profile}, error);
        }
    }
};

export const addDeviceProfileField = (deviceProfileField: TDeviceProfileField) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnDeviceProfileField = await deviceProfileFieldAPI.add(deviceProfileField);
            dispatch(actions.setApiReportDeviceProfileField(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceProfileField(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceProfileField(
                getState().deviceProfile.itemsDeviceProfileField.current_page, getState().deviceProfile.itemsDeviceProfileField.size_page, getState().deviceProfile.itemsDeviceProfile.current_value.id as number));
        } catch (error) {
            reducer_log("DeviceProfileReducer:addDeviceProfileField", deviceProfileField, error);
        }
    }
};

export const delDeviceProfileField = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnDeviceProfileField = await deviceProfileFieldAPI.del(id);
            dispatch(actions.setApiReportDeviceProfileField(data.report));
            if (data.report.code === ApiResultCode.OK) {
                const deviceProfileFieldClear: TDeviceProfileField = {
                    id: 0,
                    name: "",
                    device_profile: 0
                };
                dispatch(actions.setCurrentValueDeviceProfileField(deviceProfileFieldClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceProfileField(
                getState().deviceProfile.itemsDeviceProfileField.current_page, getState().deviceProfile.itemsDeviceProfileField.size_page, getState().deviceProfile.itemsDeviceProfile.current_value.id as number));
        } catch (error) {
            reducer_log("DeviceProfileReducer:delDeviceProfileField", {deviceProfileField_id: id}, error);
        }
    }
};

export const getDeviceProfileField = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnDeviceProfileField = await deviceProfileFieldAPI.get(id);
            dispatch(actions.setApiReportDeviceProfileField(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceProfileField(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log("DeviceProfileReducer:getDeviceProfileField", {deviceProfileField_id: id}, error);
        }
    }
};

export const updateDeviceProfileField = (deviceProfileField: TDeviceProfileField) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnDeviceProfileField = await deviceProfileFieldAPI.update(deviceProfileField);
            dispatch(actions.setApiReportDeviceProfileField(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceProfileField(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceProfileField(
                getState().deviceProfile.itemsDeviceProfileField.current_page, getState().deviceProfile.itemsDeviceProfileField.size_page, getState().deviceProfile.itemsDeviceProfile.current_value.id as number));
        } catch (error) {
            reducer_log("DeviceProfileReducer:updateDeviceProfileField", deviceProfileField, error);
        }
    }
};