import {
    ApiResultCode,
    NO,
    TAddDevice,
    TApiReport,
    TDeviceInputData, TDeviceInputDateAdding,
    TGetListAddDevice,
    TReturnAddDevice
} from "../../api/type";
import {deviceAPI} from "../../api/api";
import {initializedApp} from "./AppReducer";
import {reducer_log} from "../common/logger";

const reducerName = "DeviceReducer";
export const actions = {
    'setIsLoadListDeviceAdd': (flag: boolean) => {
        return {type: '/DEVICE/SET_IS_LOAD_LIST_DEVICE_ADD', flag} as const
    },
    'setApiReportDeviceAdd': (report: TApiReport) => {
        return {type: '/DEVICE/SET_API_REPORT_DEVICE_ADD', report} as const
    },
    'setListDeviceAdd': (devices: Array<TAddDevice>, count: number, size_page: number, current_page: number) => {
        return {type: '/DEVICE/ADD_LIST_DEVICE_ADD', devices, count, size_page, current_page} as const
    },
    'setCurrentValueDeviceAdd': (device: TAddDevice) => {
        return {type: '/DEVICE/ADD_CURRENT_VALUE_DEVICE_ADD', device} as const
    },
    'setDevicesInputData': (devices: Array<TDeviceInputData>) => {
        return {type: '/DEVICE/SET_LIST_DEVICES_INPUT_DATA', devices} as const
    },
    'setErrorInputDataList': (devices: Array<TDeviceInputData> | null) => {
        return {type: '/DEVICE/SET_LIST_DEVICE_INPUT_DATA_ERROR', devices} as const
    },
    'setDeviceAdding': (devices: TDeviceInputData[]) => {
        return {type: '/DEVICE/SET_DEVICES_INPUT_DATA_ADDING', devices} as const
    },
};


const initialState = {
    itemsDeviceAdd:
        {
            page: [] as Array<TAddDevice>,
            current_value: {} as TAddDevice,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 3,
            current_page: 1,
            isLoadList: false
        },
    itemsDeviceInputData:
        {
            page: [] as Array<TDeviceInputDateAdding>
        }
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const DeviceReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/DEVICE/SET_IS_LOAD_LIST_DEVICE_ADD': {
            return {...state, itemsDeviceAdd: {...state.itemsDeviceAdd, isLoadList: action.flag}};
        }
        case '/DEVICE/SET_API_REPORT_DEVICE_ADD': {
            return {...state, itemsDeviceAdd: {...state.itemsDeviceAdd, report: action.report}}
        }
        case '/DEVICE/ADD_CURRENT_VALUE_DEVICE_ADD': {
            return {...state, itemsDeviceAdd: {...state.itemsDeviceAdd, current_value: action.device}}
        }
        case '/DEVICE/ADD_LIST_DEVICE_ADD': {
            return {
                ...state,
                itemsDeviceAdd: {
                    ...state.itemsDeviceAdd,
                    page: action.devices,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        default: {
            return state;
        }
    }
};

export const getPageDeviceAdd = (current_page: number, size_page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListDeviceAdd(false));
            let data: TGetListAddDevice = await deviceAPI.getListAdd(current_page, size_page);
            dispatch(actions.setApiReportDeviceAdd(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setListDeviceAdd(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListDeviceAdd(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListDeviceAdd(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListDeviceAdd(true));
            reducer_log("DeviceReducer.getListDeviceAdd", {}, error);
        }
    }
};

export const addDevice = (device: TAddDevice) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnAddDevice = await deviceAPI.add(device);
            dispatch(actions.setApiReportDeviceAdd(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceAdd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceAdd(
                getState().device.itemsDeviceAdd.current_page, getState().device.itemsDeviceAdd.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.addDevice`, device, error);
        }
    }
};

export const delDevice = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnAddDevice = await deviceAPI.del(id);
            dispatch(actions.setApiReportDeviceAdd(data.report));
            if (data.report.code === ApiResultCode.OK) {
                const deviceClear: TAddDevice = {
                    name: "",
                    serial_number: null,
                    delivery_plan: null,
                    invoice: null,
                    price_start_up: null,
                    provisioner: null
                };
                dispatch(actions.setCurrentValueDeviceAdd(deviceClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceAdd(
                getState().device.itemsDeviceAdd.current_page, getState().device.itemsDeviceAdd.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.delDevice`, {device_id: id}, error);
        }
    }
};

export const getDevice = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnAddDevice = await deviceAPI.get(id);
            dispatch(actions.setApiReportDeviceAdd(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceAdd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}.get`, {device_id: id}, error);
        }
    }
};


export const updateDevice = (device: TAddDevice) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnAddDevice = await deviceAPI.update(device);
            dispatch(actions.setApiReportDeviceAdd(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueDeviceAdd(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageDeviceAdd(
                getState().device.itemsDeviceAdd.current_page, getState().device.itemsDeviceAdd.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.updateDevice`, device, error);
        }
    }
};