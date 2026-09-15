import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { ProductSection } from '../components/ProductSection';
import { Blog } from '../components/Blog';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { Toast } from '../components/Toast';

export const HomePage = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <main>
        <article>
          <Hero />
          <About />
          <ProductSection />
          <Blog />
          <Newsletter />
        </article>
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <Toast />
    </>
  );
};
