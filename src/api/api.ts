import {getInstansAxios, setTokenInstansAxios} from './setting'
import {
    ADD,
    ApiResultCode,
    DELETE,
    GET,
    GET_LIST,
    TAddDevice, TDepartment,
    TDeviceProfile,
    TDeviceProfileField,
    TGetListAddDevice, TGetListDepartment,
    TGetListDeviceProfile,
    TGetListDeviceProfileField, TGetListOvd, TGetListPc,
    TGetListReport, TGetListReportDeviceProfileDetail, TGetListVipNet, TGetListVipnetType, TOvd, TPc,
    TReport, TReportDeviceProfileDetail,
    TReturnAddDevice, TReturnDepartment,
    TReturnDeviceProfile,
    TReturnDeviceProfileField, TReturnOvd, TReturnPc,
    TReturnReport, TReturnReportDeviceProfileDetail, TReturnVipNet, TVipNet, TVipnetFilter,
    UPDATE
} from "./type";
import {AxiosInstance} from "axios";
import {
    addGeneric,
    delGeneric,
    getGeneric,
    getListFilterGeneric,
    getListGeneric,
    searchGeneric,
    updateGeneric
} from "./common";
//import {getListGeneric} from "./common";

/*const getErrorCode = (error: AxiosError): ApiResultCode => {
    if (error.response && error.response.status === 400) {
        return NOT_DELETE;
    }
    if (error.response && error.response.status === 401) {
        return UNAUTHOROZED;
    }
    if (error.response && error.response.status != 200) {
        return NOT_FOUND;
    }
    throw error;
};*/

export const authAPI = {
    setToken: setTokenInstansAxios,
    async auth(name: string, password: string) {
        let formData = new FormData();
        formData.append('username', name);
        formData.append('password', password);
        let response;
        response = await getInstansAxios().post(`/api-token-auth/`, formData);
        return response.data;
    },
    async authVerify(token: string) {
        let response;
        response = await getInstansAxios().post(`/api-token-verify/`, {token});
        return response;
    }
};

export const deviceAPI = {
    getListAdd: (current_page: number, size_page: number) => getListGeneric<TGetListAddDevice>(current_page, size_page, "/device/add/"),
    add: (device: TAddDevice) => addGeneric<TReturnAddDevice, TAddDevice>(device, "/device/add/"),
    update: (device: TAddDevice) => updateGeneric<TReturnAddDevice, TAddDevice>(device, "/device/add/"),
    del: (id: number) => delGeneric<TReturnAddDevice>(id, "/device/add/"),
    get: (id: number) => getGeneric<TReturnAddDevice>(id, "/device/add/")
};

export const deviceProfileAPI = {
    async getList(current_page: number, size_page: number) {
        try {
            const instancesAxios: AxiosInstance = getInstansAxios();
            let response;
            if (size_page === 0) {
                response = await instancesAxios.get<TGetListDeviceProfile>(`/deviceprofile/profile/`);
            } else
                response = await instancesAxios.get<TGetListDeviceProfile>(`/deviceprofile/profile/?page_size=${size_page}&page_number=${current_page}`);
            let result: TGetListDeviceProfile = response.data;
            result.report.action = GET_LIST;
            return result;
        } catch (e) {
            let result: TGetListDeviceProfile = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST},
                page_number: 0,
                page_size: 0,
                count: 0,
                data: []
            };
            return result;
        }
    },
    async add(deviceProfile: TDeviceProfile) {
        try {
            let response = await getInstansAxios().post<TReturnDeviceProfile>(`/deviceprofile/profile/`, {...deviceProfile});
            let result: TReturnDeviceProfile = response.data;
            result.report.action = ADD;
            return result
        } catch (e) {
            let result: TReturnDeviceProfile = {
                report: {code: ApiResultCode.ERROR_SERVER, action: ADD},
                data: null
            };
            return result;
        }
    },
    async update(deviceProfile: TDeviceProfile) {
        try {
            let response = await getInstansAxios().put<TReturnDeviceProfile>(`/deviceprofile/profile/${deviceProfile.id}/`, {...deviceProfile});
            let result: TReturnDeviceProfile = response.data;
            result.report.action = UPDATE;
            return result
        } catch (e) {
            let result: TReturnDeviceProfile = {
                report: {code: ApiResultCode.ERROR_SERVER, action: UPDATE},
                data: null
            };
            return result;
        }
    },
    async del(id: number) {
        try {
            let response = await getInstansAxios().delete<TReturnDeviceProfile>(`/deviceprofile/profile/${id}/`);
            let result: TReturnDeviceProfile = response.data;
            result.report.action = DELETE;
            return result
        } catch (e) {
            let result: TReturnDeviceProfile = {
                report: {code: ApiResultCode.ERROR_SERVER, action: DELETE},
                data: null
            };
            return result;
        }
    },
    async get(id: number) {
        try {
            let response = await getInstansAxios().get<TReturnDeviceProfile>(`/deviceprofile/profile/${id}/`);
            let result: TReturnDeviceProfile = response.data;
            result.report.action = GET;
            return result
        } catch (e) {
            let result: TReturnDeviceProfile = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET},
                data: null
            };
            return result;
        }
    }
};

