import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import vi_VN from "antd/es/locale/vi_VN";

// Thay moment bằng dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import updateLocale from 'dayjs/plugin/updateLocale';

// Cấu hình dayjs
dayjs.extend(updateLocale);
dayjs.locale('vi');

// Override weekdays và months để hiển thị đầy đủ tiếng Việt
dayjs.updateLocale('vi', {
  weekdaysMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  months: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  monthsShort: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]
});

// Custom locale cho Ant Design
const customViVN = {
  ...vi_VN,
  DatePicker: {
    ...vi_VN.DatePicker,
    lang: {
      ...vi_VN.DatePicker.lang,
      shortWeekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      shortMonths: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ],
      months: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ]
    }
  }
};

// Render ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ConfigProvider locale={customViVN}>
      <RecoilRoot>
        <Router>
          <App />
        </Router>
      </RecoilRoot>
    </ConfigProvider>
  </>
);