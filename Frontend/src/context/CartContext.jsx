import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [deliveryFrequency, setDeliveryFrequency] = useState('daily');
  const [totalCost, setTotalCost] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart data structure
        if (Array.isArray(parsedCart) && parsedCart.every(item => 
          item._id && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        )) {
          setCart(parsedCart);
        } else {
          // If data is invalid, clear localStorage
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${USER_API_END_POINT}/wallet/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setWalletBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchWalletBalance();
  }, []);

  // Calculate total cost whenever cart or delivery frequency changes
  useEffect(() => {
    const calculateTotalCost = () => {
      const days = 15; // Fixed 15 days period
      let multiplier = 1;
      
      switch (deliveryFrequency) {
        case 'daily':
          multiplier = 1;
          break;
        case 'alternate':
          multiplier = 0.5;
          break;
        case 'weekly':
          multiplier = 0.25;
          break;
        default:
          multiplier = 1;
      }

      const dailyTotal = getCartTotal();
      const calculatedTotal = dailyTotal * days * multiplier;
      setTotalCost(Math.max(calculatedTotal, 250)); // Minimum 250
    };

    calculateTotalCost();
  }, [cart, deliveryFrequency]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      setTotalItems(cart.reduce((total, item) => total + (item.quantity || 0), 0));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Invalid product data');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.pricePerDay || 0) * (item.quantity || 0)), 0);
  };

  const updateDeliveryFrequency = (frequency) => {
    setDeliveryFrequency(frequency);
  };

  const refreshWalletBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${USER_API_END_POINT}/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setWalletBalance(response.data.balance);
      return response.data.balance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return null;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        walletBalance,
        deliveryFrequency,
        totalCost,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        updateDeliveryFrequency,
        refreshWalletBalance
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 