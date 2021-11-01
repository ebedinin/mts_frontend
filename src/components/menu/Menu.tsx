import React from 'react';
import {Menu as AntMenu} from 'antd';
import {ClickParam} from "antd/lib/menu";
import {connect} from "react-redux";
import {actions, contents, TContents} from "../../store/reducers/AppReducer";
import {TState} from "../../store/store";

const { SubMenu } = AntMenu;

interface IState {
    content: TContents
}

interface IDispatch {
    set_content: (content: TContents)=> void;
}

interface IMenu extends IState, IDispatch {
}

const Menu: React.FC<IMenu> = (props) =>{
    let handleClick = (event: ClickParam) => {
        switch (event.key) {
            case contents.ADD: {
                props.set_content(event.key);
                break;
            }
            case contents.DEVICE_PROFILE: {
                props.set_content(event.key);
                break;
            }
            case contents.REPORT_CONFIGURATION: {
                props.set_content(event.key);
                break;
            }
            case contents.OVD: {
                props.set_content(event.key);
                break;
            }
            case contents.DEPARTMENT: {
                props.set_content(event.key);
                break;
            }
            case contents.PC: {
                props.set_content(event.key);
                break;
            }
            case contents.VIPNET: {
                props.set_content(event.key);
                break;
            }

        }
    };
    return <>
        <AntMenu
            onClick={handleClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['1']}
            mode={'horizontal'}
            theme={'dark'}
        >
            <AntMenu.Item key={contents.ADD}>
                Добавление
            </AntMenu.Item>
            <AntMenu.Item key="ALLOCATE">
                Распределение
            </AntMenu.Item>
            <AntMenu.Item key="REDISTRIBUTION">
                Перераспределение
            </AntMenu.Item>
            <AntMenu.Item key="REPAIRS">
                Ремонт
            </AntMenu.Item>
            <AntMenu.Item key="DEBIT">
                Списание
            </AntMenu.Item>
            <SubMenu key="sub1" title="Справочники">
                <AntMenu.Item key="OVD">ОВД</AntMenu.Item>
                <AntMenu.Item key="DEPARTMENT">Подразделения</AntMenu.Item>
                <AntMenu.Item key="NOMENCLATURE">Номенклатура</AntMenu.Item>
                <AntMenu.Item key={contents.DEVICE_PROFILE}>Профили устройство</AntMenu.Item>
                <AntMenu.Item key={contents.REPORT_CONFIGURATION}>Отчёты</AntMenu.Item>
            </SubMenu>
            <AntMenu.Item key="INPUT_DATA">
                Ввод данных
            </AntMenu.Item>
            <SubMenu key="sub2" title="Отчёты">
                <AntMenu.Item key="REPORT_1">Отчёты 1</AntMenu.Item>
                <AntMenu.Item key="REPORT_2">Отчёты 2</AntMenu.Item>
            </SubMenu>
            <AntMenu.Item key={contents.PC}>
                ПЭВМ
            </AntMenu.Item>
            <AntMenu.Item key={contents.VIPNET}>
                VipNet
            </AntMenu.Item>
        </AntMenu>
    </>
};
const MapStateToProps = (state: TState) =>
{
  return {
      content: state.app.content
  }
};
export default connect(MapStateToProps,{set_content: actions.set_content})(Menu);