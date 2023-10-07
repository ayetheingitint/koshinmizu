import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Radio,
    Col,
    Button
} from 'react-onsenui';

import App from '../App';
import BusinessMenuComponent from '../user/BusinessMenu';
import OrderInfoUpdateComponent from '../user/OrderInfoUpdate';
import { BASE_URL } from './../env'; // env ファイルから BASE_URL (環境変数) をインポートします。
/*受注情報確認画面Component*/
const OrderInfoConfirmPage = (props) => {
    const [showOrderInfoUpdate, setshowOrderInfoUpdate] = useState(false);
    const [showOrderInfoConfirm, setOrderInfoConfirm] = useState(true);
    const [showBusinessMenu, setshowBusinessMenu] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    const [fromDeliveryDate, setFromDeliveryDate] = useState('');
    const [toDeliveryDate, setToDeliveryDate] = useState('');
    const [validationError, setValidationError] = useState('');
    const [orderInfoList, setorderInfoList] = useState([]);
    const [selectedCustomerOrderItem, setselectedCustomerOrderItem] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [productList, setproductList] = useState([]);
    const [selectedProductOption, setselectedProductOption] = useState('');
    const [selectedProductOrderItem, setselectedProductOrderItem] = useState([]);
    const [currentLoginInChargeCode, setcurrentLoginInChargeCode] = useState([]);
    const [searchStatus, setsearchStatus] = useState(false);
    // 初期状態
    useEffect(() => {
        //ログインユーザーデータ取得
        const inchargecode = JSON.parse(localStorage.getItem('inchargeData')).in_charge_code
        setcurrentLoginInChargeCode(inchargecode);//担当者ｺｰﾄﾞ設定する
        console.log('担当者ｺｰﾄﾞ', inchargecode);

    }, []);

    // 選択した受注情報に含まれる商品リストを取得関数    
    const fetchProductDataByOrderNumber = async (searchordernumber) => {
        try {
            // 選択した受注情報に含まれる商品リストを取得API呼び出し
            console.log('selected orderNumber', searchordernumber);
            const response = await fetch(`${BASE_URL}/product_masters/searchordernumber?searchordernumber=${searchordernumber}`)
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setproductList(jsonData); // 商品List にAPIからのレスポンスデータを設定

        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    //  納品日「From Date]変更処理
    const handleFromDeliveryDateChange = (event) => {
        const selectedDate = event.target.value;
        setFromDeliveryDate(selectedDate);//納品日「From Date]設定
        /*  納品日「From Date]と納品日「To Date ]の検証をチェック関数呼び出し*/
        /* Parameter➞ 納品日「From Date]／納品日「To Date ]*/
        validateDateRange(selectedDate, toDeliveryDate);
    };

    //  納品日「To Date ]変更処理
    const handleToDeliveryDateChange = (event) => {
        const selectedDate = event.target.value;
        setToDeliveryDate(selectedDate);//納品日「To Date]設定
        /* 納品日「From Date]と納品日「To Date ]の検証をチェック関数呼び出し*/
        /* Parameter➞納品日「From Date]／納品日「To Date ]*/
        validateDateRange(fromDeliveryDate, selectedDate);
    };

    /* 納品日「From Date]と納品日「To Date ]の検証をチェック関数*/
    /* Input Parameter➞納品日「From Date]／納品日「To Date ]*/
    const validateDateRange = (from, to) => {
        /*   納品日「From Date]は納品日「To Date ]より前であるかどうか確認 */
        if (from && to && from > to) {
            /* 納品日「From Date]は納品日「To Date ]より前でない場合*/
            setValidationError('開始日は終了日より前である必要があります。');
        } else {
            /*納品日「From Date]は納品日「To Date ]より前である場合*/
            setValidationError('');
        }
    };

    /*納品日検索*/
    const searchOrderDataByDeliveryDate = async () => {
        try {
            setSelectedOption('');
            setselectedCustomerOrderItem([]);
            setselectedProductOrderItem([]);   
            setselectedProductOption('');         
            setsearchStatus(true); //検索ステータスを True に設定
            /* 納品日「From Date]／納品日「To Date ]チェック*/
            if (fromDeliveryDate && toDeliveryDate) {
                // 有場合
                setorderInfoList([]);
                /*  納品日と担当者ｺｰﾄﾞで検索API呼び出し*/
                const response = await fetch(`${BASE_URL}/orders/search_by_date_range_inchargecode?from_date=${fromDeliveryDate}&to_date=${toDeliveryDate}&searchbyinchargecode=${currentLoginInChargeCode}`);
                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                console.log('APIからのレスポンスデータ:', jsonData);
                setorderInfoList(jsonData);  //受注情報List にAPIからのレスポンスデータを設定                

            }
            else {
                // 無し場合
                setsearchStatus(false);
                setorderInfoList([]); /* 受注情報データListクリア一*/
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
        }

    }

    //受注情報選択する
    //Input Parameter→Userが選択した受注情報
    const handleOptionChange = (event) => {
        setselectedCustomerOrderItem([]);
        setselectedProductOption('');
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedItem = orderInfoList.find((item) => item.order_number === selectedValue);
        // 選択した受注が受注情報リストにあるかどうか確認 
        if (selectedItem) {
            //選択した項目をオブジェクトリストに設定する
            setselectedCustomerOrderItem(selectedItem);
            //選択した受注情報に含まれる商品リストを取得関数呼び出し
            // Parameter→Userが選択した受注No.   
            fetchProductDataByOrderNumber(selectedItem.order_number);
        }

    };

    //商品選択する
    //Input Parameter→Userが選択した商品
    const handleOptionProductChange = (event) => {
        setselectedProductOrderItem([]);
        const selectedProductValue = event.target.value;
        setselectedProductOption(selectedProductValue);
        const selectedProductOrderItem = productList.find((item) => item.product_code === selectedProductValue);
        // 選択した商品が商品リストにあるかどうか確認 
        if (selectedProductOrderItem) {
            //選択した項目をオブジェクトリストに設定する
            setselectedProductOrderItem(selectedProductOrderItem);
        }

    };

    // ログイン画面の移行
    const navigateToLogin = () => {
        setshowOrderInfoUpdate(false);
        setshowBusinessMenu(false);
        setshowLogin(true);
        setOrderInfoConfirm(false);
    };

    // 営業用メニューの移行
    const navigateToBusinessMenu = () => {
        // 営業用メニューcomponentのナビゲート
        setshowOrderInfoUpdate(false);
        setshowBusinessMenu(true);
        setshowLogin(false);
        setOrderInfoConfirm(false);
    }

    // 受注情報編集画面の移行
    const navigateToOrderInfoUpdate = () => {
        // 受注情報編集 componentのナビゲート
        setshowOrderInfoUpdate(true);
        setshowBusinessMenu(false);
        setshowLogin(false);
        setOrderInfoConfirm(false);
    }
    return (
        <div>
            {showLogin && <App />}
            {showBusinessMenu && <BusinessMenuComponent />}
            {showOrderInfoUpdate && <OrderInfoUpdateComponent selectedCustomerOrderItem={selectedCustomerOrderItem} productList={productList} />}
            {showOrderInfoConfirm &&
                <Page contentStyle={{
                    overflowY: 'scroll', // Enable vertical scrolling
                    height: '100%', // Set the height to ensure the page takes up the full viewport
                }} >

                    <Row>
                        <Col width="60">
                        </Col>
                        <Col width="40">
                            <Button large raised fill className='businessBtn' style={{ marginTop: '10px' }} onClick={navigateToLogin}>
                                ログアウト
                            </Button>
                        </Col>
                    </Row>
                    <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注情報確認
                    </p>


                    <Row className="custom-row">
                        <label className="custom-label">納品日検索

                        </label>
                    </Row>
                    <Row className="custom-row">
                        <Col className="custom-search-input-orderinfoconfirm-fromdate">
                            <Input outline

                                type="text"
                                value={fromDeliveryDate}
                                placeholder='YYYY/MM/DD'

                                onChange={handleFromDeliveryDateChange} />
                            {validationError && (
                                <div style={{ color: 'red' }}>{validationError}</div>
                            )}
                        </Col>
                        <Col className="interfaceDiv">~</Col>
                        <Col className="custom-search-input-orderinfoconfirm-todate">
                            <Input outline

                                type="text"
                                id="toDeliveryDate"
                                value={toDeliveryDate}
                                placeholder='YYYY/MM/DD'
                                onChange={handleToDeliveryDateChange} />

                        </Col>
                        <Col>
                            <Button large raised fill className="searchBtnMobile" onClick={searchOrderDataByDeliveryDate}>
                                検索
                            </Button>
                        </Col>
                    </Row>
                    <Row className="custom-row">
                        <label className="custom-label">検索結果</label>
                    </Row>
                    {orderInfoList.length == 0 && searchStatus == false && (
                        <Row>
                            <div style={{ color: '#0076ff', fontSize: '14px', marginLeft: '10px' }}>納品日でデータを検索してください!!!</div>
                        </Row>
                    )}

                    {orderInfoList.length == 0 && searchStatus == true && (
                        <Row className="custom-row">
                            <div style={{ color: 'red', fontSize: '20px', marginLeft: '17px' }}>検索データが見つかりません!!!</div>
                        </Row>
                    )}

                    <Row className="custom-row">
                        <Col>
                            <List className="custom-list">
                                <ListItem>
                                    <div className="item-title-orderinfoconfirm">納品日</div>
                                    <div className="item-title-orderinfoconfirm">受注日付</div>
                                    <div className="item-title-orderinfoconfirm">受注№</div>
                                    <div className="item-title-orderinfoconfirm">得意先名</div>


                                </ListItem>

                                {orderInfoList && searchStatus == true &&
                                    orderInfoList.map((orderItem) => (
                                        <ListItem key={orderItem.order_number}>
                                            <Radio
                                                inputId={orderItem.order_number}
                                                checked={selectedOption === orderItem.order_number}
                                                onChange={handleOptionChange}
                                                value={orderItem.order_number}
                                                name="order-radio-group"
                                                modifier='material' />
                                            <div className="item-title-orderinfoconfirm-content" >{orderItem.delivery_date}</div>
                                            <div className="item-title-orderinfoconfirm-content"  >{orderItem.order_date}</div>
                                            <div className="item-title-orderinfoconfirm-content"  >{orderItem.order_number}</div>
                                            <div className="item-title-orderinfoconfirm-content"  >{orderItem.customer_name}</div>

                                        </ListItem>


                                    ))
                                }


                            </List>

                        </Col>

                    </Row>

                    <Row className="custom-row">
                        <Row>
                            <label className="custom-label">受注情報（得意先）</label>
                        </Row>
                        <table className="custom-table">
                            <tr> <th className="custom-tableth">
                                受注日付
                            </th>

                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">
                                            {selectedCustomerOrderItem.order_date ? `${new Date(selectedCustomerOrderItem.order_date).getFullYear()}/${String(new Date(selectedCustomerOrderItem.order_date).getMonth() + 1).padStart(2, '0')}/${String(new Date(selectedCustomerOrderItem.order_date).getDate()).padStart(2, '0')}` : null}
                                        </span>)}
                                </td>
                            </tr>
                            <tr>
                                <th className="custom-tableth"> 売掛区分</th>


                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 &&  searchStatus == true && (
                                        <span className="custom-span">   {selectedCustomerOrderItem.account_type} {selectedCustomerOrderItem.account_type ? ':' : null}{selectedCustomerOrderItem.account_type_name}</span>)}
                                </td>

                            </tr>


                            <tr>
                                <th className="custom-tableth"> 倉庫コード</th>

                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">    {selectedCustomerOrderItem.warehouse_code} {selectedCustomerOrderItem.warehouse_code ? ':' : null} {selectedCustomerOrderItem.warehouse_name}</span>)}
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth">納品日</th>
                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">
                                            {selectedCustomerOrderItem.delivery_date ? `${new Date(selectedCustomerOrderItem.delivery_date).getFullYear()}/${String(new Date(selectedCustomerOrderItem.delivery_date).getMonth() + 1).padStart(2, '0')}/${String(new Date(selectedCustomerOrderItem.delivery_date).getDate()).padStart(2, '0')}` : null}
                                        </span>)}
                                </td>
                            </tr>

                            <tr>
                                <th className="custom-tableth"> 納品先コード</th>

                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">   {selectedCustomerOrderItem.delivery_destination_code}  {selectedCustomerOrderItem.delivery_destination_code ? ':' : null} {selectedCustomerOrderItem.delivery_destination_name}</span>)}
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth">備考コード</th>
                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">   {selectedCustomerOrderItem.remark_code} {selectedCustomerOrderItem.remark_code ? ':' : null} {selectedCustomerOrderItem.remarks}</span>)}
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">備考</th>
                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span"> {selectedCustomerOrderItem.remarks}</span>
                                    )}
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    受注メモ
                                </th>
                                <td className="custom-tabletd">
                                    {selectedCustomerOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">   {selectedCustomerOrderItem.order_memo}</span>
                                    )}
                                </td>

                            </tr>

                        </table>
                    </Row>

                    <Row className="custom-row">
                        <label className="custom-label">受注登録商品
                        </label>
                    </Row>

                    <Row className="custom-row">
                        <Col>

                            <List className="custom-list">
                                <ListItem>
                                    <div className="item-title">商品コード</div>
                                    <div className="item-title">商品名</div>
                                </ListItem>
                                {selectedOption && orderInfoList.length >0 && searchStatus == true &&
                                    productList.map((productItem) => (
                                        // <ListItem key={customerItem.id} onClick={() => handleCustomerItemClick(customerItem)}>
                                        <ListItem key={productItem.product_code} >
                                            <Radio
                                                inputId={productItem.product_code}
                                                checked={selectedProductOption === productItem.product_code}
                                                onChange={handleOptionProductChange}
                                                value={productItem.product_code}
                                                name="product-radio-group"
                                                modifier='material' />
                                            <div className="item-title">{productItem.product_code}</div>
                                            <div className="item-title">{productItem.product_name}</div>

                                        </ListItem>
                                    ))
                                }


                            </List>

                        </Col>

                    </Row>


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
                                    {selectedProductOption && selectedProductOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">
                                            {selectedProductOrderItem.quantity}</span>)}
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth"> 摘要コード</th>

                                <td className="custom-tabletd">
                                    {selectedProductOption && selectedProductOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">  {selectedProductOrderItem.summary_code}  {selectedProductOrderItem.summary_code ? ':' : null}  {selectedProductOrderItem.summary_1}</span>)}
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要1

                                </th>
                                <td className="custom-tabletd">
                                    {selectedProductOption && selectedProductOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span">   {selectedProductOrderItem.summary_1}</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要2

                                </th>
                                <td className="custom-tabletd">
                                    {selectedProductOption && selectedProductOrderItem && orderInfoList.length >0 && searchStatus == true && (
                                        <span className="custom-span"> {selectedProductOrderItem.summary_2}</span>
                                    )}
                                </td>
                            </tr>

                        </table>
                    </Row>

                    <Row>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToBusinessMenu}>
                                戻る
                            </Button>

                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoUpdate} disabled={selectedCustomerOrderItem.printed_flag === 1}>
                                編集

                            </Button>
                        </Col>
                    </Row>


                </Page>}
        </div>
    );
};
export default OrderInfoConfirmPage;