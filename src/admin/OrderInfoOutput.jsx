import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Dialog,
    Col,
    Button
} from 'react-onsenui';

/*受注情報出力Component*/
const OrderInfoOutputPage = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const [downloadDate, setdownloadDate] = useState(`${year}${month}${day}`);
    const [fromDeliveryDate, setFromDeliveryDate] = useState('');
    const [toDeliveryDate, setToDeliveryDate] = useState('');
    const [validationError, setValidationError] = useState('');
    const [popupOpened, setPopupOpened] = useState(false);
    const [deliveryDateSearchResultList, setdeliveryDateSearchResultList] = useState([]);
    const [searchorderListFlagFalse, setsearchorderListFlagFalse] = useState([]);
    const [searchorderListFlagTrue, setsearchorderListFlagTrue] = useState([]);
    const [searchStatus, setsearchStatus] = useState(false);
    const [nosearchDataErrorMessage, setnosearchDataErrorMessage] = useState(false);
    const [fileName, setFileName] = useState('');

    /* UTF 16 ファイルの列名設定*/
    const customHeader = ['受注日付', '受注№', '得意先ｺｰﾄﾞ', '得意先名１', '納品先ｺｰﾄﾞ', '納品先名', '売掛区分', '売掛区分名', '納期', '倉庫ｺｰﾄﾞ', '倉庫名', '商品ｺｰﾄﾞ', '商品名', '数量', '数量単位ﾞ', '行摘要ｺｰﾄﾞ', '行摘要1', '行摘要2', '備考ｺｰﾄﾞ', '備考', '受注メモ'];
    // 出力ファイル名変更する
    //Input Parameter→Userが変更したファイル名
    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
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

    /* 済みフラグを True に更新関数*/
    /* Input  Parameter→受注データ　List*/
    const updateOrderOutputFlagData = async (updatedFlagOrderList) => {
        try {
            /*  済みフラグ更新API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/order/updateflagdata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFlagOrderList),
            });

            const jsonData = await response.json();
            console.log(' APIからのレスポンスデータ:', jsonData);

            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }

        } catch (error) {
            console.error('データ取得エラー:', error);
        }

    }

    /*納品日検索*/
    const searchOrderDataByDeliveryDate = async () => {
        try {
            /* 納品日「From Date]／納品日「To Date ]　チェック*/
            if (fromDeliveryDate && toDeliveryDate) {
                /*  納品日検索API呼び出し*/
                const response = await fetch(`http://127.0.0.1:3000/orders/search_by_date_range?from_date=${fromDeliveryDate}&to_date=${toDeliveryDate}`);
                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。');
                }
                const jsonData = await response.json();
                console.log('APIからのレスポンスデータ:', jsonData);
                setsearchStatus(true); //検索ステータスを True に設定
                setnosearchDataErrorMessage(false);
                setdeliveryDateSearchResultList(jsonData); //検索データ　List　にAPIからのレスポンスデータを設定
                setsearchorderListFlagFalse(jsonData.filter(item => item.printed_flag === 0)); // 済みフラグ「 True」データ 設定
                setsearchorderListFlagTrue(jsonData.filter(item => item.printed_flag === 1));///済みフラグ「 False」データ 設定
            }
            else {
                setdeliveryDateSearchResultList([]); /* 検索データ　List　クリア一*/
                setnosearchDataErrorMessage(true);
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
        }

    }

    /* 受注情報出力確認ポップアップ開く*/
    const openPopup = () => {
        setPopupOpened(true);
    };
    /* 受注情報出力確認ポップアップ閉じる*/
    const closePopup = () => {
        setPopupOpened(false);
    };

    /* 出力されたデータが存在するかどうかを確認機能*/
    const checkoutputflagTrueDataExist = () => {
        /*  検索ステータス　あるかどうか確認 */
        /*  検索条件有場合 */
        if (searchStatus) {
            /* 出力されたデータが存在するかどうかを確認*/
            if (searchorderListFlagTrue.length > 0) {
                /*出力されたデータが存在する場合*/
                setPopupOpened(true); // 受注情報出力確認ポップアップ表示

            }
            else {
                /* 出力されたデータ無し場合*/
                handleWriteOutputFlagFalseDataClick();    /*書き込み関数呼び出し*/

            }
        }
        /* 検索条件ない場合 */
        else {
            setnosearchDataErrorMessage(true);
        }



    }

    const handleWriteAllDataClick = () => {

        /*  検索ステータス　あるかどうか確認 */
        /*  検索条件有場合 */
        if (searchStatus) {
            /* UTF 16ファイルに書き込み関数呼び出し*/
            /*  Parameter→受注データList*/
            writeDataToFile(deliveryDateSearchResultList);

            /* 済みフラグ「False]データあるかどうかを確認*/
            if (searchorderListFlagFalse.length > 0) {
                // 有場合
                /*済みフラグ「 True」データ フィルター機能呼び出し*/
                /*  Parameter→受注データList*/
                setOutputFlagtoTrue(searchorderListFlagFalse);
            }

        }

    };

    /*書き込み関数*/
    const handleWriteOutputFlagFalseDataClick = () => {

        /*   検索条件有場合 */
        if (searchStatus) {
            /*ファイルに書き込み関数呼び出し*/
            /*  Parameter→受注データList*/
            writeDataToFile(searchorderListFlagFalse);

            /*済みフラグ「 True」データ フィルター機能呼び出し*/
            /*  Parameter→受注データList*/
            setOutputFlagtoTrue(searchorderListFlagFalse);
        }

    };
    /* UTF 16ファイルに書き込み関数*/
    /* Input  Parameter→受注データList*/
    const writeDataToFile = (data) => {
        try {
            const bom = '\uFEFF';
            // Windows-style CRLF line endings
            const crlf = '\r\n';

            const header = '\uFEFF' + customHeader.join('\t') + crlf;
            const tabDelimitedText = data.map(item => `${item.order_date}\t${item.order_number}\t${item.customer_code}\t${item.customer_name}\t${item.delivery_destination_code}\t${item.delivery_destination_name}\t${item.account_type}\t${item.account_type_name}\t${item.delivery_date}\t${item.warehouse_code}\t${item.warehouse_name}\t${item.product_code}\t${item.product_name}\t${item.quantity}\t${item.quantity_unit}\t${item.summary_code}\t${item.description1}\t${item.description2}\t${item.remark_code}\t${item.remarks}\t${item.order_memo}`).join(crlf); // Use CRLF for line endings

            // Combine the UTF-16 LE header, custom header, and the tab-delimited data
            const utf16leData = new Uint16Array([...header].map(c => c.charCodeAt(0)).concat([...tabDelimitedText].map(c => c.charCodeAt(0))));

            // Create a Blob with UTF-16 LE encoding
            const dataBlob = new Blob([utf16leData.buffer], { type: 'text/plain;charset=utf-16le' });

            // Create an Object URL for the Blob
            const url = URL.createObjectURL(dataBlob);
            // Create a download link
            const link = document.createElement('a');
            link.href = url;

            // ユーザー入力ファイル名をチェック
            if (fileName) {
                /* 入力ファイル名有場合*/
                const filename = fileName + '.txt';
                link.setAttribute('download', filename);/*ファイル名設定*/
            } else {
                /* 入力ファイル名無し場合*/
                // 本日日付とファイル名を自動入力
                const filename = downloadDate + 'OrderOutput.txt';
                link.setAttribute('download', filename);/*ファイル名設定*/
            }


            /*「名前を付けて保存」ダイアログを開く*/
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: false,
                cancelable: true,
            });

            link.dispatchEvent(clickEvent);

            // Release the Object URL resource
            URL.revokeObjectURL(url);



        } catch (error) {
            console.error('エラーデータ:', error);
        }
        /*    受注情報出力確認ポップアップ閉じる機能呼び出し*/
        closePopup();
    };

    /*済みフラグ「 True」データ フィルター　機能*/
    /* Input  Parameter→受注データ　List*/
    const setOutputFlagtoTrue = (orderListFlagFalse) => {
        //set outputflag true for orderList that flag are false 
        const updatedList = orderListFlagFalse.map((obj) => ({ ...obj, printed_flag: 1 }));
        /* 済みフラグを True に更新関数*/
        /*  Parameter→受注データ　List*/
        updateOrderOutputFlagData(updatedList);

    }


    return (
        <Page contentStyle={{
            overflowY: 'scroll', // Enable vertical scrolling
            height: '100%', // Set the height to ensure the page takes up the full viewport
        }} >


            <p style={{ fontSize: 'x-large', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>受注情報出力
            </p>


            <Row>
                <label className="custom-label">納品日検索

                </label>
            </Row>
            <Row>
                <Col className="custom-search-input">
                    <Input className="fromDate" outline

                        type="text"
                        value={fromDeliveryDate}
                        placeholder='YYYY/MM/DD'

                        onChange={handleFromDeliveryDateChange} />
                    {validationError && (
                        <div style={{ color: 'red' }}>{validationError}</div>
                    )}
                </Col>
                <Col className="interfaceDiv">~</Col>
                <Col className="custom-table-input">
                    <Input className="toDate" outline

                        type="text"
                        id="toDeliveryDate"
                        value={toDeliveryDate}
                        placeholder='YYYY/MM/DD'
                        onChange={handleToDeliveryDateChange} />

                </Col>
                <Col>
                    <Button large raised fill className="searchBtn" onClick={searchOrderDataByDeliveryDate}>
                        検索
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: '30px' }}>
                <label className="custom-label">検索結果
                </label>
                <Col width="100">
                    <List className="custom-list" style={{ overflowY: 'scroll' }}>
                        <ListItem style={{ background: '#d3d3d3' }}>
                            <div className="customcontent">納品日</div>
                            <div className="customcontent">受注日付</div>
                            <div className="customcontent">受注№</div>
                            <div className="customcontent">得意先名</div>

                            <div className="customcontent">商品名</div>
                            <div className="customcontent">出力済みフラグ</div>
                        </ListItem>
                        {deliveryDateSearchResultList.length > 0 &&
                            deliveryDateSearchResultList.map((orderItem) => (
                                <ListItem key={orderItem.orderNo}>
                                    <div className="customcontent">{orderItem.delivery_date}</div>
                                    <div className="customcontent">{orderItem.order_date}</div>
                                    <div className="customcontent">{orderItem.order_number}</div>
                                    <div className="customcontent">{orderItem.customer_name}</div>

                                    <div className="customcontent">{orderItem.product_name}</div>
                                    <div className="customcontent">

                                        {orderItem.printed_flag === 1 ? (<span>過去に出力済み</span>) : (<span>未出力</span>)}</div>

                                </ListItem>


                            ))
                        }


                    </List>

                </Col>

            </Row>


            {searchStatus && deliveryDateSearchResultList.length == 0 ? (
                <Row>
                    <div style={{ color: 'red', fontSize: '14px', marginLeft: '10px' }}>検索データが見つかりません!!!</div>
                </Row>
            ) : null}

            <Row style={{ marginTop: '15px' }}>

                <Col width='20'>
                    出力ファイル名：     </Col>
                <Col width='80'>
                    <Input outline className="custom-input-exportfile" label="searchText"
                        type="text" style={{ fontSize: '10px', width: '100%' }} value={fileName} onChange={handleFileNameChange} />
                </Col>

            </Row>

            {nosearchDataErrorMessage == true &&
                <Row>
                    <div style={{ color: 'red', fontSize: '14px', marginLeft: '10px' }}>納品日でデータを検索してください!!!</div>
                </Row>
            }


            <Row style={{ marginTop: '30px' }}>
                <Col width="50" >


                </Col>
                <Col width="50">

                    <Button large raised fill className='downloadLog' style={{ marginTop: '10px' }} onClick={checkoutputflagTrueDataExist} >

                        出力
                    </Button>
                </Col>
            </Row>




            <Dialog isOpen={popupOpened} >
                <Page>
                    <p style={{ fontSize: 'medium', marginTop: '25px', textAlign: 'center', color: '#000' }}>過去に出力した受注情報ですが再出力しますか？
                    </p>
                    <p style={{ fontSize: 'medium', marginTop: '5px', textAlign: 'center', color: '#000' }}>はい：出力済みを含むすべての受注情報を出力
                    </p>
                    <p style={{ fontSize: 'medium', marginTop: '5px', textAlign: 'center', color: '#000' }}>いいえ：未出力の受注情報のみ出力
                    </p>
                    <Row style={{ marginTop: '30px' }}>
                        <Col></Col>

                        <Col>
                            <Button large raised fill onClick={handleWriteAllDataClick} className="yesBtn">
                                はい
                            </Button>

                        </Col>
                        <Col>

                            <Button large raised fill onClick={handleWriteOutputFlagFalseDataClick} className="noBtn">

                                いいえ
                            </Button>
                        </Col>
                        <Col>

                            <Button large raised fill onClick={closePopup}>

                                キャンセル

                            </Button>
                        </Col>
                        <Col></Col>
                    </Row>
                </Page>
            </Dialog>

        </Page>
    );
};
export default OrderInfoOutputPage;