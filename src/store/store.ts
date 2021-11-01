import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {reducer as formReducer} from 'redux-form';
import {AuthReducer} from "./reducers/AuthReducer";
import {AppReducer} from "./reducers/AppReducer";
import {DeviceReducer} from "./reducers/DeviceReducer";
import {DeviceProfileReducer} from "./reducers/DeviceProfileReduer";
import {ReportReducer} from "./reducers/ReportReduer";
import {OvdReducer} from "./reducers/OvdReduer";
import {DepartmentReducer} from "./reducers/DepartmentReduer";
import {PcReducer} from "./reducers/PCReducer";
import {VipNetReducer} from "./reducers/VipNetReducer";

let reducers = combineReducers({

    form: formReducer,
    auth: AuthReducer,
    app: AppReducer,
    device: DeviceReducer,
    deviceProfile: DeviceProfileReducer,
    report: ReportReducer,
    ovd: OvdReducer,
    department: DepartmentReducer,
    pc: PcReducer,
    vipnet: VipNetReducer
});
type TReducers = typeof reducers
export type TState = ReturnType<TReducers>
let store = createStore(reducers,applyMiddleware(thunkMiddleware));

export default store;