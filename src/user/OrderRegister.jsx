import React, { useRef, useState, useEffect } from 'react';

import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Col, Radio,
    Button
} from 'react-onsenui';

import OrderInfoRegisterComponent from '../user/OrderInfoRegister';
import BusinessMenuComponent from '../user/BusinessMenu';

import App from '../App';
/*受注登録 Component*/
const OrderRegisterPage = (props) => {
    const [showOrderInfoRegister, setshowOrderInfoRegister] = useState(false);
    const [showOrderRegister, setshowOrderRegister] = useState(true);
    const [showBusinessMenu, setshowBusinessMenu] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const [orderNumber, setorderNumber] = useState('');
    const [orderDate, setorderDate] = useState(`${year}/${month}/${day}`);
    const [selectedAccountTypeValue, setselectedAccountTypeValue] = useState('');
    const [accountTypeName, setAccountTypeName] = useState('');
    const [deliveryDate, setdeliveryDate] = useState(`${year}/${month}/${day}`);
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
    const [searchcustomername, setsearchcustomername] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [searchcustomercode, setsearchcustomercode] = useState('');
    const [orderinfoobjectList, setorderinfoobjectList] = useState([]);
    const [orderMemo, setorderMemo] = useState('');
    const [showDefaultSelectBox, setshowDefaultSelectBox] = useState(false);
    const [checkCustomerOption, setcheckCustomerOption] = useState(true);

    // 備考変更する
    //Input Parameter→Userが変更した備考
    const handleRemarkChange = (e) => {
        setremark(e.target.value);
    };

    // 受注メモ変更する
    //Input Parameter→Userが変更した受注メモ
    const handleOrderMemoValueChange = (e) => {
        setorderMemo(e.target.value);
    };

    // 営業用メニューへの移行
    const navigateToBusinessMenu = () => {
        // 営業用メニューcomponentのナビゲート
        setshowBusinessMenu(true);
        setshowOrderRegister(false);
        setshowOrderInfoRegister(false);
        setshowLogin(false);

    }

    // 受注情報登録画面の移行
    const navigateToOrderInfoRegister = () => {
        // 得意先データ選択かどうか確認
        if (selectedOption) {
            // 選択場合
            // 新しいオブジェクトを作成
            const orderobjectData = {
                order_number: formatOrderNumber(orderNumber),
                order_date: orderDate,
                delivery_date: deliveryDate,
                remarks: remark,
                remark_code: selectedremarkcodeValue,
                printed_flag: 0,
                customer_code: selectedCustomerItem.customer_code,
                account_type: selectedAccountTypeValue,
                account_type_name: accountTypeName,
                warehouse_code: selectedWarehouseccodeValue,
                warehouse_name: warehouseName,
                delivery_destination_code: selecteddeliverycodeValue,
                delivery_destination_name: deliveryName,
                in_charge_code: JSON.parse(localStorage.getItem('inchargeData')).in_charge_code,
                order_memo: orderMemo,
            };

            orderinfoobjectList.push(orderobjectData);
            setshowOrderInfoRegister(true);
            setshowOrderRegister(false);
            setshowBusinessMenu(false);
            setshowLogin(false);
            //受注情報データを保存
            localStorage.setItem('orderInfoData', JSON.stringify(orderinfoobjectList));
        }
        else {
            // 選択しない場合
            setcheckCustomerOption(false);//得意先選択しない場合エラー表示
        }
    }

    // 「受注No.」を自動採番(連番)関数
    // Input Parameter→受注No.
    // Output Parameter →受注No.
    const formatOrderNumber = (parameterorderNumber) => {
        //  orderNumberParameterあるかどうか確認
        if (parameterorderNumber) {
            // 有場合
            const leadingZeros = 5 - parameterorderNumber.length;
            const number = parseInt(parameterorderNumber) + 1;
            const numberString = number.toString();
            return '0'.repeat(leadingZeros) + numberString;

        }
        else {
            // 無し場合
            return '001';
        }


    };

    // 得意先名変更関数
    //Input Parameter→Userが変更 した得意先名
    const handleSearchInputCustomerNameChange = (e) => {
        const text = e.target.value;
        const lowercaseInput = text.toLowerCase();
        setsearchcustomername(lowercaseInput);
    };

    // 得意先コード変更関数
    //Input Parameter→Userが変更 した得意先コード
    const handleSearchInputCustomerCodeChange = (e) => {
        const customercode = e.target.value;
        setsearchcustomercode(customercode);
    };

    // 得意先名検索関数
    const searchByCustomerName = async () => {
        // 得意先名あるかどうか確認
        if (searchcustomername) {
            setcustomerList([]);
            try {
                const response = await fetch(`http://127.0.0.1:3000/customers/searchcustomername?searchcustomername=${searchcustomername}`)
                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                // レスポンスデータあるかどうか確認
                if (jsonData.length > 0) {
                    // 有場合
                    setcustomerList(jsonData); //得意先List にAPIからのレスポンスデータを設定
                    setSelectedOption(jsonData[0].customer_code);
                    setSelectedCustomerItem(jsonData[0]);
                }
                else {
                    // 無し場合
                    setSelectedCustomerItem([]);//選択した得意先List クリア
                    setcustomerList([]);//得意先List クリア
                }

            } catch (error) {
                console.error('データ取得エラー:', error);
            }
        }
        else {
            // 得意先データ取得API呼び出し
            fetchCustomerData();
        }

    }

    // 得意先コード検索
    const searchByCustomerCode = async () => {
        // 得意先コードあるかどうか確認
        if (searchcustomercode) {
            setcustomerList([]); //得意先List クリア
            try {
                // 得意先コード検索呼び出し
                // Input Parameter→得意先コード
                const response = await fetch(`http://127.0.0.1:3000/customers/searchcustomercode?searchcustomercode=${searchcustomercode}`)

                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                // レスポンスデータあるかどうか確認
                if (jsonData.length > 0) {
                    // 有場合
                    setcustomerList(jsonData);  //得意先List にAPIからのレスポンスデータを設定
                    setSelectedOption(jsonData[0].customer_code);
                    setSelectedCustomerItem(jsonData[0]);
                }
                else {
                    // 無し場合
                    setSelectedCustomerItem([]);//選択した得意先List クリア
                    setcustomerList([]);//得意先List クリア
                }

            } catch (error) {
                console.error('データ取得エラー:', error);
            }
        }
        else {
            // 得意先データ取得API呼び出し
            fetchCustomerData();
        }
    }

    // 初期状態
    useEffect(() => {
        fetchlastOrderRecordData(); //受注最後のデータを取得
        const storedData = JSON.parse(localStorage.getItem('orderInfoData'));
        // ローカルストレージデータあるかどうか確認
        if (storedData) {
            //    有場合
            // データ設定する
            setorderDate(storedData[0].order_date);
            setorderMemo(storedData[0].order_memo);
            setselectedWarehouseccodeValue(storedData[0].warehouse_code);
            setwarehouseName(storedData[0].warehouse_name);
            setdeliveryDate(storedData[0].delivery_date);
            setselecteddeliverycodeValue(storedData[0].delivery_destination_code);
            setdeliveryName(storedData[0].delivery_destination_name);
            setselectedremarkcodeValue(storedData[0].remark_code);
            setremark(storedData[0].remarks);
        }
        // 得意先データ取得関数呼び出し
        fetchCustomerData();
        // 売掛区データ取得関数呼び出し
        fetchAccountData();
        // 倉庫データ取得関数呼び出し
        fetchWarehouseData();
        // 納品先データ取得関数呼び出し
        fetchDeliveryData();
        // 備考データ取得関数呼び出し
        fetchRemarkData();
    }, []);

    //受注最後のデータを取得関数
    const fetchlastOrderRecordData = async () => {
        try {
            //受注最後のデータを取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/order/lastrecord');
            const jsonData = await response.json();
            setorderNumber(jsonData.order_number);//受注最後の受注№設定する

        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    // 得意先データ取得関数
    const fetchCustomerData = async () => {
        try {
            // 得意先データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/customer/get_customer_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();

            setcustomerList(jsonData); //得意先List にAPIからのレスポンスデータを設定

        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    // 売掛区データ取得関数
    const fetchAccountData = async () => {
        try {
            // 売掛区データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/account/get_account_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setaccountList(jsonData); // 売掛区List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    // 倉庫データ取得関数
    const fetchWarehouseData = async () => {
        try {
            // 倉庫データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/warehouse/get_warehouse_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();

            setwarehouseList(jsonData); // 倉庫List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    // 納品先データ取得関数
    const fetchDeliveryData = async () => {
        try {
            // 納品先データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/delivery/get_delivery_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setdeliveryList(jsonData); // 納品先List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    // 備考データ取得関数
    const fetchRemarkData = async () => {
        try {
            // 備考データ取得API呼び出し
            const response = await fetch('http://127.0.0.1:3000/remark/get_remark_data');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setremarkList(jsonData); // 備考List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };

    // 売掛選択する
    //Input Parameter→Userが選択した売掛区分
    const handleSelectAccount = (e) => {
        const selectedValue = e.target.value;
        setselectedAccountTypeValue(selectedValue);
        // 対応する売掛区を検索
        const selectedAccountType = accountList.find(
            (account) => account.account_type === selectedValue
        );

        setAccountTypeName(selectedAccountType.account_type_name);

    };

    // 倉庫選択する
    //Input Parameter→Userが選択した倉庫ｺｰﾄﾞ
    const handleSelectWarehouseCode = (e) => {
        const selectedValue = e.target.value;
        setselectedWarehouseccodeValue(selectedValue);

        // 対応する倉庫を検索
        const selectedWarehouseCode = warehouseList.find(
            (warehouse) => warehouse.warehouse_code === selectedValue
        );
        //  倉庫あるかどうか確認
        if (selectedWarehouseCode) {
            // 有場合
            setwarehouseName(selectedWarehouseCode.warehouse_name);
        } else {
            // 無し場合
            setwarehouseName('');
        }
    };


    // 納品先選択する
    //Input Parameter→Userが選択した納品先ｺｰﾄﾞ
    const handleSelectDeliveryCode = (e) => {
        const selectedValue = e.target.value;
        setselecteddeliverycodeValue(selectedValue);

        // 対応する納品先を検索
        const selectedDeliveryCode = deliveryList.find(
            (deliveryData) => deliveryData.delivery_destination_code === selectedValue
        );
        //  納品先あるかどうか確認
        if (selectedDeliveryCode) {
            // 有場合
            setdeliveryName(selectedDeliveryCode.delivery_destination_name);
        } else {
            // 無し場合
            setdeliveryName('');
        }
    };

    //備考選択する
    //Input Parameter→Userが選択した備考ｺｰﾄﾞ
    const handleSelectRemarkCode = (e) => {
        const selectedValue = e.target.value;
        setselectedremarkcodeValue(selectedValue);

        // 対応する備考を検索
        const selectedRemarkCode = remarkList.find(
            (remarkData) => remarkData.remark_code === selectedValue
        );
        // 備考あるかどうか確認
        if (selectedRemarkCode) {
            // 有場合
            setremark(selectedRemarkCode.remark);
        } else {
            // 無し場合
            setremark('');
        }
    };

    //得意先選択する
    //Input Parameter→Userが選択した得意先
    const handleOptionChange = (event) => {
        setSelectedCustomerItem([]);
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedItem = customerList.find((item) => item.customer_code === selectedValue);
        if (selectedItem) {
            //選択した項目をオブジェクトリストに設定する
            setSelectedCustomerItem(selectedItem);
            // 得意先コードが指定された範囲内「999101～99999」にあるかどうかを確認                      
            if (parseInt(selectedItem.customer_code) >= 999101 && parseInt(selectedItem.customer_code) <= 999999) {
                // 有場合                
                setshowDefaultSelectBox(true);
                setselectedAccountTypeValue(accountList.length > 0 ? accountList[accountList.length - 1].account_type : '');// 売掛区分：1(現金)表示
                setAccountTypeName(accountList.length > 0 ? accountList[accountList.length - 1].account_type_name : '');// 売掛区分：1(現金)表示
            } else {
                // 無し合
                setshowDefaultSelectBox(false);
                // 売掛区分：0(売掛)表示
                setselectedAccountTypeValue(accountList.length > 0 ? accountList[0].account_type : '');
                setAccountTypeName(accountList.length > 0 ? accountList[0].account_type_name : '');
            }
        }

    };
    // ログイン画面の移行
    const navigateToLogin = () => {
        // props.navigator.resetPage({ component: App });
        setshowBusinessMenu(false);
        setshowOrderRegister(false);
        setshowOrderInfoRegister(false);
        setshowLogin(true);
    };
    return (

        <div>
            {showLogin && <App />}
            {showBusinessMenu && <BusinessMenuComponent />}
            {showOrderInfoRegister && <OrderInfoRegisterComponent selectedCustomerItem={selectedCustomerItem} orderinfoobjectList={orderinfoobjectList} />}
            {showOrderRegister ? (
                <Page contentStyle={{
                    overflowY: 'scroll', // Enable vertical scrolling

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
                    <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注登録</p>

                    <Row className="custom-row">
                        <label className="custom-label">得意先名検索</label>
                    </Row>
                    <Row className="custom-row">
                        <Col>
                            <Input className="custom-search-input"
                                label="searchText"
                                type="text"
                                value={searchcustomername}
                                onChange={handleSearchInputCustomerNameChange}
                                placeholder="検索条件の得意先名を入力してください。" />

                        </Col>
                        <Col>
                            <Button large raised fill className='searchBtnMobile' onClick={searchByCustomerName}>
                                検索
                            </Button>
                        </Col>
                    </Row>

                    <Row className="custom-row">
                        <label className="custom-label">得意先コード指定
                        </label>
                    </Row>
                    <Row className="custom-row">
                        <Col>
                            <Input className="custom-search-input"
                                label="searchText"
                                type="text"
                                value={searchcustomercode}
                                onChange={handleSearchInputCustomerCodeChange}
                                placeholder="得意先コードを入力してください。" />

                        </Col>
                        <Col>
                            <Button large raised fill className='searchBtnMobile' onClick={searchByCustomerCode}>
                                検索
                            </Button>
                        </Col>
                    </Row>
                    <Row className="custom-row">
                        <label className="custom-label">検索結果</label>
                    </Row>

                    {customerList.length == 0 && (
                        <Row className="custom-row">
                            <div style={{ color: 'red', fontSize: '20px', marginLeft: '17px' }}>検索データが見つかりません!!!</div>
                        </Row>
                    )}

                    {customerList.length > 0 &&
                        <Row className="custom-row">
                            <Col>

                                <List className="custom-list">
                                    <ListItem>

                                        <div className="item-title">得意先ｺｰﾄﾞ</div>
                                        <div className="item-title">得意先名</div>

                                    </ListItem>
                                    {
                                        customerList.map((customerItem) => (
                                            // <ListItem key={customerItem.id} onClick={() => handleCustomerItemClick(customerItem)}>
                                            <ListItem key={customerItem.customer_code} >
                                                <Radio
                                                    inputId={customerItem.customer_code}
                                                    checked={selectedOption === customerItem.customer_code}
                                                    onChange={handleOptionChange}
                                                    value={customerItem.customer_code}
                                                    name="radio-group"
                                                    modifier='material' />
                                                <div className="item-title">{customerItem.customer_code}</div>
                                                <div className="item-title">{customerItem.customer_name1}</div>

                                            </ListItem>
                                        ))
                                    }


                                </List>

                            </Col>

                        </Row>
                    }

                    {checkCustomerOption == false ? (
                        <Row>
                            <div style={{ color: 'red', fontSize: '14px', marginLeft: '10px' }}>得意先を選択してください!!!</div>
                        </Row>
                    ) : null}
                    {customerList.length != 0 && selectedCustomerItem && (
                        <Row className="custom-row">

                            <Row>
                                <label className="custom-label">得意先情報</label>
                            </Row>
                            <table>
                                <tr><th className="custom-tableth">
                                    得意先コード</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedCustomerItem.customer_code}</span></td>
                                </tr>
                                <tr><th className="custom-tableth">
                                    得意先名</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedCustomerItem.customer_name1}</span></td>
                                </tr>
                                <tr>
                                    <th className="custom-tableth">得意先名索引</th>
                                    <td className="custom-tabletd"><span className='custom-span'>  {selectedCustomerItem.customer_name_index}</span></td>
                                </tr>
                                <tr>
                                    <th className="custom-tableth">請求先分類名</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedCustomerItem.billing_code}</span></td>
                                </tr>




                            </table>

                        </Row>


                    )}
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
                                <tr>

                                </tr>
                            </tr>
                            <tr>
                                <th className="custom-tableth"> 売掛区分</th>

                                {showDefaultSelectBox == true ? (
                                    <td className="custom-tabletd">

                                        <select className="custom-selectbox"
                                            value={selectedAccountTypeValue || (accountList.length > 0 ? accountList[accountList.length - 1].account_type : '')}
                                            onChange={handleSelectAccount}>

                                            {accountList.map((item) => (

                                                <option key={item.account_type} value={item.account_type}>
                                                    {item.account_type} : {item.account_type_name}
                                                </option>

                                            ))}
                                        </select>



                                    </td>) : (<td className="custom-tabletd">

                                        <select className="custom-selectbox"
                                            value={selectedAccountTypeValue || (accountList.length > 0 ? accountList[0].account_type : '')}
                                            onChange={handleSelectAccount}>

                                            {accountList.map((item) => (

                                                <option key={item.account_type} value={item.account_type}>
                                                    {item.account_type} : {item.account_type_name}
                                                </option>

                                            ))}
                                        </select>



                                    </td>)}



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
                                <th className="custom-tableth"> 納品先コード</th>

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
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToBusinessMenu}>
                                戻る
                            </Button>

                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoRegister} >
                                次へ
                            </Button>
                        </Col>
                    </Row>

                </Page>) : null}

        </div>
    );
};

export default OrderRegisterPage;
