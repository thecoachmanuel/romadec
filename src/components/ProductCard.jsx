import React from 'react';
import { useStore } from '../context/StoreContext';

export const ProductCard = ({ product }) => {
  const {
    addToCart,
    incrementItem,
    decrementItem,
    getItemQuantity,
    toggleWishlist,
    isInWishlist,
    setSelectedProductForModal,
    formatNaira,
  } = useStore();

  const prodId = product._id || product.id;
  const isLiked = isInWishlist(prodId);
  const inCartQty = getItemQuantity(prodId);

  return (
    <div className="product-card">
      <div
        className="card-banner img-holder has-before"
        style={{ '--width': 300, '--height': 300, cursor: 'pointer' }}
        onClick={() => setSelectedProductForModal(product)}
      >
        <img
          src={product.image}
          width="300"
          height="300"
          loading="lazy"
          alt={product.title}
          className="img-cover"
        />

        {/* Hover Action Buttons */}
        <ul className="card-action-list" onClick={(e) => e.stopPropagation()}>
          {inCartQty > 0 ? (
            <li className="card-action-qty-pill">
              <button
                type="button"
                className="card-action-btn-sm"
                aria-label="decrease quantity"
                title="Decrease"
                onClick={() => decrementItem(prodId)}
              >
                <ion-icon name="remove-outline" aria-hidden="true"></ion-icon>
              </button>
              <span className="card-action-qty-num">{inCartQty}</span>
              <button
                type="button"
                className="card-action-btn-sm"
                aria-label="increase quantity"
                title="Increase"
                onClick={() => incrementItem(product)}
              >
                <ion-icon name="add-outline" aria-hidden="true"></ion-icon>
              </button>
            </li>
          ) : (
            <li>
              <button
                type="button"
                className="card-action-btn"
                aria-label="add to cart"
                title="Add to Cart"
                onClick={() => incrementItem(product)}
              >
                <ion-icon name="add-outline" aria-hidden="true"></ion-icon>
              </button>
            </li>
          )}

          <li>
            <button
              type="button"
              className="card-action-btn"
              aria-label="view details"
              title="Quick View"
              onClick={() => setSelectedProductForModal(product)}
            >
              <ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`card-action-btn ${isLiked ? 'liked' : ''}`}
              aria-label="add to wishlist"
              title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
              onClick={() => toggleWishlist(product)}
              style={isLiked ? { color: 'var(--red-orange-color-wheel)' } : {}}
            >
              <ion-icon
                name={isLiked ? 'heart' : 'heart-outline'}
                aria-hidden="true"
              ></ion-icon>
            </button>
          </li>
        </ul>

        {/* Discount / Promo Badges */}
        {product.badge && (
          <ul className="badge-list">
            <li>
              <div className={`badge ${product.badgeColor || 'orange'}`}>
                {product.badge}
              </div>
            </li>
          </ul>
        )}

        {/* In-cart Active Badge */}
        {inCartQty > 0 && (
          <div className="card-incart-badge" title={`${inCartQty} in shopping bag`}>
            <ion-icon name="bag-handle"></ion-icon>
            <span>{inCartQty} in bag</span>
          </div>
        )}

        {/* Out of stock badge */}
        {(product.cardBadge || product.inStock === false) && (
          <div className="card-badge">Out of Stock</div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="h3">
          <button
            type="button"
            className="card-title"
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', width: '100%', font: 'inherit' }}
            onClick={() => setSelectedProductForModal(product)}
          >
            {product.title}
          </button>
        </h3>

        <div className="card-price">
          {product.delPrice && (
            <del className="del">{formatNaira(product.delPrice)}</del>
          )}
          <data className="price" value={product.price}>
            {formatNaira(product.price)}
          </data>
        </div>
      </div>
    </div>
  );
};
