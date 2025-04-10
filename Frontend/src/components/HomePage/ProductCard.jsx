import React, { useState } from "react";

const Card = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = "/images/default-product.png";

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  const imageSource = imageError ? defaultImage : (product.images?.[0] || product.image || defaultImage);

  return (
    <div className="group cursor-pointer rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img 
        src={imageSource} 
        alt={product.name} 
        className="w-full h-48 object-cover"
        onError={handleImageError}
      />
      <div className="p-3 bg-white text-center text-lg font-semibold text-[#025C9C]">
        {product.name}
      </div>
    </div>
  );
};

export default Card;