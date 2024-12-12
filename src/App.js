import './App.css';
import '../src/styles/hover.scss';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/user/HomePage';
import { UpOutlined } from '@ant-design/icons';
import NotFoundPage from './pages/NotFoundPage';
import { routers } from './routers/routes';
import { useEffect, useState } from 'react';
import OwnerLayout from './components/layout/owner/OwnerLayout';
import AdminLayout from './components/layout/admin/AdminLayout';
import UserLayout from './components/layout/user/UserLayout';
import ResultPagePayment from './pages/user/ResultPagePayment';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
function App() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Xác định layout dựa trên đường dẫn
  let Layout;
  if (location.pathname.startsWith('/owner')) {
    Layout = OwnerLayout;
  } else if (location.pathname.startsWith('/admin')) {
    Layout = AdminLayout;
  } else {
    Layout = UserLayout;
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      setShowScrollTop(scrollY > screenHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Layout>
        <Routes>
          {routers.map((r) => <Route path={r.path} element={<>{r.element}</>} />)}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/result-status-payment" element={<ResultPagePayment />} />
        </Routes>
      </Layout>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#040548',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <UpOutlined />
        </button>
      )}
    </>
  );
}

export default App;
