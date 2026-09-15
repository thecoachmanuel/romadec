import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const About = () => {
  const { businessInfo } = useStore();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <section className="section about" id="about" aria-label="about">
        <div className="container">
          <h2 className="section-title">{businessInfo.storeName || 'Romadec Stores'}</h2>

          <p className="section-text">
            {businessInfo.aboutText ||
              'Modern & Luxury Turkish Furniture. Timeless designs to suit any style of interior design. Worldwide Delivery. Est. in 1994.'}
          </p>

          <div className="about-card">
            <figure className="card-banner img-holder" style={{ '--width': 1170, '--height': 450 }}>
              <img
                src="/assets/images/about-banner.jpg"
                width="1170"
                height="450"
                loading="lazy"
                alt={`${businessInfo.storeName || 'Romadec'} showroom promo`}
                className="img-cover"
              />
            </figure>

            <button
              className="play-btn"
              aria-label="play video"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <ion-icon name="play-circle-outline" aria-hidden="true"></ion-icon>
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="app-overlay active" onClick={() => setIsVideoModalOpen(false)}>
          <div
            className="app-modal active"
            style={{ maxWidth: '800px', padding: '15px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              aria-label="close video"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                title="Romadec Stores Showroom"
                src="https://www.youtube-nocookie.com/embed/NK8Cif0dAoM?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                  borderRadius: '6px',
                }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
