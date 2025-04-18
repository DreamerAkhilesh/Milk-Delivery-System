import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X, LogOut, User2, LayoutDashboard, Package, Users } from "lucide-react";
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
      setIsMenuOpen(false);
      setIsCartOpen(false);
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
      setIsMenuOpen(false);
      setIsCartOpen(false);
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
          {user?.role !== "admin" ? (
            <>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <User2 className="h-5 w-5" />
                <Link to="/profile" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                  My Profile
                </Link>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <Package className="h-5 w-5" />
                <Link to="/user/products" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                  My Products
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <LayoutDashboard className="h-5 w-5" />
                <Link to="/admin/dashboard" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <Package className="h-5 w-5" />
                <Link to="/admin/products" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                  Manage Products
                </Link>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                <Users className="h-5 w-5" />
                <Link to="/admin/users" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                  Manage Users
                </Link>
              </div>
            </>
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

  const renderMobileMenu = () => {
    return (
      <div className="md:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}></div>
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center p-4 border-b">
            <img src={logo} alt="Logo" className="h-8" />
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            {user?.role === "admin" ? (
              <>
                <Link to="/admin/dashboard" className="block py-2 text-gray-600 hover:text-gray-900">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </div>
                </Link>
                <Link to="/admin/products" className="block py-2 text-gray-600 hover:text-gray-900">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Manage Products
                  </div>
                </Link>
                <Link to="/admin/users" className="block py-2 text-gray-600 hover:text-gray-900">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Manage Users
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block py-2 text-gray-600 hover:text-gray-900">
                  <div className="flex items-center gap-2">
                    <User2 className="h-5 w-5" />
                    My Profile
                  </div>
                </Link>
                <Link to="/user/products" className="block py-2 text-gray-600 hover:text-gray-900">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Products
                  </div>
                </Link>
              </>
            )}
            <button onClick={handleLogout} className="w-full text-left py-2 text-gray-600 hover:text-gray-900">
              <div className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Logout
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user?.role === "admin" ? (
              <>
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Manage Products
                </Link>
                <Link to="/admin/users" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Manage Users
                </Link>
              </>
            ) : (
              <>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Products
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role !== "admin" && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Package className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                )}
                <Popover>
                  <PopoverTrigger>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                      <AvatarFallback className="bg-gray-200">
                        <User2 className="h-5 w-5 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  {renderPopoverContent()}
                </Popover>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-[#49BDE9] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3A9BC7]">
                  Sign Up
                </Link>
              </div>
            )}
            <button
              className="md:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && renderMobileMenu()}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
