import React from 'react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatNaira,
    setSelectedProductForModal,
  } = useStore();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <>
      <div
        className={`app-overlay ${isWishlistOpen ? 'active' : ''}`}
        onClick={() => setIsWishlistOpen(false)}
      ></div>

      <div className={`app-drawer ${isWishlistOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">
            <ion-icon name="heart-outline" style={{ color: 'var(--red-orange-color-wheel)' }}></ion-icon>
            Saved Items ({wishlist.length})
          </h2>
          <button
            className="drawer-close-btn"
            aria-label="close wishlist"
            onClick={() => setIsWishlistOpen(false)}
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--granite-gray)' }}>
              <ion-icon name="heart-dislike-outline" style={{ fontSize: '48px', marginBottom: '15px' }}></ion-icon>
              <p style={{ fontSize: '1.6rem', marginBottom: '15px' }}>No favorites saved yet.</p>
              <button
                type="button"
                className="app-btn-secondary"
                onClick={() => setIsWishlistOpen(false)}
              >
                Browse Romadec Products
              </button>
            </div>
          ) : (
            <div>
              {wishlist.map((item) => (
                <div key={item._id || item.id} className="cart-item-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-img"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProductForModal(item);
                    }}
                  />
                  <div className="cart-item-details">
                    <h4
                      className="cart-item-title"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setSelectedProductForModal(item);
                      }}
                    >
                      {item.title}
                    </h4>
                    <p className="cart-item-price">{formatNaira(item.price)}</p>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        style={{
                          backgroundColor: 'var(--tan-crayola)',
                          color: 'var(--white)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ion-icon name="bag-add-outline"></ion-icon>
                        Move to Bag
                      </button>

                      <button
                        type="button"
                        className="item-remove-btn"
                        aria-label="remove favorite"
                        onClick={() => toggleWishlist(item)}
                      >
                        <ion-icon name="trash-outline"></ion-icon>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
