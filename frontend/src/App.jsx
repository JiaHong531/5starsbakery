import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminOrders from './pages/AdminOrders';
import ManageCategories from './pages/ManageCategories';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="about" element={<About />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/add-product" element={<ProductForm />} />
        <Route path="admin/edit-product/:id" element={<ProductForm />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="my-orders" element={<OrderHistory />} />
        <Route path="admin/orders" element={<AdminOrders />} />
        <Route path="admin/categories" element={<ManageCategories />} />
      </Route>
    </Routes>
  );
}

export default App;