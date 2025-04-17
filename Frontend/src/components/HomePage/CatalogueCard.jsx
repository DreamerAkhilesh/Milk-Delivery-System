import React, { useState } from "react";
import { Link } from "react-router-dom";

const CatalogueCard = ({ product }) => {
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
      className="group block bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-[#00B86C]/20 w-full"
    >
      <div className="flex flex-col h-[280px]">
        {/* Image Container */}
        <div className="relative h-[140px] overflow-hidden bg-gray-50">
          <img
            src={imageSource}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
          
          {/* Status Badge */}
          {!product.availability && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 p-3">
          <div>
            {/* Category Tag */}
            <div className="mb-1">
              <span className="text-xs text-[#00B86C] bg-[#00B86C]/10 px-2 py-0.5 rounded-md">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-[#00B86C] transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="space-y-1.5">
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-bold text-[#00B86C]">
                  ₹{product.pricePerDay}
                </span>
                <span className="text-xs text-gray-500">/day</span>
              </div>

              {/* Stock Info */}
              {product.quantity > 0 && (
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">
                    {product.quantity} left
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <button className="w-full py-1.5 text-xs font-medium text-[#00B86C] hover:text-white bg-[#00B86C]/10 hover:bg-[#00B86C] rounded-md transition-colors duration-300">
              Quick View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CatalogueCard; 