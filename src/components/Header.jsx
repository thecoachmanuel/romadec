import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const Header = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSidebarOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSelectedProductForModal,
    formatNaira,
    businessInfo,
    isAdminLoggedIn,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProductForModal(product);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header className={`header ${isScrolled ? 'active' : ''}`} data-header>
      <div className="container">
        {/* Real-time Search Input Wrapper */}
        <div className="input-wrapper" ref={searchContainerRef}>
          <input
            type="search"
            name="search"
            placeholder="Search Anything..."
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            autoComplete="off"
          />
          <ion-icon name="search-outline" aria-hidden="true"></ion-icon>

          {/* Real-time search dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="search-item"
                    onClick={() => handleSelectProduct(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="search-thumb"
                    />
                    <div className="search-info">
                      <p className="search-title">{item.title}</p>
                      <div className="search-meta">
                        <span className="search-category">{item.category}</span>
                        <span className="search-price">{formatNaira(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-empty">No products found matching "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <Link to="/" className="logo">
          {businessInfo.shortName || 'Romadec'}
        </Link>

        {/* Header Actions */}
        <div className="header-action">
          {/* Admin / Account Button */}
          <button
            className={`header-action-btn ${isAdminLoggedIn ? 'admin-active' : ''}`}
            aria-label="admin dashboard"
            title={isAdminLoggedIn ? 'Go to Admin Dashboard (Logged In)' : 'Admin Login'}
            onClick={() => navigate('/admin')}
            style={{ color: 'var(--smokey-black)', position: 'relative' }}
          >
            <ion-icon
              name={isAdminLoggedIn ? 'shield-checkmark-outline' : 'person-outline'}
              aria-hidden="true"
              style={{ color: isAdminLoggedIn ? 'var(--tan-crayola)' : 'var(--smokey-black)' }}
            ></ion-icon>
            {isAdminLoggedIn && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#0ba360',
                  border: '2px solid var(--white)',
                }}
                title="Admin active"
              ></span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            className="header-action-btn"
            aria-label="favorite list"
            title="Wishlist"
            onClick={() => setIsWishlistOpen(true)}
            style={{ color: 'var(--smokey-black)' }}
          >
            <ion-icon name="heart-outline" aria-hidden="true" style={{ color: 'var(--smokey-black)' }}></ion-icon>
            <span className="btn-badge">{wishlistCount}</span>
          </button>

          {/* Cart Button */}
          <button
            className="header-action-btn"
            aria-label="cart"
            title="Shopping Cart"
            onClick={() => setIsCartOpen(true)}
            style={{ color: 'var(--smokey-black)' }}
          >
            <ion-icon name="bag-handle-outline" aria-hidden="true" style={{ color: 'var(--smokey-black)' }}></ion-icon>
            <span className="btn-badge">{cartCount}</span>
          </button>

          {/* Mobile Sidebar Toggle Button */}
          <button
            className="header-action-btn"
            aria-label="open menu"
            onClick={() => setIsSidebarOpen(true)}
            style={{ color: 'var(--smokey-black)' }}
          >
            <ion-icon name="menu-outline" aria-hidden="true" style={{ color: 'var(--smokey-black)' }}></ion-icon>
          </button>
        </div>
      </div>
    </header>
  );
};
