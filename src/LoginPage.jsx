// LoginPage.jsx
import React from 'react';
import { Page, Input, Button, Toolbar } from 'react-onsenui';

const LoginPage = () => {
  return (
    <Page>
      <Toolbar>
        <div className="center">Login</div>
      </Toolbar>
      <div>
        <Input modifier="underbar" placeholder="Username" />
        <Input modifier="underbar" type="password" placeholder="Password" />
        <Button>Login</Button>
      </div>
    </Page>
  );
};

export default LoginPage;