/**
 * App Component
 * 処理概要 (Processing Summary):
 * このコンポーネントは、ログインページのUIとその関連ロジックを提供します。
 * ...
 * App Component Rendering (コンポーネントレンダリング):
 * ...
 * 出力:
    使用しているブラウザとデバイスの情報を示す文字列
    App Component Rendering (コンポーネントレンダリング):
    処理概要: ログインのUI要素を表示します。これには、入力フィールド、チェックボックス、ボタンなどが含まれます。
 */

import React, { useState } from 'react'; // useState hookをインポートします
import { Page, Button, Input } from 'react-onsenui'; // Onsen UIのコンポーネントをインポートします
import { notification } from 'onsenui'; // Onsen UIの通知コンポーネントをインポートします
import './css/login.css'; // ログインページのスタイルをインポートします
import Dashboard from './admin/Dashboard'; // ダッシュボードコンポーネントをインポートします
import { BASE_URL } from './env'; // 環境変数をインポートします
import BusinessMenu from './user/BusinessMenu';
import './css/custom.css'; 
export default function App(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isComposing, setIsComposing] = useState(false);

    // 処理概要:入力されたパスワードの変更をハンドリングします。IMEを使用している間は、パスワードの状態を直接更新します。
    const handlePasswordChange = (e) => {
        const enteredValue = e.target.value;

        // IMEを使用している間は、パスワードの値を直接更新します
        if (isComposing) {
            setPassword(enteredValue); // 合成中の中間の値でパスワードを直接更新します
            return;
        }

        // 既存の文字の追加または削除のロジック
        if (enteredValue.length > password.length) { // ユーザーが新しい文字を追加した場合
            const newChar = enteredValue.charAt(enteredValue.length - 1); // 新しく追加された文字を取得します
            setPassword(password + newChar); // 既存のパスワードに新しい文字を追加します
        } else if (enteredValue.length < password.length) { // ユーザーが文字を削除した場合
            setPassword(password.slice(0, -1)); // パスワードから最後の文字を削除します
        }
    };

    //処理概要:文字入力がIMEの合成セッションを開始したときに呼び出されます。
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    // 処理概要:IMEの合成セッションが終了したときに呼び出されます。
    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    // 処理概要:ユーザーのログインを試みます。成功した場合、ローカルストレージに情報を保存し、ダッシュボードへ移動します。失敗した場合、エラーメッセージを表示します。
    const handleLogin = async () => {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ in_charge_name: username, password: password }),
            });

            if (response.ok) {
                //ログイン担当者データ
                const jsonData = await response.json();
                console.log('response', jsonData);
                if (jsonData) {
                    localStorage.setItem('inchargeData', JSON.stringify(jsonData.token[1]));
                }
                // ログイン成功時の処理
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loginTimestamp', Date.now().toString());
                console.log('ブラウザとデバイスの結果', getBrowserAndDevice());
                if(getBrowserAndDevice() === 'Chrome on Smartphone'){
                     props.navigator.resetPage({ component: BusinessMenu }); // 営業用メニューに移動
                }
                else{
                    props.navigator.resetPage({ component: Dashboard }); // ダッシュボードに移動
                }
               
                setFailedAttempts(0); // ログイン成功時の失敗回数をリセット
                setErrorMessage(''); // 以前のエラーメッセージをクリア
            } else {
                const errorData = await response.json(); // サーバーからのエラーメッセージを取得
                setFailedAttempts(prevAttempts => prevAttempts + 1); // 失敗回数を増加
                setPassword(''); // パスワードをクリア
                if (failedAttempts >= 3 || errorData.error == 'アカウントがロックされています') { // 4回目の失敗時
                    setErrorMessage('アカウントは、複数回のログイン失敗のためにロックされています。');
                } else {
                    notification.alert({
                        message: 'ログイン中にエラーが発生しました',
                        title: 'ログインエラー',
                        buttonLabel: '了解'
                    });
                }
            }
        } catch (error) {
            // ネットワークエラーやその他の問題の処理
            setFailedAttempts(prevAttempts => prevAttempts + 1); // ネットワークエラー時も失敗回数を増加（使用方法に応じてオプション）
            notification.alert({
                message: 'ログイン中にエラーが発生しました',
                title: 'ログインエラー',
                buttonLabel: '了解'
            });
        }
    };


    // 処理概要:ブラウザとデバイスの情報を取得し、文字列として返します。
    const getBrowserAndDevice = () => {
        const ua = navigator.userAgent;
        let browserName = "Unknown browser";
        let deviceType = "PC";

        // ブラウザを検出
        if (ua.indexOf("Edg") !== -1) browserName = "Edge";  // Edgeの検出はChromeの前に行うべき
        else if (ua.indexOf("Chrome") !== -1) browserName = "Chrome";
        else if (ua.indexOf("Safari") !== -1) browserName = "Safari";
        else if (ua.indexOf("Firefox") !== -1) browserName = "Firefox";
        else if (ua.indexOf("MSIE") !== -1 || !!document.documentMode === true) browserName = "IE";

        // デバイスを検出
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) deviceType = "Smartphone";
        return `${browserName} on ${deviceType}`;
    };

    return (
        <Page>
            <div className="login-container">
                <h1 className='main-title'>ログイン画面</h1>
                <div className="user-agent-info">
                    {getBrowserAndDevice()}
                </div>
                <div className="error-message">{errorMessage}</div>
                <label className="login-label">ユーザー名</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" />
                <label className="login-label">パスワード</label>
                <Input
                    type="text"
                    value={showPassword ? password : (isComposing ? password : '*'.repeat(password.length))}
                    onChange={handlePasswordChange}
                    className="login-input"
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            e.target.blur();
                        }
                    }}
                />
                <div>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label>パスワード表示</label>
                </div>
                <Button onClick={handleLogin} className="login-button">ログイン</Button>
            </div>
        </Page>
    );
}