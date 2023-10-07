import React, { useState, useEffect } from 'react'; // Stateを使うためにuseStateをimport
import { Page } from 'react-onsenui';　// Onsen UIのコンポーネントを使う
import axios from 'axios';// axiosを使う

// このコンポーネントは、得意先マスターの一覧を表示する
// ページロード時にhttp://localhost:3000/customersからすべての顧客情報を取得する。
// 取得したデータは、setCustomersとsetDisplayedCustomersでステートに保存される。
const CustomerMasterList = () => {
    // ステート変数の定義
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [codeSearchTerm, setCodeSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [displayedCustomers, setDisplayedCustomers] = useState([]);

    // 初期ロード時にすべての顧客をフェッチする
    useEffect(() => {
        // このコンポーネントがマウントされたら、得意先マスターを取得する
        fetch('http://localhost:3000/customers')
        .then(response => response.json())
        .then(data => {
            setCustomers(data);
            setDisplayedCustomers(data); // Initially, display all customers
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    // 顧客がクリックされた時の処理
    // 顧客のリンクがクリックされた時に該当する顧客の詳細情報をselectedCustomerステートにセットする。
    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
    };

    // 名前での検索処理
    //  名前での検索ボタンがクリックされた時に動作する。
    // http://localhost:3000/customermaster/search_by_nameから該当する顧客情報を取得する。
    // 取得したデータは、setDisplayedCustomersで表示リストにセットされる。
    const handleSearchByName = async () => {
        try {
          const response = await axios.get('http://localhost:3000/customermaster/search_by_name', {
            params: {
              name: searchTerm
            }
          });
      
          const foundCustomers = response.data;
          //　検索結果がある場合は、検索結果を表示する
          if (foundCustomers && foundCustomers.length > 0) {
            setDisplayedCustomers(foundCustomers); 
            setSearchResult(foundCustomers[0]);
            setNoSearchResult(false);
          } else {
            setDisplayedCustomers([]);
            setSearchResult(null); 
            setNoSearchResult(true);
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
        }
    };

    // コードでの検索処理
    // コードでの検索ボタンがクリックされた時に動作する。
    // http://localhost:3000/customermaster/search_by_codeから該当する顧客情報を取得する。
    // 取得したデータは、setDisplayedCustomersで表示リストにセットされる。
    const handleSearchByCode = async () => {
        try {
            const response = await axios.get('http://localhost:3000/customermaster/search_by_code', {
                params: {
                    code: codeSearchTerm
                }
            });
    
            const foundCustomers = response.data;
            //　検索結果がある場合は、検索結果を表示する
            if (foundCustomers && foundCustomers.length > 0) {
                setDisplayedCustomers(foundCustomers); 
                setSearchResult(foundCustomers[0]);
                setNoSearchResult(false);
            } else {
                setDisplayedCustomers([]);
                setSearchResult(null); // or however you want to handle no results
                setNoSearchResult(true);
            }
        } catch (error) {
            console.error("Error fetching customers by code:", error);
        }
    };

  return (
    <Page>
        <h1>得意先マスター確認</h1>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <label>得意先名で検索:</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="スペースで区切るとAND検索されます。"
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', marginRight: '8px', borderRadius: '4px' }}
                />
                <button onClick={handleSearchByName} style={{ backgroundColor: '#007BFF', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    検索
                </button>
            </div>
            
            <label>得意先コードで検索:</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                    type="text"
                    value={codeSearchTerm}
                    onChange={e => setCodeSearchTerm(e.target.value)}
                    placeholder="得意先コードを指定してください。"
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', marginRight: '8px', borderRadius: '4px' }}
                />
                <button onClick={handleSearchByCode} style={{ backgroundColor: '#007BFF', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    検索
                </button>
            </div>
        </div>

        <div style={{ maxHeight: 'calc(11 * 1.5rem)', overflowY: 'auto' }}> {/* Assuming each row is approximately 1.5rem in height */}
            <table>
                <thead>
                    <tr>
                        <th>得意先ｺｰﾄﾞ</th>
                        <th>得意先名</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(displayedCustomers) && displayedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleCustomerClick(customer); }}>
                                    {customer.customer_code}
                                </a>
                            </td>
                            <td>{customer.customer_name1}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* 検索結果がない場合は、メッセージを表示する */} 
        {selectedCustomer && (
            <div>
                <h2>得意先情報</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>得意先ｺｰﾄﾞ</td>
                            <td>{selectedCustomer.customer_code}</td>
                        </tr>
                        <tr>
                            <td>得意先名</td>
                            <td>{selectedCustomer.customer_name1}</td>
                        </tr>
                        <tr>
                            <td>得意先名索引</td>
                            <td>{selectedCustomer.customer_name_index}</td>
                        </tr>
                        <tr>
                            <td>請求先分類名</td>
                            <td>{selectedCustomer.billing_classification_master.billing_name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
    </Page>
  );
};

export default CustomerMasterList;
