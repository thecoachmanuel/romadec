import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductSection = () => {
  const {
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
  } = useStore();

  const categories = [
    { label: 'All Products', value: 'all' },
    { label: 'Furniture', value: 'furniture' },
    { label: 'Accessory', value: 'accessory' },
    { label: 'Decoration', value: 'decoration' },
  ];

  // Filter products by category and active search query
  const displayedProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="section product" id="product" aria-label="product">
      <div className="container">
        <div className="title-wrapper">
          <h2 className="h2 section-title">Popular Products</h2>

          <ul className="filter-btn-list">
            {categories.map((cat) => (
              <li key={cat.value} className="filter-btn-item">
                <button
                  className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {searchQuery.trim() && (
          <div style={{ marginBottom: '20px', fontSize: '1.4rem', color: 'var(--granite-gray)' }}>
            Showing results for "<strong>{searchQuery}</strong>" ({displayedProducts.length} items)
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '1.6rem', color: 'var(--granite-gray)' }}>
            Loading products...
          </div>
        ) : displayedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.6rem', color: 'var(--granite-gray)' }}>
            No products found matching your filter.
          </div>
        ) : (
          <ul className="grid-list product-list" data-filter={selectedCategory}>
            {displayedProducts.map((product) => (
              <li key={product._id || product.id} className={product.category}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
