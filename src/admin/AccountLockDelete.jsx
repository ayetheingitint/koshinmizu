import React, { useState, useEffect } from 'react';　//　Reactのライブラリをインポート
import { Page, Dialog, Button } from 'react-onsenui';　//　Onsen UIのコンポーネントをインポート

//　アカウントロック解除ページのコンポーネント
const AccountLockDelete = ({ errors = [] }) => {
    const [lockedUsers, setLockedUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    //　アカウントロックユーザーのリストを取得
    useEffect(() => {
        fetch('http://localhost:3000/locked_users')
        .then(response => response.json())
        .then(data => {
            setLockedUsers(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    //　ロック解除ボタンを押した時の処理
    const handleMultipleUnlock = () => {
        setShowDialog(true); // Open the dialog
    };

    //　ロック解除確認ダイアログの処理
    const confirmUnlock = () => {
        setShowDialog(false);
        fetch(`http://localhost:3000/unlock_multiple_users`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userIds: selectedUsers })
        })
        .then(response => response.json())
        .then(data => {
            //　ロック解除成功時の処理
            if (data.success) {
                const unlockedUsers = lockedUsers.filter(user => selectedUsers.includes(user.id)).map(user => user.in_charge_name).join(', ');
                // Set the success message
                setSuccessMessage(`${unlockedUsers} のロック解除しました。`);
                setLockedUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
            } else {
                console.error('Failed to unlock users:', data.error);
            }
        })
        .catch(error => console.error('Error unlocking users:', error));
    };

    //　ロック解除キャンセル時の処理
    const cancelUnlock = () => {
        setShowDialog(false); // Close the dialog
    };

    //　ユーザーの選択状態を変更する処理
    const handleUserSelect = (userId, isSelected) => {
        //　ユーザーが選択されている場合は、ユーザーIDをselectedUsersに追加
        if (isSelected) {
            setSelectedUsers(prevState => [...prevState, userId]);
        } else {
            setSelectedUsers(prevState => prevState.filter(id => id !== userId));
        }
    };

    return (
        <Page>
            <h1>アカウントロック解除</h1>
            {/* ロック解除成功時のメッセージ */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <p>アカウントロックユーザーリスト</p>
            {/* アカウントロックユーザーがいる場合の処理 */}
            {lockedUsers.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>担当者名</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lockedUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUsers.includes(user.id)} 
                                            onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                                        />
                                        {user.in_charge_name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="button-container-acc-lock">
                        <button onClick={handleMultipleUnlock} className='delete-btn btn'>ロック解除</button>
                    </div>
                </>
                ) : (
                    <p>アカウントロックユーザーが見つかりません。</p>
                )}

                {/* ロック解除確認ダイアログ */}
                <Dialog
                    isOpen={showDialog}
                    onCancel={cancelUnlock}
                    isCancelable
                    isClosable
                >
                <div className="dialog-content">
                    <p className="dialog-message">選択したユーザーのロックを解除しますか？</p>
                    <div className="dialog-buttons">
                        <Button 
                            onClick={confirmUnlock} 
                            className="dialog-button confirm"
                        >
                            はい
                        </Button>
                        <Button 
                            onClick={cancelUnlock} 
                            className="dialog-button cancel"
                            style={{ marginLeft: '10px' }}
                        >
                            いいえ
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Page>
    );
};

export default AccountLockDelete;