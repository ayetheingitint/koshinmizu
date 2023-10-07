import React, { useState, useEffect, useRef } from 'react';
import {
    Page,
    Input,
    List,
    ListItem,
    Row,
    Col, Button
} from 'react-onsenui';

/*ユーザー情報登録完了Component*/
const UserInfoRegisterCompletePage = ({ props }) => {  
   
    return (      
           <div>
            <p style={{ fontSize: 'x-large', marginTop: '-17px', padding: '10px', textAlign: 'center', color: '#000' }}>ユーザー情報の登録完了
            </p>
         
            <p style={{ fontSize: 'medium', marginTop: '50px', padding: '10px', textAlign: 'center', color: '#000' }}>ユーザー情報の登録に成功しました。
                </p>
            </div>              
           
    );
};
export default UserInfoRegisterCompletePage;