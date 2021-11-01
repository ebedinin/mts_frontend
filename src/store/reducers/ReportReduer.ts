//##########Константы##########
import {
    ApiResultCode,
    NO,
    TApiReport,
    TGetListReport, TGetListReportDeviceProfileDetail,
    TReport, TReportDeviceProfileDetail,
    TReturnReport, TReturnReportDeviceProfileDetail,

} from "../../api/type";
import {initializedApp} from "./AppReducer";
import {reportAPI, reportDeviceProfileDetailAPI} from "../../api/api";
import {reducer_log} from "../common/logger";
import {getAllDeviceProfile, getCustomDeviceProfileField} from "./DeviceProfileReduer";
const reducerName = "ReportReducer";

export const actions = {
    'setIsLoadListReport': (flag: boolean) => {
        return {
            type: '/DEVICE/REPORT/SET_IS_LOAD_LIST/', flag
        } as const
    },
    'setApiReportReport': (report: TApiReport) => {
        return {
            type: '/REPORT/SET_API_REPORT/', report
        } as const
    },
    'setListReport': (report: Array<TReport>, count: number, size_page: number, current_page: number) => {
        return {
            type: '/REPORT/ADD_LIST/', report, count, size_page, current_page
        } as const
    },
    'setCurrentValueReport': (report: TReport) => {
        return {type: '/REPORT/ADD_CURRENT_VALUE/', report} as const
    },
    'setIsLoadListReportDeviceProfileDetail': (flag: boolean) => {
        return {type: '/REPORT/DEVICE_PROFILE_DETAIL/SET_IS_LOAD_LIST/', flag} as const
    },
    'setApiReportReportDeviceProfileDetail': (report: TApiReport) => {
        return {type: '/REPORT/DEVICE_PROFILE_DETAIL/SET_API_REPORT/', report} as const
    },
    'setListReportDeviceProfileDetail': (reportDeviceProfileDetails: Array<TReportDeviceProfileDetail>, count: number, size_page: number, current_page: number) => {
        return {
            type: '/REPORT/DEVICE_PROFILE_DETAIL/ADD_LIST/',
            reportDeviceProfileDetails,
            count,
            size_page,
            current_page
        } as const
    },
    'setCurrentValueReportDeviceProfileDetail': (reportDeviceProfileDetail: TReportDeviceProfileDetail) => {
        return {type: '/REPORT/DEVICE_PROFILE_DETAIL/ADD_CURRENT_VALUE/', reportDeviceProfileDetail} as const
    }
};

const initialState = {
    itemsReport:
        {
            page: [] as Array<TReport>,
            current_value: {
                id: undefined,
                name: ""
            } as TReport,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 3,
            current_page: 1,
            isLoadList: false,
        },
    itemsReportDeviceProfileDetail:
        {
            page: [] as Array<TReportDeviceProfileDetail>,
            current_value: {
                id: undefined,
                report: 0,
                device_profile_field: 0
            } as TReportDeviceProfileDetail,
            count: 0,
            report: {code: ApiResultCode.OK, action: NO} as TApiReport,
            size_page: 3,
            current_page: 1,
            isLoadList: false
        }
};

export type  TState = typeof initialState
type InferValuesType<T> = T extends { [key: string]: infer U } ? U : never;
type  TAction = ReturnType<InferValuesType<typeof actions>>;

