import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { CategorySection } from "../ProductPage/ProductCard";
import { USER_API_END_POINT } from "../../utils/constant";

const categoriesData = [
  { id: 1, name: "Milk", icon: "🥛" },
  { id: 2, name: "Milk Products", icon: "🧈" },
  { id: 3, name: "Traditional Sweets", icon: "🍮" },
];

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_API_END_POINT}/products`);
      
      // Group products by category
      const groupedProducts = response.data.products.reduce((acc, product) => {
        const categoryId = categoriesData.find(cat => cat.name === product.category)?.id;
        if (categoryId) {
          if (!acc[categoryId]) acc[categoryId] = [];
          acc[categoryId].push({
            ...product,
            id: product._id
          });
        }
        return acc;
      }, {});
      
      setProducts(groupedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="text-center">Loading products...</div>
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
