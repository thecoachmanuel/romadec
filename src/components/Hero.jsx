import React from 'react';
import { useStore } from '../context/StoreContext';

export const Hero = () => {
  const { setSelectedCategory, products, setSelectedProductForModal } = useStore();

  const handleHeroClick = (title, defaultCategory) => {
    const matched = products.find((p) => p.title.toLowerCase() === title.toLowerCase());
    if (matched) {
      setSelectedProductForModal(matched);
    } else {
      setSelectedCategory(defaultCategory);
      const productSection = document.getElementById('product');
      if (productSection) productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section hero" id="home" aria-label="home">
      <div className="container">
        <ul className="hero-list">
          {/* Card 1 */}
          <li>
            <div
              className="hero-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleHeroClick('Art Deco Home', 'accessory')}
            >
              <figure className="card-banner img-holder" style={{ '--width': 285, '--height': 396 }}>
                <img
                  src="/assets/images/hero-product-1.jpg"
                  width="285"
                  height="396"
                  alt="Art Deco Home"
                  className="img-cover"
                />
              </figure>

              <div className="card-content">
                <h3>
                  <span className="card-title">Art Deco Home</span>
                </h3>
                <p className="card-text">Decoration</p>
              </div>
            </div>
          </li>

          {/* Card 2 */}
          <li className="colspan-2">
            <div
              className="hero-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleHeroClick('Helen Chair', 'furniture')}
            >
              <figure className="card-banner img-holder" style={{ '--width': 568, '--height': 389 }}>
                <img
                  src="/assets/images/hero-product-2.jpg"
                  width="568"
                  height="389"
                  alt="Helen Chair"
                  className="img-cover"
                />
              </figure>

              <div className="card-content">
                <h3>
                  <span className="card-title">Helen Chair</span>
                </h3>
                <p className="card-text">Furniture</p>
              </div>
            </div>
          </li>

          {/* Card 3 */}
          <li>
            <div
              className="hero-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleHeroClick('Vase Of Flowers', 'decoration')}
            >
              <figure className="card-banner img-holder" style={{ '--width': 285, '--height': 396 }}>
                <img
                  src="/assets/images/hero-product-3.jpg"
                  width="285"
                  height="396"
                  alt="Vase Of Flowers"
                  className="img-cover"
                />
              </figure>

              <div className="card-content">
                <h3>
                  <span className="card-title">Vase Of Flowers</span>
                </h3>
                <p className="card-text">Decoration</p>
              </div>
            </div>
          </li>

          {/* Card 4 */}
          <li className="colspan-2">
            <div
              className="hero-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleHeroClick('Wood Eggs', 'decoration')}
            >
              <figure className="card-banner img-holder" style={{ '--width': 580, '--height': 213 }}>
                <img
                  src="/assets/images/hero-product-4.jpg"
                  width="580"
                  height="213"
                  alt="Wood Eggs"
                  className="img-cover"
                />
              </figure>

              <div className="card-content">
                <h3>
                  <span className="card-title">Wood Eggs</span>
                </h3>
                <p className="card-text">Decoration</p>
              </div>
            </div>
          </li>

          {/* Card 5 */}
          <li className="colspan-2">
            <div
              className="hero-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleHeroClick('Table Wood Pine', 'furniture')}
            >
              <figure className="card-banner img-holder" style={{ '--width': 580, '--height': 213 }}>
                <img
                  src="/assets/images/hero-product-5.jpg"
                  width="580"
                  height="213"
                  alt="Table Wood Pine"
                  className="img-cover"
                />
              </figure>

              <div className="card-content">
                <h3>
                  <span className="card-title">Table Wood Pine</span>
                </h3>
                <p className="card-text">Furniture</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
