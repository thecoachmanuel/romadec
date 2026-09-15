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
            className="header-action-btn"
            aria-label="admin dashboard"
            title="Admin Dashboard"
            onClick={() => navigate('/admin')}
          >
            <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
          </button>

          {/* Wishlist Button */}
          <button
            className="header-action-btn"
            aria-label="favorite list"
            title="Wishlist"
            onClick={() => setIsWishlistOpen(true)}
          >
            <ion-icon name="heart-outline" aria-hidden="true"></ion-icon>
            <span className="btn-badge">{wishlistCount}</span>
          </button>

          {/* Cart Button */}
          <button
            className="header-action-btn"
            aria-label="cart"
            title="Shopping Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>
            <span className="btn-badge">{cartCount}</span>
          </button>

          {/* Mobile Sidebar Toggle Button */}
          <button
            className="header-action-btn"
            aria-label="open menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ion-icon name="menu-outline" aria-hidden="true"></ion-icon>
          </button>
        </div>
      </div>
    </header>
  );
};
