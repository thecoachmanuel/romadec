import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { Toast } from '../components/Toast';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    formatNaira,
    addToCart,
    incrementItem,
    decrementItem,
    getItemQuantity,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
  } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchItem = async () => {
      try {
        setLoading(true);
        // Try finding in products context first
        const local = products.find((p) => String(p._id) === String(id) || p.slug === id);
        if (local) {
          setProduct(local);
        } else {
          const remote = await api.getProduct(id);
          setProduct(remote);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, products]);

  if (loading) {
    return (
      <>
        <Header />
        <Sidebar />
        <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.6rem' }}>
          Loading product...
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Sidebar />
        <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.6rem' }}>
          Product not found.{' '}
          <button
            type="button"
            className="app-btn-secondary"
            style={{ width: 'auto', display: 'inline-block', margin: '20px auto 0' }}
            onClick={() => navigate('/')}
          >
            Back to Store
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const isLiked = isInWishlist(product._id || product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && (p._id || p.id) !== (product._id || product.id))
    .slice(0, 4);

  return (
    <>
      <Header />
      <Sidebar />

      <main style={{ padding: '60px 0', backgroundColor: 'var(--cultured)' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              marginBottom: '50px',
            }}
          >
            <div className="modal-content-grid" style={{ padding: '40px' }}>
              <div className="modal-img-holder">
                <img src={product.image} alt={product.title} />
              </div>

              <div>
                <span className="modal-category-tag">{product.category}</span>
                <h1 className="modal-title">{product.title}</h1>

                <div className="modal-price-wrap">
                  <span className="modal-current-price">{formatNaira(product.price)}</span>
                  {product.delPrice && (
                    <span className="modal-del-price">{formatNaira(product.delPrice)}</span>
                  )}
                  {product.inStock === false ? (
                    <span style={{ color: 'var(--red-orange-color-wheel)', fontWeight: 'bold' }}>
                      (Out of Stock)
                    </span>
                  ) : (
                    <span style={{ color: '#0ba360', fontWeight: 'bold' }}>
                      (In Stock)
                    </span>
                  )}
                </div>

                <p className="modal-desc">
                  {product.description ||
                    'Contemporary luxury architectural furniture piece handcrafted for timeless beauty and enduring comfort.'}
                </p>

                <table className="modal-meta-table">
                  <tbody>
                    <tr>
                      <td>Dimensions:</td>
                      <td>{product.dimensions || 'Standard'}</td>
                    </tr>
                    <tr>
                      <td>Material:</td>
                      <td>{product.material || 'Solid Oak / Glass / Ceramic'}</td>
                    </tr>
                    <tr>
                      <td>Delivery:</td>
                      <td>Fast nationwide dispatch across Nigeria</td>
                    </tr>
                  </tbody>
                </table>

                {product.inStock !== false && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '500' }}>Quantity:</span>
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="decrease quantity"
                        onClick={() => {
                          const inCart = getItemQuantity(product._id || product.id);
                          if (inCart > 0) {
                            decrementItem(product._id || product.id);
                          } else {
                            setLocalQuantity((q) => Math.max(1, q - 1));
                          }
                        }}
                      >
                        -
                      </button>
                      <span className="qty-number">
                        {getItemQuantity(product._id || product.id) > 0
                          ? getItemQuantity(product._id || product.id)
                          : localQuantity}
                      </span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="increase quantity"
                        onClick={() => {
                          const inCart = getItemQuantity(product._id || product.id);
                          if (inCart > 0) {
                            incrementItem(product);
                          } else {
                            setLocalQuantity((q) => q + 1);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>

                    {getItemQuantity(product._id || product.id) > 0 && (
                      <span style={{ fontSize: '1.2rem', color: 'var(--tan-crayola)', fontWeight: '500' }}>
                        ({getItemQuantity(product._id || product.id)} in bag)
                      </span>
                    )}

                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: '1px solid var(--black_25)',
                        borderRadius: '4px',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontSize: '1.3rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: isLiked ? 'var(--red-orange-color-wheel)' : 'var(--granite-gray)',
                      }}
                      onClick={() => toggleWishlist(product)}
                    >
                      <ion-icon name={isLiked ? 'heart' : 'heart-outline'}></ion-icon>
                      {isLiked ? 'Saved' : 'Wishlist'}
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    className="app-btn-primary"
                    disabled={product.inStock === false}
                    onClick={() => {
                      const inCart = getItemQuantity(product._id || product.id);
                      if (inCart > 0) {
                        incrementItem(product);
                      } else {
                        addToCart(product, localQuantity);
                      }
                    }}
                  >
                    {product.inStock === false
                      ? 'Out of Stock'
                      : getItemQuantity(product._id || product.id) > 0
                      ? `In Bag (${getItemQuantity(product._id || product.id)}) • Add More`
                      : 'Add to Cart'}
                  </button>

                  {product.inStock !== false && (
                    <button
                      type="button"
                      className="app-btn-secondary"
                      onClick={() => {
                        const inCart = getItemQuantity(product._id || product.id);
                        if (inCart === 0) {
                          addToCart(product, localQuantity);
                        }
                        setIsCheckoutOpen(true);
                      }}
                    >
                      Buy Now (Pay with Paystack)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '700', marginBottom: '25px', color: 'var(--smokey-black)' }}>
                Related {product.category} Products
              </h2>
              <ul className="grid-list">
                {relatedProducts.map((rel) => (
                  <li key={rel._id || rel.id}>
                    <ProductCard product={rel} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <Toast />
    </>
  );
};
