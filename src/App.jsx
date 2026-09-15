import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminLayout } from './components/Admin/AdminLayout';
import { useStore } from './context/StoreContext';

export const App = () => {
  const { isAdminLoggedIn } = useStore();
  const location = useLocation();
  const isOnAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Admin Return Shortcut on Main Site */}
      {isAdminLoggedIn && !isOnAdminRoute && (
        <Link
          to="/admin"
          className="admin-floating-badge"
          aria-label="Return to Admin Dashboard"
          title="Logged in as Admin. Click to open Dashboard"
        >
          <ion-icon name="shield-checkmark"></ion-icon>
          <span>Admin Dashboard</span>
        </Link>
      )}
    </>
  );
};

export default App;
