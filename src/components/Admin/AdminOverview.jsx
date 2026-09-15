import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminOverview = ({ setActiveTab }) => {
  const { products, formatNaira } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const outOfStockCount = products.filter(
    (p) => p.inStock === false || Number(p.stockQuantity) === 0
  ).length;

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--smokey-black)', marginBottom: '6px' }}>
          Store Dashboard Overview
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
          Monitor sales, inventory performance, and recent orders processed with Paystack.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Total Revenue</div>
          <div className="kpi-value" style={{ color: 'var(--tan-crayola)' }}>
            {formatNaira(totalRevenue)}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Total Orders</div>
          <div className="kpi-value">{orders.length}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Active Products</div>
          <div className="kpi-value">{products.length}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Stock Warnings</div>
          <div
            className="kpi-value"
            style={{ color: outOfStockCount > 0 ? 'var(--red-orange-color-wheel)' : '#0ba360' }}
          >
            {outOfStockCount} items
          </div>
        </div>
      </div>

      {/* Recent Orders Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent Orders</h2>
          <button
            type="button"
            style={{
              backgroundColor: 'var(--cultured)',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '1.3rem',
              color: 'var(--smokey-black)',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('orders')}
          >
            View All Orders &rarr;
          </button>
        </div>

        {loading ? (
          <p style={{ padding: '20px 0', fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p style={{ padding: '20px 0', fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
            No orders placed yet.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Delivery (Nigeria)</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Paystack Ref</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id || order.orderNumber}>
                    <td style={{ fontWeight: '500' }}>{order.orderNumber}</td>
                    <td>
                      <div>{order.customer?.fullName}</div>
                      <small style={{ color: 'var(--spanish-gray)' }}>{order.customer?.phone}</small>
                    </td>
                    <td>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </td>
                    <td>{order.items?.length || 1} items</td>
                    <td style={{ fontWeight: '700' }}>{formatNaira(order.totalAmount)}</td>
                    <td>
                      <span className={`status-badge ${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                      {order.paystackReference || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
