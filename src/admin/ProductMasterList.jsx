import React, { useState, useEffect } from 'react'; // React と、useState および useEffect フックをインポートします。
import { Page } from 'react-onsenui'; // OnsenUI から Page コンポーネントをインポートします。
import axios from 'axios'; // HTTP クライアントライブラリである axios をインポートします。
import EditProduct from './EditProduct'; // EditProduct コンポーネントをインポートします。
import { BASE_URL } from './../env'; // env ファイルから BASE_URL (環境変数) をインポートします。

const ProductMasterList = () => {
    // コンポーネントがマウントされたときに商品データをフェッチします
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [codeSearchTerm, setCodeSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [noSearchResult, setNoSearchResult] = useState(false);
    const [showEditComponent, setShowEditComponent] = useState(false);

    useEffect(() => {
        fetch(`${BASE_URL}/products`)
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            setDisplayedProducts(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    // 編集ボタンのクリックを処理
    const handleEditProduct = (product) => {
        // 編集コンポーネントを表示するためのフラグを設定します
        setShowEditComponent(true);
    };

    // 商品のクリックを処理
    const handleProductClick = (product) => {
        // クリックされた商品を選択状態にします
        setSelectedProduct(product);
    };

    // 名前による検索を処理
    const handleSearchByName = async () => {
        // 検索結果をリセット
        setSelectedProduct(null);
        try {
            // 商品名で検索
            const response = await axios.get(`${BASE_URL}/product_masters/search_by_name`, {
                params: {
                    name: searchTerm
                }
            });
            const foundProducts = response.data; // 検索結果を取得
            // 検索結果がある場合は、検索結果を表示
            if (foundProducts && foundProducts.length > 0) {
                setDisplayedProducts(foundProducts);
                setNoSearchResult(false);
            } else {
                setDisplayedProducts([]);
                setNoSearchResult(true);
            }
        } catch (error) {
            console.error("Error fetching products by name:", error);
        }
    };

    // コードによる検索を処理
    const handleSearchByCode = async () => {
        setSelectedProduct(null);
        try {
            // 商品コードで検索
            const response = await axios.get(`${BASE_URL}/product_masters/search_by_code`, {
                params: {
                    code: codeSearchTerm
                }
            });
            // 検索結果を取得
            const foundProducts = response.data;
            // 検索結果がある場合は、検索結果を表示
            if (foundProducts && foundProducts.length > 0) {
                setDisplayedProducts(foundProducts);
                setNoSearchResult(false);
            } else {
                setDisplayedProducts([]);
                setNoSearchResult(true);
            }
        } catch (error) {
            console.error("Error fetching products by code:", error);
        }
    };    

    // showEditComponentがtrueの場合、EditProductコンポーネントを表示
    if (showEditComponent && selectedProduct) {
        return <EditProduct product={selectedProduct} onClose={() => setShowEditComponent(false)} />;
    }

    return (
        <Page>
            <h1>商品マスター確認</h1>

            {/* 検索フォームを追加 */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                <label>商品名で検索:</label>
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
                
                <label>商品コードで検索:</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input 
                        type="text"
                        value={codeSearchTerm}
                        onChange={e => setCodeSearchTerm(e.target.value)}
                        placeholder="商品コードを指定してください。"
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
                            <th>商品ｺｰﾄﾞ</th>
                            <th>商品名１</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(displayedProducts) && displayedProducts.length > 0 ? (
                            displayedProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleProductClick(product); }}> {/* Fixed casing */}
                                            {product.product_code}
                                        </a>
                                    </td>
                                    <td>{product.product_name}</td>
                                </tr>
                            ))
                        ) : noSearchResult ? (
                            <tr>
                                <td colSpan="2">製品が見つかりませんでした。</td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
            
            {/* 商品が選択されている場合、商品の詳細を表示 */}
            {selectedProduct && !noSearchResult && (
                <div>
                    <h2>商品情報</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>商品ｺｰﾄﾞ</td>
                                <td>{selectedProduct.product_code}</td>
                            </tr>
                            <tr>
                                <td>商品名１</td>
                                <td>{selectedProduct.product_name}</td>
                            </tr>
                            <tr>
                                <td>商品名索引</td>
                                <td>{selectedProduct.product_name_index}</td>
                            </tr>
                            <tr>
                                <td>容量</td>
                                <td>{selectedProduct.capacity}</td>
                            </tr>
                            <tr>
                                <td>数量単位</td>
                                <td>{selectedProduct.quantity_unit}</td>
                            </tr>
                            <tr>
                                <td>JANコード</td>
                                <td>{selectedProduct.jan_code}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 商品の画像を表示 */}
                    <div style={{ marginTop: '20px' }}>
                        {selectedProduct.product_image_url ? (
                            <img 
                                src={`${BASE_URL}${selectedProduct.product_image_url}`}
                                alt={selectedProduct.product_name} 
                                style={{ width: '300px', height: 'auto' }}
                            />
                        ) : null}
                    </div>

                    {/* テーブルの下に編集ボタンを追加 */}
                    <button 
                        onClick={() => handleEditProduct(selectedProduct)} 
                        style={{ marginTop: '10px', backgroundColor: '#FFA500', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',float: 'right'
                        }}>
                        編集
                    </button>

                </div>
            )}
        </Page>
    );
};

export default ProductMasterList;