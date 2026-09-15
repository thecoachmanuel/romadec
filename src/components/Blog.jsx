import React from 'react';

export const Blog = () => {
  const posts = [
    {
      id: 1,
      image: '/assets/images/blog-1.jpg',
      title: 'Unique products that will impress your home in 2026.',
      date: 'November 27, 2026',
      author: 'Admin',
      category: 'in deco',
    },
    {
      id: 2,
      image: '/assets/images/blog-2.jpg',
      title: 'Navy Blue & White Striped Area Rugs & Styling Tips',
      date: 'November 25, 2026',
      author: 'Admin',
      category: 'in interior',
    },
    {
      id: 3,
      image: '/assets/images/blog-3.jpg',
      title: 'Romadec White Coated Staircase Floating Architecture',
      date: 'November 18, 2026',
      author: 'Admin',
      category: 'in modern',
    },
  ];

  return (
    <section className="section blog" id="blog" aria-label="blog">
      <div className="container">
        <div className="title-wrapper">
          <h2 className="h2 section-title">Explore our blog</h2>

          <a href="#blog" className="btn-link">
            <span className="span">View All</span>
            <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
          </a>
        </div>

        <ul className="grid-list">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="blog-card">
                <div className="card-banner img-holder" style={{ '--width': 370, '--height': 250 }}>
                  <img
                    src={post.image}
                    width="370"
                    height="250"
                    loading="lazy"
                    alt={post.title}
                    className="img-cover"
                  />

                  <a href="#blog" className="card-btn">
                    <span className="span">Read more</span>
                    <ion-icon name="add-outline" aria-hidden="true"></ion-icon>
                  </a>
                </div>

                <div className="card-content">
                  <h3 className="h3">
                    <a href="#blog" className="card-title">
                      {post.title}
                    </a>
                  </h3>

                  <ul className="card-meta-list">
                    <li className="card-meta-item">
                      <time className="card-meta-text">{post.date}</time>
                    </li>

                    <li className="card-meta-item">
                      <span className="card-meta-text">{post.author}</span>
                    </li>

                    <li className="card-meta-item">
                      <span className="card-meta-text">{post.category}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
