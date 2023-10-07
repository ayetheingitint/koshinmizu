import React, { useRef, useState, useEffect } from 'react';
import {
    Page,
    Input, Toast,
    List, Checkbox,
    ListItem, Dialog,
    Row,
    Col, Radio,
    Button
} from 'react-onsenui';

import OrderInfoRegisterComponent from '../user/OrderInfoRegister';
import BusinessMenuComponent from '../user/BusinessMenu';
import App from '../App';
/*受注登録確認  Component*/
const OrderInfoRegisterConfirmPage = (props) => {
    const [selectedSummarycodeValue, setselectedSummarycodeValue] = useState('');
    const [summaryName1, setsummaryName1] = useState('');
    const [summaryName2, setsummaryName2] = useState('');
    const [quantity, setquantity] = useState(0);
    const [selectedProductOption, setselectedProductOption] = useState('');
    const [selectedProductItem, setselectedProductItem] = useState([]);
    const [showOrderInfoRegister, setshowOrderInfoRegister] = useState(false);
    const [showOrderRegisterConfirm, setshowOrderRegisterConfirm] = useState(true);
    const [showLogin, setshowLogin] = useState(false);
    const [showBusinessMenu, setshowBusinessMenu] = useState(false);
    const [popupOpened, setPopupOpened] = useState(false);
    console.log('受注登録リストの印刷 Confirm orderinfoobjectList>>>>>>>>>', props.orderinfoobjectList);
    console.log('受注登録リストの印刷 Confirm selectedProductItemList>>>>>>>>>', props.selectedProductItemList);

    const navigateToOrderInfoRegisterConfirmation = () => {
        /*  受注登録関数呼び出し*/
        postOrderDataAPI();
    }

    /*  受注登録関数*/
    const postOrderDataAPI = async () => {
        try {
            console.log('受注登録リストの印刷', props.orderinfoobjectList);
            /*  受注登録API呼び出し*/
            const response = await fetch("http://127.0.0.1:3000/order/registerorder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(props.orderinfoobjectList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());

                /*  受注明細登録関数呼び出し*/
                /*  Parameter→受注明細List*/
                postOrderDetailDataAPI(props.selectedProductItemList);


            } else {
                console.log("データ取得エラー", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    };
    /*  受注明細登録関数*/
    /*  Input Parameter→受注明細List*/
    const postOrderDetailDataAPI = async (orderinfodetailproductobjectList) => {
        try {
            console.log('受注明細リストの印刷>>>>>', orderinfodetailproductobjectList);
            /* 受注明細登録API呼び出し*/
            const response = await fetch("http://127.0.0.1:3000/order/registerorderdetail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderinfodetailproductobjectList),
            });
            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
                /*  摘要更新関数呼び出し*/
                /*  Parameter→受注明細データList*/
                // updateSummaryDataAPI(orderinfodetailproductobjectList);
                /*  備考更新関数呼び出し*/
                /*  Parameter→受注データList*/
                updateRemarkDataAPI(props.orderinfoobjectList);
                openPopup();
            } else {
                console.log("データ取得エラー", await response.json());

            }


        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }


    };
    /*  摘要更新関数*/
    /*  Input Parameter→受注明細データList*/
    const updateSummaryDataAPI = async (orderinfodetailproductobjectList) => {
        console.log('受注明細リストの印刷>>>>>', orderinfodetailproductobjectList);
        try {
            /* 摘要更新API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/summary/updatesummarydata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderinfodetailproductobjectList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
            } else {
                console.log("データ取得エラー", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    }
    /*  備考更新関数*/
    /*  Input Parameter→受注データList*/
    const updateRemarkDataAPI = async (updatedRemarkOrderList) => {
        console.log('受注リストの印刷>>>>>', updatedRemarkOrderList);

        try {
            /* 備考更新API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/remark/updateremarkdata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRemarkOrderList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
            } else {
                console.log("データ取得エラー:", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    }

    /*  受注情報の登録成功ポップアップ開く*/
    const openPopup = () => {
        setPopupOpened(true);
    };
    /* 受注情報の登録成功ポップアップ閉じる*/
    const closePopup = () => {
        setPopupOpened(false);
        setshowLogin(false);
        // 営業用メニューcomponentのナビゲート     
        setshowBusinessMenu(true);
        setshowOrderInfoRegister(false);
        setshowOrderRegisterConfirm(false);

    };
    // 営業用メニューの移行
    const navigateToBusinessMenu = () => {
        closePopup();
        localStorage.removeItem('orderInfoData');
        localStorage.removeItem('orderInfoProductData');
        localStorage.removeItem('selectedProductItem');
        localStorage.removeItem('customerName');
        localStorage.removeItem('orderinfoobjectList');
    }
    //受注情報登録画面の移行
    const navigateToOrderInfoRegister = () => {
        // 受注情報登録componentのナビゲート
        setshowLogin(false);
        setshowBusinessMenu(false);
        setshowOrderInfoRegister(true);
        setshowOrderRegisterConfirm(false);

    }
    // ログイン画面の移行
    const navigateToLogin = () => {
        setshowLogin(true);
        setshowBusinessMenu(false);
        setshowOrderInfoRegister(false);
        setshowOrderRegisterConfirm(false);

    };

    // 商品選択する
    //Input Parameter→Userが選択した商品
    const handleOptionProductChange = (event) => {
        console.log('props.selectedProductItemList', props.selectedProductItemList);
        setselectedProductItem([]);
        const selectedValue = event.target.value;
        setselectedProductOption(selectedValue);
        // 対応する商品を検索
        const selectedItem = props.selectedProductItemList.find((item) => item.product_code === selectedValue);
        //商品あるかどうか確認
        if (selectedItem) {
            // 有場合
            setselectedProductItem(selectedItem);
            setquantity(selectedItem.quantity);
            setselectedSummarycodeValue(selectedItem.summary_code);
            setsummaryName1(selectedItem.summary_1);
            setsummaryName2(selectedItem.summary_2);

        }

    };
    return (
        <div>
            {showLogin && <App />}
            {showBusinessMenu && <BusinessMenuComponent />}
            {showOrderInfoRegister && <OrderInfoRegisterComponent />}
            {showOrderRegisterConfirm &&
                <Page contentStyle={{
                    overflowY: 'scroll', // Enable vertical scrolling
                    height: '100%', // Set the height to ensure the page takes up the full viewport
                }}>
                    <Row>
                        <Col width="60">
                        </Col>
                        <Col width="40">
                            <Button large raised fill className='businessBtn' style={{ marginTop: '10px' }} onClick={navigateToLogin}>
                                ログアウト
                            </Button>
                        </Col>
                    </Row>
                    <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注情報の登録確認

                    </p>
                    <p style={{ padding: '10px', textAlign: 'center', color: '#000' }}>受注情報の登録内容を確認してください。
                    </p>
                    <Row className="custom-row">

                        <Row>
                            <label className="custom-label">受注情報（得意先）</label>
                        </Row>

                        <table className="custom-table">
                            <tr> <th className="custom-tableth">
                                受注日付
                            </th>

                                <td className="custom-tabletd">
                                    <span className="custom-span">  {props.orderinfoobjectList[0].order_date}</span>
                                </td>
                            </tr>
                            <tr>
                                <th className="custom-tableth"> 売掛区分</th>


                                <td className="custom-tabletd">
                                    <span className="custom-span">   {props.orderinfoobjectList[0].account_type} : {props.orderinfoobjectList[0].account_type_name}</span>
                                </td>

                            </tr>


                            <tr>
                                <th className="custom-tableth"> 倉庫コード</th>

                                <td className="custom-tabletd">

                                    <span className="custom-span">    {props.orderinfoobjectList[0].warehouse_code} : {props.orderinfoobjectList[0].warehouse_name}</span>
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth">納品日</th>
                                <td className="custom-tabletd">
                                    <span className="custom-span">  {props.orderinfoobjectList[0].delivery_date}</span>
                                </td>
                            </tr>

                            <tr>
                                <th className="custom-tableth"> 納品先コード</th>

                                <td className="custom-tabletd">

                                    <span className="custom-span">   {props.orderinfoobjectList[0].delivery_destination_code} : {props.orderinfoobjectList[0].delivery_destination_name}</span>
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth">備考コード</th>
                                <td className="custom-tabletd">
                                    <span className="custom-span">   {props.orderinfoobjectList[0].remark_code} : {props.orderinfoobjectList[0].remarks}</span>
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">備考</th>
                                <td className="custom-tabletd">
                                    <span className="custom-span"> {props.orderinfoobjectList[0].remarks}</span>
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    受注メモ
                                </th>
                                <td className="custom-tabletd">

                                    <span className="custom-span">   {props.orderinfoobjectList[0].order_memo}</span>
                                </td>

                            </tr>

                        </table>
                    </Row>


                    <Row className="custom-row">
                        <label className="custom-label">受注登録商品
                        </label>
                    </Row>



                    {props.selectedProductItemList &&
                        <Row className="custom-row">
                            <Col>

                                <List className="custom-list">
                                    <ListItem>

                                        <div className="item-title">商品コード</div>
                                        <div className="item-title">商品名</div>

                                    </ListItem>


                                    {
                                        props.selectedProductItemList.map((productItem) => (
                                            // <ListItem key={customerItem.id} onClick={() => handleCustomerItemClick(customerItem)}>
                                            <ListItem key={productItem.product_code} >
                                                <Radio
                                                    inputId={productItem.product_code}
                                                    checked={selectedProductOption === productItem.product_code}
                                                    onChange={handleOptionProductChange}
                                                    value={productItem.product_code}
                                                    name="radio-group"
                                                    modifier='material' />
                                                <div className="item-title">{productItem.product_code}</div>
                                                <div className="item-title">{productItem.product_name}</div>

                                            </ListItem>
                                        ))
                                    }

                                </List>

                            </Col>

                        </Row>
                    }

                    <Row className="custom-row">

                        <Row>
                            <label className="custom-label">受注情報（商品）
                            </label>
                        </Row>

                        <table className="custom-table">
                            <tr>
                                <th className="custom-tableth">
                                    数量
                                </th>
                                <td className="custom-tabletd">
                                    <span className="custom-span">    {selectedProductItem.quantity}</span>
                                </td>

                            </tr>



                            <tr>
                                <th className="custom-tableth"> 摘要コード</th>

                                <td className="custom-tabletd">

                                    <span className="custom-span">  {selectedProductItem.summary_code}  {selectedProductItem.summary_code ? ':' : null}    {selectedProductItem.summary_1}</span>
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要1

                                </th>
                                <td className="custom-tabletd">
                                    <span className="custom-span">   {selectedProductItem.summary_1}</span>
                                </td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要2

                                </th>
                                <td className="custom-tabletd">
                                    <span className="custom-span"> {selectedProductItem.summary_2}</span>
                                </td>
                            </tr>

                        </table>
                    </Row>
                    <Row>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoRegister}>
                                戻る
                            </Button>

                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoRegisterConfirmation} >
                                登録

                            </Button>
                        </Col>
                    </Row>





                    {/* 成功ポップアップ */}
                    <Dialog isOpen={popupOpened} className='successDialog'>

                        <p style={{ fontSize: 'medium', marginTop: '50px', textAlign: 'center', color: '#000' }}>受注情報の登録に成功しました。
                        </p>
                        <Row style={{ marginTop: '30px' }}>
                            <Col></Col>
                            <Col></Col>
                            <Col>
                                <Button large raised fill onClick={navigateToBusinessMenu} className="OKBtn">OK
                                </Button>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>

                    </Dialog>
                </Page>}
        </div>
    );
};
export default OrderInfoRegisterConfirmPage;