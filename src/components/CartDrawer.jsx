import React from 'react';
import { useStore } from '../context/StoreContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    formatNaira,
    setIsCheckoutOpen,
  } = useStore();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div
        className={`app-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className={`app-drawer ${isCartOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">
            <ion-icon name="bag-handle-outline"></ion-icon>
            Shopping Bag ({cartCount})
          </h2>
          <button
            className="drawer-close-btn"
            aria-label="close cart"
            onClick={() => setIsCartOpen(false)}
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--granite-gray)' }}>
              <ion-icon name="bag-outline" style={{ fontSize: '48px', marginBottom: '15px' }}></ion-icon>
              <p style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Your bag is currently empty.</p>
              <button
                type="button"
                className="app-btn-secondary"
                onClick={() => setIsCartOpen(false)}
              >
                Discover Furniture & Decor
              </button>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.product} className="cart-item-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <p className="cart-item-price">{formatNaira(item.price)}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="qty-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="item-remove-btn"
                        aria-label="remove item"
                        onClick={() => removeFromCart(item.product)}
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

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span style={{ fontWeight: '700', color: 'var(--smokey-black)' }}>{formatNaira(cartTotal)}</span>
            </div>
            <div className="cart-summary-row" style={{ fontSize: '1.2rem', color: 'var(--spanish-gray)' }}>
              <span>Delivery:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total:</span>
              <span style={{ color: 'var(--tan-crayola)' }}>{formatNaira(cartTotal)}</span>
            </div>

            <button
              type="button"
              className="app-btn-primary"
              style={{ marginTop: '15px' }}
              onClick={handleCheckoutClick}
            >
              Checkout Now ({formatNaira(cartTotal)})
            </button>

            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--spanish-gray)',
                fontSize: '1.2rem',
                width: '100%',
                marginTop: '10px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};
