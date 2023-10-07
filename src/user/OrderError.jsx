import React, { useRef, useState, useEffect } from 'react';

import {
    Page,
    Input,
    List,
    ListItem, Dialog,
    Row,
    Col, Radio,
    Button
} from 'react-onsenui';

import OrderInfoRegisterComponent from '../user/OrderInfoRegister';
import OrderRegisterConfirmComponent from '../user/OrderRegisterConfirm';
import App from '../App';
/*受注エラー Component*/
const OrderErrorPage = (props) => {
    const [selectedorderinfoProductList, setselectedorderinfoProductList] = useState([]);
    const [selectedProductOption, setselectedProductOption] = useState('');
    const [selectedProductNumber, setselectedProductNumber] = useState('');
    const [previousInputValue, setPreviousInputValue] = useState('');
    const [previousSummaryCodeValue, setpreviousSummaryCodeValue] = useState('');
    const [previousSummary1Value, setpreviousSummary1Value] = useState('');
    const [previousSummary2Value, setpreviousSummary2Value] = useState('');
    const [showOrderError, setshowOrderError] = useState(true);
    const [showOrderRegisterConfirm, setshowOrderRegisterConfirm] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    const [showOrderInfoRegister, setshowOrderInfoRegister] = useState(false);
    const [orderNumber, setorderNumber] = useState('');
    const [customerName, setcustomerName] = useState('');
    const [orderDate, setorderDate] = useState('');
    const [selectedAccountTypeValue, setselectedAccountTypeValue] = useState('');
    const [accountTypeName, setAccountTypeName] = useState('');
    const [deliveryDate, setdeliveryDate] = useState('');
    const [selectedCustomerItem, setSelectedCustomerItem] = useState([]);
    const [accountList, setaccountList] = useState([]);
    const [warehouseList, setwarehouseList] = useState([]);
    const [selectedWarehouseccodeValue, setselectedWarehouseccodeValue] = useState('');
    const [warehouseName, setwarehouseName] = useState('');
    const [deliveryList, setdeliveryList] = useState([]);
    const [selecteddeliverycodeValue, setselecteddeliverycodeValue] = useState('');
    const [deliveryName, setdeliveryName] = useState('');
    const [remarkList, setremarkList] = useState([]);
    const [selectedremarkcodeValue, setselectedremarkcodeValue] = useState('');
    const [remark, setremark] = useState('');
    const [customerList, setcustomerList] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [summaryList, setsummaryList] = useState([]);
    const [selectedSummarycodeValue, setselectedSummarycodeValue] = useState('');
    const [summaryName1, setsummaryName1] = useState('');
    const [summaryName2, setsummaryName2] = useState('');
    const [quantity, setquantity] = useState(0);
    const [selectedProductItemList, setselectedProductItem] = useState([]);
    const [orderMemo, setorderMemo] = useState('');
    const [orderinfoobjectList, setorderinfoobjectList] = useState([]);
    const [orderinfoproductobjectList, setorderinfoproductobjectList] = useState([]);
    const [selectedorderinfoobjectList, setselectedorderinfoobjectList] = useState([]);
    console.log('受注登録商品リストの印刷', props.selectedProductItem);
    console.log('受注登録リストの印刷', props.orderinfoobjectList);

    // 受注メモ変更する
    //Input Parameter→Userが変更した受注メモ
    const handleOrderMemoValueChange = (e) => {
        setorderMemo(e.target.value);
    };

    // 数量変更する
    //Input Parameter→Userが変更した数量
    const handleQuantityChange = (e) => {
        setquantity(e.target.value);
         const numericQuantity = parseInt(quantity);
        const existingProduct = props.selectedProductItem.find((item) => item.product_number === selectedProductNumber);

        const combinederrorRowandDataObjectList = props.selectedProductItem.map((product) => {
            if (product.product_number === existingProduct.product_number) {

                return {
                    ...product, quantity: numericQuantity, summary_code: selectedSummarycodeValue,
                    summary_1: summaryName1,
                    summary_2: summaryName2,
                    order_number: orderNumber,
                };
            }           

            return product;

        });       
        selectedorderinfoProductList.push(combinederrorRowandDataObjectList);
    };

    // 摘要1変更する
    //Input Parameter→Userが変更した摘要1
    const handleSummaryNameOneChange = (e) => {
        setsummaryName1(e.target.value);
    };
    // 摘要2変更する
    //Input Parameter→Userが変更した摘要2
    const handleSummaryNameTwoChange = (e) => {
        setsummaryName2(e.target.value);
    };
    //    摘要データ取得関数
    const fetchsummaryData = async () => {
        try {
            /* 摘要データ取得API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/summary/get_summary_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setsummaryList(jsonData); // 得意先List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('ネットワークエラーが発生しました。', error);
        }
    };
    // 備考選択する
    //Input Parameter→Userが選択した備考
    const handleRemarkChange = (e) => {
        setremark(e.target.value);
    };
    // 受注情報登録画面の移行
    const navigateToOrderInfoRegister = () => {

        //  受注情報登録componentのナビゲート
        setshowLogin(false);
        setshowOrderError(false);
        setshowOrderRegisterConfirm(false);
        setshowOrderInfoRegister(true);        

    }

    // 摘要コード選択する
    //Input Parameter→Userが選択した摘要コード
    const handleSelectSummaryCode = (e) => {
        const selectedValue = e.target.value;
        setselectedSummarycodeValue(selectedValue);
        // 対応する摘要コードを検索
        const selectedSummaryCode = summaryList.find(
            (summary) => summary.summary_code === selectedValue
        );
        // 選択した摘要あるかどうか確認
        if (selectedSummaryCode) {
            // 有場合
            setsummaryName1(selectedSummaryCode.summary_1);
            setsummaryName2(selectedSummaryCode.summary_2);
        } else {
            // 無し場合
            setsummaryName1('');
            setsummaryName2('');
        }
        const existingProduct = props.selectedProductItem.find((item) => item.product_number === selectedProductNumber);
        const combinederrorRowandDataObjectList = props.selectedProductItem.map((product) => {
            if (product.product_number === existingProduct.product_number) {

                return {
                    ...product, quantity: quantity, summary_code: selectedValue,
                    summary_1: selectedSummaryCode.summary_1,
                    summary_2: selectedSummaryCode.summary_2,
                    order_number: orderNumber,
                };
            }            

            return product;

        });

        selectedorderinfoProductList.push(combinederrorRowandDataObjectList);
       
    };

    // 商品選択する
    //Input Parameter→Userが選択した商品
    const handleOptionProductChange = (event) => {
        setselectedProductItem([]);
        const selectedValue = event.target.value;
        setselectedProductOption(selectedValue);
        // 対応する商品を検索
        const selectedItem = props.selectedProductItem.find((item) => item.product_code === selectedValue);
        //商品あるかどうか確認
        if (selectedItem) {
            // 有場合
            setselectedProductItem(selectedItem);
            setselectedProductNumber(selectedItem.product_number);
            setPreviousInputValue(quantity);
            setpreviousSummaryCodeValue(selectedSummarycodeValue);
            setpreviousSummary1Value(summaryName1);
            setpreviousSummary2Value(summaryName2);
            setquantity(selectedItem.quantity);
            setselectedSummarycodeValue(selectedItem.summary_code);
            setsummaryName1(selectedItem.summary_1);
            setsummaryName2(selectedItem.summary_2);

        }

    };

    // 初期状態
    useEffect(() => {
        //    摘要データ取得関数呼び出し
        fetchsummaryData();
        /*  受注登録Listあるかどうか確認*/
        if (props.orderinfoobjectList[0]) {
            /* 有場合*/
            orderinfoobjectList.push(props.orderinfoobjectList[0]);
            setorderNumber(props.orderinfoobjectList[0].order_number);
            setorderDate(props.orderinfoobjectList[0].order_date);
            setselectedAccountTypeValue(props.orderinfoobjectList[0].account_type);
            setAccountTypeName(props.orderinfoobjectList[0].account_type_name);
            setselectedWarehouseccodeValue(props.orderinfoobjectList[0].warehouse_code);
            setwarehouseName(props.orderinfoobjectList[0].warehouse_name);
            setdeliveryDate(props.orderinfoobjectList[0].delivery_date);
            setselecteddeliverycodeValue(props.orderinfoobjectList[0].delivery_destination_code);
            setdeliveryName(props.orderinfoobjectList[0].delivery_destination_name);
            setselectedremarkcodeValue(props.orderinfoobjectList[0].remark_code);
            setremark(props.orderinfoobjectList[0].remarks);
            setorderMemo(props.orderinfoobjectList[0].order_memo);
        }

        /* 選択された商品あるかどうか確認*/
        if (JSON.parse(localStorage.getItem('selectedProductItem'))) {
            const storedproductData = JSON.parse(localStorage.getItem('selectedProductItem'));
           
        }
        //    得意先データ取得関数呼び出し
        fetchCustomerData();
        //    売掛データ取得関数呼び出し
        fetchaccountData();
        //    倉庫データ取得関数呼び出し
        fetchwarehouseData();
        //    納品データ取得関数呼び出し
        fetchdeliveryData();
        //     備考データ取得関数呼び出し
        fetchRemarkData();
    }, []);

    //    得意先データ取得関数
    const fetchCustomerData = async () => {
        try {
            //    得意先データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/customer/get_customer_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setcustomerList(jsonData); // 得意先List にAPIからのレスポンスデータを設定
            setSelectedOption(jsonData[0].customer_code);
            setSelectedCustomerItem(jsonData[0]);
        } catch (error) {
            console.error('ネットワークエラーが発生しました。', error);
        }
    };
    //    売掛データ取得関数
    const fetchaccountData = async () => {
        try {
            //  売掛データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/account/get_account_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();

            setaccountList(jsonData); // 売掛List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('ネットワークエラーが発生しました。', error);
        }
    };
    //    倉庫データ取得関数
    const fetchwarehouseData = async () => {
        try {
            //  倉庫データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/warehouse/get_warehouse_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();

            setwarehouseList(jsonData); // 倉庫List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('ネットワークエラーが発生しました。', error);
        }
    };
    //    納品データ取得関数
    const fetchdeliveryData = async () => {
        try {
            //    納品データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/delivery/get_delivery_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();

            setdeliveryList(jsonData); // 納品List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('ネットワークエラーが発生しました。', error);
        }
    };

    //     備考データ取得関数
    const fetchRemarkData = async () => {
        try {
            //     備考データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/remark/get_remark_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();

            setremarkList(jsonData); // 備考List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('ネットワークエラーが発生しました。', error);
        }
    };

    // 売掛ドロップダウンの選択
    const handleSelectAccount = (e) => {
        const selectedValue = e.target.value;
        setselectedAccountTypeValue(selectedValue);
        // 対応する売掛を検索
        const selectedAccountType = accountList.find(
            (account) => account.account_type === selectedValue
        );
        // 選択した 売掛あるかどうか確認
        if (selectedAccountType) {
            // 有場合
            setAccountTypeName(selectedAccountType.account_type_name);
        } else {
            // 無し場合
            setAccountTypeName('');
        }
    };

    // 倉庫ドロップダウンの選択
    const handleSelectWarehouseCode = (e) => {
        const selectedValue = e.target.value;
        setselectedWarehouseccodeValue(selectedValue);

        // 対応する倉庫を検索
        const selectedWarehouseCode = warehouseList.find(
            (warehouse) => warehouse.warehouse_code === selectedValue
        );
        // 選択した 倉庫あるかどうか確認
        if (selectedWarehouseCode) {
            // 有場合
            setwarehouseName(selectedWarehouseCode.warehouse_name);
        } else {
            // 無し場合
            setwarehouseName('');
        }
    };

    // 納品ドロップダウンの選択
    const handleSelectDeliveryCode = (e) => {
        const selectedValue = e.target.value;
        setselecteddeliverycodeValue(selectedValue);

        // 対応する納品を検索
        const selectedDeliveryCode = deliveryList.find(
            (deliveryData) => deliveryData.delivery_destination_code === selectedValue
        );
        // 選択した 納品あるかどうか確認
        if (selectedDeliveryCode) {
            // 有場合
            setdeliveryName(selectedDeliveryCode.delivery_destination_name);
        } else {
            // 無し場合
            setdeliveryName('');
        }
    };
    // 備考ドロップダウンの選択
    const handleSelectRemarkCode = (e) => {
        const selectedValue = e.target.value;
        setselectedremarkcodeValue(selectedValue);

        // 対応する備考を検索
        const selectedRemarkCode = remarkList.find(
            (remarkData) => remarkData.remark_code === selectedValue
        );
        // 選択した 備考あるかどうか確認
        if (selectedRemarkCode) {
            // 有場合
            setremark(selectedRemarkCode.remark);
        } else {
            // 無し場合
            setremark('');
        }
    };

    //  受注登録関数
    const orderRegistration = () => {      
        if (selectedorderinfoProductList.length > 0) {            
            orderinfoproductobjectList.push(selectedorderinfoProductList[selectedorderinfoProductList.length - 1]);           
            const isObjectInvalid = (obj) => {
                return obj.quantity === undefined || obj.quantity === null || obj.quantity === 0 || obj.summary_code === '';
            };         
            const invalidObjects = selectedorderinfoProductList[selectedorderinfoProductList.length - 1].filter((obj) => isObjectInvalid(obj));
        
        }
        else {           
            orderinfoproductobjectList.push(props.selectedProductItem);
        }
        // 入力データ検証チェック
        if (orderDate && selectedAccountTypeValue && selectedWarehouseccodeValue && deliveryDate && selecteddeliverycodeValue && selectedremarkcodeValue && remark) {
            // 入力データ有場合
            // 新しいオブジェクトを作成
            const orderobjectData = {
                order_number: orderNumber,
                order_date: orderDate,
                delivery_date: deliveryDate,
                remarks: remark,
                remark_code: selectedremarkcodeValue,
                printed_flag: 0,
                customer_code: props.orderinfoobjectList[0].customer_code,
                account_type: selectedAccountTypeValue,
                account_type_name: accountTypeName,
                warehouse_code: selectedWarehouseccodeValue,
                warehouse_name: warehouseName,
                delivery_destination_code: selecteddeliverycodeValue,
                delivery_destination_name: deliveryName,
                in_charge_code: JSON.parse(localStorage.getItem('inchargeData')).in_charge_code,
                order_memo: orderMemo,
            };

            selectedorderinfoobjectList.push(orderobjectData);
            setshowLogin(false);
            setshowOrderError(false);
            setshowOrderRegisterConfirm(true);
            setshowOrderInfoRegister(false);
            console.log('受注登録リストの印刷', selectedorderinfoobjectList);
            localStorage.setItem('customerName', JSON.stringify(customerName));
            localStorage.setItem('selectedProductItem', JSON.stringify(props.selectedProductItem));
            localStorage.setItem('orderinfoobjectList', JSON.stringify(selectedorderinfoobjectList));

        }



    }
    // ログイン画面の移行
    const navigateToLogin = () => {
        setshowLogin(true);
        setshowOrderError(false);
        setshowOrderRegisterConfirm(false);
        setshowOrderInfoRegister(false);

    };
    return (
        <div>
            {showLogin && <App />}
            {showOrderInfoRegister && <OrderInfoRegisterComponent />}
            {showOrderRegisterConfirm && <OrderRegisterConfirmComponent selectedProductItemList={orderinfoproductobjectList[0]} orderinfoobjectList={selectedorderinfoobjectList} />}
            {showOrderError &&
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
                    <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注情報の登録エラー
                    </p>
                    <p style={{ padding: '10px', textAlign: 'center', color: '#000' }}>受注情報登録でエラーが発生しました。

                    </p>
                    <Row className="custom-row">
                        <label className="custom-label">エラーリスト
                        </label>
                    </Row>

                    <Row className="custom-row">
                        <table>
                            <tr>
                                <td ><ul>{!orderDate && <li style={{ fontSize: '15px', color: 'red' }}>  受注日付 を入力してください。</li>}
                                    {!selectedAccountTypeValue && <li style={{ fontSize: '15px', color: 'red' }}> 売掛区分 を入力してください。</li>}
                                    {!selectedWarehouseccodeValue && <li style={{ fontSize: '15px', color: 'red' }}> 倉庫コード を入力してください。</li>}
                                    {!deliveryDate && <li style={{ fontSize: '15px', color: 'red' }}> 納品日 を入力してください。</li>}
                                    {!selecteddeliverycodeValue && <li style={{ fontSize: '15px', color: 'red' }}> 納品先コード を入力してください。</li>}
                                    {!selectedremarkcodeValue && <li style={{ fontSize: '15px', color: 'red' }}> 備考コード を入力してください。</li>}
                                    {!remark && <li style={{ fontSize: '15px', color: 'red' }}> 備考 を入力してください。</li>}
                                    {quantity == 0 ? (<li style={{ fontSize: '15px', color: 'red' }}> 数量 を入力してください。</li>) : null}

                                    {!selectedSummarycodeValue ? (<li style={{ fontSize: '15px', color: 'red' }}> 摘要コード を入力してください。</li>) : null}
                                    {!summaryName1 ? (<li style={{ fontSize: '15px', color: 'red' }}> 摘要1 を入力してください。</li>) : null}

                                </ul></td>
                            </tr>

                        </table>




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
                                    <Input outline
                                        type="text" className="custom-date"
                                        placeholder='YYYY/MM/DD'
                                        value={orderDate} onChange={(e) => setorderDate(e.target.value)} />

                                </td>
                            </tr>
                            <tr>
                                <th className="custom-tableth"> 売掛区分</th>


                                <td className="custom-tabletd">
                                    <select className="custom-selectbox"
                                        value={selectedAccountTypeValue} onChange={handleSelectAccount}>
                                        <option value="">売掛区分を選択してください。</option>
                                        {accountList.map((item) => (
                                            <option key={item.account_type} value={item.account_type}>
                                                {item.account_type} : {item.account_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                            </tr>


                            <tr>
                                <th className="custom-tableth"> 倉庫コード</th>

                                <td className="custom-tabletd">

                                    <select className="custom-selectbox"
                                        value={selectedWarehouseccodeValue} onChange={handleSelectWarehouseCode}>
                                        <option value="">倉庫コードを選択してください。</option>
                                        {warehouseList.map((item) => (
                                            <option key={item.warehouse_code} value={item.warehouse_code}>
                                                {item.warehouse_code} : {item.warehouse_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth">納品日</th>
                                <td className="custom-tabletd">
                                    <Input outline className="custom-date"
                                        type="text"
                                        placeholder='YYYY/MM/DD'
                                        value={deliveryDate} onChange={(e) => setdeliveryDate(e.target.value)} />
                                </td>
                            </tr>

                            <tr>
                                <th className="custom-tableth">納品先コード</th>

                                <td className="custom-tabletd">

                                    <select className="custom-selectbox"
                                        value={selecteddeliverycodeValue} onChange={handleSelectDeliveryCode}>
                                        <option value="">納品先コードを選択してください。</option>
                                        {deliveryList.map((item) => (
                                            <option key={item.delivery_destination_code} value={item.delivery_destination_code}>
                                                {item.delivery_destination_code} : {item.delivery_destination_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                            </tr>

                            <tr>
                                <th className="custom-tableth">備考コード</th>
                                <td className="custom-tabletd">
                                    <select className="custom-selectbox"
                                        value={selectedremarkcodeValue} onChange={handleSelectRemarkCode}>
                                        <option value="">備考コードを選択してください。</option>
                                        {remarkList.map((item) => (
                                            <option key={item.remark_code} value={item.remark_code}>
                                                {item.remark_code} : {item.remark}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    備考
                                </th>
                                <td className="custom-tabletd">

                                    {remark && (
                                        <Input outline className="custom-input"
                                            type="text" value={remark}
                                            onChange={handleRemarkChange} />


                                    )}


                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    受注メモ
                                </th>
                                <td className="custom-tabletd">


                                    <Input outline className="custom-input" value={orderMemo}
                                        onChange={handleOrderMemoValueChange}
                                        type="text" placeholder="受注メモ" />
                                </td>

                            </tr>

                        </table>
                    </Row>

                    <Row className="custom-row">
                        <label className="custom-label">受注登録商品
                        </label>
                    </Row>



                    {props.selectedProductItem &&
                        <Row className="custom-row">
                            <Col>

                                <List className="custom-list">
                                    <ListItem>

                                        <div className="item-title">商品コード</div>
                                        <div className="item-title">商品名</div>

                                    </ListItem>
                                    {
                                        props.selectedProductItem.map((productItem) => (
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

                                    <Input outline className="custom-input"
                                        type="number" placeholder="数量" value={quantity}
                                        onChange={handleQuantityChange} />

                                </td>

                            </tr>



                            <tr>
                                <th className="custom-tableth"> 摘要コード</th>

                                <td className="custom-tabletd">

                                    <select className="custom-selectbox"
                                        value={selectedSummarycodeValue} onChange={handleSelectSummaryCode}>
                                        <option value="">摘要コードを選択してください。</option>
                                        {summaryList.map((item) => (
                                            <option key={item.summary_code} value={item.summary_code}>
                                                {item.summary_code} : {item.summary_1}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要1

                                </th>
                                <td className="custom-tabletd">
                                    {summaryName1 && (
                                        <Input outline className="custom-input"
                                            type="text" value={summaryName1}
                                            onChange={handleSummaryNameOneChange} />


                                    )}

                                </td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要2

                                </th>
                                <td className="custom-tabletd">

                                    <Input outline className="custom-input"
                                        type="text" value={summaryName2}
                                        onChange={handleSummaryNameTwoChange} />



                                </td>
                            </tr>

                        </table>
                    </Row>

                    <Row>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoRegister} >
                                戻る
                            </Button>

                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={orderRegistration} >
                                エラー修正

                            </Button>
                        </Col>
                    </Row>

                </Page>}

        </div>
    );
};

export default OrderErrorPage;
