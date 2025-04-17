import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { CategorySection } from "../ProductPage/ProductCard";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const categoriesData = [
  { id: 1, name: "Milk", icon: "🥛" },
  { id: 2, name: "Milk Products", icon: "🧈" },
  { id: 3, name: "Traditional Sweets", icon: "🍮" },
];

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from:', `${USER_API_END_POINT}/products`); // Debug log
      
      const response = await axios.get(`${USER_API_END_POINT}/products`);
      
      console.log('Response:', response.data); // Debug log
      
      if (!response.data || !response.data.products) {
        throw new Error('Invalid response format');
      }

      // Group products by category
      const groupedProducts = response.data.products.reduce((acc, product) => {
        const categoryId = categoriesData.find(cat => cat.name === product.category)?.id;
        if (categoryId) {
          if (!acc[categoryId]) acc[categoryId] = [];
          acc[categoryId].push({
            ...product,
            id: product._id,
            images: product.images || []
          });
        }
        return acc;
      }, {});
      
      setProducts(groupedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
      
      // More detailed error messaging
      if (error.response) {
        // Server responded with an error
        toast.error(`Failed to load products: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // Request was made but no response
        toast.error("Failed to load products: No response from server");
      } else {
        // Error in request setup
        toast.error(`Failed to load products: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show error state in UI
  if (error) {
    return (
      <>
        
        <div className="container mx-auto p-6">
          <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error Loading Products</h2>
            <p>{error}</p>
            <Button 
              onClick={fetchProducts} 
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 flex">
        {/* Vertical Category Sidebar */}
        <div className="w-1/4 h-[80vh] overflow-y-auto border-r border-gray-300 pr-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800">Categories</h2>
          <div className="flex flex-col space-y-2">
            {categoriesData.map((category) => (
              <button
                key={category.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#00B86C] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-lg font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Section */}
        <div className="w-3/4 pl-6">
          {loading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B86C]"></div>
            </div>
          ) : (
            <CategorySection
              category={categoriesData.find((cat) => cat.id === selectedCategory)}
              products={products[selectedCategory] || []}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