export const deviceProfileFieldAPI = {
    async getList(current_page: number, size_page: number, device_profile: Array<number>) {
        try {
            const instancesAxios: AxiosInstance = getInstansAxios();
            let param = device_profile.map(item => {
                return `device_profile=${item}`
            });
            let response;
            if (size_page === 0) {
                response = await instancesAxios.get<TGetListDeviceProfileField>(`/deviceprofile/field/?${param.join('&')}`)
            } else {
                response = await instancesAxios.get<TGetListDeviceProfileField>(`/deviceprofile/field/?${param.join('&')}&page_size=${size_page}&page_number=${current_page}`)
            }
            let result: TGetListDeviceProfileField = response.data;
            result.report.action = GET_LIST;
            return result;
        } catch (e) {
            let result: TGetListDeviceProfileField = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST},
                page_number: 0,
                page_size: 0,
                count: 0,
                data: []
            };
            return result;
        }
    },
    async add(deviceProfileField: TDeviceProfileField) {
        try {
            let response = await getInstansAxios().post<TReturnDeviceProfileField>(`/deviceprofile/field/`, {...deviceProfileField});
            let result: TReturnDeviceProfileField = response.data;
            result.report.action = ADD;
            return result
        } catch (e) {
            let result: TReturnDeviceProfileField = {
                report: {code: ApiResultCode.ERROR_SERVER, action: ADD},
                data: null
            };
            return result;
        }
    },
    async update(deviceProfileField: TDeviceProfileField) {
        try {
            let response = await getInstansAxios().put<TReturnDeviceProfileField>(`/deviceprofile/field/${deviceProfileField.id}/`, {...deviceProfileField});
            let result: TReturnDeviceProfileField = response.data;
            result.report.action = UPDATE;
            return result
        } catch (e) {
            let result: TReturnDeviceProfileField = {
                report: {code: ApiResultCode.ERROR_SERVER, action: UPDATE},
                data: null
            };
            return result;
        }
    },
    async del(id: number) {
        try {
            let response = await getInstansAxios().delete<TReturnDeviceProfileField>(`/deviceprofile/field/${id}/`);
            let result: TReturnDeviceProfileField = response.data;
            result.report.action = DELETE;
            return result
        } catch (e) {
            let result: TReturnDeviceProfileField = {
                report: {code: ApiResultCode.ERROR_SERVER, action: DELETE},
                data: null
            };
            return result;
        }
    },
    async get(id: number) {
        try {
            let response = await getInstansAxios().get<TReturnDeviceProfileField>(`/deviceprofile/field/${id}/`);
            let result: TReturnDeviceProfileField = response.data;
            result.report.action = GET;
            return result
        } catch (e) {
            let result: TReturnDeviceProfileField = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET},
                data: null
            };
            return result;
        }
    }
};
/* async getList(current_page: number, size_page: number) {
        try {
            const instancesAxios: AxiosInstance = getInstansAxios();
            let response = await instancesAxios.get<TGetListReport>(`/report/report/?page_size=${size_page}&page_number=${current_page}`);
            let result: TGetListReport = response.data;
            result.report.action = GET_LIST;
            return result;
        } catch (e) {
            let result: TGetListReport = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST},
                page_number: 0,
                page_size: 0,
                count: 0,
                data: []
            };
            return result;
        }
    }*/

export const reportAPI = {
    getList: (current_page: number, size_page: number) => getListGeneric<TGetListReport>(current_page, size_page, "/report/report/"),
    add: (report: TReport) => addGeneric<TReturnReport, TReport>(report, "/report/report/"),
    update: (report: TReport) => updateGeneric<TReturnReport, TReport>(report, "/report/report/"),
    del: (id: number) => delGeneric<TReturnReport>(id, "/report/report/"),
    get: (id: number) => getGeneric<TReturnReport>(id, "/report/report/")
};

