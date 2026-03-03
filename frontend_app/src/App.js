import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import { StoreProvider } from './state/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';

// PUBLIC_INTERFACE
function App() {
  /** This is a public function. */
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="kv-app">
          <Navbar />
          <CartDrawer />
          <Toast />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
