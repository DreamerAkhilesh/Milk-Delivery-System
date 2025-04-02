import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Home, User2, LogOut, Package, ShoppingCart, CreditCard, Settings, HelpCircle, Wallet } from "lucide-react";

const Profile = () => {
  const user = { 
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    profile: { profilePhoto: "path-to-image.jpg" },
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl relative">
      
      {/* 🏠 Back to Home Icon */}
      <Link to="/" className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition">
        <Home size={20} className="text-gray-600 hover:text-[#00B86C]" />
      </Link>

      {/* 🌟 Top Heading */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">My Profile</h1>

      {/* 👤 Profile Section */}
      <div className="p-6 bg-gray-100 rounded-2xl shadow-md flex flex-col items-center space-y-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
          <AvatarFallback><User2 size={40} /></AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-600">{user?.phone}</p>
        </div>
        <div className="w-full h-[1px] bg-gray-300"></div>
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Stats & More</h3>
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>

      {/* First Section (Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Part 1: Product and Subscriptions */}
        <div className="flex flex-col p-6 bg-gray-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Product & Subscriptions</h2>
          <div className="flex space-x-6">
            <Link to="/products" className="group flex items-center space-x-2 text-gray-700 hover:text-[#00B86C]">
              <Package size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
              <span className="group-hover:text-[#00B86C]">Products</span>
            </Link>
            <Link to="/subscriptions" className="group flex items-center space-x-2 text-gray-700 hover:text-[#00B86C]">
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
              <span className="group-hover:text-[#00B86C]">My Subscriptions</span>
            </Link>
          </div>
        </div>

        {/* Part 2: Orders and Billing */}
        <div className="flex flex-col p-6 bg-gray-100 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Orders & Billing</h2>
          <div className="flex space-x-6">
            <Link to="/orders" className="group flex items-center space-x-2 text-gray-700 hover:text-[#00B86C]">
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
              <span className="group-hover:text-[#00B86C]">My Orders</span>
            </Link>
            <Link to="/transactions" className="group flex items-center space-x-2 text-gray-700 hover:text-[#00B86C]">
              <CreditCard size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
              <span className="group-hover:text-[#00B86C]">Transactions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Second Section: Full-width options */}
      <div className="mt-6 grid grid-cols-1 gap-4">
        
        <Link to="/account-settings" className="group flex items-center justify-between p-4 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200">
          <div className="flex items-center space-x-4">
            <Settings size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
            <span className="text-lg font-medium group-hover:text-[#00B86C]">Account & Preferences</span>
          </div>
        </Link>

        <Link to="/wallet" className="group flex items-center justify-between p-4 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200">
          <div className="flex items-center space-x-4">
            <Wallet size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
            <span className="text-lg font-medium group-hover:text-[#00B86C]">CD Money & Payment Modes</span>
          </div>
        </Link>

        <Link to="/help" className="group flex items-center justify-between p-4 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200">
          <div className="flex items-center space-x-4">
            <HelpCircle size={24} className="text-gray-700 group-hover:text-[#00B86C]" />
            <span className="text-lg font-medium group-hover:text-[#00B86C]">Need Help?</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