export const reportDeviceProfileDetailAPI = {
    async getList(current_page: number, size_page: number, report: number) {
        try {
            const instancesAxios: AxiosInstance = getInstansAxios();
            let response = await instancesAxios.get<TGetListReportDeviceProfileDetail>(`/report/deviceprofiledetail/?report=${report}&page_size=${size_page}&page_number=${current_page}`);
            let result: TGetListReportDeviceProfileDetail = response.data;
            result.report.action = GET_LIST;
            return result;
        } catch (e) {
            let result: TGetListReportDeviceProfileDetail = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST},
                page_number: 0,
                page_size: 0,
                count: 0,
                data: []
            };
            return result;
        }
    },
    async add(reportDeviceProfileDetail: TReportDeviceProfileDetail) {
        try {
            let response = await getInstansAxios().post<TReturnReportDeviceProfileDetail>(`/report/deviceprofiledetail/`, {...reportDeviceProfileDetail});
            let result: TReturnReportDeviceProfileDetail = response.data;
            result.report.action = ADD;
            return result
        } catch (e) {
            let result: TReturnReportDeviceProfileDetail = {
                report: {code: ApiResultCode.ERROR_SERVER, action: ADD},
                data: null
            };
            return result;
        }
    },
    async update(reportDeviceProfileDetail: TReportDeviceProfileDetail) {
        try {
            let response = await getInstansAxios().put<TReturnReportDeviceProfileDetail>(`/report/deviceprofiledetail/${reportDeviceProfileDetail.id}/`, {...reportDeviceProfileDetail});
            let result: TReturnReportDeviceProfileDetail = response.data;
            result.report.action = UPDATE;
            return result
        } catch (e) {
            let result: TReturnReportDeviceProfileDetail = {
                report: {code: ApiResultCode.ERROR_SERVER, action: UPDATE},
                data: null
            };
            return result;
        }
    },
    async del(id: number) {
        try {
            let response = await getInstansAxios().delete<TReturnReportDeviceProfileDetail>(`/report/deviceprofiledetail/${id}/`);
            let result: TReturnReportDeviceProfileDetail = response.data;
            result.report.action = DELETE;
            return result
        } catch (e) {
            let result: TReturnReportDeviceProfileDetail = {
                report: {code: ApiResultCode.ERROR_SERVER, action: DELETE},
                data: null
            };
            return result;
        }
    },
    async get(id: number) {
        try {
            let response = await getInstansAxios().get<TReturnReportDeviceProfileDetail>(`/report/deviceprofiledetail/${id}/`);
            let result: TReturnReportDeviceProfileDetail = response.data;
            result.report.action = GET;
            return result
        } catch (e) {
            let result: TReturnReportDeviceProfileDetail = {
                report: {code: ApiResultCode.ERROR_SERVER, action: GET},
                data: null
            };
            return result;
        }
    }
};/**/

export const ovdAPI = {
    getList: (current_page: number, size_page: number) => getListGeneric<TGetListOvd>(current_page, size_page, "/ovd/item/"),
    add: (ovd: TOvd) => addGeneric<TReturnOvd, TOvd>(ovd, "/ovd/item/"),
    update: (ovd: TOvd) => updateGeneric<TReturnOvd, TOvd>(ovd, "/ovd/item/"),
    del: (id: number) => delGeneric<TReturnOvd>(id, "/ovd/item/"),
    get: (id: number) => getGeneric<TReturnOvd>(id, "/ovd/item/")
};
export const departmentAPI = {
    getList: (current_page: number, size_page: number) => getListGeneric<TGetListDepartment>(current_page, size_page, "/department/item/"),
    add: (department: TDepartment) => addGeneric<TReturnDepartment, TDepartment>(department, "/department/item/"),
    update: (department: TDepartment) => updateGeneric<TReturnDepartment, TDepartment>(department, "/department/item/"),
    del: (id: number) => delGeneric<TReturnDepartment>(id, "/department/item/"),
    get: (id: number) => getGeneric<TReturnDepartment>(id, "/department/item/")
};

export const pcAPI = {
    getList: (current_page: number, size_page: number) => getListGeneric<TGetListPc>(current_page, size_page, "/certification/pc/"),
    //add: (item: TPc) => addGeneric<TReturnPC, TPc>(item, "/certification/pc/"),
    update: (item: TPc) => updateGeneric<TReturnPc, TPc>(item, "/certification/pc/apply/"),
    //del: (id: number) => delGeneric<TReturnPC>(id, "/certification/pc/"),
    get: (id: number) => getGeneric<TReturnPc>(id, "/certification/pc/"),
    search: (search:Map<string,string>=new Map()) => searchGeneric<TGetListPc>("/certification/pc/", search)
};

export const vipnetAPI = {
    getList: (current_page: number, size_page: number) => getListGeneric<TGetListVipNet>(current_page, size_page, "/certification/vipnet/web/"),
    getListFilter: (current_page: number, size_page: number, vipnet_filter: TVipnetFilter) => getListFilterGeneric<TGetListVipNet, TVipnetFilter>(current_page, size_page, vipnet_filter, "/certification/vipnet/web/"),
    getAllTypeList: (current_page: number, size_page: number) => getListGeneric<TGetListVipnetType>(current_page, size_page, "/certification/vipnettype/"),
    add: (item: TVipNet) => addGeneric<TReturnVipNet, TVipNet>(item, "/certification/vipnet/web/"),
    update: (item: TVipNet) => updateGeneric<TReturnVipNet, TVipNet>(item, "/certification/vipnet/web/"),
    del: (id: number) => delGeneric<TReturnVipNet>(id, "/certification/vipnet/web/"),
    get: (id: number) => getGeneric<TReturnVipNet>(id, "/certification/vipnet/web/")
};