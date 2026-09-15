import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminLayout } from './components/Admin/AdminLayout';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/order-success/:id" element={<OrderSuccessPage />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default App;
