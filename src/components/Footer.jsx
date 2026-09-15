import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { businessInfo } = useStore();
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowBackTop(true);
      } else {
        setShowBackTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#top" className="logo">
              {businessInfo.shortName || 'Romadec'}
            </a>

            <p className="footer-text">
              Premium handcrafted furniture and contemporary architectural home decorations in Nigeria.
            </p>

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

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Help & Information</p>
            </li>

            <li>
              <a href="#about" className="footer-link">Help & Contact Us</a>
            </li>

            <li>
              <a href="#product" className="footer-link">Returns & Refunds</a>
            </li>

            <li>
              <a href="#product" className="footer-link">Online Stores</a>
            </li>

            <li>
              <a href="#about" className="footer-link">Terms & Conditions</a>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">About Us</p>
            </li>

            <li>
              <a href="#about" className="footer-link">About Romadec</a>
            </li>

            <li>
              <a href="#about" className="footer-link">What We Do</a>
            </li>

            <li>
              <a href="#product" className="footer-link">Our Collections</a>
            </li>

            <li>
              <a href="#about" className="footer-link">Contact Us</a>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Contact & Location</p>
            </li>

            <li className="footer-list-item">
              <ion-icon name="location-sharp" aria-hidden="true"></ion-icon>
              <address className="address">
                {businessInfo.address || '12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria'}
              </address>
            </li>

            <li className="footer-list-item">
              <ion-icon name="call-sharp" aria-hidden="true"></ion-icon>
              <a href={`tel:${businessInfo.phone?.replace(/[^0-9+]/g, '')}`} className="footer-link">
                {businessInfo.phone || '+234 (0) 803 123 4567'}
              </a>
            </li>

            <li className="footer-list-item">
              <ion-icon name="mail-sharp" aria-hidden="true"></ion-icon>
              <a href={`mailto:${businessInfo.email}`} className="footer-link">
                {businessInfo.email || 'support@romadec.com'}
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} All Rights Reserved by{' '}
            <a href="#" className="copyright-link">
              {businessInfo.storeName || 'Romadec Stores'}
            </a>
            .
          </p>
        </div>
      </div>

      {/* Back to top button */}
      <button
        className={`back-top-btn ${showBackTop ? 'active' : ''}`}
        aria-label="back to top"
        onClick={scrollToTop}
      >
        <ion-icon name="arrow-up" aria-hidden="true"></ion-icon>
      </button>
    </footer>
  );
};