export const ReportReducer = (state = initialState, action: TAction): TState => {
    switch (action.type) {
        case '/DEVICE/REPORT/SET_IS_LOAD_LIST/': {
            return {...state, itemsReport: {...state.itemsReport, isLoadList: action.flag}};
        }
        case '/REPORT/SET_API_REPORT/': {
            return {...state, itemsReport: {...state.itemsReport, report: action.report}}
        }
        case '/REPORT/ADD_CURRENT_VALUE/': {
            return {...state, itemsReport: {...state.itemsReport, current_value: action.report}}
        }
        case '/REPORT/ADD_LIST/': {
            return {
                ...state,
                itemsReport: {
                    ...state.itemsReport,
                    page: action.report,
                    count: action.count,
                    size_page: action.size_page,
                    current_page: action.current_page
                }
            }
        }
        case '/REPORT/DEVICE_PROFILE_DETAIL/SET_IS_LOAD_LIST/': {
            return {...state, itemsReportDeviceProfileDetail: {...state.itemsReportDeviceProfileDetail, isLoadList: action.flag}};
        }
        case '/REPORT/DEVICE_PROFILE_DETAIL/SET_API_REPORT/': {
            return {...state, itemsReportDeviceProfileDetail: {...state.itemsReportDeviceProfileDetail, report: action.report}}
        }
        case '/REPORT/DEVICE_PROFILE_DETAIL/ADD_CURRENT_VALUE/': {
            return {
                ...state,
                itemsReportDeviceProfileDetail: {...state.itemsReportDeviceProfileDetail, current_value: action.reportDeviceProfileDetail}
            }
        }
        case '/REPORT/DEVICE_PROFILE_DETAIL/ADD_LIST/': {
            return {
                ...state,
                itemsReportDeviceProfileDetail: {
                    ...state.itemsReportDeviceProfileDetail,
                    page: action.reportDeviceProfileDetails,
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

export const getPageReport = (current_page: number, size_page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListReport(false));
            let data: TGetListReport = await reportAPI.getList(current_page, size_page) as TGetListReport;
            dispatch(actions.setApiReportReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                dispatch(actions.setListReport(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListReport(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListReport(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListReport(true));
            reducer_log(`${reducerName}.getPageReport`, {}, error);
        }
    }
};

export const addReport = (report: TReport) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnReport = await reportAPI.add(report) as TReturnReport;
            dispatch(actions.setApiReportReport(data.report));
            if (data.report.code === ApiResultCode.OK  && data.data) {
                data.data && dispatch(actions.setCurrentValueReport(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageReport(
                getState().report.itemsReport.current_page, getState().report.itemsReport.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.addReport`, report, error);
        }
    }
};

export const delReport = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnReport = await reportAPI.del(id) as TReturnReport;
            dispatch(actions.setApiReportReport(data.report));
            if (data.report.code === ApiResultCode.OK) {
                const reportClear: TReport = {
                    id: undefined,
                    name: "",
                    type: undefined
                };
                dispatch(actions.setCurrentValueReport(reportClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageReport(
                getState().report.itemsReport.current_page, getState().report.itemsReport.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.delReport`, {report_id: id}, error);
        }
    }
};

export const getReport = (id: number) => {
    return async (dispatch: any, getState:any) => {
        try {
            let data: TReturnReport = await reportAPI.get(id) as TReturnReport;
            dispatch(actions.setApiReportReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                if (data.data) {
                    dispatch(actions.setCurrentValueReport(data.data));
                    dispatch(getAllDeviceProfile());
                    dispatch(getCustomDeviceProfileField(data.data.device_profile));
                    dispatch(getPageReportDeviceProfileDetail(
                        getState().report.itemsReportDeviceProfileDetail.current_page, getState().report.itemsReportDeviceProfileDetail.size_page, data.data.id as number));
                }
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}.getReport`, {report_id: id}, error);
        }
    }
};

export const updateReport = (report: TReport) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnReport = await reportAPI.update(report) as TReturnReport;
            dispatch(actions.setApiReportReport(data.report));
            if (data.report.code === ApiResultCode.OK && data.data) {
                data.data && dispatch(actions.setCurrentValueReport(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageReport(
                getState().report.itemsReport.current_page, getState().report.itemsReport.size_page));
        } catch (error) {
            reducer_log(`${reducerName}.updateReport`, report, error);
        }
    }
};

//####

export const getPageReportDeviceProfileDetail = (current_page: number, size_page: number, report: number) => {
    return async (dispatch: any) => {
        try {
            dispatch(actions.setIsLoadListReportDeviceProfileDetail(false));
            let data: TGetListReportDeviceProfileDetail = await reportDeviceProfileDetailAPI.getList(current_page, size_page, report);
            dispatch(actions.setApiReportReportDeviceProfileDetail(data.report));
            if (data.report.code === ApiResultCode.OK) {
                dispatch(actions.setListReportDeviceProfileDetail(data.data,
                    data.count,
                    size_page,
                    current_page));
                dispatch(actions.setIsLoadListReportDeviceProfileDetail(true));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(actions.setIsLoadListReportDeviceProfileDetail(true));
                dispatch(initializedApp());
            }
        } catch (error) {
            dispatch(actions.setIsLoadListReportDeviceProfileDetail(true));
            reducer_log(`${reducerName}.getPageReportDeviceProfileDetail`, {}, error);
        }
    }
};

export const addReportDeviceProfileDetail = (reportDeviceProfileDetail: TReportDeviceProfileDetail) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnReportDeviceProfileDetail = await reportDeviceProfileDetailAPI.add(reportDeviceProfileDetail);
            dispatch(actions.setApiReportReportDeviceProfileDetail(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueReportDeviceProfileDetail(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageReportDeviceProfileDetail(
                getState().report.itemsReportDeviceProfileDetail.current_page, getState().report.itemsReportDeviceProfileDetail.size_page, getState().report.itemsReport.current_value.id as number));
        } catch (error) {
            reducer_log(`${reducerName}.addReportDeviceProfileDetail`, reportDeviceProfileDetail, error);
        }
    }
};

export const delReportDeviceProfileDetail = (id: number) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnReportDeviceProfileDetail = await reportDeviceProfileDetailAPI.del(id);
            dispatch(actions.setApiReportReportDeviceProfileDetail(data.report));
            if (data.report.code === ApiResultCode.OK) {
                const ReportDeviceProfileDetailClear: TReportDeviceProfileDetail = {
                    id: 0,
                    report: 0,
                    device_profile_field: 0,
                    value:""
                };
                dispatch(actions.setCurrentValueReportDeviceProfileDetail(ReportDeviceProfileDetailClear));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageReportDeviceProfileDetail(
                getState().report.itemsReportDeviceProfileDetail.current_page, getState().report.itemsReportDeviceProfileDetail.size_page, getState().report.itemsReport.current_value.id as number));
        } catch (error) {
            reducer_log(`${reducerName}.delReportDeviceProfileDetail`, {reportDeviceProfile_id: id}, error);
        }
    }
};

export const getReportDeviceProfileDetail = (id: number) => {
    return async (dispatch: any) => {
        try {
            let data: TReturnReportDeviceProfileDetail = await reportDeviceProfileDetailAPI.get(id);
            dispatch(actions.setApiReportReportDeviceProfileDetail(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueReportDeviceProfileDetail(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
        } catch (error) {
            reducer_log(`${reducerName}.getReportDeviceProfileDetail`, {reportDeviceProfile_id: id}, error);
        }
    }
};

export const updateReportDeviceProfileDetail = (reportDeviceProfileDetail: TReportDeviceProfileDetail) => {
    return async (dispatch: any, getState: any) => {
        try {
            let data: TReturnReportDeviceProfileDetail = await reportDeviceProfileDetailAPI.update(reportDeviceProfileDetail);
            dispatch(actions.setApiReportReportDeviceProfileDetail(data.report));
            if (data.report.code === ApiResultCode.OK) {
                data.data && dispatch(actions.setCurrentValueReportDeviceProfileDetail(data.data));
            }
            if (data.report.code === ApiResultCode.UNAUTHOROZED) {
                dispatch(initializedApp());
            }
            dispatch(getPageReportDeviceProfileDetail(
                getState().report.itemsReportDeviceProfileDetail.current_page, getState().report.itemsReportDeviceProfileDetail.size_page, getState().report.itemsReport.current_value.id as number));
        } catch (error) {
            reducer_log(`${reducerName}.updateReportDeviceProfileDetail`, reportDeviceProfileDetail, error);
        }
    }
};
