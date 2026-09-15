import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const About = () => {
  const { businessInfo, isAdminLoggedIn } = useStore();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Helper to convert YouTube watch/short link to embed link
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  const videoEmbedUrl = getEmbedUrl(businessInfo.videoUrl);

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
            style={{ maxWidth: '750px', width: '92%', padding: videoEmbedUrl ? '15px' : '30px 20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              aria-label="close video"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>

            {videoEmbedUrl ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  title="Romadec Stores Showroom"
                  src={videoEmbedUrl}
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
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <ion-icon
                  name="videocam-outline"
                  style={{ fontSize: '56px', color: 'var(--tan-crayola)', marginBottom: '14px' }}
                ></ion-icon>
                <h3 style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--smokey-black)', marginBottom: '10px' }}>
                  Showroom Video Coming Soon
                </h3>
                <p style={{ fontSize: '1.4rem', color: 'var(--granite-gray)', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
                  Our brand new Turkish furniture showroom tour video will be available soon.
                </p>
                {isAdminLoggedIn && (
                  <Link
                    to="/admin"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--tan-crayola)',
                      color: 'var(--white)',
                      padding: '10px 18px',
                      borderRadius: '4px',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                    }}
                    onClick={() => setIsVideoModalOpen(false)}
                  >
                    <ion-icon name="settings-outline"></ion-icon>
                    Set Video Link in Admin Settings
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
