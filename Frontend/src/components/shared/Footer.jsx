import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Milk & Dairy Products */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Milk & Dairy Products</h2>
          <ul className="space-y-2">
            <li>Cow Milk</li>
            <li>Buffalo Milk</li>
            <li>Butter</li>
            <li>Ghee</li>
            <li>Cheese</li>
            <li>Dahi</li>
            <li>Paneer</li>
            <li>Lassi</li>
            <li>Yogurt</li>
            <li>Ice Cream</li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Company</h2>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>How Can We Help</li>
            <li>Privacy</li>
            <li>FAQs</li>
            <li>Terms & Conditions</li>
            <li>Divya Dairy Reviews</li>
          </ul>
        </div>

        {/* Social & Download */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Connect With Us</h2>
          <div className="flex space-x-4 text-gray-700 text-2xl">
            <FaFacebookF />
            <FaInstagram />
            <FaLinkedinIn />
            <FaYoutube />
          </div>
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-3">Download App</h2>
            <div className="flex space-x-4">
              <img src="../src/assets/logo1.png" alt="Google Play" className="w-32" />
              <img src="../src/assets/logo1.png" alt="App Store" className="w-32" />
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Admin</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/login"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-sm text-gray-500 border-t pt-4">
        "Divya Dairy" is owned & managed by Divya Dairy Pvt. Ltd. Images and videos are for representation purposes; actual products may vary. Product availability is subject to location and stock changes. Price, Offers, Discounts and Festival combos are subject to product availability, location. Price and other benefits might fluctuate. The product related information is provided for general informational and educational purposes only and is not a substitute for professional advice. Check the product label for batch, manufacturing details, and other info before use. For further information, reach out to Divya Dairy customer service.
      </div>
    </footer>
  );
}
