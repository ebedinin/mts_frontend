import React from "react";
import {Card, Col, Row} from "antd";

import CSS from '../common/card.module.css'

const Home: React.FC = () => {
    return <>
        <Row className={CSS["site-card"]}>
            <Col>
                <Card title="Учет технических средств" bordered={false} style={{width: 300}}>

                </Card>
            </Col>
        </Row>
    </>
};

export default Home