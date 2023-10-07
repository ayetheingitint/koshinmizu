import React, { useState } from 'react'; // React と useState フックをインポートします。
import App from '../App'; // アプリケーションのメインコンポーネントをインポートします。 
import { Page, Button, List, Navigator } from 'react-onsenui'; // OnsenUI のコンポーネントをインポートします。
import { notification } from 'onsenui'; // OnsenUI からの通知関数をインポートします
import { BASE_URL } from './../env'; // 環境変数をインポートします。


// ダッシュボードのサブページをインポートします。 (Import sub-pages for the dashboard.)
import CustomerMasterRegister from './CustomerMasterRegister'; // 得意先マスターの登録ページをインポートします。
import CustomerMasterList from './CustomerMasterList'; // 得意先マスターのリストページをインポートします。
import ProductMasterRegister from './ProductMasterRegister'; // 商品マスターの登録ページをインポートします。
import ProductMasterList from './ProductMasterList'; // 商品マスターのリスト・編集ページをインポートします。
import AccountLockDelete from './AccountLockDelete'; // アカウントロック解除のページをインポートします。
import UserRegisterComponent from './UserRegister';
import LogConfirmComponent from './LogConfirm';
import OrderInfoOutputComponent from './OrderInfoOutput';
import Page2 from './Page2'; // サンプルのページ2をインポートします。 (Import the sample Page 2.)

const Dashboard = (props) => {
  const [activeComponent, setActiveComponent] = useState(() => <CustomerMasterRegister navigator={props.navigator} />);
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // ログアウト成功時の処理
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTimestamp');
        props.navigator.resetPage({ component: App });
      } else {
        const errorData = await response.json();
        notification.alert(errorData.message || 'Failed to log out!');
      }
    } catch (error) {
      notification.alert('Network error or server is not responding.');
    }
  };

  // 各メニューアイテムのレンダリング
  const renderRow = (row) => {
    return (
      <div key={row.title} className='menu-items' onClick={() => {
        setActiveComponent(row.component());
      }} >
        {row.title}
      </div>
    );
  }

  // メニューアイテムを表示
  const menuItems = [
    { title: '得意先マスター登録', component: () => <CustomerMasterRegister navigator={props.navigator} changeActiveComponent={changeActiveComponent} /> },
    { title: '得意先マスター確認', component: () => <CustomerMasterList navigator={props.navigator} /> },
    { title: '商品マスター登録', component: () => <ProductMasterRegister navigator={props.navigator} /> },
    { title: '商品マスター確認・編集', component: () => <ProductMasterList navigator={props.navigator} /> },
    { title: '受注情報出力', component: () => <OrderInfoOutputComponent navigator={props.navigator} /> },
    { title: 'ユーザー登録', component: () => <UserRegisterComponent navigator={props.navigator} /> },
    { title: 'アカウントロック解除', component: () => <AccountLockDelete navigator={props.navigator} /> },
    { title: 'ログ確認', component: () => <LogConfirmComponent navigator={props.navigator} /> },
  ];

  const changeActiveComponent = (newComponent) => {
    setActiveComponent(newComponent);
  };

  return (
    <Page>
      <div className="dashboard-container">
        <div className="custom-sidebar">
          <div className='logo-text' >
            KOSHIMIZU
          </div>
          <List
            dataSource={menuItems}
            renderRow={renderRow}
          />
          <Button onClick={handleLogout} className='logout-btn'>ログアウト</Button>
        </div>

        <div className="main-content">
          {activeComponent}
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;