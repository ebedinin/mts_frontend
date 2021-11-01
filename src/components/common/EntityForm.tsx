import React from "react";
import {Button, Form, Input} from "antd";
import {FormInstance} from "antd/lib/form";
import {CheckOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import CSS from '../common/form.module.css'


interface IState<TEntity> {
    entity: TEntity
}

interface IDispatch<TEntity> {
    update: (entity: TEntity) => void,
    add: (entity: TEntity) => void,
    delete: (id: number) => void
}

interface IEntityForm<TEntity> extends IState<TEntity>, IDispatch<TEntity> {
}

export class EntityForm<TEntity extends { id?: number|undefined }> extends React.Component<IEntityForm<TEntity>> {
    forms = Form.useForm();
    form = this.forms[0];
    componentDidMount(): void {
        //this.form = Form.useForm()
    }

    layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 5},
    };
    tailLayout = {
        wrapperCol: {offset: 4, span: 5},
    };
    getEntityForm = (form: FormInstance) => {
        return {} as TEntity;
    };
    onAdd = () => {
        this.props.add(this.getEntityForm(this.form));
    };
    onUpdate = (id: number) => {
        let entity: TEntity = this.getEntityForm(this.form);
        entity.id = id;
        this.props.update(entity);
    };
    onDelete = (id: number) => {
        this.props.delete(id);
    };
    // Инициализация формы. Реализуется в классе предке
    initialValues = () => this.form.setFieldsValue([]);

    render() {

        return (
            <>
                <div className={CSS["form-block"]}>
                    <Form {...this.layout}
                          form={this.form}
                          layout="horizontal"
                          size={'middle'}
                    >
                        <Form.Item label="Название" name="name">
                            <Input/>
                        </Form.Item>

                        <Form.Item {...this.tailLayout}>
                            <Button icon={<PlusOutlined/>} onClick={() => this.onAdd()}/>
                            <Button icon={<CheckOutlined/>}
                                    onClick={() => this.props.entity.id && this.onUpdate(this.props.entity.id)}/>
                            <Button icon={<MinusOutlined/>}
                                    onClick={() => this.props.entity.id && this.onDelete(this.props.entity.id)}/>
                        </Form.Item>
                    </Form>
                </div>
            </>
        );
    }
}
//export default EntityForm