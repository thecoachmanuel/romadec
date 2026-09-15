import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { AdminLogin } from './AdminLogin';

export const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('romadec_admin_token');
  });

  const [activeTab, setActiveTab] = useState('overview');
  const { businessInfo, showToast, setIsAdminLoggedIn } = useStore();

  const handleLogout = () => {
    localStorage.removeItem('romadec_admin_token');
    localStorage.removeItem('romadec_admin_user');
    setIsAuthenticated(false);
    if (setIsAdminLoggedIn) setIsAdminLoggedIn(false);
    showToast('Logged out of Admin dashboard');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-container">
      {/* Admin Top Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {businessInfo.shortName || 'Romadec'}
          </Link>
          <span>ADMIN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '1.3rem',
              color: 'var(--tan-crayola)',
              fontWeight: '500',
            }}
          >
            <ion-icon name="arrow-back-outline"></ion-icon>
            Back to Store
          </Link>

          <button
            type="button"
            style={{
              background: 'none',
              border: '1px solid var(--black_25)',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '1.2rem',
              color: 'var(--granite-gray)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
            onClick={handleLogout}
            title="Log Out of Admin"
          >
            <ion-icon name="log-out-outline"></ion-icon>
            Log Out
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Desktop Sidebar */}
        <aside className="admin-sidebar">
          <div
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <ion-icon name="grid-outline" style={{ fontSize: '18px' }}></ion-icon>
            <span>Overview</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ion-icon name="cube-outline" style={{ fontSize: '18px' }}></ion-icon>
            <span>Products (CRUD)</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ion-icon name="receipt-outline" style={{ fontSize: '18px' }}></ion-icon>
            <span>Orders</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <ion-icon name="settings-outline" style={{ fontSize: '18px' }}></ion-icon>
            <span>Store & Address</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          {activeTab === 'overview' && <AdminOverview setActiveTab={setActiveTab} />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Mobile Bottom Tabs Navigation */}
      <nav className="admin-mobile-tabs">
        <div
          className={`mobile-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ion-icon name="grid-outline" style={{ fontSize: '20px' }}></ion-icon>
          <span>Overview</span>
        </div>

        <div
          className={`mobile-tab-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <ion-icon name="cube-outline" style={{ fontSize: '20px' }}></ion-icon>
          <span>Products</span>
        </div>

        <div
          className={`mobile-tab-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ion-icon name="receipt-outline" style={{ fontSize: '20px' }}></ion-icon>
          <span>Orders</span>
        </div>

        <div
          className={`mobile-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <ion-icon name="settings-outline" style={{ fontSize: '20px' }}></ion-icon>
          <span>Settings</span>
        </div>
      </nav>
    </div>
  );
};
