import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Col, Button
} from 'react-onsenui';


import UserInfoRegisterCompleteComponent from '../admin/UserRegisterComplete';
import { checkUTF16File } from '../admin/CheckUTF16File';
/*ユーザー情報エラーComponent*/
const UserRegisterErrorPage = ({ errorList, errorRow }) => {
    const [showerror, setshowerror] = useState(true);
    const [showcomplete, setshowcomplete] = useState(false);
    const [isValidUTF16LE, setIsValidUTF16LE] = useState(false);
    const [fileName, setFileName] = useState('');
    const [errordataList, seterrordataList] = useState([]);
    const [errorRows, setErrorRows] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [errorRowandDataObjectList, seterrorRowandDataObjectList] = useState([]);
    // 初期状態
    useEffect(() => {
        /* エラー行とエラーデータリストを結合メソッド呼び出し*/
        // Parameter→エラーデータList／エラー行List
        combineErrorRowandData(errorList, errorRow);
    }, []);

    // 選択File変更する
    //Input Parameter→Userが選択したFile
    const handleFileChange = (e) => {
        seterrordataList([]);//エラーデータList クリア一
        setErrorRows([]);//エラー行List クリア一
        const selectedFile = e.target.files[0];
        setSelectedFile(selectedFile);//選択Fileを設定する
        setFileName(e.target.files[0]?.name || ''); //File名前を設定する
        // Reset the previous result
        setIsValidUTF16LE(false);
        //ファイルを選択するかどうか確認
        if (selectedFile) {
            /*UTF 16 File 確認メソッド 呼び出し*/
            /* Parameter→ 選択File*/
            checkUTF16File(selectedFile, (fileCheck) => {
                if (fileCheck == true) {
                    console.log('UTF16 ファイル:', fileCheck);
                    setIsValidUTF16LE(true);
                } else {
                    setIsValidUTF16LE(false);
                    alert('UTF16 ファイルを選択してください。 !!!.');

                }
            });
        }

    };


    /* エラー行とエラーデータリストを結合メソッド*/
    /*   Input  Parameter→エラーデータList／エラー行List*/
    const combineErrorRowandData = (errordata, errorrow) => {
        const combinederrorRowandDataObjectList = errordata.map((item, index) => ({
            ...item,
            errorRow: errorrow[index], // errordataListに新しい列「errorRow」を追加
        }));
        seterrorRowandDataObjectList(combinederrorRowandDataObjectList);

    }
    // UTF16 file読み取り
    const handleReadDataClick = () => {
        seterrorRowandDataObjectList([]);
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const rows = content.split('\n'); // rowsで 分ける 
            const objectList = [];
            const headerRow = [];
            /*   UTF16 fileの中でRowごとにループする*/
            rows.forEach((row, rowIndex) => {
                const values = rows[rowIndex].split('\t');  // Tabで 分ける
                /*Header 確認する*/
                if (rowIndex === 0) {
                    /*Header 設定する*/
                    headerRow.push(values);
                } else if (rowIndex > 1) {
                    const dataObject = {};
                    let isEmptyRow = true;
                    let importData = false;
                    /*   Header 名前使用して データ object登録*/
                    for (let i = 0; i < headerRow.length; i++) {
                        for (let j = 0; j < headerRow[i].length; j++) {
                            console.log('headerRow印刷', headerRow[i][j])

                            if (headerRow[i][j] === '担当者ｺｰﾄﾞ') {
                                dataObject[headerRow[i][j]] = values[j];
                                // 担当者ｺｰﾄ データ あるかどうか確認
                                if (!values[j]) {
                                    // 担当者ｺｰﾄ データ無し場合
                                    isEmptyRow = false;
                                }
                                else {
                                    //  担当者ｺｰﾄ データ有場合
                                    importData = true;
                                }

                            }
                            else if (headerRow[i][j] === '担当者名') {

                                dataObject[headerRow[i][j]] = values[j];
                                // 担当者名 データ あるかどうか確認
                                if (!values[j]) {
                                    // 担当者名データ無し場合
                                    isEmptyRow = false;
                                }
                                else {
                                    //担当者名 データ有場合
                                    importData = true;
                                }

                            }
                            else if (headerRow[i][j] === '担当者ﾌﾘｶﾞﾅ') {

                                dataObject[headerRow[i][j]] = values[j];
                                // 担当者ﾌﾘｶﾞﾅ データ あるかどうか確認
                                if (!values[j]) {
                                    // 担当者ﾌﾘｶﾞﾅデータ無し場合
                                    isEmptyRow = false;
                                } else {
                                    // 担当者ﾌﾘｶﾞﾅ データ有場合
                                    importData = true;
                                }

                            }

                        }
                        /*    読み取りデータ有場合 ObjectList に設定*/
                        if (importData == true) {
                            /*  エラー行あるかどうか確認*/
                            if (isEmptyRow == true) {
                                //エラー行無し場合
                                objectList.push(dataObject);

                            } else {
                                //エラー行有場合
                                errordataList.push(dataObject);// エラー データ list に設定
                                errorRows.push(rowIndex); //エラー rows listに設定

                            }
                            importData == false;
                        }

                    }
                }
            });

            /* postDataListToApi 呼び出し*/
            /*エラー データList あるかどうか確認*/
            if (errordataList.length > 0) {
                //エラー データList 有場合
                setshowerror(true);   //Error Component表示する為            
                setshowcomplete(false);//User Complete Component表示しない為
                combineErrorRowandData(errordataList, errorRows); /* エラー行とエラーデータリストを結合メソッド呼び出し*/

            }

            else {
                //エラー データList 無し場合
                setshowerror(false); //Error Component表示しない為         
                setshowcomplete(true); //User Register Complete Component表示する為
                /*   ユーザー登録 API呼び出し*/
                /*    Parameter→ ユーザー データList*/
                postDataListToApi(objectList);

            }
        };

        //  エンコードを「UTF-16」として指定
        reader.readAsText(selectedFile, 'UTF-16');
        seterrorRowandDataObjectList([]);
    };

    /*   ユーザー登録 メソッド*/
    /*   Input Parameter→ ユーザー データList*/
    const postDataListToApi = async (userDataList) => {
        try {
            console.log('ユーザーデータリスト 印刷：', userDataList);
            /*  担当者登録API呼び出し*/
            const response = await fetch("http://127.0.0.1:3000/personincharge/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataList),
            });
            /*  APIからのレスポンスデータ成功かどうか確認*/
            if (response.status === 200) {
                console.log("インポート成功⇒APIからのレスポンスデータ:", await response.json());
            } else {
                console.log("インポート失敗:", await response.json());

            }
        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    };


    return (

        <div>
            {showcomplete && <UserInfoRegisterCompleteComponent />}
            {showerror &&
                <div>
                    <p style={{ fontSize: 'x-large', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>ユーザー情報の登録エラー
                    </p>
                    <Row>
                        <p style={{ fontSize: 'medium', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>ユーザー情報にエラーが発生しました。</p>
                    </Row>


                    {errorRowandDataObjectList.length > 0 ? (
                        <Row style={{ marginTop: '30px' }}>

                            <Col >
                                <label className="custom-label" style={{ width: '80%' }} >エラーリスト</label>
                                <table style={{ width: '80%' }} >
                                    {errorRowandDataObjectList.map((errorItem) => (
                                        <tr key={errorItem} >
                                            <th ><p style={{ fontSize: '15px', color: 'red' }}>Row: {errorItem.errorRow}</p>  </th>
                                            <td ><ul>   {!errorItem.担当者ｺｰﾄﾞ && <li style={{ fontSize: '15px', color: 'red' }}> 担当者ｺｰﾄﾞ を入力してください。</li>}
                                                {!errorItem.担当者名 && <li style={{ fontSize: '15px', color: 'red' }}> 担当者名 を入力してください。</li>}
                                                {!errorItem.担当者ﾌﾘｶﾞﾅ && <li style={{ fontSize: '15px', color: 'red' }}> 担当者ﾌﾘｶﾞﾅ を入力してください。</li>}

                                            </ul></td>
                                        </tr>
                                    ))
                                    }
                                </table>

                            </Col>

                        </Row>
                    ) : null}
                    {errorRowandDataObjectList.length > 0 ? (<p style={{ fontSize: 'medium', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000', marginTop: '20px' }}>修正したユーザー情報のUNIファイルを指定してください。</p>) : null}
                    <Row style={{ marginTop: '30px' }}>
                        ファイル名：      <Input outline className="custom-input-exportfile" label="searchText"
                            type="text" style={{ fontSize: '10px' }} value={fileName} readonly />

                        <input
                            type="file"
                            accept=".txt"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        <Button large raised fill className='selectfileBtn' onClick={() => fileInputRef.current.click()}>
                            選択
                        </Button>


                    </Row>

                    <Row>
                        <Col width="50">

                        </Col>
                        <Col width="50">
                            <Button large raised fill className='downloadLog' style={{ marginTop: '10px' }} onClick={handleReadDataClick} disabled={!isValidUTF16LE}>
                                登録
                            </Button>
                        </Col>
                    </Row>
                </div>
            }
        </div>

    );
};
export default UserRegisterErrorPage;