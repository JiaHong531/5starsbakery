import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
