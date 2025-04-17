import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';

const CartSidebar = ({ isOpen, onClose }) => {
  const { 
    cart, 
    totalItems, 
    walletBalance, 
    deliveryFrequency, 
    totalCost,
    updateDeliveryFrequency,
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    refreshWalletBalance
  } = useCart();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentWalletBalance, setCurrentWalletBalance] = useState(0);

  // Fetch wallet balance when cart opens
  useEffect(() => {
    if (isOpen) {
      const fetchWalletBalance = async () => {
        try {
          const balance = await refreshWalletBalance();
          if (balance !== null) {
            setCurrentWalletBalance(balance);
          }
        } catch (error) {
          console.error('Error fetching wallet balance:', error);
          toast.error('Failed to fetch wallet balance');
        }
      };
      fetchWalletBalance();
    }
  }, [isOpen, refreshWalletBalance]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (currentWalletBalance < totalCost) {
      toast.error('Insufficient wallet balance. Please add money to your wallet.');
      return;
    }
    navigate('/subscription');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Delivery Frequency */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Frequency
            </label>
            <select
              value={deliveryFrequency}
              onChange={(e) => updateDeliveryFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="alternate">Alternate Day</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.pricePerDay}/day</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, (item.quantity || 0) - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity || 0}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, (item.quantity || 0) + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              {/* Daily Subtotal */}
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>

              {/* Delivery Frequency Info */}
              <div className="flex justify-between text-[#00B86C]">
                <span>Delivery Frequency</span>
                <span className="capitalize">{deliveryFrequency}</span>
              </div>

              {/* Total for 15 days */}
              <div className="flex justify-between text-[#00B86C] font-medium">
                <span>Total for 15 days</span>
                <span>₹{totalCost}</span>
              </div>

              {/* Wallet Balance */}
              <div className="flex justify-between">
                <span className="text-gray-600">Wallet Balance</span>
                <span className={currentWalletBalance < totalCost ? 'text-red-500' : 'text-[#00B86C]'}>
                  ₹{currentWalletBalance}
                </span>
              </div>

              {/* Balance Status */}
              {currentWalletBalance < totalCost && (
                <div className="text-red-500 text-sm mt-2">
                  Insufficient wallet balance. Please add ₹{totalCost - currentWalletBalance} more to your wallet.
                </div>
              )}
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0 || currentWalletBalance < totalCost}
            className="w-full mt-6 bg-[#00B86C] text-white py-2 px-4 rounded-md hover:bg-[#009c5b] disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Proceed to Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar; 