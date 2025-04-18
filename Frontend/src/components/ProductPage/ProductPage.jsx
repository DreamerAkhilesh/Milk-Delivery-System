import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { CategorySection } from "../ProductPage/ProductCard";
import { USER_PRODUCTS_API_END_POINT } from "../../utils/constant";
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
      
      const response = await axios.get(USER_PRODUCTS_API_END_POINT);
      
      if (!response.data || !response.data.products) {
        throw new Error('Invalid response format');
      }

      // The backend sends products in response.data.products
      const productsData = response.data.products;

      // Group products by category
      const groupedProducts = productsData.reduce((acc, product) => {
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
      
      if (error.response) {
        toast.error(`Failed to load products: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        toast.error("Failed to load products: No response from server. Please make sure the backend server is running.");
      } else {
        toast.error(`Failed to load products: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchProducts} className="bg-blue-500 hover:bg-blue-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              {categoriesData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full p-3 rounded-lg text-left ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            <CategorySection
              category={categoriesData.find(cat => cat.id === selectedCategory)}
              products={products[selectedCategory] || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
