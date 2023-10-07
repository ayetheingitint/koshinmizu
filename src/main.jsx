import 'react-hot-loader/patch';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Navigator } from 'react-onsenui';
import ons from 'onsenui';

import Dashboard from './admin/Dashboard';
import CustomerMasterRegSuccess from './admin/CustomerMasterRegisterSuccess';

// Onsen UI Styling and Icons
require('onsenui/css/onsen-css-components.css');
require('onsenui/css/onsenui.css');

import App from './App';

if (ons.platform.isIPhoneX()) {
  document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

const renderPage = (route, navigator) => {
  const Component = route.component;
  return <Component key={route.key} navigator={navigator} />;
};

const isLoggedIn = localStorage.getItem('isLoggedIn');
const loginTimestamp = localStorage.getItem('loginTimestamp');

const hasSessionExpired = () => {
  const ONE_HOUR = 60 * 60 * 1000; // in milliseconds
  if (loginTimestamp) {
    const currentTime = Date.now();
    return currentTime - parseInt(loginTimestamp, 10) > ONE_HOUR;
  }
  return true;
};

const initialRoute = isLoggedIn && !hasSessionExpired() 
                     ? { component: Dashboard, key: "DASHBOARD" } 
                     : { component: App, key: "APP" };

const rootElement = document.getElementById('app');
ReactDOM.render(
  <AppContainer>
    <Navigator
      initialRoute={initialRoute}
      renderPage={renderPage}
    />
  </AppContainer>,
  rootElement
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      rootElement
    );
  });
}
