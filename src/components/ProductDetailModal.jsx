import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    addToCart,
    incrementItem,
    decrementItem,
    getItemQuantity,
    setIsCheckoutOpen,
    formatNaira,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [localQuantity, setLocalQuantity] = useState(1);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const prodId = product._id || product.id;
  const isLiked = isInWishlist(prodId);
  const inCartQty = getItemQuantity(prodId);

  const displayQuantity = inCartQty > 0 ? inCartQty : localQuantity;

  const handleIncrement = () => {
    if (inCartQty > 0) {
      incrementItem(product);
    } else {
      setLocalQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (inCartQty > 0) {
      decrementItem(prodId);
    } else {
      setLocalQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = () => {
    if (inCartQty > 0) {
      incrementItem(product);
    } else {
      addToCart(product, localQuantity);
    }
  };

  const handleBuyNow = () => {
    if (inCartQty === 0) {
      addToCart(product, localQuantity);
    }
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

            {/* Quantity Selector Synchronized Across App */}
            {product.inStock !== false && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '500', color: 'var(--smokey-black)' }}>
                  Quantity:
                </span>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="decrease quantity"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                  <span className="qty-number">{displayQuantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="increase quantity"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                </div>

                {inCartQty > 0 && (
                  <span style={{ fontSize: '1.2rem', color: 'var(--tan-crayola)', fontWeight: '500' }}>
                    ({inCartQty} in bag)
                  </span>
                )}

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
                {product.inStock === false
                  ? 'Out of Stock'
                  : inCartQty > 0
                  ? `In Bag (${inCartQty}) • Add More`
                  : 'Add to Cart'}
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
