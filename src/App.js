import './App.css';
import '../src/styles/hover.scss';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/user/HomePage';
import { UpOutlined } from '@ant-design/icons';
import NotFoundPage from './pages/NotFoundPage';
import { routers } from './routers/routes';
import { lazy, Suspense, useEffect, useState } from 'react';
import ResultPagePayment from './pages/user/ResultPagePayment';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

// Lazy load các layout
const OwnerLayout = lazy(() => import('./components/layout/owner/OwnerLayout'));
const AdminLayout = lazy(() => import('./components/layout/admin/AdminLayout')); 
const UserLayout = lazy(() => import('./components/layout/user/UserLayout'));

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Xác định layout component dựa trên path
  const getLayout = () => {
    if (location.pathname.startsWith('/owner')) {
      return OwnerLayout;
    }
    if (location.pathname.startsWith('/admin')) {
      return AdminLayout;
    }
    return UserLayout;
  };

  const Layout = getLayout();

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
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <Routes>
          {routers.map((r, index) => (
            <Route key={index} path={r.path} element={r.element} />
          ))}
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
    </Suspense>
  );
}

export default App;
