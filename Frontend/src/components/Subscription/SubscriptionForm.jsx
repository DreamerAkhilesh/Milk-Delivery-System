import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';

const SubscriptionForm = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [formData, setFormData] = useState({
    startDate: '',
    deliveryFrequency: 'daily',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    coordinates: {
      latitude: null,
      longitude: null
    }
  });

  // Calculate total cost based on delivery frequency
  useEffect(() => {
    const calculateTotalCost = () => {
      const days = 15; // Fixed 15 days period
      let multiplier = 1;
      
      switch (formData.deliveryFrequency) {
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
  }, [formData.deliveryFrequency, getCartTotal]);

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(
          `${USER_API_END_POINT}/wallet/balance`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setWalletBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        toast.error('Failed to fetch wallet balance');
      }
    };

    fetchWalletBalance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          coordinates: {
            latitude,
            longitude
          }
        }));
        toast.success('Location detected successfully!');
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please enter address manually.';
        }
        toast.error(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if wallet has sufficient balance
      if (walletBalance < totalCost) {
        toast.error('Insufficient wallet balance. Please add money to your wallet.');
        setLoading(false);
        return;
      }

      // Create subscription for each product in cart
      const subscriptions = cart.map(item => ({
        product: item._id,
        pricePerDay: item.pricePerDay,
        startDate: formData.startDate,
        deliveryFrequency: formData.deliveryFrequency,
        address: formData.address,
        coordinates: formData.coordinates
      }));

      // Make API call to create subscriptions
      const response = await axios.post(
        `${USER_API_END_POINT}/subscriptions/create`,
        { 
          subscriptions,
          amount: totalCost
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Subscription created successfully!');
        clearCart();
        navigate('/profile/subscriptions');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Subscription</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subscription Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Delivery Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Frequency
          </label>
          <select
            name="deliveryFrequency"
            value={formData.deliveryFrequency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="alternate">Alternate Day</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Delivery Address</h3>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#00B86C] hover:text-[#009c5b]"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Detecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use Current Location
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landmark
              </label>
              <input
                type="text"
                name="address.landmark"
                value={formData.address.landmark}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between">
                <span>{item.name}</span>
                <span>₹{item.pricePerDay}/day</span>
              </div>
            ))}
            <div className="border-t pt-2 font-medium">
              <div className="flex justify-between">
                <span>Total per day</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-[#00B86C]">
                <span>Total for 15 days ({formData.deliveryFrequency})</span>
                <span>₹{totalCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Wallet Balance</span>
                <span className={walletBalance < totalCost ? 'text-red-500' : 'text-[#00B86C]'}>
                  ₹{walletBalance}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || walletBalance < totalCost}
          className="w-full bg-[#00B86C] text-white py-2 px-4 rounded-md hover:bg-[#009c5b] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Complete Subscription'}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm; 