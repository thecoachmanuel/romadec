import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
    formatNaira,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const isLiked = isInWishlist(product._id || product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductForModal(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      className="app-overlay active"
      onClick={() => setSelectedProductForModal(null)}
    >
      <div
        className="app-modal active"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-icon"
          aria-label="close product details"
          onClick={() => setSelectedProductForModal(null)}
        >
          <ion-icon name="close-outline"></ion-icon>
        </button>

        <div className="modal-content-grid">
          {/* Image */}
          <div className="modal-img-holder">
            <img
              src={product.image}
              alt={product.title}
            />
          </div>

          {/* Details */}
          <div>
            <span className="modal-category-tag">{product.category}</span>
            <h2 className="modal-title">{product.title}</h2>

            <div className="modal-price-wrap">
              <span className="modal-current-price">
                {formatNaira(product.price)}
              </span>
              {product.delPrice && (
                <span className="modal-del-price">
                  {formatNaira(product.delPrice)}
                </span>
              )}
              {product.inStock === false ? (
                <span style={{ color: 'var(--red-orange-color-wheel)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  (Out of Stock)
                </span>
              ) : (
                <span style={{ color: '#0ba360', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  (In Stock - {product.stockQuantity || 'Available'})
                </span>
              )}
            </div>

            <p className="modal-desc">
              {product.description ||
                'Handcrafted premium design, built with precision and timeless elegance for modern architectural homes.'}
            </p>

            <table className="modal-meta-table">
              <tbody>
                <tr>
                  <td>Dimensions:</td>
                  <td>{product.dimensions || 'Standard'}</td>
                </tr>
                <tr>
                  <td>Material:</td>
                  <td>{product.material || 'Premium Solid Hardwood / Metal / Ceramic'}</td>
                </tr>
                <tr>
                  <td>Delivery:</td>
                  <td>Express Delivery Across Nigeria (24-72 hrs)</td>
                </tr>
              </tbody>
            </table>

            {/* Quantity Selector */}
            {product.inStock !== false && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '500', color: 'var(--smokey-black)' }}>
                  Quantity:
                </span>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: '1px solid var(--black_25)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    color: isLiked ? 'var(--red-orange-color-wheel)' : 'var(--granite-gray)',
                  }}
                  onClick={() => toggleWishlist(product)}
                >
                  <ion-icon name={isLiked ? 'heart' : 'heart-outline'}></ion-icon>
                  {isLiked ? 'Saved' : 'Wishlist'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="app-btn-primary"
                disabled={product.inStock === false}
                style={product.inStock === false ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                onClick={handleAddToCart}
              >
                {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {product.inStock !== false && (
                <button
                  type="button"
                  className="app-btn-secondary"
                  onClick={handleBuyNow}
                >
                  Buy It Now (Pay with Paystack)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
