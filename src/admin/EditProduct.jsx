import React, { useState, useEffect } from 'react';
import { Page } from 'react-onsenui';
import axios from 'axios';

const EditProduct = ({ product, onClose }) => {
    const [productName, setProductName] = useState(product.product_name || "");
    const [productCode, setProductCode] = useState(product.product_code || "");
    const [productIndex, setProductIndex] = useState(product.product_name_index || "");
    const [capacity, setCapacity] = useState(product.capacity || "");
    const [quantity_unit, setQuantityUnit ] = useState(product.quantity_unit || "");
    const [janCode, setJanCode] = useState(product.jan_code || "");
    const [isConfirmMode, setIsConfirmMode] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const [productImage, setProductImage] = useState(null);

    const [isSuccess, setIsSuccess] = useState(false);
    const [productImagePreview, setProductImagePreview] = useState(null);


    useEffect(() => {

        axios.get(`http://localhost:3000/products/${product.id}`)
            .then(response => {
                const fetchedProduct = response.data;
                console.log("Fetched product:", fetchedProduct);
                setProductImage(fetchedProduct.product_image_url);
            })
            .catch(error => {
                console.log(error);
            });
    }, [product.id]);

    useEffect(() => {
        return () => {
            // Release the object URL to avoid memory leaks
            if (productImage) {
                URL.revokeObjectURL(productImage);
            }
        };
    }, [productImage]);

    const prepareConfirm = () => {
        let tempErrors = [];
        
        // 商品コードは必須
        if (!productCode.trim()) {
            tempErrors.push("商品コードは必要です。");
        }
        // 商品名は必須
        if (!productName.trim()) {
            tempErrors.push("商品名は必要です。");
        }
    
        //　エラーがない場合は、確認モードに移行する
        if (tempErrors.length === 0) {
            setIsConfirmMode(true);
        }
        // エラーがある場合は、ログをサーバーに送信する
        if (tempErrors.length > 0) {
            axios.post('http://localhost:3000/log_error', {
                category: 'Error',
                process_name: '商品M更新',
                message: '商品Mは誤ったデータのため更新できませんでした。'
            }).then(response => {
                console.log(response.data.message);
            }).catch(err => {
                console.error("Error logging to server:", err);
            });
        }
        setErrors(tempErrors);
    };

    const handleBack = () => {
        window.location.reload();
    };
    
    const confirmUpdate = () => {
        let formData = new FormData();
        
        formData.append('product_master[product_name]', productName);
        formData.append('product_master[product_code]', productCode);
        formData.append('product_master[product_name_index]', productIndex);
        formData.append('product_master[capacity]', capacity);
        formData.append('product_master[quantity_unit]', quantity_unit);
        formData.append('product_master[jan_code]', janCode);
        if (productImagePreview) {
            formData.append('product_master[product_image]', productImage);
        }
    
        axios.put(`http://localhost:3000/product_masters/${product.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.status === 200) {
                setIsSuccess(true);
            }
        })
        .catch(error => {
            console.log(error);
        });
        setIsConfirmMode(false);
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        //　ファイルが選択されていない場合は、警告を出力して終了する
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setProductImagePreview(objectUrl);
            setProductImage(file);
        }
    };

    const deleteProduct = () => {
        axios.delete(`http://localhost:3000/product_masters/${product.id}`)
             .then(response => {
                if (response.status === 200) {
                    setIsDeleted(true); // <-- Set to true when product is deleted
                }
             })
             .catch(error => {
                console.log(error);  // Log the entire error
                alert('Error deleting the product.');
             });
    };
    

    return (
        <Page>
            {isDeleted ? (
                <>
                    <h1>商品マスターの削除完了</h1>
                    <p>商品マスターの削除に成功しました。</p>
                </>
            ) : errors.length > 0 ? (
                <>
                    <h1 className="error-title">商品マスターの登録エラー</h1>
                    <h2 className="error-subtitle">商品マスターにエラーが発生しました。</h2>
                    <ul className="error-list">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>

                    <div className="error-product-info">
                        <h3 className="error-instruction">エラーを修正してください。</h3>
                        <div>商品名: {productName}</div>
                        <div>商品ｺｰﾄﾞ: {productCode}</div>
                        <div>商品名索引: {productIndex}</div>
                        <div>容量: {capacity}</div>
                        <div>JANコード: {janCode}</div>
                        <button className="fix-error-btn" onClick={handleBack}>戻る</button>
                        <button className="fix-error-btn" onClick={() => setErrors([])}>エラー修正</button>
                    </div>
                </>
            ) : isSuccess ? (
                <>
                    <h1>商品マスターの登録完了</h1>
                    <p>商品マスターの登録に成功しました。</p>
                </>
            ) : isConfirmMode ? (
                <>
                    <h1>商品マスターの登録確認</h1>
                    <div className="product-edit-form">
                        <div className="input-row">
                            <label>商品名:</label>
                            <span className='confirm-val'>{productName}</span>
                        </div>
                        <div className="input-row">
                            <label>商品ｺｰﾄﾞ:</label>
                            <span className='confirm-val'>{productCode}</span>
                        </div>
                        <div className="input-row">
                            <label>商品名索引:</label>
                            <span className='confirm-val'>{productIndex}</span>
                        </div>
                        <div className="input-row">
                            <label>容量:</label>
                            <span className='confirm-val'>{capacity}</span>
                        </div>
                        <div className="input-row">
                            <label>数量単位:</label>
                            <span className='confirm-val'>{quantity_unit}</span>
                        </div>
                        <div className="input-row">
                            <label>JANコード:</label>
                            <span className='confirm-val'>{janCode}</span>
                        </div>
                        <div className="input-row">
                            <label>商品画像:</label>
                            <div className='img-show'>
                                {productImagePreview && <img src={productImagePreview} alt="Product1" style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                                {productImage && !productImagePreview && <img src={productImage} alt="Product2" style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                            </div>
                        </div>

                        <div className="button-group">
                            <button className="update-btn" onClick={confirmUpdate}>更新</button>
                            <button className="cancel-btn" onClick={() => setIsConfirmMode(false)}>キャンセル</button>
                        </div>
                    </div>    
                </>
            ) : (
                <>
                    <h1>商品マスター編集</h1>
                    <div className="product-edit-form">
                        <div className="input-row">
                            <label>商品名:</label>
                            <input className="product-input" type="text" value={productName} onChange={e => setProductName(e.target.value)} readOnly={isConfirmMode}/>
                        </div>
                        <div className="input-row">
                            <label>商品ｺｰﾄﾞ:</label>
                            <input className="product-input" type="text" value={productCode} onChange={e => setProductCode(e.target.value)} readOnly={isConfirmMode} />
                        </div>
                        <div className="input-row">
                            <label>商品名索引:</label>
                            <input className="product-input" type="text" value={productIndex} onChange={e => setProductIndex(e.target.value)} readOnly={isConfirmMode} />
                        </div>
                        <div className="input-row">
                            <label>容量:</label>
                            <input className="product-input" type="text" value={capacity} onChange={e => setCapacity(e.target.value)} readOnly={isConfirmMode} />
                        </div>
                        <div className="input-row">
                            <label>数量単位:</label>
                            <input className="product-input" type="text" value={quantity_unit} onChange={e => setQuantityUnit(e.target.value)} readOnly={isConfirmMode} />
                        </div>
                        <div className="input-row">
                            <label>JANコード:</label>
                            <input className="product-input" type="text" value={janCode} onChange={e => setJanCode(e.target.value)} readOnly={isConfirmMode} />
                        </div>
                        <div className="input-row">
                            <label>商品画像:</label>
                            <div className='img-show'>
                                {productImagePreview && <img src={productImagePreview} alt="Product1" style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                                {productImage && !productImagePreview && <img src={productImage} alt="Product2" style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                            </div>
                        </div>
                        <div className="file-input-container">
                            <input 
                                type="file" 
                                id="fileInput" 
                                style={{ display: 'none' }} 
                                onChange={handleImageChange} 
                            />
                            <label htmlFor="fileInput" className="customFileLabel">
                                {'ファイルを選択'}
                            </label>
                        </div>
                        <div className="button-group">
                            {isConfirmMode ? (
                                <></>
                            ) : (
                                <>
                                    <button className="update-btn" onClick={prepareConfirm}>確認</button>
                                    <button className="cancel-btn" onClick={onClose}>キャンセル</button>
                                    <button className="cancel-btn" onClick={deleteProduct}>削除</button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </Page>
    );
};

export default EditProduct;
