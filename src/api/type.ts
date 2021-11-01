export const ApiResultCode = {
    OK: 0 as const,
    NOT_FOUND: 1 as const,
    UNAUTHOROZED: 2 as const,
    NOT_DELETE: 3 as const,
    NOT_UPDATA: 4 as const,
    ERROR: 5 as const,
    REPEAT: 6 as const,
    ERROR_SERVER: 7 as const
};

type InferValuesType<T> = T extends { [key: string]: infer U }? U: never;
export type TApiResultCode = InferValuesType<typeof ApiResultCode>

export type ApiActionType = typeof ADD | typeof DELETE | typeof UPDATE | typeof GET | typeof GET_LIST | typeof NO
export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
export const GET = 'GET';
export const GET_LIST = 'GET_LIST';
export const NO = 'NO';
export type TApiReport = {
    code: TApiResultCode,
    action: ApiActionType
}
export type TReturn = {
    report: TApiReport
}
export type TAddDevice = {
    id?: number,
    name: string,
    serial_number: string | null,
    price_start_up: number | null,
    provisioner: string | null,
    delivery_plan: string | null,
    invoice: string | null
}
export type TDeviceInputData = {
    name: string,
    serial_number?: string,
    inventory_number: string,
    price_start_up?: number,
    date_start: string,
    ovd: number,
    person: string
}
export type TDeviceInputDateAdding = {
    key: number,
    item: TDeviceInputData,
    isRequestSend : boolean, //True = запрос на добавление отправлялся
    isAdding: boolean, //True = исполняется запрос на добавление
    isDuplicate: boolean //True = имеется дубль в БД
}

export type TReturnAddDevice = {
    report: TApiReport,
    data: TAddDevice | null
}



export type TGetListAddDevice = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<TAddDevice> | []
}

export type TDeviceProfile = {
    id?: number,
    name: string
}

export type TGetListDeviceProfile = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<TDeviceProfile> | []
}
export type TReturnDeviceProfile = {
    report: TApiReport,
    data: TDeviceProfile | null
}

export type TDeviceProfileField = {
    id?: number,
    name: string,
    device_profile: number
}

export type TGetListDeviceProfileField = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<TDeviceProfileField> | []
}
export type TReturnDeviceProfileField = {
    report: TApiReport,
    data: TDeviceProfileField | null
}

export const reportType = {
    REPORT_DEVICE_PROFILE: "REPORT_DEVICE_PROFILE" as const,
    REPORT_DEVICE_AVAILABLE: "REPORT_DEVICE_AVAILABLE" as const,
};

export type TReportType = InferValuesType<typeof reportType>
export type TReport = {
    id?: number,
    name: string,
    type?: TReportType,
    device_profile?: Array<number>
}

type TGetListEntity<T> = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<T> | []
}
type TReturnEntity<T> = {
    report: TApiReport,
    data: T | null
}

export type TGetListReport = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<TReport> | []
}
export type TReturnReport = {
    report: TApiReport,
    data: TReport | null
}
export type TReportDeviceProfileDetail = {
    id?: number,
    report: number,
    device_profile_field: number,
    value: string
}

export type TGetListReportDeviceProfileDetail = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<TReportDeviceProfileDetail> | []
}
export type TReturnReportDeviceProfileDetail = {
    report: TApiReport,
    data: TReportDeviceProfileDetail | null
}

export type TOvd = {
    id?: number,
    name_abbreviation: string,
    name_full: string
}

export type TGetListOvd = {
    report: TApiReport,
    count: number,
    page_number: number,
    page_size?: number,
    data: Array<TOvd> | []
}
export type TReturnOvd = {
    report: TApiReport,
    data: TOvd | null
}

export type TDepartment = {
    id?: number,
    name_abbreviation: string,
    name_full: string,
    ovd: Array<number>
}
export type TGetListDepartment = TGetListEntity<TDepartment>;
export type TReturnDepartment = TReturnEntity<TDepartment>;

export const IS_APPLY = "IS_APPLY";
export const IS_NOT_APPLY = "IS_NOT_APPLY";
export const PROCESSING = "PROCESSING";

export type TStatusPc = typeof IS_APPLY | typeof IS_NOT_APPLY | typeof PROCESSING
export type TPc = {
    id ?: number,
    name : string,
    serial_number : string,
    inventory_number : string,
    isUnknownInventoryNumber : boolean,
    price_start_up : string,
    user : string,
    bailee : string,
    note : string,
    object : number | TObject | null,
    ovd: number,
    department: number,
    inventory_number_other : string,
    room : string,
    mac_address : string,
    ip_address : string,
    host_name : string,
    hard_serial_number : string,
    hard_name : string,
    os : string,
    secret_net_studio_version : string,
    crypto_pro_version : string,
    vipnet_client_version : string,
    kaspersky_version : string,
    status : TStatusPc,
    date_apply : string,
    date_edit : string
}
export type TGetListPc = TGetListEntity<TPc>;
export type TReturnPc = TReturnEntity<TPc>;

export type TObject = {
    id : number,  ovd : number,  department : number,  address : number | TAddress
}
export type TGetListObject = TGetListEntity<TObject>;
export type TReturnObject = TReturnEntity<TObject>;

export type TAddress = {
    address: string
}
export type TGetListAddress = TGetListEntity<TAddress>;
export type TReturnAddress = TReturnEntity<TAddress>;

export type TVipNet = {
    id: number|undefined,
    identifier: string,
    name: string,
    date_create:string | null,
    date_remove: string | null,
    ip_real: string | null,
    ip_virtual: string |null,
    pc: TPc | null,
    last_date_locked: string|null,
    vipnet_type: TVipnetType | null
    isLocked: boolean
}
export type TGetListVipNet = TGetListEntity<TVipNet>;
export type TReturnVipNet = TReturnEntity<TVipNet>;

export type TVipnetType = {
    id: number,
    name: string
}
export type TGetListVipnetType = TGetListEntity<TVipnetType>;
export type TReturnVipnetType = TReturnEntity<TVipnetType>;

export type TVipnetFilter =  {
    isUseFilter: boolean,
    search: string,
    isLocked: boolean,
    isServices: boolean,
    vipnet_type: TVipnetType | null
}