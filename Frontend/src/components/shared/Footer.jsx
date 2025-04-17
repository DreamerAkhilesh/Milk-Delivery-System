import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, User, Package, ShoppingCart, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo1.png';

const Footer = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Milk Delivery Logo" className="h-8 w-auto" />
              <h3 className="text-lg font-semibold text-[#00B86C]">
                Milk Delivery
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Fresh dairy products delivered to your doorstep every morning. Quality you can trust.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00B86C] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00B86C] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00B86C] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-[#00B86C] mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Conditional Section */}
          {user ? (
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-[#00B86C] mb-4 uppercase tracking-wider">
                My Account
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#00B86C]/5 rounded">
                    <User size={16} className="text-[#00B86C]" />
                  </div>
                  <Link to="/profile" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                    My Profile
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#00B86C]/5 rounded">
                    <Package size={16} className="text-[#00B86C]" />
                  </div>
                  <Link to="/subscriptions" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                    My Subscriptions
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#00B86C]/5 rounded">
                    <ShoppingCart size={16} className="text-[#00B86C]" />
                  </div>
                  <Link to="/orders" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-[#00B86C] mb-4 uppercase tracking-wider">
                Admin Access
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#00B86C]/5 rounded">
                    <Lock size={16} className="text-[#00B86C]" />
                  </div>
                  <Link to="/admin/login" className="text-gray-500 hover:text-[#00B86C] text-sm transition-colors">
                    Admin Login
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#00B86C]/5 rounded">
                    <Mail size={16} className="text-[#00B86C]" />
                  </div>
                  <span className="text-gray-500 text-sm">support@milkdelivery.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#00B86C]/5 rounded">
                    <Phone size={16} className="text-[#00B86C]" />
                  </div>
                  <span className="text-gray-500 text-sm">+91 1234567890</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} Milk Delivery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
