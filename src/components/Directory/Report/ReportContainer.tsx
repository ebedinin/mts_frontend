import React from "react";
import {
    reportType,
    TApiReport,
    TDeviceProfile,
    TDeviceProfileField,
    TReport,
    TReportDeviceProfileDetail
} from "../../../api/type";
import {TState} from "../../../store/store";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../Auth/withAuthRedirect";
import {Col, Divider, Row} from "antd";
import {
    addReport,
    addReportDeviceProfileDetail,
    delReport,
    delReportDeviceProfileDetail,
    getPageReport,
    getPageReportDeviceProfileDetail,
    getReport,
    getReportDeviceProfileDetail,
    updateReport,
    updateReportDeviceProfileDetail
} from "../../../store/reducers/ReportReduer";
import ReportForm from "./ReportForm";
import ReportList from "./ReportList";
import {getAllDeviceProfile, getCustomDeviceProfileField} from "../../../store/reducers/DeviceProfileReduer";
import {ReportDeviceProfileDetailForm} from "./ReportDeviceProfileDetailForm";
import ReportDeviceProfileDetailList from "./ReportDeviceProfileDetailList";

interface IMapStateToProps {
    report: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TReport,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TReport>,
        deviceProfiles: Array<TDeviceProfile>,
        device_profile_field: Array<TDeviceProfileField>
    },
    reportDeviceProfileDetail: {
        size_page: number,
        count: number,
        current_page: number,
        current_value: TReportDeviceProfileDetail,
        isLoadList: boolean,
        report: TApiReport,
        page: Array<TReportDeviceProfileDetail>,
        device_profile_field: Array<TDeviceProfileField>,
        report_id: number
    },
    isAuth: boolean
}

interface IMapDispatchToProps {
    addReport: (report: TReport) => Promise<void>,
    delReport: (id: number) => Promise<void>,
    getPageReport: (current_page: number, size_page: number) => Promise<void>,
    getReport: (report_id: number) => Promise<void>,
    updateReport: (report: TReport) => Promise<void>,
    addReportDeviceProfileDetail: (reportDeviceProfile: TReportDeviceProfileDetail) => Promise<void>,
    delReportDeviceProfileDetail: (id: number) => Promise<void>,
    getPageReportDeviceProfileDetail: (current_page: number, size_page: number, report: number) => Promise<void>,
    getReportDeviceProfileDetail: (reportDeviceProfile: number) => Promise<void>,
    updateReportDeviceProfileDetail: (reportDeviceProfile: TReportDeviceProfileDetail) => Promise<void>,
    getCustomDeviceProfileField: (listDeviceProfile?: Array<number>) => Promise<void>,
    getAllDeviceProfile: () => Promise<void>
}

interface IReportContainer extends IMapStateToProps, IMapDispatchToProps {

}

class ReportContainer extends React.Component<IReportContainer> {
    componentDidMount() {
        this.props.isAuth && this.props.getPageReport(this.props.report.current_page, this.props.report.size_page);
    };

    report = {
        delete: (id: number): void => {
            this.props.delReport(id);
        },
        add: (value: TReport): void => {
            this.props.addReport(value);
        },
        update: (value: TReport): void => {
            this.props.updateReport(value);
        },
        onClickPage: (page: number): void => {
            this.props.getPageReport(page, this.props.report.size_page);
        },
        onClickRow: (id: number): void => {
            this.props.getReport(id);
        }
    };
    reportDeviceProfileDetail = {
        delete: (id: number): void => {
            this.props.delReportDeviceProfileDetail(id);
        },
        add: (value: TReportDeviceProfileDetail): void => {
            this.props.addReportDeviceProfileDetail(value);
        },
        update: (value: TReportDeviceProfileDetail): void => {
            this.props.updateReportDeviceProfileDetail(value);
        },
        onClickPage: (page: number): void => {
            this.props.getPageReportDeviceProfileDetail(page, this.props.reportDeviceProfileDetail.size_page, this.props.report.current_value.id as number);
        },
        onClickRow: (id: number): void => {
            this.props.getReportDeviceProfileDetail(id);
            //this.props.getAllDeviceProfile();
        }
    };

