import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { CategorySection } from "../ProductPage/ProductCard";

const categoriesData = [
  { id: 1, name: "Fruits", icon: "🍎" },
  { id: 2, name: "Vegetables", icon: "🥦" },
  { id: 3, name: "Dairy", icon: "🧀" },
  { id: 4, name: "Snacks", icon: "🍪" },
];

const productsData = {
  1: [
    { id: 1, name: "Apple", description: "Fresh Red Apple", image: "path-to-apple.jpg" },
    { id: 2, name: "Banana", description: "Organic Banana", image: "path-to-banana.jpg" },
  ],
  2: [
    { id: 3, name: "Carrot", description: "Sweet and Crunchy", image: "path-to-carrot.jpg" },
  ],
  3: [
    { id: 4, name: "Milk", description: "Pure Cow Milk", image: "path-to-milk.jpg" },
  ],
  4: [
    { id: 5, name: "Chips", description: "Crispy & Tasty", image: "path-to-chips.jpg" },
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
