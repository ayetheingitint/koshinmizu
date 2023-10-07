// routes.js
import App from './App';
import LoginPage from './LoginPage'; // Assuming you have a LoginPage component

const routes = [
  { path: '/', component: App, exact: true },
  { path: '/login', component: LoginPage }
];

export default routes;
