import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Thank you for subscribing to Romadec newsletter!');
    setEmail('');
  };

  return (
    <section className="section newsletter" aria-label="newsletter">
      <div className="container">
        <div className="newsletter-card">
          <div className="card-content">
            <h2 className="h2 section-title">Our Newsletter</h2>

            <p className="section-text">
              Subscribe our newsletter and get discount 50% off
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="card-form">
            <input
              type="email"
              name="email_address"
              placeholder="Your email address"
              required
              className="email-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="newsletter-btn"
              aria-label="subscribe"
            >
              <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
