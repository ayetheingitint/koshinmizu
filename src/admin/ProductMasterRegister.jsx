import React, { useRef, useState, useEffect } from 'react';　// useState, useEffectをインポートする
import { Page, Button } from 'react-onsenui';　// Page, Buttonをインポートする
import axios from 'axios';　// axiosをインポートする

// ProductMasterRegister関数は、商品マスターを登録するための画面です。
const ProductMasterRegister = (props) => {
    const [isUTF16, setIsUTF16] = useState(null);
    const fileInputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [invalidRows, setInvalidRows] = useState([]);
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    // このuseEffectは、isUTF16の変更を監視し、ファイルのエンコードがUTF-16でない場合にエラーメッセージを設定します。
    useEffect(() => {
      if (isUTF16 === false) {
        setErrorMsg("File is not in UTF-16 format. Please select a valid file.");
      } else {
        setErrorMsg('');
      }
    }, [isUTF16]);

    // handleFileChange関数は、ファイル入力からの変更を処理します。
    // 使用画面: 商品M登録ページ
    // Input: イベント(e) - ユーザーがファイルを選択したときのイベント
    // Output: なし (ただし、内部の状態は更新される)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setIsUTF16(null);
            setUploadedFileName('');  // Clear the filename if no file is selected
            return;
        }
        
        // Update the displayed filename when a file is selected
        setUploadedFileName(file.name);
    
        const reader = new FileReader();
        reader.onload = function(event) {
            const buffer = new Uint8Array(event.target.result);
    
            if ((buffer[0] === 0xFF && buffer[1] === 0xFE) || 
                (buffer[0] === 0xFE && buffer[1] === 0xFF)) {
                setIsUTF16(true);
    
                const decodedString = new TextDecoder('utf-16').decode(buffer);
                validateFileContent(decodedString);
            } else {
                setIsUTF16(false);
            }
        };
        
        reader.readAsArrayBuffer(file);
    };

    // validateFileContent関数は、アップロードされたファイルの内容を検証します。
    // 使用画面: 商品M登録ページ
    // Input: content - ファイルのテキスト内容
    // Output: なし (ただし、内部の状態は更新される)
    const validateFileContent = (content) => {
        const errors = [];
        const columnNames = ["商品名", "商品ｺｰﾄﾞ", "商品名索引"];
        const lines = content.trim().split('\n');
        if (lines.length < 1) {
            errors.push("ファイルに商品Mデータがありません。");
        } else {
            const headers = lines[0].split('\t');
            
            columnNames.forEach(columnToCheck => {
                const columnIndex = headers.indexOf(columnToCheck);
                
                if (columnIndex === -1) {
                    errors.push("ファイルフォーマットが間違っています。");
                    return;
                }
    
                for (let i = 2; i < lines.length; i++) {
                    const cells = lines[i].split('\t');
                    const cellValue = cells[columnIndex]?.trim();  // Safeguard against undefined
                    
                    // Check if cell value is empty
                    if (!cellValue) {
                        errors.push(`Row ${i-1} に ${columnToCheck} がありません。`);
                    } else if (columnToCheck === "商品名" && /\d/.test(cellValue)) {
                        // Check if 商品名 value contains numbers
                        errors.push(`Row ${i} の ${columnToCheck} のフォーマットが間違っています。`);
                    } else if ((columnToCheck === "商品ｺｰﾄﾞ" || columnToCheck === "商品名索引") && !/^[0-9]+$/.test(cellValue)) {
                        // Check if 商品ｺｰﾄﾞ contains anything other than numbers
                        errors.push(`Row ${i} の ${columnToCheck} のフォーマットが間違っています。`);
                    }
                }
            });
        }
    
        if (errors.length > 0) {
            setShowErrorBox(true);
            setInvalidRows(errors);

            // エラーがある場合は、ログをサーバーに送信する
            axios.post('http://localhost:3000/log_error', {
                  category: 'Error',
                  process_name: '商品M登録',
                  message: '商品Mのインポートが失敗しました。ファイルの値が正しくありません。'
              }).then(response => {
                  console.log(response.data.message);
              }).catch(err => {
                  console.error("Error logging to server:", err);
              });
            } else {
                setShowErrorBox(false);
            }

    };  

    // handleSubmit関数は、ファイルをサーバーに送信する際に使用されます。
    // 使用画面: 商品M登録ページ
    // Input: なし
    // Output: なし (ただし、内部の状態は更新される、またはコンソールにエラーメッセージが出力される)
    const handleSubmit = async () => {
        // ファイルのエンコードがUTF-16でない場合は、警告を出力して終了する
        if (!isUTF16) {
          console.warn("Invalid file format. Please upload a UTF-16 encoded file.");
          return;
        }
    
        const file = fileInputRef.current?.files[0];
        // ファイルが選択されていない場合は、警告を出力して終了する
        if (!file) {
          console.warn("No file selected.");
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file); // 画像ファイルを追加する場合は、ここに追加する
    
        try {
          const response = await fetch('http://localhost:3000/product_masters/import', { // サーバーのURLを指定する
            method: 'POST',
            body: formData,
          });
    
          const data = await response.json(); // サーバーからの応答をJSON形式で取得する
          // サーバーからの応答が正常な場合は、importSuccessをtrueに設定する
          if (response.ok) {
            setImportSuccess(true); 
          } else {
            console.error("ファイルのアップロード中に問題が発生しました。");
          }
        } catch (error) {
          console.error("ファイルのアップロード中にエラーが発生しました:", error);
        }
    };
    

    return (
        <Page>
          <h1>{importSuccess ? '商品マスターの登録完了' : showErrorBox ? '商品Mエラー登録' : '商品M登録'}</h1>
          {showErrorBox && (
            <div style={{ padding: '10px', marginTop: '20px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
              <h2>エラー</h2>
              <p>商品マスターにエラーが発生しました。</p>
              <ul>
                  {/* ファイルの内容にエラーがある場合は、エラーメッセージを表示する  */}
                  {invalidRows.map((errorMsg, index) => (
                      <li key={index}>
                          {errorMsg}
                      </li>
                  ))}
              </ul>
            </div>
          )}
          
          {/* ファイルのアップロードが成功した場合は、成功メッセージを表示する */}
          <p>{showErrorBox ? '修正した商品マスターのUNIファイルを指定してください。' : importSuccess ? '商品マスターの登録に成功しました。' : '商品マスターのUNIファイルを指定してください。'}</p>
          {/* ファイルのアップロードが成功した場合は、登録ボタンを非表示にする */}
          {!importSuccess && (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    flexGrow: 1, 
                    padding: '10px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px'
                  }}
                >
                  {uploadedFileName || "ファイルが選択されていません。"}
                </div>
      
                <label htmlFor="fileUpload" style={{ marginLeft: '10px' }}>
                  <Button>選択</Button>
                  <input 
                    id="fileUpload" 
                    type="file" 
                    accept=".txt" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              {isUTF16 === false && <p style={{color: 'red', marginTop: '10px'}}>ファイルは UTF-16 形式ではありません。 有効なファイルを選択してください。</p>}
              <Button onClick={handleSubmit} className='reg-button'>登録</Button>
            </>
          )}
      </Page>
    );
};

export default ProductMasterRegister;