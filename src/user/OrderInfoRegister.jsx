import React, { useRef, useState, useEffect } from 'react';

import {
    Page,
    Input,
    List, Checkbox,
    ListItem, Dialog,
    Row,
    Col, Radio,
    Button
} from 'react-onsenui';
import OrderRegisterComponent from '../user/OrderRegister';
import OrderRegisterConfirmComponent from '../user/OrderRegisterConfirm';
import OrderRegisterErrorComponent from '../user/OrderError';
import BarcodeScannerComponent from '../user/BarcodeScanner';
import { BASE_URL } from './../env'; // env ファイルから BASE_URL (環境変数) をインポートします。
import App from '../App';
/*受注情報登録 Component*/
const OrderInfoRegisterPage = (props) => {
    const [showBarcodeScanner, setshowBarcodeScanner] = useState(false);
    const [showOrderInfoRegister, setshowOrderInfoRegister] = useState(true);
    const [showOrderRegister, setshowOrderRegister] = useState(false);
    const [showOrderError, setshowOrderError] = useState(false);
    const [showOrderRegisterConfirm, setshowOrderRegisterConfirm] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    const [projectcreatesuccesspopupOpened, setprojectcreatesuccesspopupOpened] = useState(false);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const [customerName, setcustomerName] = useState('');
    const [searchproductname, setsearchproductname] = useState('');
    const [searchproductcode, setsearchproductcode] = useState('');
    const [productList, setproductList] = useState([]);
    const [selectedProductOption, setselectedProductOption] = useState('');
    const [selectedProductItem, setselectedProductItem] = useState([]);
    const [selectedProductList, setSelectedProductList] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [summaryList, setsummaryList] = useState([]);
    const [selectedSummarycodeValue, setselectedSummarycodeValue] = useState('');
    const [checkProductOption, setcheckProductOption] = useState(true);
    const [summaryName1, setsummaryName1] = useState('');
    const [summaryName2, setsummaryName2] = useState('');
    const [quantity, setquantity] = useState(0);
    const [orderNumber, setorderNumber] = useState('');
    const [productCode, setproductCode] = useState('')
    const [productNameIndex, setproductNameIndex] = useState('')
    const [productName, setproductName] = useState('')
    const [productCapacity, setproductCapacity] = useState('')
    const [productQuantityUnit, setproductQuantityUnit] = useState('');
    const [productJanCode, setproductJanCode] = useState('')
    const [selectedorderinfoobjectList, setselectedorderinfoobjectList] = useState([]);
     const [selectedproductobjectList, setselectedproductobjectList] = useState([]);
    const [selectedorderinfoProductList, setselectedorderinfoProductList] = useState([]);
    const [selectedProductNumber, setselectedProductNumber] = useState('');
    const [previousInputValue, setPreviousInputValue] = useState('');
    const [previousSummaryCodeValue, setpreviousSummaryCodeValue] = useState('');
    const [previousSummary1Value, setpreviousSummary1Value] = useState('');
    const [previousSummary2Value, setpreviousSummary2Value] = useState('');
    const [orderRegisterDataToBarcodeComponent, setorderRegisterDataToBarcodeComponent] = useState([]);
    // バーコードスキャン遷移
    const barcodeScan = () => {
        // バーコードスキャンcomponentのナビゲート     

        setshowBarcodeScanner(true);
        setshowOrderError(false);
        setshowOrderInfoRegister(false);
        setshowOrderRegisterConfirm(false);
        setshowLogin(false);
        setshowOrderRegister(false);
        localStorage.setItem('orderinfoobjectList', JSON.stringify(orderRegisterDataToBarcodeComponent));
        localStorage.setItem('customerName', JSON.stringify(customerName));

    }
    // 商品ｺｰﾄﾞ変更する
    //Input Parameter→Userが変更した商品ｺｰﾄﾞ
    const handleproductCodeChange = (e) => {
        setproductCode(e.target.value);
    };
    // 商品名索引変更する
    //Input Parameter→Userが変更した商品名索引
    const handleproductNameIndexChange = (e) => {
        setproductNameIndex(e.target.value);
    };
    // 商品名変更する
    //Input Parameter→Userが変更した商品名
    const handleproductNameChange = (e) => {
        setproductName(e.target.value);
    };
    // 容量変更する
    //Input Parameter→Userが変更した容量
    const handleproductCapacityChange = (e) => {
        setproductCapacity(e.target.value);
    };
    // 数量単位変更する
    //Input Parameter→Userが変更した数量単位
    const handleproductQuantityUnitChange = (e) => {
        setproductQuantityUnit(e.target.value);
    };
    // JANコード変更する
    //Input Parameter→Userが変更したJANコード
    const handleproductJanCodeChange = (e) => {
        setproductJanCode(e.target.value);
    };
    // 数量変更する
    //Input Parameter→Userが変更した数量
    const handleQuantityChange = (e) => {
        setquantity(e.target.value);
        const numericQuantity = parseInt(quantity);
        const existingProduct = selectedProductList.find((item) => item.product_number === selectedProductNumber);
        const combinederrorRowandDataObjectList = selectedProductList.map((product) => {
            if (product.product_number === existingProduct.product_number) {
                return {
                    ...product, quantity: numericQuantity, summary_code: selectedSummarycodeValue,
                    summary_1: summaryName1,
                    summary_2: summaryName2,
                    order_number: orderNumber,
                };
            }
            else {
                return {
                    ...product, quantity: previousInputValue, summary_code: previousSummaryCodeValue,
                    summary_1: previousSummary1Value,
                    summary_2: previousSummary2Value,
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
    // 選択 商品名変更する
    //Input Parameter→Userが選択 した商品名
    const handleSearchInputProductNameChange = (e) => {
        const text = e.target.value;
        const lowercaseInput = text.toLowerCase();
        setsearchproductname(lowercaseInput);
    };
    // 選択 商品ｺｰﾄﾞ変更する
    //Input Parameter→Userが選択 した商品ｺｰﾄﾞ
    const handleSearchInputProductCodeChange = (e) => {
        const productcode = e.target.value;
        setsearchproductcode(productcode);
    };


    // 商品名検索関数
    const searchByProductName = async () => {
        // 商品名あるかどうか確認
        if (searchproductname) {
            setproductList([]);
            try {
                // 商品名検索API呼び出し
                const response = await fetch(`${BASE_URL}/product_masters/searchproductname?searchproductname=${searchproductname}`)

                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                // レスポンスデータあるかどうか確認
                if (jsonData.length > 0) {
                    // 有場合
                    setproductList(jsonData); //商品List にAPIからのレスポンスデータを設定

                }
                else {
                    // 無し場合
                    setselectedProductItem([]);
                    setproductList([]);
                }

            } catch (error) {
                console.error('データ取得エラー:', error);
            }
        }
        else {
            //   商品データ取得API呼び出し
            fetchProductData();
        }

    }
    // 商品ｺｰﾄﾞ検索関数
    const searchByProductCode = async () => {

        if (searchproductcode) {
            setproductList([]);
            try {
                //  商品ｺｰﾄﾞ検索API呼び出し
                const response = await fetch(`${BASE_URL}/product_masters/searchproductcode?searchproductcode=${searchproductcode}`)

                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                // レスポンスデータあるかどうか確認
                if (jsonData.length > 0) {
                    // 有場合
                    setproductList(jsonData); //商品List にAPIからのレスポンスデータを設定

                }
                else {
                    // 無し場合
                    setselectedProductItem([]);
                    setproductList([]);
                }

            } catch (error) {
                console.error('データ取得エラー::', error);
            }
        }
        else {
            //   商品データ取得API呼び出し
            fetchProductData();
        }

    }

    // Janｺｰﾄﾞ検索関数
    const searchByJanCode = async (searchjancode) => {
        if (searchjancode) {

            // setproductList([]);
            try {
                //  Janｺｰﾄﾞ検索API呼び出し
                const response = await fetch(`${BASE_URL}/product_masters/searchjancode?searchjancode=${searchjancode}`)

                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                // レスポンスデータあるかどうか確認
                if (jsonData.length > 0) {
                    // 有場合
                    // setproductList((prevProductList) => [
                    //     ...prevProductList,
                    //     jsonData,
                    // ]);
                    setproductList(jsonData);//商品List にAPIからのレスポンスデータを設定
                    console.log('productList', productList);
                }
                else {
                    // 無し場合
                    setproductList([]);

                }

            } catch (error) {
                console.error('データ取得エラー::', error);
            }
        }


    }
    // 初期状態
    useEffect(() => {

        if (props.orderinfoobjectList) {
            setorderNumber(props.orderinfoobjectList[0].order_number);
            orderRegisterDataToBarcodeComponent.push(props.orderinfoobjectList[0]);
        }
        // 商品データ取得関数呼び出し
        fetchProductData();
        // 摘要データ取得関数呼び出し
        fetchsummaryData();
        // 選択した Jan code あるかどうか確認     
        console.log('Jancode', props.searchjancode);
        if (props.searchjancode) {
            // 有場合           
            searchByJanCode(props.searchjancode);
        }
        // 選択した 得意先 あるかどうか確認
        if (props.selectedCustomerItem) {
            // 有場合
            setcustomerName(props.selectedCustomerItem.customer_name1);
        }
        //  得意先「LocalStorage Data」 あるかどうか確認
        else if (JSON.parse(localStorage.getItem('customerName'))) {
            // 有場合
            const customerName = JSON.parse(localStorage.getItem('customerName'));
            setcustomerName(customerName);
        }
        else if (JSON.parse(localStorage.getItem('orderinfoobjectList'))) {
            const orderinfoobjectList = JSON.parse(localStorage.getItem('orderinfoobjectList'));
            setorderNumber(orderinfoobjectList.order_number);
        }



    }, []);

    //   商品データ取得関数
    const fetchProductData = async () => {
        try {
            //   商品データ取得API呼び出し
            const response = await fetch(`${BASE_URL}/product_masters/get_product_data`);
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setproductList(jsonData); // 商品List にAPIからのレスポンスデータを設定

        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };
    //   摘要データ取得関数
    const fetchsummaryData = async () => {
        try {
            // 摘要データ取得API呼び出し
            const response = await fetch(`${BASE_URL}/summary/get_summary_data`);
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setsummaryList(jsonData); // 摘要List にAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    };


    // 摘要選択する
    //Input Parameter→Userが選択した摘要ｺｰﾄﾞ
    const handleSelectSummaryCode = (e) => {
        const selectedValue = e.target.value;
        setselectedSummarycodeValue(selectedValue);

        // 対応する摘要を検索
        const selectedSummaryCode = summaryList.find(
            (summary) => summary.summary_code === selectedValue
        );
        //  摘要あるかどうか確認
        if (selectedSummaryCode) {
            // 有場合
            setsummaryName1(selectedSummaryCode.summary_1);
            setsummaryName2(selectedSummaryCode.summary_2);
        } else {
            // 無し場合
            setsummaryName1('');
            setsummaryName2('');
        }
        const existingProduct = selectedProductList.find((item) => item.product_number === selectedProductNumber);
        const combinederrorRowandDataObjectList = selectedProductList.map((product) => {
            if (product.product_number === existingProduct.product_number) {

                return {
                    ...product, quantity: quantity, summary_code: selectedValue,
                    summary_1: selectedSummaryCode.summary_1,
                    summary_2: selectedSummaryCode.summary_2,
                    order_number: orderNumber,
                };
            }
            else {
                return {
                    ...product, quantity: previousInputValue, summary_code: previousSummaryCodeValue,
                    summary_1: previousSummary1Value,
                    summary_2: previousSummary2Value,
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
        const selectedItem = productList.find((item) => item.product_code === selectedValue);
        //商品あるかどうか確認
        if (selectedItem) {
            // 有場合
            setselectedProductItem(selectedItem);
            setselectedProductNumber(selectedItem.product_number);
            setPreviousInputValue(quantity);
            setpreviousSummaryCodeValue(selectedSummarycodeValue);
            setpreviousSummary1Value(summaryName1);
            setpreviousSummary2Value(summaryName2);
            setquantity(0);
            setsummaryName1('');
            setsummaryName2('');
            setselectedSummarycodeValue('');


        }

    };

    // 受注登録画面の移行
    const navigateToOrderRegister = () => {
        //  受注登録componentのナビゲート
        setshowOrderRegister(true);
        setshowBarcodeScanner(false);
        setshowOrderRegisterConfirm(false);
        setshowOrderError(false);
        setshowLogin(false);
        setshowOrderInfoRegister(false);

    }

    // 受注登録関数
    const orderRegistration = () => {

        // 選択した商品あるかどうか確認
        if (selectedProductOption) {
            console.log('selectedorderinfoProductList[selectedorderinfoProductList.length - 1]',selectedorderinfoProductList[selectedorderinfoProductList.length - 1]);
            // 有場合        
            // 入力データ検証チェック
            if (props.orderinfoobjectList) {
                if (props.orderinfoobjectList[0].order_date && props.orderinfoobjectList[0].account_type && props.orderinfoobjectList[0].warehouse_code && props.orderinfoobjectList[0].delivery_date && props.orderinfoobjectList[0].delivery_destination_code && props.orderinfoobjectList[0].remark_code && props.orderinfoobjectList[0].remarks) {
                    if (selectedorderinfoProductList.length > 0) {
                        const isObjectInvalid = (obj) => {
                            return obj.quantity === undefined || obj.quantity === null || obj.quantity === 0 || obj.summary_code === '';
                        };
                        const invalidObjects = selectedorderinfoProductList[selectedorderinfoProductList.length - 1].filter((obj) => isObjectInvalid(obj));

                        if (invalidObjects.length > 0) {
                            selectedorderinfoobjectList.push(props.orderinfoobjectList[0]);
                            selectedproductobjectList.push(selectedorderinfoProductList[selectedorderinfoProductList.length - 1]);
                            setshowOrderError(true);
                            setshowOrderInfoRegister(false);
                            setshowOrderRegisterConfirm(false);
                            setshowBarcodeScanner(false);
                            setshowLogin(false);
                            setshowOrderRegister(false);

                        } else {
                            selectedorderinfoobjectList.push(props.orderinfoobjectList[0]);
                             selectedproductobjectList.push(selectedorderinfoProductList[selectedorderinfoProductList.length - 1]);
                            setshowOrderError(false);
                            setshowOrderInfoRegister(false);
                            setshowOrderRegisterConfirm(true);
                            setshowBarcodeScanner(false);
                            setshowLogin(false);
                            setshowOrderRegister(false);
                        }

                    }
                    else {
                        console.log('no product data (quantity)');
                        selectedorderinfoobjectList.push(props.orderinfoobjectList[0]);
                         selectedproductobjectList.push(selectedProductList);
                        setshowOrderError(true);
                        setshowOrderInfoRegister(false);
                        setshowOrderRegisterConfirm(true);
                        setshowBarcodeScanner(false);
                        setshowLogin(false);
                        setshowOrderRegister(false);
                    }
                }
                else {

                    if (props.orderinfoobjectList) {
                        selectedorderinfoobjectList.push(props.orderinfoobjectList[0]);
                        setshowOrderError(true);
                        setshowOrderInfoRegister(false);
                        setshowOrderRegisterConfirm(false);
                        setshowBarcodeScanner(false);
                        setshowLogin(false);
                        setshowOrderRegister(false);
                    }
                    else {
                        const orderinfoobjectList = JSON.parse(localStorage.getItem('orderinfoobjectList'));
                        selectedorderinfoobjectList.push(orderinfoobjectList[0]);
                        setshowOrderError(true);
                        setshowOrderInfoRegister(false);
                        setshowOrderRegisterConfirm(false);
                        setshowBarcodeScanner(false);
                        setshowLogin(false);
                        setshowOrderRegister(false);
                    }

                }
                localStorage.setItem('orderinfoobjectList', JSON.stringify(selectedorderinfoobjectList));
                localStorage.setItem('customerName', JSON.stringify(customerName));
            }
            else {
                //history data check after returning  Barcode Scanner page               
                const orderinfoobjectList = props.orderinfoobjectListFromBarcode;
                console.log('history', orderinfoobjectList);
                if (orderinfoobjectList[0].order_date && orderinfoobjectList[0].account_type && orderinfoobjectList[0].warehouse_code && orderinfoobjectList[0].delivery_date && orderinfoobjectList[0].delivery_destination_code && orderinfoobjectList[0].remark_code && orderinfoobjectList[0].remarks) {
                    if (selectedorderinfoProductList.length > 0) {
                        const isObjectInvalid = (obj) => {
                            return obj.quantity === undefined || obj.quantity === null || obj.quantity === 0 || obj.summary_code === '';
                        };
                        const invalidObjects = selectedorderinfoProductList[selectedorderinfoProductList.length - 1].filter((obj) => isObjectInvalid(obj));

                        if (invalidObjects.length > 0) {
                            // 入力データ無し場合  
                            selectedorderinfoobjectList.push(orderinfoobjectList[0]);
                            setshowOrderError(true);
                            setshowOrderInfoRegister(false);
                            setshowOrderRegisterConfirm(false);
                            setshowBarcodeScanner(false);
                            setshowLogin(false);
                            setshowOrderRegister(false);

                        } else {
                            // 入力データ有場合   
                            selectedorderinfoobjectList.push(orderinfoobjectList[0]);
                            setshowOrderError(false);
                            setshowOrderInfoRegister(false);
                            setshowOrderRegisterConfirm(true);
                            setshowBarcodeScanner(false);
                            setshowLogin(false);
                            setshowOrderRegister(false);
                        }

                    }

                }
                else {
                    // 入力データ無し場合          
                    selectedorderinfoobjectList.push(orderinfoobjectList[0]);
                    setshowOrderError(true);
                    setshowOrderInfoRegister(false);
                    setshowOrderRegisterConfirm(false);
                    setshowBarcodeScanner(false);
                    setshowLogin(false);
                    setshowOrderRegister(false);

                }
                localStorage.setItem('orderinfoobjectList', JSON.stringify(selectedorderinfoobjectList));
                localStorage.setItem('customerName', JSON.stringify(customerName));
            }
        }
        else {
            // 無し場合  
            setcheckProductOption(false);
        }
    }
    // 商品を追加
    const handleCheckAll = () => {
        const checkedProducts = productList.filter((product) =>
            checkedItems.includes(product.product_code)
        );
        setSelectedProductList(checkedProducts);
    };

    // 商品変更するする関数
    const handleCheckboxChange = (product_code) => {
        setCheckedItems((prevCheckedItems) => {
            if (prevCheckedItems.includes(product_code)) {
                return prevCheckedItems.filter((code) => code !== product_code);
            } else {
                return [...prevCheckedItems, product_code];
            }
        });
    };

    // 新しい商品を登録関数
    const postProductDataListToApi = async () => {
        const productobjectList = [];
        // 新しいオブジェクトを作成
        const productobjectData = {

            product_code: productCode,
            product_name: productName,
            product_name_index: productNameIndex,
            capacity: productCapacity,
            quantity_unit: productQuantityUnit,
            jan_code: productJanCode,
        };
        productobjectList.push(productobjectData);

        try {
            // 新しい商品を登録API呼び出し
            const response = await fetch(`${BASE_URL}/product_masters/registerproduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productobjectList),
            });

            if (response.status === 200) {
                setprojectcreatesuccesspopupOpened(true);
                setproductCode('');
                setproductName('');
                setproductNameIndex('');
                setproductCapacity('');
                setproductJanCode('');
                setproductQuantityUnit('');
                console.log("登録成功:", await response.json());
            } else {
                console.log("登録失敗:", await response.json());

            }
        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }
        // 商品取得関数呼び出し
        fetchProductData();
    };
    // ログイン画面の移行
    const navigateToLogin = () => {
        setshowOrderError(false);
        setshowOrderInfoRegister(false);
        setshowOrderRegisterConfirm(false);
        setshowBarcodeScanner(false);
        setshowLogin(true);
        setshowOrderRegister(false);
        // props.navigator.resetPage({ component: App });
    };

    /*  商品の登録成功ポップアップ開く*/
    const openProductCreateSuccessPopup = () => {
        setprojectcreatesuccesspopupOpened(true);
    };
    /* 商品の登録成功ポップアップ閉じる*/
    const closeProductCreateSuccessPopup = () => {
        setprojectcreatesuccesspopupOpened(false);
    };
    return (
        <div>
            {showBarcodeScanner && <BarcodeScannerComponent orderRegisterData={orderRegisterDataToBarcodeComponent} />}
            {showLogin && <App />}
            {showOrderRegister && <OrderRegisterComponent />}
            {showOrderRegisterConfirm && <OrderRegisterConfirmComponent
                selectedProductItemList={selectedorderinfoProductList[selectedorderinfoProductList.length - 1]} orderinfoobjectList={selectedorderinfoobjectList} />}
            {showOrderError && <OrderRegisterErrorComponent selectedProductItem={selectedorderinfoProductList[selectedorderinfoProductList.length - 1]} orderinfoobjectList={selectedorderinfoobjectList} />}
            {showOrderInfoRegister ?
                (<Page contentStyle={{
                    overflowY: 'scroll', // Enable vertical scrolling
                    height: '100%', // Set the height to ensure the page takes up the full viewport
                }}>
                    <Row>
                        <Col width="60">
                        </Col>
                        <Col width="40">
                            <Button large raised fill className='businessBtn' style={{ marginTop: '10px' }} onClick={navigateToLogin} >
                                ログアウト
                            </Button>
                        </Col>
                    </Row>
                    <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注情報登録
                    </p>
                    <Row className="custom-row">
                        <p>得意先名:<span className="custom-span"> {customerName}</span></p>
                    </Row>
                    <Row className="custom-row">
                        <label className="custom-label">商品名検索
                        </label>
                    </Row>
                    <Row className="custom-row">
                        <Col>
                            <Input className="custom-search-input"
                                label="searchText"
                                type="text"
                                value={searchproductname}
                                onChange={handleSearchInputProductNameChange}
                                placeholder="商品名を入力してください。" />

                        </Col>
                        <Col>
                            <Button large raised fill className='searchBtnMobile' onClick={searchByProductName}>
                                検索
                            </Button>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            <Button large raised fill className="barcodeBtnMobile" style={{ width: '100px' }} onClick={barcodeScan}>
                                バーコードスキャン

                            </Button>
                        </Col>
                    </Row>

                    <Row className="custom-row">
                        <label className="custom-label">商品コード指定

                        </label>
                    </Row>
                    <Row className="custom-row">
                        <Col>
                            <Input className="custom-search-input"
                                label="searchText"
                                type="text"
                                value={searchproductcode}
                                onChange={handleSearchInputProductCodeChange}
                                placeholder="商品コードを入力してください。" />

                        </Col>
                        <Col>
                            <Button large raised fill className='searchBtnMobile' onClick={searchByProductCode}>
                                検索
                            </Button>
                        </Col>
                    </Row>


                    <Row className="custom-row">
                        <label className="custom-label">検索結果</label>
                    </Row>

                    {productList.length == 0 &&
                        <Row>
                            <div style={{ color: 'red', fontSize: '20px', marginLeft: '17px' }}>検索データが見つかりません!!!</div>
                        </Row>
                    }
                    {productList &&
                        <Row className="custom-row">
                            <Col>

                                <List className="custom-list">
                                    <ListItem>

                                        <div className="item-title">商品コード</div>
                                        <div className="item-title">商品名</div>

                                    </ListItem>
                                    {
                                        productList.map((productItem) => (

                                            <ListItem key={productItem.product_code} >

                                                <Checkbox
                                                    inputId={`checkbox-${productItem.product_code}`}
                                                    checked={checkedItems.includes(productItem.product_code)}
                                                    onChange={() => handleCheckboxChange(productItem.product_code)}
                                                />
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
                        <Col width="80" >
                            <p> 受注登録する商品を追加してください。
                            </p>
                        </Col>
                        <Col width="20">
                            <Button large raised fill className='businessBtn' style={{ marginTop: '10px', marginLeft: '5px' }} onClick={handleCheckAll}>
                                追加
                            </Button>
                        </Col>
                    </Row>

                    <Row className="custom-row">

                        <Row>
                            <label className="custom-label">未登録商品の追加
                            </label></Row>

                        <Row>
                            <label className="custom-label">未登録商品を受注登録する場合は商品情報を入力して追加してください。

                            </label></Row>
                        <table>
                            <tr><th className="custom-tableth">
                                商品コード</th>
                                <td className="custom-tabletd"> <Input outline className="custom-input"
                                    type="text" placeholder="商品コード"
                                    value={productCode}
                                    onChange={handleproductCodeChange} /></td>
                            </tr>
                            <tr><th className="custom-tableth">
                                商品名</th>
                                <td className="custom-tabletd"><Input outline className="custom-input"
                                    type="text" placeholder="商品名"
                                    value={productName}
                                    onChange={handleproductNameChange} /></td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">商品名索引</th>
                                <td className="custom-tabletd"><Input outline className="custom-input"
                                    type="text" placeholder="商品名索引"
                                    value={productNameIndex}
                                    onChange={handleproductNameIndexChange} /></td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">容量</th>
                                <td className="custom-tabletd"><Input outline className="custom-input"
                                    type="text" placeholder="容量"
                                    value={productCapacity}
                                    onChange={handleproductCapacityChange} /></td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">数量単位</th>
                                <td className="custom-tabletd"><Input outline className="custom-input"
                                    type="text" placeholder="数量単位"
                                    value={productQuantityUnit}
                                    onChange={handleproductQuantityUnitChange} /></td>
                            </tr>
                            <tr>
                                <th className="custom-tableth">JANコード</th>
                                <td className="custom-tabletd"><Input outline className="custom-input"
                                    type="text" placeholder="JANコード"
                                    value={productJanCode}
                                    onChange={handleproductJanCodeChange} /></td>
                            </tr>




                        </table>

                    </Row>
                    <Row className="custom-row">
                        <Col width="70" >

                        </Col>
                        <Col width="30">
                            <Button large raised fill className='businessBtn' style={{ marginTop: '10px', marginLeft: '5px' }} onClick={postProductDataListToApi} >
                                追加
                            </Button>
                        </Col>
                    </Row>

                    <Row className="custom-row">
                        <label className="custom-label">受注登録商品
                        </label>
                    </Row>



                    {selectedProductList.length > 0 &&
                        <Row className="custom-row">
                            <Col>

                                <List className="custom-list">
                                    <ListItem>

                                        <div className="item-title">商品コード</div>
                                        <div className="item-title">商品名</div>

                                    </ListItem>
                                    {
                                        selectedProductList.map((productItem) => (
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
                    {checkProductOption == false ? (
                        <Row>
                            <div style={{ color: 'red', fontSize: '14px', marginLeft: '10px' }}>受注登録商品を選択してください!!!</div>
                        </Row>
                    ) : null}

                    {selectedProductList.length != 0 && selectedProductItem && (
                        <Row className="custom-row">


                            <label className="custom-label">商品情報</label>

                            <table>
                                <tr><th className="custom-tableth">
                                    商品コード</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedProductItem.product_code}</span></td>
                                </tr>
                                <tr><th className="custom-tableth">
                                    商品名</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedProductItem.product_name}</span></td>
                                </tr>
                                <tr>
                                    <th className="custom-tableth">商品名索引</th>
                                    <td className="custom-tabletd"><span className='custom-span'>  {selectedProductItem.product_name_index}</span></td>
                                </tr>
                                <tr>
                                    <th className="custom-tableth">容量</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedProductItem.capacity}</span></td>
                                </tr>
                                <tr>
                                    <th className="custom-tableth">数量単位</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedProductItem.quantity_unit}</span></td>
                                </tr>
                                <tr>
                                    <th className="custom-tableth">JANコード</th>
                                    <td className="custom-tabletd"><span className='custom-span'> {selectedProductItem.jan_code}</span></td>
                                </tr>




                            </table>

                        </Row>


                    )}
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
                            <Button large raised fill className='return_nextBtn' onClick={navigateToOrderRegister} >
                                戻る
                            </Button>

                        </Col>
                        <Col>
                            <Button large raised fill className='return_nextBtn' onClick={orderRegistration} >
                                登録

                            </Button>
                        </Col>
                    </Row>


                    {/* 商品成功ポップアップ */}
                    <Dialog isOpen={projectcreatesuccesspopupOpened} className='successDialog'>

                        <p style={{ fontSize: 'medium', marginTop: '50px', textAlign: 'center', color: '#000' }}>商品の登録に成功しました。
                        </p>
                        <Row style={{ marginTop: '30px' }}>
                            <Col></Col>
                            <Col></Col>
                            <Col>
                                <Button large raised fill onClick={closeProductCreateSuccessPopup} className="OKBtn">OK
                                </Button>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>

                    </Dialog>

                </Page>) : null}

        </div>
    );
};
export default OrderInfoRegisterPage;