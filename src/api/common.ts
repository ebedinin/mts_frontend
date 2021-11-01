import {AxiosInstance} from "axios";
import {getInstansAxios} from "./setting";
import {ADD, ApiResultCode, DELETE, GET, GET_LIST,
    TReturn, UPDATE} from "./type";

const buildGetParam= <T extends object>(value: T )=>{
    let get_param:Array<string>=Array();
    for (let key in value){
        get_param.push(key.toString()+"="+value[key])
    }
    return get_param.join("&")
};
export const getListFilterGeneric = async <T extends TReturn, U extends {isUseFilter: boolean}>(current_page: number, size_page: number, filter: U, url:string) => {
    try {
        const instancesAxios: AxiosInstance = getInstansAxios();
        let response;
        let get_string = filter.isUseFilter?buildGetParam(filter):"";
        if (size_page === 0) {
            response = await instancesAxios.get<T>(`${url}&${get_string}`);
        }else {
            response = await instancesAxios.get<T>(`${url}?page_size=${size_page}&page_number=${current_page}&${get_string}`);
        }
        let result: T = response.data;
        result.report.action = GET_LIST;
        return result;
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};
export const getListGeneric = async <T extends TReturn>(current_page: number, size_page: number, url:string) => {
    try {
        const instancesAxios: AxiosInstance = getInstansAxios();
        let response;
        if (size_page === 0) {
            response = await instancesAxios.get<T>(`${url}`);
        }else {
            response = await instancesAxios.get<T>(`${url}?page_size=${size_page}&page_number=${current_page}`);
        }
        let result: T = response.data;
        result.report.action = GET_LIST;
        return result;
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};
export const searchGeneric = async <T extends TReturn>(url:string, search: Map<string,string>) => {
    try {
        const instancesAxios: AxiosInstance = getInstansAxios();
        let response;
        response = await instancesAxios.get<T>(`${url}?${buildGetParam(search)}`);
        let result: T = response.data;
        result.report.action = GET_LIST;
        return result;
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};

export const addGeneric = async <T extends TReturn, N>(param: N, url :string) =>{
    try {
        let response = await getInstansAxios().post<T>(`${url}`, {...param});
        let result: T = response.data;
        result.report.action = ADD;
        return result
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};

export const updateGeneric = async <T extends TReturn, N extends {id?: number}>(param: N, url:string) => {
    try {
        let response = await getInstansAxios().put<T>(`${url}${param.id}/`, {...param});
        let result: T = response.data;
        result.report.action = UPDATE;
        return result
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};

export  const delGeneric = async <T extends TReturn>(id: number, url:string) =>{
    try {
        let response = await getInstansAxios().delete<T>(`${url}${id}/`);
        let result: T = response.data;
        result.report.action = DELETE;
        return result
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};

export const getGeneric = async <T extends TReturn>(id: number, url:string)=> {
    try {
        let response = await getInstansAxios().get<T>(`${url}${id}/`);
        let result: T = response.data;
        result.report.action = GET;
        return result
    } catch (e) {
        // @ts-ignore
        let result: T = {
            report: {code: ApiResultCode.ERROR_SERVER, action: GET_LIST}
        };
        return result as T;
    }
};