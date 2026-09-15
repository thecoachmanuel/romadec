import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, businessInfo, isAdminLoggedIn } = useStore();

  const handleLinkClick = (hash) => {
    setIsSidebarOpen(false);
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`} data-navbar>
        <button
          className="nav-close-btn"
          aria-label="close menu"
          onClick={() => setIsSidebarOpen(false)}
          style={{ color: 'var(--smokey-black)' }}
        >
          <ion-icon name="close-outline" aria-hidden="true" style={{ color: 'var(--smokey-black)' }}></ion-icon>
        </button>

        <div className="wrapper">
          <ul className="sidebar-list">
            <li>
              <p className="sidebar-list-title">Language</p>
            </li>
            <li>
              <a href="#lang" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                English
              </a>
            </li>
            <li>
              <a href="#lang" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                Yoruba / Igbo / Hausa
              </a>
            </li>
          </ul>

          <ul className="sidebar-list">
            <li>
              <p className="sidebar-list-title">Currency</p>
            </li>
            <li>
              <a href="#curr" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                NGN - Nigerian Naira (₦)
              </a>
            </li>
          </ul>
        </div>

        <nav className="navbar">
          <ul className="navbar-list">
            {isAdminLoggedIn && (
              <li className="navbar-item" style={{ borderBottom: '1px solid var(--black_10)', paddingBottom: '12px', marginBottom: '16px' }}>
                <Link
                  to="/admin"
                  className="navbar-link"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--tan-crayola)', fontWeight: '700' }}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <ion-icon name="shield-checkmark" style={{ fontSize: '20px', color: 'var(--tan-crayola)' }}></ion-icon>
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            )}

            <li className="navbar-item">
              <a
                href="#home"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#home');
                }}
              >
                Home
              </a>
            </li>

            <li className="navbar-item">
              <a
                href="#about"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#about');
                }}
              >
                About
              </a>
            </li>

            <li className="navbar-item">
              <a
                href="#product"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#product');
                }}
              >
                Product
              </a>
            </li>

            <li className="navbar-item">
              <a
                href="#blog"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#blog');
                }}
              >
                Blogs
              </a>
            </li>
          </ul>
        </nav>

        <ul className="contact-list">
          <li>
            <p className="contact-list-title">Contact Us</p>
          </li>

          <li className="contact-item">
            <address className="address">
              {businessInfo.address || '93 Olojo Drive, Ojo, Lagos, Nigeria'}
            </address>
          </li>

          <li className="contact-item">
            <a href={`mailto:${businessInfo.email}`} className="contact-link">
              {businessInfo.email || 'support@romadec.com'}
            </a>
          </li>

          <li className="contact-item">
            <a href={`tel:${businessInfo.phone?.replace(/[^0-9+]/g, '')}`} className="contact-link">
              {businessInfo.phone || '+234 (0) 808 760 8827'}
            </a>
          </li>
        </ul>

        <div className="social-wrapper">
          <p className="social-list-title">Follow US On Socials</p>

          <ul className="social-list">
            <li>
              <a href={businessInfo.socialLinks?.facebook || '#'} className="social-link" target="_blank" rel="noreferrer">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>

            <li>
              <a href={businessInfo.socialLinks?.twitter || '#'} className="social-link" target="_blank" rel="noreferrer">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>

            <li>
              <a href={businessInfo.socialLinks?.instagram || '#'} className="social-link" target="_blank" rel="noreferrer">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        data-overlay
      ></div>
    </>
  );
};
