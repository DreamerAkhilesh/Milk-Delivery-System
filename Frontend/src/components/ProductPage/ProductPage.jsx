import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { CategorySection } from "../ProductPage/ProductCard";

const categoriesData = [
  { id: 1, name: "Milk", icon: "🥛" },
  { id: 2, name: "Milk Products", icon: "🧈" },
  { id: 3, name: "Traditional Sweets", icon: "🍮" },
];

const productsData = {
  1: [
    { id: 1, name: "Cow Milk", description: "Fresh and pure cow milk", image: "path-to-cow-milk.jpg" },
    { id: 2, name: "Buffalo Milk", description: "High cream buffalo milk", image: "path-to-buffalo-milk.jpg" },
  ],
  2: [
    { id: 3, name: "Paneer", description: "Fresh homemade paneer", image: "path-to-paneer.jpg" },
    { id: 4, name: "Ghee", description: "Pure desi ghee", image: "path-to-ghee.jpg" },
    { id: 5, name: "Curd", description: "Thick and creamy curd", image: "path-to-curd.jpg" },
  ],
  3: [
    { id: 6, name: "Rasgulla", description: "Soft and juicy rasgullas", image: "path-to-rasgulla.jpg" },
    { id: 7, name: "Gulab Jamun", description: "Warm and syrupy delight", image: "path-to-gulab-jamun.jpg" },
    { id: 8, name: "Kalakand", description: "Milky and rich traditional sweet", image: "path-to-kalakand.jpg" },
  ],
};

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);

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
          <CategorySection
            category={categoriesData.find((cat) => cat.id === selectedCategory)}
            products={productsData[selectedCategory] || []}
          />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
