import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useStore } from '../context/StoreContext';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const { formatNaira } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  return (
    <div style={{ minHeight: '80vh', backgroundColor: 'var(--cultured)', padding: '60px 15px' }}>
      <div
        className="container"
        style={{
          maxWidth: '650px',
          backgroundColor: 'var(--white)',
          padding: '40px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#e6f7ef',
            color: '#0ba360',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '38px',
          }}
        >
          <ion-icon name="checkmark-outline"></ion-icon>
        </div>

        <h1 style={{ fontSize: '2.8rem', color: 'var(--smokey-black)', marginBottom: '8px' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--granite-gray)', marginBottom: '25px' }}>
          Your payment via Paystack was verified and your order is now being processed.
        </p>

        {loading ? (
          <p>Loading order receipt...</p>
        ) : order ? (
          <div
            style={{
              textAlign: 'left',
              backgroundColor: 'var(--cultured)',
              padding: '20px',
              borderRadius: '6px',
              marginBottom: '30px',
              fontSize: '1.4rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Order Number:</strong>
              <span style={{ color: 'var(--tan-crayola)', fontWeight: 'bold' }}>{order.orderNumber}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Payment Status:</strong>
              <span className="status-badge paid">{order.paymentStatus}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Paystack Ref:</strong>
              <span style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>{order.paystackReference || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Total Paid:</strong>
              <strong style={{ color: 'var(--smokey-black)' }}>{formatNaira(order.totalAmount)}</strong>
            </div>

            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--black_10)' }}>
              <strong>Delivery Address:</strong>
              <p style={{ color: 'var(--granite-gray)', marginTop: '4px' }}>
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, Nigeria
              </p>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '30px', fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
            Order ID: <strong>{id}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/" className="app-btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '12px 30px' }}>
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
};
