import React, { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminProductCard = ({ product, onDelete, onEdit }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = "/images/default-product.png";

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  return (
    <div className="min-h-[280px] p-5 pb-12 bg-white rounded-2xl shadow-xl border border-gray-100 relative transition-transform hover:scale-105 hover:shadow-2xl">
      <img
        src={imageError ? defaultImage : (product.images?.[0] || defaultImage)}
        alt={product.name}
        className="w-32 h-32 object-cover mx-auto rounded-md border border-gray-200 shadow-sm"
        onError={handleImageError}
      />
      <h3 className="text-lg font-semibold text-gray-900 text-center mt-4 leading-tight">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">
        {product.description}
      </p>
      <div className="absolute bottom-3 right-3 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(product)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminProductCard;
