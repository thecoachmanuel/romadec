import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminProducts = () => {
  const { products, refreshProducts, formatNaira, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    title: '',
    category: 'decoration',
    price: '',
    delPrice: '',
    image: '/assets/images/product-1.jpg',
    stockQuantity: 20,
    inStock: true,
    badge: '',
    badgeColor: 'orange',
    description: '',
    dimensions: 'Standard',
    material: 'Wood / Fabric / Glass',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setFormData({
      title: product.title || '',
      category: product.category || 'decoration',
      price: product.price || '',
      delPrice: product.delPrice || '',
      image: product.image || '/assets/images/product-1.jpg',
      stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 10,
      inStock: product.inStock !== undefined ? product.inStock : true,
      badge: product.badge || '',
      badgeColor: product.badgeColor || 'orange',
      description: product.description || '',
      dimensions: product.dimensions || 'Standard',
      material: product.material || 'Standard Material',
    });
    setEditingProduct(product);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setFormData((prev) => ({ ...prev, image: dataUrl }));
        showToast(`Loaded "${file.name}" successfully!`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProduct) {
        // Update product
        await api.updateProduct(editingProduct._id || editingProduct.id, formData);
        showToast(`Updated product "${formData.title}"`);
        setEditingProduct(null);
      } else {
        // Create product
        await api.createProduct(formData);
        showToast(`Created new product "${formData.title}"`);
        setIsAddModalOpen(false);
      }
      await refreshProducts();
    } catch (err) {
      console.error(err);
      showToast('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setSubmitting(true);
    try {
      await api.deleteProduct(deletingProduct._id || deletingProduct.id);
      showToast(`Deleted "${deletingProduct.title}"`);
      setDeletingProduct(null);
      await refreshProducts();
    } catch (err) {
      console.error(err);
      showToast('Error deleting product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStock = async (product) => {
    const newStatus = !product.inStock;
    try {
      await api.updateProduct(product._id || product.id, {
        inStock: newStatus,
        stockQuantity: newStatus ? (product.stockQuantity > 0 ? product.stockQuantity : 10) : 0,
        cardBadge: newStatus ? null : 'Out of Stock',
      });
      showToast(`Updated stock status for "${product.title}"`);
      await refreshProducts();
    } catch (err) {
      console.error(err);
      showToast('Error updating stock status');
    }
  };

  // Real-time table filter
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--smokey-black)', marginBottom: '6px' }}>
            Product Catalog Management
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
            Manage inventory, edit Nigerian Naira pricing, and create new store products.
          </p>
        </div>

        <button
          type="button"
          className="app-btn-primary"
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          onClick={handleOpenAdd}
        >
          <ion-icon name="add-circle-outline" style={{ fontSize: '20px' }}></ion-icon>
          Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="admin-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center',
          padding: '16px 20px',
        }}
      >
        <div style={{ flexGrow: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search products in catalog..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="furniture">Furniture</option>
            <option value="accessory">Accessory</option>
            <option value="decoration">Decoration</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price (NGN)</th>
                <th>Discount Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id || p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{
                          width: '45px',
                          height: '45px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          backgroundColor: 'var(--cultured)',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>{p.title}</div>
                        {p.badge && (
                          <span
                            style={{
                              fontSize: '1rem',
                              backgroundColor:
                                p.badgeColor === 'cyan'
                                  ? 'var(--middle-blue-green)'
                                  : 'var(--red-orange-color-wheel)',
                              color: 'var(--white)',
                              padding: '1px 6px',
                              borderRadius: '3px',
                            }}
                          >
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                  <td style={{ fontWeight: '700', color: 'var(--tan-crayola)' }}>
                    {formatNaira(p.price)}
                  </td>
                  <td style={{ color: 'var(--spanish-gray)' }}>
                    {p.delPrice ? formatNaira(p.delPrice) : '—'}
                  </td>
                  <td>{p.stockQuantity !== undefined ? p.stockQuantity : 'N/A'}</td>
                  <td>
                    <button
                      type="button"
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        backgroundColor: p.inStock ? '#e6f7ef' : '#fde8e8',
                        color: p.inStock ? '#0ba360' : '#e03131',
                        fontWeight: '500',
                      }}
                      onClick={() => handleToggleStock(p)}
                      title="Click to toggle stock status"
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="action-btn-icon"
                        title="Edit Product"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <ion-icon name="create-outline"></ion-icon>
                      </button>

                      <button
                        type="button"
                        className="action-btn-icon delete"
                        title="Delete Product"
                        onClick={() => setDeletingProduct(p)}
                      >
                        <ion-icon name="trash-outline"></ion-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div
          className="app-overlay active"
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
        >
          <div
            className="app-modal active admin-modal-body"
            style={{ maxWidth: '680px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              aria-label="close modal"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--smokey-black)' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div className="form-field">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Modern Mahogany Dining Chair"
                  className="form-input"
                  value={formData.title}
                  onChange={handleFormChange}
                />
              </div>

              {/* Local Image Upload & URL Field */}
              <div className="form-field">
                <label className="form-label">Product Image *</label>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <label
                    htmlFor="product-local-file-input"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--cultured)',
                      border: '1px dashed var(--tan-crayola)',
                      color: 'var(--smokey-black)',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1.3rem',
                      fontWeight: '500',
                      transition: 'var(--transition-1)',
                    }}
                  >
                    <ion-icon name="cloud-upload-outline" style={{ fontSize: '20px', color: 'var(--tan-crayola)' }}></ion-icon>
                    <span>Upload Local Image (Device)</span>
                  </label>
                  <input
                    id="product-local-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.2rem', color: 'var(--granite-gray)' }}>
                    or paste image path / URL below
                  </span>
                </div>

                <input
                  type="text"
                  name="image"
                  required
                  placeholder="e.g. /assets/images/product-1.jpg or choose local image above"
                  className="form-input"
                  value={formData.image}
                  onChange={handleFormChange}
                />

                {/* Live Image Preview */}
                {formData.image && (
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: 'var(--cultured)',
                      borderRadius: '6px',
                      border: '1px solid var(--black_10)',
                    }}
                  >
                    <img
                      src={formData.image}
                      alt="Product preview"
                      style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '1.2rem', color: '#0ba360', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ion-icon name="checkmark-circle"></ion-icon> Image Ready
                      </span>
                      <span style={{ fontSize: '1.1rem', color: 'var(--granite-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {formData.image.startsWith('data:') ? 'Local file uploaded' : formData.image}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="clear image"
                      title="Clear image"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      style={{ color: 'var(--red-orange-color-wheel)', fontSize: '1.8rem', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                  </div>
                )}
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    <option value="accessory">Accessory</option>
                    <option value="decoration">Decoration</option>
                    <option value="furniture">Furniture</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Material</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="e.g. Solid Turkish Oak / Ceramic"
                    className="form-input"
                    value={formData.material}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="form-label">Price in Naira (₦) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="e.g. 45000"
                    className="form-input"
                    value={formData.price}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Discount / Strikethrough Price (₦)</label>
                  <input
                    type="number"
                    name="delPrice"
                    placeholder="e.g. 60000"
                    className="form-input"
                    value={formData.delPrice}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    className="form-input"
                    value={formData.stockQuantity}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Promo Badge</label>
                  <input
                    type="text"
                    name="badge"
                    placeholder="Sale or -15%"
                    className="form-input"
                    value={formData.badge}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Badge Color</label>
                  <select
                    name="badgeColor"
                    className="form-select"
                    value={formData.badgeColor}
                    onChange={handleFormChange}
                  >
                    <option value="orange">Orange (Sale)</option>
                    <option value="cyan">Cyan (Discount)</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-textarea"
                  placeholder="Describe the product materials, finish, and features..."
                  value={formData.description}
                  onChange={handleFormChange}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="app-btn-secondary"
                  style={{ width: 'auto', minWidth: '100px', padding: '10px 20px', margin: 0 }}
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="app-btn-primary"
                  style={{ width: 'auto', minWidth: '140px', padding: '10px 25px' }}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="app-overlay active" onClick={() => setDeletingProduct(null)}>
          <div
            className="app-modal active admin-modal-body"
            style={{ maxWidth: '460px', width: '92%', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#fde8e8',
                color: 'var(--red-orange-color-wheel)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto',
                fontSize: '32px',
              }}
            >
              <ion-icon name="warning-outline"></ion-icon>
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px', color: 'var(--smokey-black)' }}>
              Confirm Product Deletion
            </h3>
            <p style={{ fontSize: '1.4rem', color: 'var(--granite-gray)', marginBottom: '25px' }}>
              Are you sure you want to delete "<strong>{deletingProduct.title}</strong>"? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="app-btn-secondary"
                style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
                onClick={() => setDeletingProduct(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                style={{
                  backgroundColor: 'var(--red-orange-color-wheel)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 24px',
                  fontSize: '1.4rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
                disabled={submitting}
                onClick={handleDeleteProduct}
              >
                {submitting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
