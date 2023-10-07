import React, { useRef, useState, useEffect } from 'react'; // Stateを使うためにuseStateをimport
import { Page, Button } from 'react-onsenui'; // Onsen UIのコンポーネントを使う

// 
const CustomerMasterRegister = (props) => {
    const [isUTF16, setIsUTF16] = useState(null);
    const fileInputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [invalidRows, setInvalidRows] = useState([]);
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    useEffect(() => {
      //　ファイルが選択されていない場合は、エラーメッセージをクリアする
      if (isUTF16 === false) {
        setErrorMsg("File is not in UTF-16 format. Please select a valid file.");
      } else {
        setErrorMsg('');
      }
    }, [isUTF16]);

     /**
    * メソッド: handleFileChange(e)
    * 使用画面: ファイル選択ボタン
    * Input: e - ファイルインプットのイベントオブジェクト
    * Output: isUTF16 state (UTF-16ならtrue、それ以外はfalse)
    *         uploadedFileName state (選択されたファイル名)
    */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        //　ファイルが選択されていない場合は、エラーメッセージをクリアする
        if (!file) {
            setIsUTF16(null);
            setUploadedFileName('');
            return;
        }
        
        //　ファイルが選択されている場合は、ファイル名を表示する
        setUploadedFileName(file.name);
        
        //　ファイルが選択されている場合は、ファイルの形式をチェックする
        const reader = new FileReader();
        reader.onload = function(event) {
            const buffer = new Uint8Array(event.target.result);
            //　ファイルの形式がUTF-16かどうかをチェックする
            if ((buffer[0] === 0xFF && buffer[1] === 0xFE) || 
                (buffer[0] === 0xFE && buffer[1] === 0xFF)) {
                setIsUTF16(true);
    
                const decodedString = new TextDecoder('utf-16').decode(buffer);
                validateFileContent(decodedString);
            } else {
                setIsUTF16(false);
            }
        };
        
        //  ファイルを読み込む
        reader.readAsArrayBuffer(file);
    };

    /**
    * メソッド: validateFileContent(content)
    * 使用画面: ファイルが選択されたときに内部的に使用
    * Input: content - UTF-16でデコードされたファイル内容の文字列
    * Output: invalidRows state (エラーとその詳細を持つ行のリスト)
    *         showErrorBox state (エラーがある場合はtrue)
    */
    const validateFileContent = (content) => {
      const rows = content.split(/\r?\n/);
      let invalidRows = [];
  
      //　ファイルの内容が正しいかどうかをチェックする
      if (rows.length < 3) {
          setErrorMsg("The file is missing headers or data.");
          return;
      }
  
      //　ファイルのヘッダーをチェックする
      const headerRow = rows[0].split('\t');
      const columnsToCheck = ['得意先ｺｰﾄﾞ', '得意先名１', '得意先名索引', '得意先分類０ｺｰﾄﾞ'];
      const columnIndex = {};
      //　ファイルのヘッダーが正しいかどうかをチェックする
      columnsToCheck.forEach(column => {
          columnIndex[column] = headerRow.indexOf(column);
      });
  
      //　ファイルのヘッダーが正しくない場合は、エラーメッセージを表示する
      for (let rowIndex = 2; rowIndex < rows.length; rowIndex++) {
          const columns = rows[rowIndex].split('\t');
          const errors = [];

          //　ファイルのデータが正しいかどうかをチェックする
          for (const [column, index] of Object.entries(columnIndex)) {
              if (!columns[index] || !columns[index].trim()) {
                errors.push(`行${rowIndex - 1}で${column}が不足しています`);
              } else {
                  // Validate data type
                  if (column === '得意先ｺｰﾄﾞ' && isNaN(Number(columns[index]))) {
                      errors.push(`行${rowIndex - 1}で${column}の形式が正しくありません`);
                  }
              }
          }
          //　ファイルのデータが正しくない場合は、エラーメッセージを表示する
          if (errors.length) {
              invalidRows.push({
                  rowNumber: rowIndex + 1,
                  errors: errors
              });
          }
      }
      
      //　ファイルのデータが正しくない場合は、エラーメッセージを表示する
      if (invalidRows.length) {
          setInvalidRows(invalidRows);
          setShowErrorBox(true);
          fileInputRef.current.value = '';
      }
    };
  
    /**
    * メソッド: handleSubmit()
    * 使用画面: "登録" ボタンをクリックしたとき
    * Input: なし (Reactの内部状態とrefsを使用)
    * Output: importSuccess state (ファイルのアップロードが成功した場合はtrue)
    *         エラーやレスポンスメッセージのコンソールログ
    */
    const handleSubmit = async () => {
        //　ファイルが選択されていない場合は、エラーメッセージを表示する
        if (!isUTF16) {
          console.warn("Invalid file format. Please upload a UTF-16 encoded file.");
          return;
        }

        const file = fileInputRef.current?.files[0];
        //　
        if (!file) {
          console.warn("No file selected.");
          return;
        }

        const formData = new FormData();
        formData.append('file', file); // ファイルを追加する

        try {
          //　ファイルをアップロードする
          const response = await fetch('http://localhost:3000/customer_masters/import', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json(); // レスポンスをJSON形式に変換する

          //　ファイルのアップロードが成功した場合は、エラーメッセージをクリアする
          if (response.ok) {
            setImportSuccess(true); 
          } else {
            console.error("There was an issue uploading the file.");
          }
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
    };

  

  return (
    <Page>
      <h1>{importSuccess ? '得意先マスターの登録完了' : showErrorBox ? '得意先Mエラー登録' : '得意先M登録'}</h1>
      {showErrorBox && (
        <div style={{ padding: '10px', marginTop: '20px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
          <h2>エラー</h2>
          <p>得意先マスターにエラーが発生しました。</p>
          <ul>
            {invalidRows.map((invalidRow, index) => (
                <li key={index}>
                    {invalidRow.errors.join(', ')}
                </li>
            ))}
          </ul>
        </div>
      )}
      
      <p>{showErrorBox ? '修正した得意先マスターのUNIファイルを指定してください。' : importSuccess ? '得意先マスターの登録に成功しました。' : '得意先マスターのUNIファイルを指定してください。'}</p>

      {!importSuccess && (
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
      )}
      
      {isUTF16 === false && <p style={{color: 'red', marginTop: '10px'}}>ファイルは UTF-16 形式ではありません。 有効なファイルを選択してください。</p>}
      {!importSuccess && (
      <Button onClick={handleSubmit} className='reg-button'>登録</Button>
      )}
      
    </Page>
  );
};

export default CustomerMasterRegister;
