import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import CatalogueCard from "../HomePage/CatalogueCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [subscriptionType, setSubscriptionType] = useState("");

  // Check if both subscription type and quantity are selected
  const isSubscriptionReady = quantity > 0 && subscriptionType !== "";

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${USER_API_END_POINT}/products/${id}`);
      console.log("Product details response:", response.data);
      
      // Extract product data based on response format
      let productData = null;
      
      // Handle different possible response formats
      if (response.data.data && response.data.data.product) {
        // New format: { success, statusCode, message, data: { product } }
        console.log("New response format detected with nested data.product");
        productData = response.data.data.product;
      } else if (response.data.data) {
        // Alternative format: { success, statusCode, message, data }
        console.log("New response format detected with data");
        productData = response.data.data;
      } else if (response.data.product) {
        // Original format: { message, product }
        console.log("Original response format detected");
        productData = response.data.product;
      } else {
        console.error("Unexpected response format:", response.data);
        throw new Error('Invalid response format');
      }

      if (!productData) {
        throw new Error('Product data not found in response');
      }

      console.log("Raw product data before processing:", productData);
      
      // Ensure the product has an ID - try different possible formats
      if (!productData._id && productData.id) {
        console.log("Using 'id' instead of '_id'");
        productData._id = productData.id;
      }
      
      // If we're getting raw data with the id as a parameter
      if (!productData._id && id) {
        console.log("Using URL parameter as ID");
        productData._id = id;
      }

      // Verify that the product has all required fields
      if (!productData._id) {
        console.error("Product is missing _id field:", productData);
        throw new Error('Product ID is missing');
      }

      if (productData.pricePerDay === undefined || productData.pricePerDay === null) {
        console.error("Product is missing pricePerDay field:", productData);
        throw new Error('Product price information is missing');
      }

      console.log("Final processed product data:", productData);
      setProduct(productData);
      setSelectedImage(0);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError(error.message);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/products`);
      console.log("Related products response:", response.data);
      
      // Extract products based on response format
      let productsData = [];
      
      if (response.data.data && response.data.data.products) {
        // New format: { success, statusCode, message, data: { products } }
        productsData = response.data.data.products;
      } else if (response.data.products) {
        // Original format: { message, products }
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        // Direct array format
        productsData = response.data;
      } else {
        console.warn("Unexpected format for products list:", response.data);
        return;
      }
      
      // Filter out current product and get 4 random related products
      const filteredProducts = productsData
        .filter(p => p._id !== id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
        
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.quantity || 1)) {
      setQuantity(value);
    }
  };

  const handleSubscriptionTypeChange = (e) => {
    setSubscriptionType(e.target.value);
  };

  const handleConfirmSubscription = () => {
    if (!product.availability) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (!isSubscriptionReady) {
      toast.error("Please select both quantity and subscription type");
      return;
    }

    // Ensure the product object has all required fields
    if (!product._id) {
      console.error("Product is missing _id field:", product);
      toast.error("Invalid product data. Please try again.");
      return;
    }

    if (!product.pricePerDay) {
      console.error("Product is missing pricePerDay field:", product);
      toast.error("Product price information is missing. Please try again.");
      return;
    }

    // Log what we're passing to the next page
    console.log("Navigating to subscription confirm with:", {
      product: {
        _id: product._id,
        name: product.name,
        pricePerDay: product.pricePerDay,
        availability: product.availability,
      },
      quantity,
      subscriptionType
    });

    // Navigate to subscription confirmation page with necessary details
    navigate("/subscription/confirm", {
      state: {
        product: {
          _id: product._id,
          name: product.name,
          pricePerDay: product.pricePerDay,
          description: product.description,
          category: product.category,
          images: product.images,
          image: product.image,
          availability: product.availability,
          quantity: product.quantity
        },
        quantity,
        subscriptionType
      }
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B86C]"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
            <p className="text-gray-600 mb-6">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-[#00B86C] text-white rounded-md hover:bg-[#009c5b] transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[400px] bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={product.images?.[selectedImage] || product.image || "/images/default-product.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.availability && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-[#00B86C]" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-[#00B86C] bg-[#00B86C]/10 px-3 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#00B86C]">
                ₹{product.pricePerDay}
              </span>
              <span className="text-gray-500">/day</span>
            </div>

            {/* Stock Information */}
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.quantity > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-gray-600">
                {product.quantity > 0 ? `${product.quantity} available` : "Out of stock"}
              </span>
            </div>

            {/* Subscription Form */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
              
              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                />
              </div>
              
              {/* Subscription Type Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subscription Type</label>
                <select
                  value={subscriptionType}
                  onChange={handleSubscriptionTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                >
                  <option value="">Select a subscription type</option>
                  <option value="daily">Daily</option>
                  <option value="alternate">Alternate Days</option>
                  <option value="weekly">Weekly</option>
                  <option value="one-time">One Time</option>
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleConfirmSubscription}
                  disabled={!product.availability || !isSubscriptionReady}
                  className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
                    product.availability && isSubscriptionReady
                      ? "bg-[#00B86C] text-white hover:bg-[#009c5b]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Confirm Subscription
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className={`${product.availability ? "text-green-600" : "text-red-600"}`}>
                    {product.availability ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock</span>
                  <span className="text-gray-900">{product.quantity} units</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="transform transition-transform hover:scale-105"
              >
                <CatalogueCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail; 