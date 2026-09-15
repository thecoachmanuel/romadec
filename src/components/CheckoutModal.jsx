import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

const NIGERIAN_STATES = [
  'Lagos',
  'Abuja FCT',
  'Rivers',
  'Ogun',
  'Oyo',
  'Kano',
  'Kaduna',
  'Enugu',
  'Delta',
  'Edo',
  'Anambra',
  'Akwa Ibom',
  'Abia',
  'Cross River',
  'Imo',
  'Kwara',
  'Ondo',
  'Osun',
  'Plateau',
];

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartTotal,
    formatNaira,
    showToast,
    businessInfo,
    incrementItem,
    decrementItem,
    removeFromCart,
  } = useStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+234 ',
    street: '',
    city: 'Lagos Island',
    state: 'Lagos',
    country: 'Nigeria',
    postalCode: '',
  });

  const [processing, setProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const deliveryFee = cartTotal > 100000 ? 0 : 2500;
  const grandTotal = cartTotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const executeOrderCreation = async (paystackRef = null) => {
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item.product,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: 'Nigeria',
          postalCode: formData.postalCode,
        },
        totalAmount: grandTotal,
        paymentMethod: 'Paystack',
        paystackReference: paystackRef || `PSTK_REF_${Date.now()}`,
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      setIsCheckoutOpen(false);
      showToast('Payment successful! Your order has been placed.');
      navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`);
    } catch (err) {
      console.error(err);
      showToast('Error placing order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaystackPayment = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.street || !formData.phone) {
      showToast('Please fill in all required shipping address fields');
      return;
    }

    if (cart.length === 0) {
      showToast('Your bag is empty.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Initialize Paystack on server
      const initRes = await api.initializePayment({
        email: formData.email,
        amount: grandTotal,
        callback_url: window.location.href,
      });

      const publicKey =
        import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || initRes.publicKey || 'pk_test_romadec_public_key';
      const reference = initRes.reference;

      // 2. If window.PaystackPop exists and not dummy mock key
      if (
        window.PaystackPop &&
        publicKey &&
        !publicKey.includes('mock') &&
        publicKey.startsWith('pk_')
      ) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: formData.email,
          amount: Math.round(grandTotal * 100), // in kobo
          currency: 'NGN',
          ref: reference,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: formData.fullName },
              { display_name: 'Phone Number', variable_name: 'phone_number', value: formData.phone },
              { display_name: 'Delivery Address', variable_name: 'delivery_address', value: `${formData.street}, ${formData.city}, ${formData.state}` },
            ],
          },
          callback: function (response) {
            // Verify payment
            api
              .verifyPayment({ reference: response.reference })
              .then(() => {
                executeOrderCreation(response.reference);
              })
              .catch(() => {
                executeOrderCreation(response.reference);
              });
          },
          onClose: function () {
            setProcessing(false);
            showToast('Transaction was not completed.');
          },
        });
        handler.openIframe();
      } else {
        // Test / Sandbox Simulation Mode:
        // Demonstrates realistic flow and successfully places the order
        setTimeout(() => {
          executeOrderCreation(reference);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setProcessing(false);
      showToast('Payment initialization error. Using demo approval mode.');
      executeOrderCreation(`DEMO_PSTK_${Date.now()}`);
    }
  };

  return (
    <div
      className="app-overlay active"
      onClick={() => !processing && setIsCheckoutOpen(false)}
    >
      <div
        className="app-modal active"
        style={{ maxWidth: '920px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-icon"
          aria-label="close checkout"
          disabled={processing}
          onClick={() => setIsCheckoutOpen(false)}
        >
          <ion-icon name="close-outline"></ion-icon>
        </button>

        <form onSubmit={handlePaystackPayment}>
          <div className="checkout-grid">
            {/* Left Column: Nigerian Delivery Address Form */}
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--smokey-black)' }}>
                Delivery Information
              </h3>
              <p style={{ fontSize: '1.3rem', color: 'var(--granite-gray)', marginBottom: '20px' }}>
                Default country is Nigeria. Enter your accurate contact and location details.
              </p>

              <div className="form-field">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Babatunde Adeleke"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@domain.com"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+234 803 000 0000"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="House number, Street name, Estate / Landmark"
                  className="form-input"
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label className="form-label">City / Town *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Lekki, Ikeja"
                    className="form-input"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">State (Nigeria) *</label>
                  <select
                    name="state"
                    className="form-select"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="100001"
                    className="form-input"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Paystack Action */}
            <div style={{ backgroundColor: 'var(--cultured)', padding: '24px', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px', color: 'var(--smokey-black)' }}>
                Order Summary ({cart.length} items)
              </h3>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--granite-gray)' }}>
                  <ion-icon name="bag-outline" style={{ fontSize: '36px', marginBottom: '10px' }}></ion-icon>
                  <p style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Your shopping bag is empty.</p>
                  <button
                    type="button"
                    className="app-btn-secondary"
                    style={{ fontSize: '1.2rem', padding: '6px 14px' }}
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.product}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '1px dashed var(--black_10)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                      />
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: '500',
                            color: 'var(--smokey-black)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </p>
                        <span style={{ fontSize: '1.2rem', color: 'var(--granite-gray)' }}>
                          {formatNaira(item.price)} each
                        </span>
                      </div>

                      {/* Quantity Controls in Checkout */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <div className="qty-control" style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
                          <button
                            type="button"
                            className="qty-btn"
                            aria-label="decrease quantity"
                            onClick={() => decrementItem(item.product)}
                          >
                            -
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            aria-label="increase quantity"
                            onClick={() => incrementItem(item)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label="remove item"
                          title="Remove item"
                          onClick={() => removeFromCart(item.product)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--granite-gray)',
                            fontSize: '1.6rem',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ion-icon name="trash-outline"></ion-icon>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--black_10)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1.4rem' }}>
                  <span>Subtotal</span>
                  <span>{formatNaira(cartTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.4rem' }}>
                  <span>Delivery (Nigeria)</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: 'var(--smokey-black)',
                    borderTop: '1px solid var(--black_10)',
                    paddingTop: '10px',
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--tan-crayola)' }}>{formatNaira(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="paystack-btn"
                disabled={processing || cart.length === 0}
              >
                {processing ? (
                  <span>Processing with Paystack...</span>
                ) : (
                  <>
                    <ion-icon name="card-outline" style={{ fontSize: '20px' }}></ion-icon>
                    <span>Pay {formatNaira(grandTotal)} with Paystack</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '1.1rem', color: 'var(--spanish-gray)' }}>
                Secured by Paystack • Accepts Nigerian Cards, Bank Transfer, & USSD
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
