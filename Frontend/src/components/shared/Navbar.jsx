import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X, LogOut, User2 } from "lucide-react";
import axios from "axios";
import { logoutUser } from "../../redux/authSlice";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { USER_API_END_POINT, ADMIN_API_END_POINT } from "../../utils/constant";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../ui/popover";
import { useCart } from '../../context/CartContext';
import CartSidebar from '../Cart/CartSidebar';
import logo from '../../assets/logo1.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      const apiEndpoint = user?.role === "admin" ? ADMIN_API_END_POINT : USER_API_END_POINT;
      
      const res = await axios.get(`${apiEndpoint}/logout`, {
        withCredentials: true,
        headers: {
          Authorization: user?.role === "admin" ? 
            localStorage.getItem("adminToken") : 
            localStorage.getItem("token")
        }
      });

      if (user?.role === "admin") {
        localStorage.removeItem("adminToken");
      } else {
        localStorage.removeItem("token");
      }

      dispatch(logoutUser());
      navigate("/home");
      toast.success(res.data.message || "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
      
      dispatch(logoutUser());
      if (user?.role === "admin") {
        localStorage.removeItem("adminToken");
      } else {
        localStorage.removeItem("token");
      }
      navigate("/home");
    }
  };

  const renderPopoverContent = () => {
    return (
      <PopoverContent className="w-64">
        <div className="flex items-center space-x-3 p-2">
          <Avatar>
            <AvatarImage
              src={user?.profile?.profilePhoto}
              alt="Profile"
            />
            <AvatarFallback className="bg-gray-200">
              <User2 className="h-5 w-5 text-gray-600" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-700">{user?.name || "User"}</span>
        </div>
        <div className="mt-4 text-gray-600">
          {user?.role !== "admin" && (
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <User2 className="h-5 w-5" />
              <Link to="/profile" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                My Profile
              </Link>
            </div>
          )}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <LogOut className="h-5 w-5" />
            <button onClick={handleLogout} className="flex-grow text-left text-gray-600 hover:text-gray-900 bg-transparent border-none p-0 m-0 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </PopoverContent>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Milk Delivery Logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[#49BDE9]">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-[#49BDE9]">
              Products
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-[#49BDE9]">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-[#49BDE9]">
              Contact
            </Link>
            
            {/* Cart Icon - Only show for logged-in users with user role */}
            {user && user.role !== "admin" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-[#49BDE9]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#49BDE9] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer h-8 w-8">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-gray-200">
                        <User2 className="h-4 w-4 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  {renderPopoverContent()}
                </Popover>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-[#49BDE9] px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#49BDE9] text-white px-4 py-2 rounded-md hover:bg-[#3A9BC7]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#49BDE9]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
            >
              Contact
            </Link>
            {/* Cart in mobile menu - Only show for logged-in users with user role */}
            {user && user.role !== "admin" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
              >
                Cart ({totalItems})
              </button>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-gray-600 hover:text-[#49BDE9]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
