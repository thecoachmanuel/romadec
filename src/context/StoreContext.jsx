import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Drawers and Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('romadec_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('romadec_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Business Info
  const [businessInfo, setBusinessInfo] = useState({
    storeName: 'Romadec Stores',
    shortName: 'Romadec',
    tagline: 'Get Quality Furniture',
    email: 'support@romadec.com',
    phone: '+234 (0) 808 760 8827',
    address: '93 Olojo Drive, Ojo, Lagos, Nigeria',
    city: 'Victoria Island, Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    aboutText:
      'When you start with a portrait and search for a pure form, a clear volume, through successive eliminations, you arrive inevitably at the egg. Likewise, starting with the egg and following the same process in reverse, one finishes with the portrait.',
    socialLinks: {
      facebook: 'https://facebook.com/romadec',
      twitter: 'https://twitter.com/romadec',
      instagram: 'https://instagram.com/romadec',
    },
  });

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('romadec_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('romadec_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Load Products & Business Info
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [prodsData, bizData] = await Promise.allSettled([
        api.getProducts(),
        api.getBusinessInfo(),
      ]);

      if (prodsData.status === 'fulfilled' && Array.isArray(prodsData.value)) {
        setProducts(prodsData.value);
      }
      if (bizData.status === 'fulfilled' && bizData.value) {
        setBusinessInfo(bizData.value);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Real-time Search Filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
    setSearchResults(matches);
  }, [searchQuery, products]);

  // Cart Operations
  const getItemQuantity = (productId) => {
    if (!productId) return 0;
    const item = cart.find((i) => String(i.product) === String(productId));
    return item ? item.quantity : 0;
  };

  const addToCart = (product, quantity = 1) => {
    if (product.inStock === false || product.stockQuantity === 0) {
      showToast('Sorry, this product is currently out of stock!');
      return;
    }
    const prodId = product._id || product.id || product.product;
    setCart((prev) => {
      const existing = prev.find((item) => String(item.product) === String(prodId));
      if (existing) {
        return prev.map((item) =>
          String(item.product) === String(prodId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product: prodId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
    showToast(`Added "${product.title}" to cart`);
  };

  const incrementItem = (product) => {
    if (product.inStock === false || product.stockQuantity === 0) {
      showToast('Sorry, this product is currently out of stock!');
      return;
    }
    const prodId = product._id || product.id || product.product;
    setCart((prev) => {
      const existing = prev.find((item) => String(item.product) === String(prodId));
      if (existing) {
        return prev.map((item) =>
          String(item.product) === String(prodId)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product: prodId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    showToast(`Updated "${product.title}" quantity`);
  };

  const decrementItem = (productOrId) => {
    const prodId =
      typeof productOrId === 'object'
        ? productOrId._id || productOrId.id || productOrId.product
        : productOrId;

    setCart((prev) => {
      const existing = prev.find((item) => String(item.product) === String(prodId));
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => String(item.product) !== String(prodId));
      }
      return prev.map((item) =>
        String(item.product) === String(prodId)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
    showToast('Updated item quantity');
  };

  const setItemQuantity = (product, newQuantity) => {
    const prodId = product._id || product.id || product.product;
    if (newQuantity <= 0) {
      removeFromCart(prodId);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => String(item.product) === String(prodId));
      if (existing) {
        return prev.map((item) =>
          String(item.product) === String(prodId)
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product: prodId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: newQuantity,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => String(item.product) !== String(productId)));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.product) === String(productId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist Operations
  const toggleWishlist = (product) => {
    const prodId = product._id || product.id;
    const exists = wishlist.some((item) => (item._id || item.id) === prodId);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== prodId));
      showToast(`Removed "${product.title}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.title}" to wishlist`);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  // Currency Formatter: Nigerian Naira (₦)
  const formatNaira = (val) => {
    const num = Number(val || 0);
    return `₦${num.toLocaleString('en-NG')}`;
  };

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshBusinessInfo = async () => {
    try {
      const data = await api.getBusinessInfo();
      setBusinessInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        loading,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        searchResults,
        cart,
        addToCart,
        incrementItem,
        decrementItem,
        setItemQuantity,
        getItemQuantity,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        businessInfo,
        formatNaira,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        isSidebarOpen,
        setIsSidebarOpen,
        toast,
        showToast,
        refreshProducts,
        refreshBusinessInfo,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
