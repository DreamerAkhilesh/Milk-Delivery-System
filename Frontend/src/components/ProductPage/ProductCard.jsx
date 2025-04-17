import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = "/images/default-product.png";

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  const imageSource = imageError ? defaultImage : (product.images?.[0] || product.image || defaultImage);

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-[#00B86C]/20 w-full"
    >
      {/* Main Container with 2:3 aspect ratio */}
      <div className="flex flex-col h-[420px]">
        {/* Image Container - Takes up about 50% of height */}
        <div className="relative h-[210px] overflow-hidden bg-gray-50">
          <img
            src={imageSource}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {!product.availability && (
              <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 p-5">
          <div>
            {/* Category Tag */}
            <div className="mb-3">
              <span className="text-sm text-[#00B86C] bg-[#00B86C]/10 px-3 py-1 rounded-md">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#00B86C] transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {product.description}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="space-y-3">
            {/* Price Section */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#00B86C]">
                  ₹{product.pricePerDay}
                </span>
                <span className="text-sm text-gray-500">/day</span>
              </div>

              {/* Stock Info */}
              {product.quantity > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    {product.quantity} available
                  </span>
                </div>
              )}
            </div>

            {/* View Details Button */}
            <button className="w-full py-2 text-sm font-medium text-[#00B86C] hover:text-white bg-[#00B86C]/10 hover:bg-[#00B86C] rounded-md transition-colors duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategorySection = ({ category, products }) => {
  return (
    <div className="mb-10">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
        <span className="text-2xl">{category.icon}</span>
        <h2 className="text-xl font-bold text-gray-800">
          {category.name}
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { ProductCard, CategorySection };