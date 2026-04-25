/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssetProvider } from './context/AssetContext';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { InventoryProvider } from './context/InventoryContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import NotificationPanel from './components/NotificationPanel';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Market from './pages/Market';
import Shops from './pages/Shops';
import Analytics from './pages/Analytics';
import ConsumerProfile from './pages/consumer/ConsumerProfile';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorInventory from './pages/vendor/VendorInventory';
import VendorProfile from './pages/vendor/VendorProfile';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'consumer' | 'vendor' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'consumer' ? '/market' : '/vendor/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Root — Always show onboarding (prototype mode) */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={user?.role === 'consumer' ? '/market' : '/vendor/dashboard'} replace />
            : <Onboarding />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={user?.role === 'consumer' ? '/market' : '/vendor/dashboard'} replace />
            : <Login />
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          isAuthenticated
            ? <Navigate to={user?.role === 'consumer' ? '/market' : '/vendor/dashboard'} replace />
            : <Signup />
        }
      />

      {/* Consumer Routes */}
      <Route
        path="/market"
        element={
          <ProtectedRoute allowedRole="consumer">
            <Layout variant="consumer">
              <Market />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shops"
        element={
          <ProtectedRoute allowedRole="consumer">
            <Layout variant="consumer">
              <Shops />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRole="consumer">
            <Layout variant="consumer">
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="consumer">
            <Layout variant="consumer">
              <ConsumerProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <VendorDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/market"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <Market />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/shops"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <Shops />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/analytics"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/inventory"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <VendorInventory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/profile"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <VendorProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <AssetProvider>
              <WatchlistProvider>
                <NotificationProvider>
                  <InventoryProvider>
                    <AppRoutes />
                    <NotificationPanel />
                  </InventoryProvider>
                </NotificationProvider>
              </WatchlistProvider>
            </AssetProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}
