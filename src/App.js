import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ProductDetails from './pages/productDetails';
import './index.css';
import Login from './pages/login';
import StoreKeeper from './pages/view-products';
import Manager from './pages/dashboard';
import ProtectedRoute from './widgets/protectedRoutes';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  function ProtectedRoute({ children, allowDashboard = false }) {
    const userRole = localStorage.getItem('role');
  
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }
  
    // Block store-keeper from accessing dashboard
    if (!allowDashboard && window.location.pathname === '/dashboard' && userRole !== 'manager') {
      return <Navigate to="/home" replace />;
    }
  
    return children;
  }  

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <StoreKeeper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowDashboard={true}>
              <Manager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
