import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '../../utils/constant';
import Navbar from '../shared/Navbar';
import { Wallet, CreditCard } from 'lucide-react';

const SubscriptionConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Get product data from location state
  const { product, quantity, subscriptionType } = location.state || {};
  
  // State for subscription confirmation
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState('15_days');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [hasAddress, setHasAddress] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  
  // Calculate costs and duration
  const [calculatedCost, setCalculatedCost] = useState({
    dailyCost: 0,
    totalDeliveries: 0,
    totalCost: 0,
    durationDays: 15
  });

  // Protect against direct access without product data
  useEffect(() => {
    // Log what data we received from navigation
    console.log("Received data from navigation:", {
      product: product ? {
        _id: product._id,
        name: product.name,
        pricePerDay: product.pricePerDay,
        availability: product.availability,
        quantity: product.quantity
      } : null,
      quantity,
      subscriptionType
    });
    
    // Check if we have all required data
    const isMissingData = !product || !product._id || !quantity || !subscriptionType;
    
    if (isMissingData) {
      console.error("Missing required subscription data:", {
        hasProduct: !!product,
        hasProductId: product ? !!product._id : false,
        hasQuantity: !!quantity,
        hasSubscriptionType: !!subscriptionType
      });
      
      toast.error('Invalid subscription data. Please select a product first.');
      navigate('/products');
      return;
    }
    
    // Validate product data
    if (!product.pricePerDay || product.pricePerDay <= 0) {
      console.error("Invalid product price:", product.pricePerDay);
      toast.error('The selected product has an invalid price. Please choose another product.');
      navigate('/products');
      return;
    }
    
    if (!product.availability) {
      console.error("Product not available:", product);
      toast.error('The selected product is not available. Please choose another product.');
      navigate('/products');
      return;
    }
    
    console.log("Product data validation passed, proceeding with subscription");
  }, [product, quantity, subscriptionType, navigate]);
  
  // Fetch user address and wallet balance
  useEffect(() => {
    if (user?.id) {
      fetchUserAddress();
      fetchWalletBalance();
    }
  }, [user]);
  
  // Calculate cost when subscription details change
  useEffect(() => {
    if (product && quantity && subscriptionType && subscriptionPlan) {
      calculateSubscriptionCost();
    }
  }, [product, quantity, subscriptionType, subscriptionPlan]);
  
  const fetchUserAddress = async () => {
    try {
      setAddressLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${USER_API_END_POINT}/subscriptions/address`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.data?.address) {
        setAddress(response.data.data.address);
        setHasAddress(true);
      } else {
        setHasAddress(false);
      }
    } catch (error) {
      console.error('Error fetching user address:', error);
      setHasAddress(false);
    } finally {
      setAddressLoading(false);
    }
  };
  
  const fetchWalletBalance = async () => {
    try {
      setWalletLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${USER_API_END_POINT}/subscriptions/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWalletBalance(response.data.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Failed to fetch wallet balance');
    } finally {
      setWalletLoading(false);
    }
  };
  
  const calculateSubscriptionCost = () => {
    // Log input data to debug
    console.log("Calculating cost with:", {
      product: product ? {
        _id: product._id,
        name: product.name,
        pricePerDay: product.pricePerDay
      } : null,
      quantity,
      subscriptionType,
      subscriptionPlan
    });
    
    // Validate inputs
    if (!product || !product.pricePerDay) {
      console.error("Invalid product data for calculation:", product);
      return;
    }
      
    // Calculate frequency multiplier
    let frequencyMultiplier = 1;
    switch (subscriptionType) {
      case 'daily':
        frequencyMultiplier = 1;
        break;
      case 'alternate':
        frequencyMultiplier = 0.5;
        break;
      case 'weekly':
        frequencyMultiplier = 0.25;
        break;
      default:
        console.warn(`Unknown frequency type: ${subscriptionType}, defaulting to daily`);
        frequencyMultiplier = 1;
    }
    
    // Calculate duration in days
    let durationDays = 15;
    switch (subscriptionPlan) {
      case '15_days':
        durationDays = 15;
        break;
      case '1_month':
        durationDays = 30;
        break;
      case '2_months':
        durationDays = 60;
        break;
      case '3_months':
        durationDays = 90;
        break;
      case '6_months':
        durationDays = 180;
        break;
      case '1_year':
        durationDays = 365;
        break;
      default:
        console.warn(`Unknown subscription plan: ${subscriptionPlan}, defaulting to 15 days`);
        durationDays = 15;
    }
    
    // Calculate costs
    const dailyCost = product.pricePerDay * quantity;
    const totalDeliveries = Math.ceil(durationDays * frequencyMultiplier);
    const totalCost = dailyCost * totalDeliveries;
    
    // Log calculated values
    console.log("Calculation results:", {
      dailyCost,
      totalDeliveries,
      totalCost,
      durationDays
    });
    
    setCalculatedCost({
      dailyCost,
      totalDeliveries,
      totalCost,
      durationDays
    });
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const validateAddress = () => {
    const requiredFields = ['street', 'city', 'state', 'pincode'];
    
    for (const field of requiredFields) {
      if (!address[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    // Simple pincode validation
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Pincode must be a 6-digit number');
      return false;
    }
    
    return true;
  };
  
  const handleConfirmSubscription = async () => {
    if (!validateAddress()) {
      return;
    }
    
    // If wallet payment but insufficient balance
    if (paymentMethod === 'wallet' && walletBalance < calculatedCost.totalCost) {
      toast.error('Insufficient wallet balance');
      return;
    }
    
    // Validate required fields before sending
    if (!product?._id) {
      console.error("Missing product ID:", product);
      toast.error('Invalid product data. Product ID is required.');
      return;
    }
    
    if (!quantity || quantity <= 0) {
      console.error("Invalid quantity:", quantity);
      toast.error('Please specify a valid quantity.');
      return;
    }
    
    if (!subscriptionType) {
      console.error("Missing delivery frequency:", subscriptionType);
      toast.error('Please select a delivery frequency.');
      return;
    }
    
    if (!subscriptionPlan) {
      console.error("Missing subscription plan:", subscriptionPlan);
      toast.error('Please select a subscription plan.');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Create subscription payload
      const subscriptionData = {
        productId: product._id,
        quantity,
        deliveryFrequency: subscriptionType,
        subscriptionPlan,
        address,
        paymentMethod
      };
      
      // Log the data being sent
      console.log("Sending subscription data:", JSON.stringify({
        ...subscriptionData,
        address: { ...subscriptionData.address } // Clone to avoid circular reference issues
      }, null, 2));
      
      // Log the auth token (with partial masking for security)
      console.log("Using auth token:", token ? 
        token.substring(0, 10) + "..." + token.substring(token.length - 10) : 
        "No token found!");
      
      // Log request details
      console.log("API Endpoint:", `${USER_API_END_POINT}/subscriptions`);
      console.log("Request method:", "POST");
      console.log("Request headers:", { Authorization: `Bearer ${token}` });
      
      const response = await axios.post(
        `${USER_API_END_POINT}/subscriptions`,
        subscriptionData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Log successful response
      console.log("Subscription created successfully:", response.data);
      
      if (paymentMethod === 'wallet') {
        // Subscription is automatically activated with wallet payment
        toast.success('Subscription confirmed and payment completed');
        navigate('/profile');
      } else {
        // For online payment, redirect to payment gateway or confirmation
        // For now, we'll just show success and redirect to profile
        toast.success('Subscription confirmed! Redirecting to payment...');
        
        // Simulate payment success after 2 seconds
        setTimeout(() => {
          // Complete the payment
          axios.post(
            `${USER_API_END_POINT}/subscriptions/${response.data.data.subscription._id}/payment`,
            { paymentId: `DEMO-${Date.now()}`, paymentMethod: 'online' },
            { headers: { Authorization: `Bearer ${token}` } }
          ).then((paymentResponse) => {
            console.log("Payment completed:", paymentResponse.data);
            toast.success('Payment successful!');
            navigate('/profile');
          }).catch((paymentError) => {
            console.error("Payment error:", paymentError);
            console.error("Payment error details:", paymentError.response?.data);
            toast.error(paymentError.response?.data?.message || 'Payment failed');
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      
      // Add detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle plan selection
  const handlePlanChange = (e) => {
    setSubscriptionPlan(e.target.value);
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B86C]"></div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Confirm Your Subscription</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Selected Product */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Product</h2>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={product.images?.[0] || product.image || "/images/default-product.png"}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#00B86C]">{formatCurrency(product.pricePerDay)}/day</p>
                      <p className="text-sm text-gray-500 mt-1">Quantity: {quantity}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Delivery Frequency: 
                      <span className="font-medium ml-1 capitalize">{subscriptionType}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscription Plan */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plan</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: '15_days', label: '15 Days' },
                  { value: '1_month', label: '1 Month' },
                  { value: '2_months', label: '2 Months' },
                  { value: '3_months', label: '3 Months' },
                  { value: '6_months', label: '6 Months' },
                  { value: '1_year', label: '1 Year' },
                ].map((plan) => (
                  <div key={plan.value} className="relative">
                    <input
                      type="radio"
                      id={`plan-${plan.value}`}
                      name="subscriptionPlan"
                      value={plan.value}
                      checked={subscriptionPlan === plan.value}
                      onChange={handlePlanChange}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor={`plan-${plan.value}`}
                      className="block w-full p-3 text-center border-2 rounded-lg cursor-pointer text-gray-700 peer-checked:border-[#00B86C] peer-checked:bg-[#00B86C]/10 peer-checked:text-[#00B86C] hover:border-gray-300 transition-all"
                    >
                      {plan.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
              
              {addressLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00B86C]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address*
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State*
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Wallet Payment Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'wallet' 
                      ? 'border-[#00B86C] bg-[#00B86C]/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('wallet')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${paymentMethod === 'wallet' ? 'bg-[#00B86C]/20' : 'bg-gray-100'}`}>
                      <Wallet size={20} className={paymentMethod === 'wallet' ? 'text-[#00B86C]' : 'text-gray-500'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Wallet Balance</h3>
                      {walletLoading ? (
                        <div className="h-5 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                      ) : (
                        <p className={`text-sm ${walletBalance >= calculatedCost.totalCost ? 'text-green-600' : 'text-red-500'}`}>
                          {formatCurrency(walletBalance)}
                          {walletBalance < calculatedCost.totalCost && ' (Insufficient)'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Online Payment Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'online' 
                      ? 'border-[#00B86C] bg-[#00B86C]/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('online')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${paymentMethod === 'online' ? 'bg-[#00B86C]/20' : 'bg-gray-100'}`}>
                      <CreditCard size={20} className={paymentMethod === 'online' ? 'text-[#00B86C]' : 'text-gray-500'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Online Payment</h3>
                      <p className="text-sm text-gray-500">Credit/Debit Card, UPI, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity} unit(s)</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium capitalize">{subscriptionType}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Daily Cost</span>
                  <span className="font-medium">{formatCurrency(calculatedCost.dailyCost)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{calculatedCost.durationDays} days</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Deliveries</span>
                  <span className="font-medium">{calculatedCost.totalDeliveries}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
                
                <div className="flex justify-between pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-[#00B86C]">
                    {formatCurrency(calculatedCost.totalCost)}
                  </span>
                </div>
                
                <button
                  onClick={handleConfirmSubscription}
                  disabled={loading || (paymentMethod === 'wallet' && walletBalance < calculatedCost.totalCost)}
                  className={`w-full py-3 px-4 mt-6 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loading || (paymentMethod === 'wallet' && walletBalance < calculatedCost.totalCost)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#00B86C] text-white hover:bg-[#009c5b] focus:ring-[#00B86C]'
                  }`}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    <>Confirm Subscription</>
                  )}
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 px-4 mt-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionConfirm; 