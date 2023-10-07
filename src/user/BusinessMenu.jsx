import React, { useRef, useState, useEffect } from 'react';

import {
    Page,
    Row,
    Col,
    Button
} from 'react-onsenui';

import OrderRegisterComponent from '../user/OrderRegister';
import OrderInfoConfirmComponent from '../user/OrderInfoConfirm';
import App from '../App';
/* 営業用メニュー Component*/
const BusinessMenuPage = (props) => {
    const [showBusinessMenu, setshowBusinessMenu] = useState(true);
    const [showOrderInfoConfirm, setOrderInfoConfirm] = useState(false);
    const [showOrderRegister, setshowOrderRegister] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    // 受注登録画面の移行
    const navigateToOrderRegister = () => {

        // 受注登録componentのナビゲート
        setshowLogin(false);
        setshowOrderRegister(true);
        setOrderInfoConfirm(false);
        setshowBusinessMenu(false);

    };

    // 受注情報確認画面の移行
    const navigateToOrderInfoConfirm = () => {
        // 受注情報確認componentのナビゲート
        setshowLogin(false);
        setshowOrderRegister(false);
        setOrderInfoConfirm(true);
        setshowBusinessMenu(false);

    };

    // ログイン画面の移行
    const navigateToLogin = () => {
        setshowLogin(true);
        setshowOrderRegister(false);
        setOrderInfoConfirm(false);
        setshowBusinessMenu(false);

    };
    return (
        <div>
            {showLogin && <App />}
            {showOrderRegister && <OrderRegisterComponent />}
            {showOrderInfoConfirm && <OrderInfoConfirmComponent />}
            {showBusinessMenu &&
                <div>
                    <Row>
                        <Col width="60">
                        </Col>
                        <Col width="40">
                            <Button large raised fill className='businessBtn' style={{ marginTop: '10px' }} onClick={navigateToLogin}>
                                ログアウト
                            </Button>
                        </Col>
                    </Row>
                    <p style={{ fontSize: 'x-large', marginTop: '25px', padding: '10px', textAlign: 'center', color: '#000' }}>メインメニュー

                    </p>


                    <Row style={{ marginTop: '10px' }}>
                        <Col width="20">
                        </Col>
                        <Col width="60">

                            <Button large raised fill className='menuBtn' onClick={navigateToOrderRegister}>
                                受注登録
                            </Button>
                        </Col>
                        <Col width="20">
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col width="20">
                        </Col>
                        <Col width="60">
                            <Button large raised fill className='menuBtn' onClick={navigateToOrderInfoConfirm}>
                                受注情報確認・編集
                            </Button>
                        </Col>
                        <Col width="20">
                        </Col>
                    </Row>
                </div>}
        </div>
    );
};

export default BusinessMenuPage;
