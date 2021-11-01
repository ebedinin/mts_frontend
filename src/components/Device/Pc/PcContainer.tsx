import React from 'react'
import {TApiReport, TPc} from "../../../api/type";
import {TState} from "../../../store/store";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../Auth/withAuthRedirect";
import PcList from "./PcList";
import {applyPc, getPagePc, getPc, updatePc} from "../../../store/reducers/PCReducer";

interface IMapStateToProps {
    size_page: number,
    count: number,
    current_page: number,
    current_value: TPc,
    isLoadList: boolean,
    report: TApiReport,
    page: Array<TPc>,
    isAuth: boolean
}

interface IMapDispatchToProps {
    getPagePc: (current_page: number, size_page: number) => Promise<void>,
    getPc: (deviceid: number) => Promise<void>,
    updatePc: (device: TPc) => Promise<void>
    applyPc: (id:number, flag: boolean) => Promise<void>
}

interface IPcContainer extends IMapStateToProps, IMapDispatchToProps {

}

class PcContainer extends React.Component<IPcContainer> {
    componentDidMount() {
        this.props.isAuth && this.props.getPagePc(this.props.current_page, this.props.size_page);
    };
    apply = (id:number, flag: boolean): void => {
        this.props.applyPc(id, flag)
    };
    update = (value: TPc): void => {
        this.props.updatePc(value);
    };
    onClickPage = (page: number): void => {
        this.props.getPagePc(page, this.props.size_page);
    };
    onClickRow = (id: number): void => {
        this.props.getPc(id);
    };

    render() {
        return (
            <div>
                <PcList size_page={this.props.size_page}
                            count={this.props.count}
                            current_page={this.props.current_page}
                            current_value={this.props.current_value}
                            isLoadList={this.props.isLoadList}
                            report={this.props.report}
                            page={this.props.page}
                            onClickPage={this.onClickPage}
                            onClickRow={this.onClickRow}
                            onApply={this.apply}
                />
            </div>

        )
    }
}

const MapStateToProps = (state: TState) => {
    return {
        size_page: state.pc.itemsPc.size_page,
        count: state.pc.itemsPc.count,
        current_page: state.pc.itemsPc.current_page,
        current_value: state.pc.itemsPc.current_value,
        isLoadList: state.pc.itemsPc.isLoadList,
        report: state.pc.itemsPc.report,
        page: state.pc.itemsPc.page,
        isAuth: state.auth.name!==""
    }
};

export default compose(connect(MapStateToProps, {
    getPagePc,
    getPc,
    updatePc,
    applyPc
}), withAuthRedirect)(PcContainer);