    render() {
        return (
            <Row>
                <Col span={10}>
                    <Divider orientation="left">Отчёт</Divider>
                    <ReportForm report={this.props.report.current_value}
                                deviceProfiles={this.props.report.deviceProfiles}
                                update={this.report.update}
                                add={this.report.add}
                                delete={this.report.delete}/>
                    <ReportList size_page={this.props.report.size_page}
                                count={this.props.report.count}
                                current_page={this.props.report.current_page}
                                current_value={this.props.report.current_value}
                                isLoadList={this.props.report.isLoadList}
                                report={this.props.report.report}
                                page={this.props.report.page}
                                onClickPage={this.report.onClickPage}
                                onClickRow={this.report.onClickRow}
                                onDelete={this.report.delete}
                    />
                </Col>
                {this.props.report.current_value.id &&
                this.props.report.current_value.type === reportType.REPORT_DEVICE_PROFILE ?
                    <Col span={10} offset={2}>
                        <Divider orientation="left">Отчёт "{this.props.report.current_value.name}"</Divider>
                        <ReportDeviceProfileDetailForm
                            reportDeviceProfileDetail={this.props.reportDeviceProfileDetail.current_value}
                            report_id={this.props.report.current_value.id}
                            device_profile_field={this.props.reportDeviceProfileDetail.device_profile_field}
                            update={this.reportDeviceProfileDetail.update}
                            add={this.reportDeviceProfileDetail.add}
                            delete={this.reportDeviceProfileDetail.delete}/>
                        {<ReportDeviceProfileDetailList size_page={this.props.reportDeviceProfileDetail.size_page}
                            count={this.props.reportDeviceProfileDetail.count}
                            current_page={this.props.reportDeviceProfileDetail.current_page}
                            current_value={this.props.reportDeviceProfileDetail.current_value}
                            isLoadList={this.props.reportDeviceProfileDetail.isLoadList}
                            report={this.props.reportDeviceProfileDetail.report}
                            page={this.props.reportDeviceProfileDetail.page}
                            device_profile_field={this.props.reportDeviceProfileDetail.device_profile_field}
                            onClickPage={this.reportDeviceProfileDetail.onClickPage}
                            onClickRow={this.reportDeviceProfileDetail.onClickRow}
                            onDelete={this.reportDeviceProfileDetail.delete}
                            />}
                    </Col> :
                    <div>

                    </div>
                }
            </Row>
        )
    }
}


const MapStateToProps = (state: TState) => {
    return {
        report: {
            size_page: state.report.itemsReport.size_page,
            count: state.report.itemsReport.count,
            current_page: state.report.itemsReport.current_page,
            current_value: state.report.itemsReport.current_value,
            isLoadList: state.report.itemsReport.isLoadList,
            report: state.report.itemsReport.report,
            page: state.report.itemsReport.page,
            deviceProfiles: state.deviceProfile.itemsDeviceProfile.allItems,
        },
        reportDeviceProfileDetail: {
            size_page: state.report.itemsReportDeviceProfileDetail.size_page,
            count: state.report.itemsReportDeviceProfileDetail.count,
            current_page: state.report.itemsReportDeviceProfileDetail.current_page,
            current_value: state.report.itemsReportDeviceProfileDetail.current_value,
            isLoadList: state.report.itemsReportDeviceProfileDetail.isLoadList,
            report: state.report.itemsReportDeviceProfileDetail.report,
            page: state.report.itemsReportDeviceProfileDetail.page,
            device_profile_field: state.deviceProfile.itemsDeviceProfileField.custemItems,
            report_id: state.report.itemsReportDeviceProfileDetail.current_value.id
        },
        isAuth: state.auth.name !== ""
    }
};

export default compose(connect(MapStateToProps, {
    addReport,
    delReport,
    getPageReport,
    getReport,
    updateReport,
    getAllDeviceProfile,
    getCustomDeviceProfileField,
    updateReportDeviceProfileDetail,
    getReportDeviceProfileDetail,
    delReportDeviceProfileDetail,
    addReportDeviceProfileDetail,
    getPageReportDeviceProfileDetail
}), withAuthRedirect)(ReportContainer);