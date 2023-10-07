import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row, Dialog,
    Radio,
    Col,
    Button
} from 'react-onsenui';

import App from '../App';
import BusinessMenuComponent from '../user/BusinessMenu';
import OrderInfoConfirmComponent from '../user/OrderInfoConfirm';
import OrderRegisterConfirmComponent from '../user/OrderRegisterConfirm';
import OrderErrorComponent from '../user/OrderError';
/*受注情報確認画面Component*/
const OrderInfoUpdatePage = (props) => {
    const [showOrderError, setshowOrderError] = useState(false);
    const [showOrderRegisterConfirm, setshowOrderRegisterConfirm] = useState(false);
    const [showOrderInfoUpdate, setshowOrderInfoUpdate] = useState(true);
    const [showOrderInfoConfirm, setOrderInfoConfirm] = useState(false);
    const [showBusinessMenu, setshowBusinessMenu] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    const [orderInfoDeletePopupOpened, setorderInfoDeletePopupOpened] = useState(false);
    const [orderInfoList, setorderInfoList] = useState([]);
    const [orderNumber, setorderNumber] = useState('');
    const [orderDate, setorderDate] = useState('');
    const [selectedAccountTypeValue, setselectedAccountTypeValue] = useState('');
    const [accountTypeName, setAccountTypeName] = useState('');
    const [deliveryDate, setdeliveryDate] = useState('');
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
    const [summaryList, setsummaryList] = useState([]);
    const [selectedSummarycodeValue, setselectedSummarycodeValue] = useState('');
    const [summaryName1, setsummaryName1] = useState('');
    const [summaryName2, setsummaryName2] = useState('');
    const [quantity, setquantity] = useState(0);
    const [orderMemo, setorderMemo] = useState('');
    const [printedFlag, setPrintedFlag] = useState(0);
    const [selectedorderinfoProductList, setselectedorderinfoProductList] = useState([]);
    const [productList, setproductList] = useState([]);
    const [selectedProductOption, setselectedProductOption] = useState('');
    const [selectedProductOrderItem, setselectedProductOrderItem] = useState([]);
    const [selectedProductNumber, setselectedProductNumber] = useState('');
    const [orderinfoproductobjectList, setorderinfoproductobjectList] = useState([]);
    const [popupDeleteSuccessOpened, setpopupDeleteSuccessOpened] = useState(false);
    console.log(' orderInfoList.push(props.orderInfoList)', props.selectedCustomerOrderItem);
    console.log('productList', props.productList);
    // 初期状態
    useEffect(() => {
        if (props.productList) {
            console.log('selectedCustomerOrderItem', props.selectedCustomerOrderItem);
            /* 有場合*/
            productList.push(props.productList);
        }

        if (props.selectedCustomerOrderItem) {
            console.log('selectedCustomerOrderItem', props.selectedCustomerOrderItem);
            /* 有場合*/
            // customerOrderObjectList.push(props.selectedCustomerOrderItem);
            setorderNumber(props.selectedCustomerOrderItem.order_number);
            const orderDate = props.selectedCustomerOrderItem.order_date;
            setorderDate(`${new Date(orderDate).getFullYear()}/${String(new Date(orderDate).getMonth() + 1).padStart(2, '0')}/${String(new Date(orderDate).getDate()).padStart(2, '0')}`);
            setselectedAccountTypeValue(props.selectedCustomerOrderItem.account_type);
            setAccountTypeName(props.selectedCustomerOrderItem.account_type_name);
            setselectedWarehouseccodeValue(props.selectedCustomerOrderItem.warehouse_code);
            setwarehouseName(props.selectedCustomerOrderItem.warehouse_name);
            const deliveryDate = props.selectedCustomerOrderItem.order_date;
            setdeliveryDate(`${new Date(deliveryDate).getFullYear()}/${String(new Date(deliveryDate).getMonth() + 1).padStart(2, '0')}/${String(new Date(deliveryDate).getDate()).padStart(2, '0')}`);
            setselecteddeliverycodeValue(props.selectedCustomerOrderItem.delivery_destination_code);
            setdeliveryName(props.selectedCustomerOrderItem.delivery_destination_name);
            setselectedremarkcodeValue(props.selectedCustomerOrderItem.remark_code);
            setremark(props.selectedCustomerOrderItem.remarks);
            setorderMemo(props.selectedCustomerOrderItem.order_memo);
            setPrintedFlag(props.selectedCustomerOrderItem.printed_flag);
            // setquantity(props.selectedCustomerOrderItem.quantity);
            // setselectedSummarycodeValue(props.selectedCustomerOrderItem.summary_code);
            // setsummaryName1(props.selectedCustomerOrderItem.description1);
            // setsummaryName2(props.selectedCustomerOrderItem.description2);
        }
        //    摘要データ取得関数呼び出し
        fetchsummaryData();
        //    売掛データ取得関数呼び出し
        fetchaccountData();
        //    倉庫データ取得関数呼び出し
        fetchwarehouseData();
        //    納品データ取得関数呼び出し
        fetchdeliveryData();
        //     備考データ取得関数呼び出し
        fetchRemarkData();
        //商品データ取得関数呼び出し
        // fetchProductData();
        //受注情報データ取得関数呼び出し
        // fetchOrderInfoData();
    }, []);
    // // 受注情報データ取得関数
    // const fetchOrderInfoData = async () => {
    //     try {
    //         // 受注情報データ取得API呼び出し
    //         const response = await fetch('http://127.0.0.1:3000/order/get_data');
    //         if (!response.ok) {
    //             throw new Error('ネットワークエラーが発生しました。');
    //         }
    //         const jsonData = await response.json();
    //         console.log('Response>>>>', jsonData);
    //         setorderInfoList(jsonData); //得意先List にAPIからのレスポンスデータを設定


    //     } catch (error) {
    //         console.error('データ取得エラー:', error);
    //     }
    // };
    //   商品データ取得関数
    // const fetchProductData = async () => {
    //     try {
    //         //   商品データ取得API呼び出し
    //         const response = await fetch('http://127.0.0.1:3000/product_masters/get_product_data');
    //         if (!response.ok) {
    //             throw new Error('ネットワークエラーが発生しました。');
    //         }
    //         const jsonData = await response.json();
    //         setproductList(jsonData); // 商品List にAPIからのレスポンスデータを設定

    //     } catch (error) {
    //         console.error('データ取得エラー:', error);
    //     }
    // };
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
        const existingProduct = props.productList.find((item) => item.product_number === selectedProductNumber);
        const combinederrorRowandDataObjectList = props.productList.map((product) => {
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
        const existingProduct = props.productList.find((item) => item.product_number === selectedProductNumber);
        const combinederrorRowandDataObjectList = props.productList.map((product) => {
            if (product.product_number === existingProduct.product_number) {

                return {
                    ...product, quantity: quantity, summary_code: selectedSummarycodeValue,
                    summary_1: summaryName1,
                    summary_2: summaryName2,
                    order_number: orderNumber,
                };
            }

            return product;

        });
        selectedorderinfoProductList.push(combinederrorRowandDataObjectList);
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
        }
        const existingProduct = props.productList.find((item) => item.product_number === selectedProductNumber);
        const combinederrorRowandDataObjectList = props.productList.map((product) => {
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






    // ログイン画面の移行
    const navigateToLogin = () => {
        setshowLogin(true);
        setshowOrderInfoUpdate(false);
        setOrderInfoConfirm(false);
        setshowBusinessMenu(false)

        // props.navigator.resetPage({ component: App });
    };
    // 受注情報確認画面の移行
    const navigateToOrderInfoConfirm = () => {
        // 受注情報確認 componentのナビゲート
        setshowLogin(false);
        setshowOrderInfoUpdate(false);
        setOrderInfoConfirm(true);
        setshowBusinessMenu(false)
        // props.navigator.resetPage({
        //     component: BusinessMenuComponent

        // });
    }
    /*  受注情報削除確認ポップアップ開く*/
    const openOrderInfoDeleteSuccessPopup = () => {
        setorderInfoDeletePopupOpened(true);
    };
    /* 受注情報削除確認ポップアップ閉じる*/
    const closeOrderInfoDeleteSuccessPopup = () => {
        setorderInfoDeletePopupOpened(false);
        /*  受注明細削除関数呼び出し*/
        orderDetailDeleteDataAPI();
    };

    /* 受注明細削除関数*/
    const orderDetailDeleteDataAPI = async () => {
        console.log('To delete orderinfoproductobjectList', props.productList);
        try {
            /* 受注情報明細削除API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/orders/orderdetailsdelete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(props.productList),
            });

            if (response.status === 200) {

                console.log("受注情報明細削除に成功:", await response.json());
                /*  受注情報削除関数呼び出し*/
                /*  Parameter→受注List*/
                orderDeleteDataAPI(props.selectedCustomerOrderItem);
            } else {
                console.log("データ取得エラー:", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }
    };

    /*  受注情報削除関数*/
    /*  Input Parameter→受注List*/
    const orderDeleteDataAPI = async (deleteOrderData) => {

        console.log('To delete orderList', deleteOrderData);
        const orderID = deleteOrderData.order_id;
        try {
            /* 受注情報削除API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/orders/orderdelete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderID),
            });

            if (response.status === 200) {

                console.log("受注情報削除に成功:", await response.json());
                openDeleteSuccessPopup();

            } else {
                console.log("データ取得エラー:", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }
    };

    /* 受注情報削除関数*/
    const orderInfoDelete = () => {
        openOrderInfoDeleteSuccessPopup();
    }
    //商品選択する
    //Input Parameter→Userが選択した商品
    const handleOptionProductChange = (event) => {
        setselectedProductOrderItem([]);
        const selectedProductValue = event.target.value;
        setselectedProductOption(selectedProductValue);

        const selectedProductOrderItem = props.productList.find((item) => item.product_code === selectedProductValue);
        console.log('selectedProductItem', selectedProductOrderItem);
        if (selectedProductOrderItem) {

            //選択した項目をオブジェクトリストに設定する
            setselectedProductOrderItem(selectedProductOrderItem);
            setselectedProductNumber(selectedProductOrderItem.product_number);
            setquantity(selectedProductOrderItem.quantity);
            setselectedSummarycodeValue(selectedProductOrderItem.summary_code);
            setsummaryName1(selectedProductOrderItem.summary_1);
            setsummaryName2(selectedProductOrderItem.summary_2);



        }

    };

    const orderRegistration = () => {
        // 選択した商品あるかどうか確認
        if (selectedProductOption) {
            // 入力データ有場合
            // 新しいオブジェクトを作成
            const orderobjectData = {
                order_number: orderNumber,
                order_date: orderDate,
                delivery_date: deliveryDate,
                remarks: remark,
                remark_code: selectedremarkcodeValue,
                printed_flag: printedFlag,
                customer_code: props.selectedCustomerOrderItem.customer_code,
                account_type: selectedAccountTypeValue,
                account_type_name: accountTypeName,
                warehouse_code: selectedWarehouseccodeValue,
                warehouse_name: warehouseName,
                delivery_destination_code: selecteddeliverycodeValue,
                delivery_destination_name: deliveryName,
                in_charge_code: props.selectedCustomerOrderItem.in_charge_code,
                order_memo: orderMemo,
            };

            orderInfoList.push(orderobjectData);
            // 入力データ検証チェック
            if (orderDate && selectedAccountTypeValue && selectedWarehouseccodeValue && deliveryDate && selecteddeliverycodeValue && selectedremarkcodeValue && remark) {

                if (selectedorderinfoProductList.length > 0) {
                    orderinfoproductobjectList.push(selectedorderinfoProductList[selectedorderinfoProductList.length - 1]);
                    console.log('selectedorderinfoProductList', orderinfoproductobjectList);
                    const isObjectInvalid = (obj) => {
                        return obj.quantity === undefined || obj.quantity === null || obj.quantity === 0 || obj.summary_code === '';
                    };
                    const invalidObjects = selectedorderinfoProductList[selectedorderinfoProductList.length - 1].filter((obj) => isObjectInvalid(obj));
                    console.log('invalidObjects', invalidObjects);
                    if (invalidObjects.length > 0) {
                        console.log('invalidObjects To Error>>', invalidObjects);
                        // 入力データ無し合 
                        setshowOrderError(true);
                        setshowOrderRegisterConfirm(false);
                        setshowLogin(false);
                        setshowOrderRegisterConfirm(false);
                        setshowOrderInfoUpdate(false);
                        setshowBusinessMenu(false);
                    } else {
                        // 入力データ有場合 
                        console.log('Valid To Confirm>>');
                        setshowOrderError(false);
                        setshowOrderRegisterConfirm(true);
                        setshowLogin(false);
                        setOrderInfoConfirm(false);
                        setshowOrderInfoUpdate(false);
                        setshowBusinessMenu(false);
                    }

                }
                else {

                    orderinfoproductobjectList.push(props.productList);
                    console.log('No selectedorderinfoProductList', orderinfoproductobjectList);
                    // 入力データ有場合 
                    console.log('Valid To Confirm>>');
                    setshowOrderError(false);
                    setshowOrderRegisterConfirm(true);
                    setshowLogin(false);
                    setOrderInfoConfirm(false);
                    setshowOrderInfoUpdate(false);
                    setshowBusinessMenu(false);
                }


            }
            else {
                console.log('Order Data not valid');
                if (selectedorderinfoProductList.length > 0) {

                    orderinfoproductobjectList.push(selectedorderinfoProductList[selectedorderinfoProductList.length - 1]);
                    console.log('selectedorderinfoProductList', orderinfoproductobjectList);
                    const isObjectInvalid = (obj) => {
                        return obj.quantity === undefined || obj.quantity === null || obj.quantity === 0 || obj.summary_code === '';
                    };
                    const invalidObjects = selectedorderinfoProductList[selectedorderinfoProductList.length - 1].filter((obj) => isObjectInvalid(obj));
                    console.log('invalidObjects', invalidObjects);
                    if (invalidObjects.length > 0) {
                        console.log('invalidObjects To Error>>', invalidObjects);
                        // 入力データ無し合 
                        setshowOrderError(true);
                        setshowOrderRegisterConfirm(false);
                        setshowLogin(false);
                        setshowLogin(false);
                        setshowOrderInfoUpdate(false);
                        setshowBusinessMenu(false);
                    } else {
                        console.log('Valid To Confirm>>');
                        // 入力データ有場合 
                        setshowOrderError(false);
                        setshowOrderRegisterConfirm(true);
                        setshowLogin(false);
                        setOrderInfoConfirm(false);
                        setshowOrderInfoUpdate(false);
                        setshowBusinessMenu(false);
                    }

                }
                else {

                    orderinfoproductobjectList.push(props.productList);
                    console.log('No selectedorderinfoProductList', orderinfoproductobjectList);
                    setshowOrderError(true);
                    setshowOrderRegisterConfirm(false);
                    setshowLogin(false);
                    setOrderInfoConfirm(false);
                    setshowOrderInfoUpdate(false);
                    setshowBusinessMenu(false);
                }


            }
        }
    }
    /*  受注情報の登録成功ポップアップ開く*/
    const openDeleteSuccessPopup = () => {
        setpopupDeleteSuccessOpened(true);
    };
    /* 受注情報の登録成功ポップアップ閉じる*/
    const closeDeleteSuccessPopup = () => {
        setpopupDeleteSuccessOpened(false);
        setshowOrderError(false);
        setshowOrderRegisterConfirm(false);
        setshowLogin(false);
        setOrderInfoConfirm(false);
        setshowOrderInfoUpdate(false);
        setshowBusinessMenu(true);

    };

    // 営業用メニューの移行
    const navigateToBusinessMenu = () => {
        closeDeleteSuccessPopup();


    }
    return (
        <div>
            {showLogin && <App />}
            {showBusinessMenu && <BusinessMenuComponent />}
            {showOrderInfoConfirm && <OrderInfoConfirmComponent />}
            {showOrderError && <OrderErrorComponent selectedProductItem={orderinfoproductobjectList[0]} orderinfoobjectList={orderInfoList} />}
            {showOrderRegisterConfirm && <OrderRegisterConfirmComponent selectedProductItemList={orderinfoproductobjectList[0]} orderinfoobjectList={orderInfoList} />}
            {showOrderInfoUpdate &&
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
                    <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注情報編集
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




                    <Row className="custom-row">
                        <Col>

                            <List className="custom-list">
                                <ListItem>

                                    <div className="item-title">商品コード</div>
                                    <div className="item-title">商品名</div>

                                </ListItem>
                                {
                                    props.productList.map((productItem) => (
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
                                    {selectedProductOption && selectedProductOrderItem && (

                                        <Input outline className="custom-input"
                                            type="number" placeholder="数量" value={quantity}
                                            onChange={handleQuantityChange} />
                                    )}
                                </td>

                            </tr>



                            <tr>
                                <th className="custom-tableth"> 摘要コード</th>

                                <td className="custom-tabletd">
                                    {selectedProductOption && selectedProductOrderItem && (
                                        <select className="custom-selectbox"

                                            value={selectedSummarycodeValue}
                                            onChange={handleSelectSummaryCode}>
                                            <option value="">摘要コードを選択してください。</option>
                                            {summaryList.map((item) => (
                                                <option key={item.summary_code} value={item.summary_code}>
                                                    {item.summary_code} : {item.summary_1}
                                                </option>
                                            ))}
                                        </select>)}
                                </td>

                            </tr>
                            <tr>
                                <th className="custom-tableth">
                                    摘要1

                                </th>
                                <td className="custom-tabletd">
                                    {selectedProductOption && selectedProductOrderItem && summaryName1 && (
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
                                    {selectedProductOption && selectedProductOrderItem && (
                                        <Input outline className="custom-input"
                                            type="text" value={summaryName2}
                                            onChange={handleSummaryNameTwoChange} />

                                    )}

                                </td>
                            </tr>

                        </table>
                    </Row>




                    <Row>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoConfirm}>
                                戻る
                            </Button>

                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={orderRegistration} >
                                登録
                            </Button>
                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={orderInfoDelete}>
                                削除
                            </Button>
                        </Col>
                    </Row>
                    {/* 受注情報削除確認ポップアップ */}
                    <Dialog isOpen={orderInfoDeletePopupOpened} className='successDialog'>

                        <p style={{ fontSize: 'medium', marginTop: '50px', textAlign: 'center', color: '#000' }}>受注情報を削除しますか？
                        </p>
                        <Row style={{ marginTop: '30px' }}>
                            <Col></Col>
                            <Col>
                                <Button large raised fill onClick={closeOrderInfoDeleteSuccessPopup} className="OKBtn">はい
                                </Button>
                            </Col>
                            <Col>
                                <Button large raised fill onClick={closeOrderInfoDeleteSuccessPopup} className="OKBtn">いいえ

                                </Button>
                            </Col>
                            <Col></Col>

                        </Row>

                    </Dialog>

                    {/* 削除成功ポップアップ */}
                    <Dialog isOpen={popupDeleteSuccessOpened} className='successDialog'>

                        <p style={{ fontSize: 'medium', marginTop: '50px', textAlign: 'center', color: '#000' }}>受注情報の削除に成功しました。
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
export default OrderInfoUpdatePage;