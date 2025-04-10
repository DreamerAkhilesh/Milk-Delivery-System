import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/HomePage/Home'
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/ProfilePage/profile';
import ProductPage from './components/ProductPage/ProductPage';
import Dashboard from './components/Dashboard/Dashboard';
import AdminProductPage from './components/ProductPage/ProductPageAdmin';
import UserManagement from './components/UserManagement/UserManagement';
import AdminLogin from './components/auth/AdminLogin';
import AdminRegister from './components/auth/AdminRegister';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/admin/login" />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/products" element={<AdminProductPage />} />
      <Route path="/admin/users" element={<UserManagement />} />
      
      {/* User Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<ProductPage />} />
    </Routes>
  );
}

export default App
