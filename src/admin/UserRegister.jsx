import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Col, Button
} from 'react-onsenui';

import UserInfoRegisterErrorComponent from '../admin/UserRegisterError';
import UserInfoRegisterCompleteComponent from '../admin/UserRegisterComplete';
import { checkUTF16File } from '../admin/CheckUTF16File';
/*ユーザー登録  Component*/
const UserInfoRegisterPage = ({ navigator }) => {
    const [errordataList, seterrordataList] = useState([]);
    const [errorRows, setErrorRows] = useState([]);
    const [isValidUTF16LE, setIsValidUTF16LE] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [showDataList, setShowDataList] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [headerRow, setHeaderRow] = useState([]);
    const [fileName, setFileName] = useState('');
    const [showerror, setshowerror] = useState(false);//error component表示する為
    const [showcomplete, setshowcomplete] = useState(false);//complete component表示する為
    const [showuserinitial, setshowuserinitial] = useState(true); // user register component表示する為

    // 選択File変更する
    //Input Parameter→Userが選択したFile
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setSelectedFile(selectedFile);//選択Fileを設定する
        setFileName(e.target.files[0]?.name || '');//File名前を設定する
        // Reset the previous result
        setIsValidUTF16LE(false);

        //ファイルを選択するかどうか確認
        if (selectedFile) {
            /*UTF 16 File確認関数呼び出し*/
            /* Parameter→選択File*/
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



    // UTF16 file読み取り
    const handleReadDataClick = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const rows = content.split('\n'); // rowsで分ける 
            const objectList = [];
            const headerRow = [];

            /*   UTF16 fileの中でRowごとにループする*/
            rows.forEach((row, rowIndex) => {
                const values = rows[rowIndex].split('\t');    // Tabで分ける

                /*Header確認する*/
                if (rowIndex === 0) {
                    /*Header設定する*/
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
                                errordataList.push(dataObject); // エラーデータ list に設定
                                errorRows.push(rowIndex); //エラー rowslistに設定

                            }
                            importData == false;
                        }

                    }


                }
            });


            /* postDataListToApi呼び出し*/
            /*エラー データList あるかどうか確認*/
            if (errordataList.length > 0) {
                //エラー データList 有場合
                setshowerror(true); //Error Component表示する為
                setshowuserinitial(false); //User Register Component表示しない為
                setshowcomplete(false);//User Complete Component表示しない為
                console.log('エラーデータリストの印刷', errordataList);
                console.log('エラー行リストの印刷', errorRows);


            }
            else {
                //エラー データList 無し場合
                setshowcomplete(true);//User Register Complete Component表示する為
                setshowerror(false); //Error Component表示しない為
                setshowuserinitial(false); //User Register Component表示しない為
                /*   ユーザー登録 API呼び出し*/
                postDataListToApi(objectList);
            }
        };

        //  エンコードを「UTF-16」として指定
        reader.readAsText(selectedFile, 'UTF-16');


    }

    /*   ユーザー登録関数*/
    /*   Input Parameter→ ユーザー データList*/
    const postDataListToApi = async (userDataList) => {
        try {
            /*  担当者登録API呼び出し*/
            const response = await fetch("http://127.0.0.1:3000/personincharge/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataList),
            });
            /*       APIからのレスポンスデータ成功かどうか確認*/
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

        <Page contentStyle={{
            overflowY: 'scroll', // Enable vertical scrolling
            height: '100%', // Set the height to ensure the page takes up the full viewport
        }}>
            {showerror && <UserInfoRegisterErrorComponent errorList={errordataList} errorRow={errorRows} />}
            {showcomplete && <UserInfoRegisterCompleteComponent />}
            {showuserinitial &&
                <div>
                    <p style={{ fontSize: 'x-large', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>ユーザー情報登録
                    </p>
                    <Row>
                        <p style={{ fontSize: 'medium', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>ユーザー情報のUNIファイルを指定してください。
                        </p>
                    </Row>
                    {errorRows.length > 0 && (
                        <div>
                            <h3>Error Rows:</h3>
                            <ul>
                                {errorRows.map((row, index) => (
                                    <li key={index}>Row {row}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Row style={{ marginTop: '30px' }}>

                        ファイル名：
                        <Input outline className="custom-input-exportfile" label="searchText"
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
                            <Button large raised fill style={{ marginTop: '10px' }} onClick={handleReadDataClick} disabled={!isValidUTF16LE}>
                                登録
                            </Button>
                        </Col>
                    </Row>
                </div>}
        </Page>

    );
};
export default UserInfoRegisterPage;