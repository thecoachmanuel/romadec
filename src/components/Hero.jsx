import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';

export const Hero = () => {
  const { setSelectedCategory, products, setSelectedProductForModal } = useStore();

  const heroSlides = [
    {
      id: 1,
      title: 'Helen Chair',
      category: 'furniture',
      image: '/assets/images/hero-product-2.jpg',
      aspectRatio: '568 / 389',
    },
    {
      id: 2,
      title: 'Art Deco Home',
      category: 'accessory',
      image: '/assets/images/hero-product-1.jpg',
      aspectRatio: '568 / 389',
    },
    {
      id: 3,
      title: 'Table Wood Pine',
      category: 'furniture',
      image: '/assets/images/hero-product-5.jpg',
      aspectRatio: '568 / 389',
    },
    {
      id: 4,
      title: 'Vase Of Flowers',
      category: 'decoration',
      image: '/assets/images/hero-product-3.jpg',
      aspectRatio: '568 / 389',
    },
    {
      id: 5,
      title: 'Wood Eggs',
      category: 'decoration',
      image: '/assets/images/hero-product-4.jpg',
      aspectRatio: '568 / 389',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

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
        {/* Mobile Hero Slider (< 768px) */}
        <div
          className="hero-mobile-slider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="hero-slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="hero-slide-item"
                onClick={() => handleHeroClick(slide.title, slide.category)}
              >
                <div className="hero-card mobile-card">
                  <figure className="card-banner img-holder">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="img-cover"
                    />
                  </figure>

                  <div className="card-content">
                    <h3>
                      <span className="card-title">{slide.title}</span>
                    </h3>
                    <p className="card-text" style={{ textTransform: 'capitalize' }}>
                      {slide.category}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Arrow Controls */}
          <button
            type="button"
            className="slider-arrow prev"
            aria-label="Previous Slide"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSlide();
            }}
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <button
            type="button"
            className="slider-arrow next"
            aria-label="Next Slide"
            onClick={(e) => {
              e.stopPropagation();
              handleNextSlide();
            }}
          >
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>

          {/* Pagination Indicator Dots */}
          <div className="slider-dots">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
              ></button>
            ))}
          </div>
        </div>

        {/* Desktop Hero Grid (>= 768px) */}
        <ul className="hero-list desktop-hero">
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
