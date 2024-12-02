
import './App.css';
import '../src/styles/hover.scss';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/user/HomePage';

import  NotFoundPage  from './pages/NotFoundPage';
import { routers } from './routers/routes';
import { useEffect } from 'react';
import OwnerLayout from './components/layout/owner/OwnerLayout';
import AdminLayout from './components/layout/admin/AdminLayout';
import UserLayout from './components/layout/user/UserLayout';
function App() {
  const location = useLocation();

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

  return (

    <Layout>
      <Routes>
        {routers.map((r) => <Route path={r.path} element={<>{r.element}</>} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>

  );
}

export default App;
