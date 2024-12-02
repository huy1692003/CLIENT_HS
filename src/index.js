import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
// import reportWebVitals from './reportWebVitals';
import vi_VN from "antd/es/locale/vi_VN"; // Import ngôn ngữ tiếng Việt
import moment from "moment";
import 'moment/locale/vi'; // Import locale cho moment

// Thiết lập locale cho moment
moment.locale('vi')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={vi_VN}>
    <RecoilRoot>
      <Router>
        <App />
      </Router>
    </RecoilRoot>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
