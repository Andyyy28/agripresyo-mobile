/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssetProvider } from './context/AssetContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Market from './pages/Market';
import Budget from './pages/Budget';
import ConsumerProfile from './pages/consumer/ConsumerProfile';
import VendorInventory from './pages/vendor/VendorInventory';
import VendorNotifications from './pages/vendor/VendorNotifications';
import VendorProfile from './pages/vendor/VendorProfile';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'consumer' | 'vendor' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'consumer' ? '/market' : '/vendor/market'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={user?.role === 'consumer' ? '/market' : '/vendor/market'} replace />
            : <Login />
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
        path="/budget"
        element={
          <ProtectedRoute allowedRole="consumer">
            <Layout variant="consumer">
              <Budget />
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
        path="/vendor/notifications"
        element={
          <ProtectedRoute allowedRole="vendor">
            <Layout variant="vendor">
              <VendorNotifications />
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
      <AuthProvider>
        <AssetProvider>
          <AppRoutes />
        </AssetProvider>
      </AuthProvider>
    </Router>
  );
}
