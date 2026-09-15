import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminSettings = () => {
  const { businessInfo, refreshBusinessInfo, showToast } = useStore();
  const [formData, setFormData] = useState({ ...businessInfo });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessInfo) {
      setFormData({
        ...businessInfo,
        socialLinks: {
          facebook: businessInfo.socialLinks?.facebook || 'https://facebook.com/romadec',
          twitter: businessInfo.socialLinks?.twitter || 'https://twitter.com/romadec',
          instagram: businessInfo.socialLinks?.instagram || 'https://instagram.com/romadec',
        },
      });
    }
  }, [businessInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const network = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...(prev.socialLinks || {}),
          [network]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateBusinessInfo(formData);
      await refreshBusinessInfo();
      showToast('Business details and address updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update business settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--smokey-black)', marginBottom: '6px' }}>
          Store & Nigerian Address Settings
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
          Update store branding, contact email, Nigerian physical address, and phone numbers.
        </p>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSave}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '18px', color: 'var(--smokey-black)' }}>
            Brand Identity & Currency
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label className="form-label">Store Legal / Display Name *</label>
              <input
                type="text"
                name="storeName"
                required
                className="form-input"
                value={formData.storeName || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Brand Short Name (Logo Text) *</label>
              <input
                type="text"
                name="shortName"
                required
                className="form-input"
                value={formData.shortName || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                name="tagline"
                className="form-input"
                value={formData.tagline || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                name="currencySymbol"
                className="form-input"
                value={formData.currencySymbol || '₦'}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--black_10)', margin: '25px 0' }} />

          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '18px', color: 'var(--smokey-black)' }}>
            Default Nigerian Address & Contact Info
          </h3>

          <div className="form-field">
            <label className="form-label">Physical Address (Nigeria) *</label>
            <input
              type="text"
              name="address"
              required
              className="form-input"
              value={formData.address || ''}
              onChange={handleChange}
            />
            <small style={{ color: 'var(--spanish-gray)', marginTop: '4px', display: 'block' }}>
              Displayed on store footer, mobile contact drawer, and invoice receipts.
            </small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label className="form-label">Customer Support Email *</label>
              <input
                type="email"
                name="email"
                required
                className="form-input"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Nigerian Phone Number *</label>
              <input
                type="text"
                name="phone"
                required
                className="form-input"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">City & State</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--black_10)', margin: '25px 0' }} />

          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '18px', color: 'var(--smokey-black)' }}>
            About Romadec Stores
          </h3>

          <div className="form-field">
            <label className="form-label">About Store Story Text</label>
            <textarea
              name="aboutText"
              rows="4"
              className="form-textarea"
              value={formData.aboutText || ''}
              onChange={handleChange}
            ></textarea>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--black_10)', margin: '25px 0' }} />

          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '18px', color: 'var(--smokey-black)' }}>
            Social Media Links
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div className="form-field">
              <label className="form-label">Facebook URL</label>
              <input
                type="url"
                name="social_facebook"
                className="form-input"
                value={formData.socialLinks?.facebook || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Twitter / X URL</label>
              <input
                type="url"
                name="social_twitter"
                className="form-input"
                value={formData.socialLinks?.twitter || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Instagram URL</label>
              <input
                type="url"
                name="social_instagram"
                className="form-input"
                value={formData.socialLinks?.instagram || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="app-btn-primary"
              style={{ width: 'auto', padding: '14px 35px' }}
              disabled={saving}
            >
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
