import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import vi_VN from "antd/es/locale/vi_VN"; // Import ngôn ngữ tiếng Việt
import moment from "moment";
import 'moment/locale/vi'; // Import locale tiếng Việt cho moment

// Thiết lập locale cho moment
moment.locale('vi');

// Render ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={vi_VN}>
      <RecoilRoot>
        <Router>
          <App />
        </Router>
      </RecoilRoot>
    </ConfigProvider>
  </React.StrictMode>
);
