import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminOrders = () => {
  const { formatNaira, showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Updated order status to ${newStatus}`);
      await fetchOrders();
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      filterStatus === 'all' ||
      o.orderStatus === filterStatus ||
      o.paymentStatus === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customer?.fullName?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q) ||
      o.shippingAddress?.state?.toLowerCase().includes(q) ||
      o.shippingAddress?.city?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--smokey-black)', marginBottom: '6px' }}>
          Customer Orders
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
          Track customer payments via Paystack and update Nigerian delivery dispatch statuses.
        </p>
      </div>

      {/* Filter and Search */}
      <div
        className="admin-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center',
          padding: '16px 20px',
        }}
      >
        <div style={{ flexGrow: 1, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Search order number, customer name, state..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        {loading ? (
          <p style={{ padding: '30px 0', textAlign: 'center', fontSize: '1.4rem' }}>
            Loading orders...
          </p>
        ) : filteredOrders.length === 0 ? (
          <p style={{ padding: '30px 0', textAlign: 'center', fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
            No orders found matching your filters.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id || order.orderNumber}>
                    <td style={{ fontWeight: '700', color: 'var(--tan-crayola)' }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ fontSize: '1.2rem', color: 'var(--granite-gray)' }}>
                      {new Date(order.createdAt || Date.now()).toLocaleDateString('en-NG')}
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{order.customer?.fullName}</div>
                      <small style={{ color: 'var(--spanish-gray)' }}>{order.customer?.phone}</small>
                    </td>
                    <td>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </td>
                    <td style={{ fontWeight: '700' }}>{formatNaira(order.totalAmount)}</td>
                    <td>
                      <span className={`status-badge ${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '6px 8px', fontSize: '1.2rem', width: 'auto' }}
                        value={order.orderStatus || 'pending'}
                        onChange={(e) => handleStatusChange(order._id || order.orderNumber, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="action-btn-icon"
                        title="View Full Order"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="app-overlay active" onClick={() => setSelectedOrder(null)}>
          <div
            className="app-modal active"
            style={{ maxWidth: '650px', padding: '30px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              aria-label="close modal"
              onClick={() => setSelectedOrder(null)}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--smokey-black)' }}>
              Order {selectedOrder.orderNumber}
            </h2>
            <p style={{ fontSize: '1.3rem', color: 'var(--granite-gray)', marginBottom: '20px' }}>
              Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-NG')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: 'var(--cultured)', padding: '15px', borderRadius: '4px' }}>
                <h4 style={{ fontSize: '1.3rem', color: 'var(--granite-gray)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Customer Details
                </h4>
                <p><strong>{selectedOrder.customer?.fullName}</strong></p>
                <p style={{ fontSize: '1.3rem', color: 'var(--granite-gray)' }}>{selectedOrder.customer?.email}</p>
                <p style={{ fontSize: '1.3rem', color: 'var(--granite-gray)' }}>{selectedOrder.customer?.phone}</p>
              </div>

              <div style={{ backgroundColor: 'var(--cultured)', padding: '15px', borderRadius: '4px' }}>
                <h4 style={{ fontSize: '1.3rem', color: 'var(--granite-gray)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Nigerian Shipping Address
                </h4>
                <p>{selectedOrder.shippingAddress?.street}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                <p>{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            <h4 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>
              Items Ordered ({selectedOrder.items?.length})
            </h4>

            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
              {selectedOrder.items?.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingBottom: '10px',
                    marginBottom: '10px',
                    borderBottom: '1px solid var(--black_10)',
                  }}
                >
                  <img
                    src={it.image}
                    alt={it.title}
                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontWeight: '500', fontSize: '1.4rem' }}>{it.title}</p>
                    <small style={{ color: 'var(--granite-gray)' }}>
                      Quantity: {it.quantity} × {formatNaira(it.price)}
                    </small>
                  </div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--tan-crayola)' }}>
                    {formatNaira(it.price * it.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--black_10)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: '700' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--tan-crayola)' }}>{formatNaira(selectedOrder.totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', color: 'var(--granite-gray)', marginTop: '6px' }}>
                <span>Paystack Reference</span>
                <span style={{ fontFamily: 'monospace' }}>{selectedOrder.paystackReference || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
