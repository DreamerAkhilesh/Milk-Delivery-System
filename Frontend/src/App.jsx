import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import store from './redux/store';
import Home from './components/HomePage/Home';
import ProductPage from './components/ProductPage/ProductPage';
import ProductDetail from './components/ProductPage/ProductDetail';
import Contacts from './components/Contacts/Contacts';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/ProfilePage/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import AdminProductPage from './components/ProductPage/ProductPageAdmin';
import UserManagement from './components/UserManagement/UserManagement';
import AdminLogin from './components/auth/AdminLogin';
import AdminRegister from './components/auth/AdminRegister';
import AboutUs from './components/AboutUs/AboutUs';
import AgentDashboard from './components/LiveChat/AgentDashboard';
import SubscriptionConfirm from './components/Subscription/SubscriptionConfirm';
import { ErrorBoundary } from 'react-error-boundary';

// Route Protection Components
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm text-gray-600 mb-4">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-[#49BDE9] text-white rounded-md hover:bg-[#3A9BC7] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contacts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products" element={<ProductPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Protected User Routes */}
            <Route path="/user/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/subscription/confirm" element={
              <ProtectedRoute>
                <SubscriptionConfirm />
              </ProtectedRoute>
            } />
            <Route path="/user/products" element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProductPage />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/chat" element={
              <AdminRoute>
                <AgentDashboard />
              </AdminRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
                <a 
                  href="/" 
                  className="inline-block px-6 py-2 bg-[#49BDE9] text-white rounded-md hover:bg-[#3A9BC7] transition-colors"
                >
                  Return Home
                </a>
              </div>
            } />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
