import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminLogin = ({ onLoginSuccess }) => {
  const { businessInfo, showToast, setIsAdminLoggedIn } = useStore();
  const [email, setEmail] = useState('admin@romadec.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.adminLogin({ email, password });
      localStorage.setItem('romadec_admin_token', response.token);
      localStorage.setItem('romadec_admin_user', JSON.stringify(response.user));
      if (setIsAdminLoggedIn) setIsAdminLoggedIn(true);
      showToast('Logged in successfully!');
      onLoginSuccess(response.user);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cultured)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--white)',
          borderRadius: '8px',
          padding: '40px 30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid var(--black_10)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link
            to="/"
            className="logo"
            style={{
              fontSize: '3.6rem',
              display: 'inline-block',
              marginBottom: '6px',
            }}
          >
            {businessInfo.shortName || 'Romadec'}
          </Link>
          <div
            style={{
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--tan-crayola)',
              fontWeight: '700',
            }}
          >
            Administrator Portal
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fde8e8',
              color: '#e03131',
              padding: '12px 16px',
              borderRadius: '4px',
              fontSize: '1.3rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ion-icon name="alert-circle-outline" style={{ fontSize: '18px' }}></ion-icon>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@romadec.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </div>

          <button
            type="submit"
            className="app-btn-primary"
            style={{ marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <Link
            to="/"
            style={{
              fontSize: '1.3rem',
              color: 'var(--granite-gray)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ion-icon name="arrow-back-outline"></ion-icon>
            Back to Romadec Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
