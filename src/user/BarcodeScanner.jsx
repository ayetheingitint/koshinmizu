import React, { useState, useRef, useEffect } from 'react';
import { Page, Button } from 'react-onsenui';
import { BrowserMultiFormatReader } from '@zxing/library';
import OrderInfoRegisterComponent from '../user/OrderInfoRegister';

/*バーコードスキャナComponent*/
const BarcodeScannerPage = (props) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [result, setResult] = useState('');
    const [showResultbtn, setShowResultbtn] = useState(false);
    const [showscanRec, setshowscanRec] = useState(false);
    const [searchjancode, setsearchjancode] = useState('');
    const [showBarcode, setShowBarcode] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [showOrderInfoRegister, setshowOrderInfoRegister] = useState(false);
    const [showBarcodeScanner, setshowBarcodeScanner] = useState(true);
    const [orderinfoobjectList, setorderinfoobjectList] = useState([]);
    useEffect(() => {
        if (props.orderRegisterData) {
            orderinfoobjectList.push(props.orderRegisterData[0]);
        }

    }, []);
    // 受注情報登録画面の移行
    const navigateToOrderInfoRegister = () => {
        const videoElement = document.getElementById('video');
        const stream = videoElement.srcObject;
        // video Elementあるかどうか確認
        if (stream) {
            // あるかどうか確認
            // video閉じる
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoElement.srcObject = null;
            videoElement.style.display = 'none';

        }
        // 受注情報登録componentのナビゲート
        setshowOrderInfoRegister(true);
        setshowBarcodeScanner(false);

    }

    // video開ける
    const startVideo = () => {
        // BrowserMultiFormatReader作成
        const codeReader = new BrowserMultiFormatReader();
        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
            // Barcode Scanner結果あるかどうか確認
            setshowscanRec(true);
            if (result) {
                // 有場合
                setsearchjancode(result.text);//Barcode Scanner結果を設定
                setShowResultbtn(true);//結果Button表示
            }
        }, videoRef.current);

    }

    //Barcodeスキャナー関数
    const handleBarcodeButtonClick = () => {
        setResult('');//結果クリア
        setShowResultbtn(false);//結果Buttonを無効にする
        startVideo();//video開ける関数
        setShowBarcode(true);
        setShowQRCode(false);
    };

    //QRスキャナー関数
    const handleQRCodeButtonClick = () => {
        setResult('');//結果クリア
        setShowResultbtn(false);//結果Buttonを無効にする
        startVideo();//video開ける関数
        setShowBarcode(false);
        setShowQRCode(true);
    };

    return (
        <div>
            {showOrderInfoRegister && <OrderInfoRegisterComponent searchjancode={searchjancode} orderinfoobjectListFromBarcode={orderinfoobjectList} />}
            {showBarcodeScanner ? (<Page>
                <div className="barcode-scanner" style={{ display: showscanRec ? "block" : "none" }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} id="video" />
                    <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} id="canvas" />
                    {showBarcode && (
                        <div className="scan-rectangle" style={{ display: showBarcode ? "block" : "none" }}>
                            <div className="laser"></div>
                            <div className="corner top-left" style={{ display: showBarcode ? "block" : "none" }}></div>
                            <div className="corner top-right" style={{ display: showBarcode ? "block" : "none" }}></div>
                            <div className="corner bottom-left" style={{ display: showBarcode ? "block" : "none" }}></div>
                            <div className="corner bottom-right" style={{ display: showBarcode ? "block" : "none" }}></div>

                        </div>

                    )}
                    {showQRCode && (
                        <div className="scan-rectangle-qr" style={{ display: showQRCode ? "block" : "none" }}>
                            <div className="laser"></div>
                            <div className="corner top-left" style={{ display: showscanRec ? "block" : "none" }}></div>
                            <div className="corner top-right" style={{ display: showscanRec ? "block" : "none" }}></div>
                            <div className="corner bottom-left" style={{ display: showscanRec ? "block" : "none" }}></div>
                            <div className="corner bottom-right" style={{ display: showscanRec ? "block" : "none" }}></div>

                        </div>

                    )}
                </div>
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <Button onClick={handleBarcodeButtonClick} style={{ marginRight: '10px' }}>Barcode Scanner</Button>
                    <Button onClick={handleQRCodeButtonClick}>QR Code Scanner</Button>
                </div>
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <Button onClick={navigateToOrderInfoRegister} style={{ display: showResultbtn ? "block" : "none" }}>
                        スキャナー 結果
                    </Button>
                </div>
            </Page >) : null}

        </div>
    );
};

export default BarcodeScannerPage;
