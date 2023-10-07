import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Col, Button
} from 'react-onsenui';

/*ログ確認 Component*/
const LogConfirmPage = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const [downloadDate, setdownloadDate] = useState(`${year}${month}${day}`);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [validationError, setValidationError] = useState('');
    const [infoList, setinfoList] = useState([]);
    const [errorList, seterrorList] = useState([]);
    const [infoCheck, setinfoCheck] = useState(true);
    const [errorCheck, seterrorCheck] = useState(false);
    const [searchStatus, setsearchStatus] = useState(false);
    const [fileName, setFileName] = useState('');
    const [nosearchDataErrorMessage, setnosearchDataErrorMessage] = useState(false);
    /*  CSVファイルの列名設定*/
    const customHeader = ['タイムスタンプ', '区分', '処理名', 'メッセージ', 'ユーザー名'];

    // 出力ファイル名変更する
    //Input Parameter→Userが変更したファイル名
    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };

    /* 機能ログチェックボックス設定*/
    const handleInfoCheckboxChange = () => {
        setinfoCheck((prevIsChecked) => !prevIsChecked);

    };
    /* エラーログチェックボックス設定*/
    const handleErrorCheckboxChange = () => {
        seterrorCheck((prevIsChecked) => !prevIsChecked);

    };


    /*日付検索 */
    const searchLogDataByDate = () => {
        /* From Date &&To Date確認*/
        if (fromDate && toDate) {
            searchInfoDataByDate(); /*日付検索「インフォログList」呼び出し*/
            searchErrorDataByDate();/*日付検索「エラーログList」呼び出し*/
        }
        else {
            setinfoList([]);/*インフォログList クリア一*/
            seterrorList([]);/* エラーログList クリア一*/
            setnosearchDataErrorMessage(true);

        }
    }

    /*日付検索「インフォログList」*/
    const searchInfoDataByDate = async () => {

        try {
            setinfoList([]); /*インフォログListクリア一*/
            /*  日付検索API呼び出し*/
            const response = await fetch(`http://127.0.0.1:3000/infolog/search_by_date_range?from_date=${fromDate}&to_date=${toDate}`);
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setsearchStatus(true); //検索ステータスを True に設定
            setnosearchDataErrorMessage(false);
            setinfoList(jsonData); //インフォログListにAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }
    }

    /*日付検索「エラーログList」*/
    const searchErrorDataByDate = async () => {
        seterrorList([]);/* エラーログListクリア一*/
        try {
            setinfoList([]);/*インフォログListクリア一*/
            /*  日付検索API呼び出し*/
            const response = await fetch(`http://127.0.0.1:3000/errorlog/search_by_date_range?from_date=${fromDate}&to_date=${toDate}`);
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました。');
            }
            const jsonData = await response.json();
            setsearchStatus(true);//検索ステータスを True に設定
            setnosearchDataErrorMessage(false);
            seterrorList(jsonData); //エラーログListにAPIからのレスポンスデータを設定
        } catch (error) {
            console.error('データ取得エラー:', error);
        }

    }

    /* データを CSV ファイルに書き込み*/
    const handleWriteDataClick = () => {

        /*    検索ステータスあるかどうか確認 */
        /*   検索条件有場合 */
        if (searchStatus) {
            /*  機能ログチェックボックスと エラーログチェックボックス確認*/
            if (infoCheck && errorCheck) {
                /* 両方のチェック場合*/
                const combinedList = infoList.concat(errorList);/*インフォログListと エラーログListを結合*/
                /*CSV ファイルに書き込み関数呼び出し */
                /*   Parameter→結合List*/
                writeDataToFile(combinedList);
            }
            /*     機能ログチェック場合*/
            else if (infoCheck) {
                /*CSV ファイルに書き込み関数呼び出し */
                /*   Parameter→インフォログList*/
                writeDataToFile(infoList);
            }
            /*  エラーログチェック場合*/
            else if (errorCheck) {
                /* CSV ファイルに書き込み関数呼び出し */
                /*   Parameter→エラーログList*/
                writeDataToFile(errorList);

            }
        }
        /*   検索条件ない場合 */
        else {
            setnosearchDataErrorMessage(true);
        }

    };

    /* 最後の列（ユーザー名）に文字列[']を追加機能*/
    /*Input Parameter➞データList*/
    /*Output Parameter➞データList*/
    const modifyLastColumn = (data) => {
        return data.map(obj => {
            // オブジェクトのキー(カラム名)を取得
            const keys = Object.keys(obj);

            // 最後のキー(列名)を取得
            const lastKey = keys[keys.length - 1];

            // 文字列を最後の列の値に追加
            obj[lastKey] = "'" + obj[lastKey];

            return obj;
        });
    }



    //  「開始日」変更処理
    const handleFromDateChange = (event) => {
        const selectedDate = event.target.value;
        console.log('開始日', selectedDate)
        setFromDate(selectedDate);//開始日設定
        /*  開始日と終了日の検証をチェック関数呼び出し*/
        /* Parameter➞開始日／終了日*/
        validateDateRange(selectedDate, toDate);
    };

    // 「終了日」変更処理
    const handleToDateChange = (event) => {
        const selectedDate = event.target.value;
        console.log('終了日', selectedDate)
        setToDate(selectedDate);//終了日設定
        /*  開始日と終了日の検証をチェック関数呼び出し*/
        /* Parameter➞開始日／終了日*/
        validateDateRange(fromDate, selectedDate);
    };

    /* 開始日と終了日の検証をチェック関数*/
    /*Input Parameter➞開始日／終了日*/
    const validateDateRange = (fromDate, toDate) => {
        /*   開始日は終了日より前であるかどうか確認 */
        if (fromDate && toDate && fromDate > toDate) {
            /*開始日は終了日より前でない場合*/
            setValidationError('開始日は終了日より前である必要があります。');
        } else {
            /*開始日は終了日より前である場合*/
            setValidationError('');
        }
    };

    /*CSV ファイルに書き込み関数*/
    /* Input  Parameter→ログList*/
    const writeDataToFile = (data) => {
        try {

            // 各オブジェクトから最初の列をスライス (削除) する関数
            function sliceFirstColumn(data) {
                // 最初の列「log_number」を含まないオブジェクトを含む新しい配列を作成
                return data.map(obj => {
                    const { log_number, ...rest } = obj;
                    return rest;
                });
            }

            /*  各オブジェクトから最初の列をスライス(削除) 機能呼び出し*/
            const csvData = sliceFirstColumn(data);
            /*   データをCSV文字列に変換関数呼び出し*/
            const combinedData = dataToCsvString(customHeader, csvData);
            // Create a Blob with the data
            const dataBlob = new Blob([combinedData], { type: 'application/octet-stream' });

            // Create an Object URL for the Blob
            const url = URL.createObjectURL(dataBlob);
            // Create a download link
            const link = document.createElement('a');
            link.href = url;
            // ユーザー入力ファイル名をチェック
            if (fileName) {
                /* 入力ファイル名有場合*/
                const filename = fileName + '.csv';
                link.setAttribute('download', filename); /*ファイル名設定*/
            } else {
                /* 入力ファイル名無し場合*/
                // 本日日付とファイル名を自動入力
                const filename = downloadDate + 'Log.csv';
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


    };

    /*   データをCSV文字列に変換関数*/
    /* Input  Parameter→header／データList*/
    /*Output Parameter →CSVString*/
    const dataToCsvString = (header, data) => {
        /*   最後の列（ユーザー名）に文字列[']を追加機能呼び出し*/
        /*Parameter →データList*/
        modifyLastColumn(data);
        const customHeader = '\uFEFF' + header.join(',') + '\n';
        const rows = data.map((obj) => "'" + Object.values(obj).join(',') + '\n');
        return customHeader + rows.join('');
    };



    return (
        <Page contentStyle={{
            overflowY: 'scroll', // Enable vertical scrolling
            height: '100%', // Set the height to ensure the page takes up the full viewport
        }}>

            <p style={{ fontSize: 'x-large', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>ログ確認

            </p>

            <Row>
                <label className="custom-label">日付検索
                </label>
            </Row>
            <Row>
                <Col className="custom-search-input">
                    <Input className="fromDate" outline


                        type="text"
                        value={fromDate}
                        placeholder='YYYY/MM/DD'

                        onChange={handleFromDateChange} />
                    {validationError && (
                        <div style={{ color: 'red' }}>{validationError}</div>
                    )}
                </Col>
                <Col className="interfaceDiv">~</Col>
                <Col className="custom-table-input">

                    <Input className="toDate" outline
                        type="text"
                        id="toDate"
                        value={toDate}
                        placeholder='YYYY/MM/DD'
                        onChange={handleToDateChange} />
                </Col>
                <Col>
                    <Button large raised fill className="searchBtn" onClick={searchLogDataByDate}>
                        検索
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: '30px' }} >
                <Col width="30" >
                    <label className="custom-label">ログリスト
                    </label>
                </Col>
                <Col width="25">

                    <input
                        type="checkbox"
                        name="my-checkbox1" className="infoCheckbox"
                        checked={infoCheck}
                        onChange={handleInfoCheckboxChange}
                    />

                    <span>機能ログ</span>
                </Col>
                <Col width="35">
                    <input
                        type="checkbox"
                        name="my-checkbox2" checked={errorCheck}
                        onChange={handleErrorCheckboxChange}
                    />

                    <span>エラーログ</span>

                </Col>
                <Col width="100">
                    <List className="custom-list" >
                        <ListItem style={{ background: '#d3d3d3' }}>
                            <div className="customcontentLog" style={{ width: '150px' }}>タイムスタンプ</div>
                            <div className="customcontentLog" style={{ textAlign: 'center' }}>区分</div>
                            <div className="customcontentLog" style={{ textAlign: 'center' }}>処理名</div>
                            <div className="customcontentLog" style={{ textAlign: 'center' }}>メッセージ</div>
                            <div className="customcontentLog" style={{ width: '100px', textAlign: 'center' }}>ユーザー名</div>
                        </ListItem>
                        {infoCheck && infoList.map((logItem) => (
                            <ListItem >
                                <div className="customcontentLog" style={{ width: '150px' }}>
                                    <span>
                                        {`${new Date(logItem.timestamp).getFullYear()}/${String(new Date(logItem.timestamp).getMonth() + 1).padStart(2, '0')}/${String(new Date(logItem.timestamp).getDate()).padStart(2, '0')}`} {new Date(logItem.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div className="customcontentLog" style={{ textAlign: 'center' }} >{logItem.category}</div>
                                <div className="customcontentLog" style={{ textAlign: 'center' }} >{logItem.process_name}</div>
                                <div className="customcontentLog" style={{ textAlign: 'center' }}>{logItem.message}</div>
                                <div className="customcontentLog" style={{ width: '100px', textAlign: 'center' }}>{logItem.in_charge_code}</div>
                            </ListItem>
                        ))

                        }
                        {errorCheck &&
                            errorList.map((logItem) => (
                                <ListItem>
                                    <div className="customcontentLog" style={{ width: '150px' }}>
                                        <span>
                                            {`${new Date(logItem.timestamp).getFullYear()}/${String(new Date(logItem.timestamp).getMonth() + 1).padStart(2, '0')}/${String(new Date(logItem.timestamp).getDate()).padStart(2, '0')}`} {new Date(logItem.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="customcontentLog" style={{ textAlign: 'center' }} >{logItem.category}</div>
                                    <div className="customcontentLog" style={{ textAlign: 'center' }} >{logItem.process_name}</div>
                                    <div className="customcontentLog" style={{ textAlign: 'center' }}>{logItem.message}</div>
                                    <div className="customcontentLog" style={{ width: '100px', textAlign: 'center' }}>{logItem.in_charge_code}</div>
                                </ListItem>
                            ))

                        }

                    </List>

                </Col>

            </Row>


            {searchStatus && (infoList.length == 0 || errorList.length == 0) ? (
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
                    <div style={{ color: 'red', fontSize: '14px', marginLeft: '10px' }}>日付でデータを検索してください!!!</div>
                </Row>
            }


            <Row style={{ marginTop: '50px' }} >
                <Col width="30" >

                </Col>
                <Col width="40">
                    <div style={{ textAlign: 'center' }}>
                        <Button large raised fill className='downloadLog' style={{ marginTop: '10px' }} onClick={handleWriteDataClick}>
                            ダウンロード

                        </Button>
                    </div>
                </Col>
                <Col width="30" >


                </Col>
            </Row>
        </Page>
    );
};
export default LogConfirmPage;