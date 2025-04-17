import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import CatalogueCard from "../HomePage/CatalogueCard";
import { useCart } from "../../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${USER_API_END_POINT}/products/${id}`);
      
      if (!response.data || !response.data.product) {
        throw new Error('Invalid response format');
      }

      setProduct(response.data.product);
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
      if (response.data && response.data.products) {
        // Filter out current product and get 4 random related products
        const filteredProducts = response.data.products
          .filter(p => p._id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelatedProducts(filteredProducts);
      }
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

  const handleAddToCart = () => {
    if (!product.availability) {
      toast.error("This product is currently out of stock");
      return;
    }

    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const isInCart = cart.some(item => item._id === product?._id);

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

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B86C]"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.availability || isInCart}
                className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
                  product.availability && !isInCart
                    ? "bg-[#00B86C] text-white hover:bg-[#009c5b]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isInCart ? "Already in Cart" : "Add to Cart"}
              </button>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Products
              </button>
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