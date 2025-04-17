import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const handleProceedToSubscription = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    onClose();
    navigate('/subscription');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart</p>
              <div className="mt-6">
                <Link
                  to="/products"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00B86C] hover:bg-[#009c5b]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={item.images?.[0] || item.image || "/images/default-product.png"}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.pricePerDay}/day</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="mx-2 text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      ₹{item.pricePerDay * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>₹{getCartTotal()}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleProceedToSubscription}
                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00B86C] hover:bg-[#009c5b]"
              >
                Proceed to Subscription
              </button>
              <Link
                to="/products"
                onClick={onClose}
                className="flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar; 