import React from "react";

const Card = ({ product }) => {
  return (
    <div className="group cursor-pointer rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-3 bg-white text-center text-lg font-semibold text-[#025C9C]">
        {product.name}
      </div>
    </div>
  );
};

export default Card;