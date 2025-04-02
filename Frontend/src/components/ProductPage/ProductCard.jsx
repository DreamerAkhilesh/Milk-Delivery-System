import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Package, Droplet, Clock } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="block p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-200"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-20 h-20 object-cover mx-auto"
      />
      <h3 className="text-lg font-semibold text-gray-800 text-center mt-3">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 text-center">{product.description}</p>
      <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-md mt-2 text-center">
        Order via App and get <span className="text-green-600">Upto 40% OFF</span> with <span className="font-bold">VIP</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1"><BadgeCheck size={16} /> No Added Preservatives</div>
        <div className="flex items-center gap-1"><BadgeCheck size={16} /> Naturally Sweet</div>
        <div className="flex items-center gap-1"><Droplet size={16} /> Lots of Water</div>
        <div className="flex items-center gap-1"><Package size={16} /> No Added Flavours</div>
        <div className="flex items-center gap-1"><Clock size={16} /> Assured Delivery by 7 AM</div>
      </div>
      <p className="text-sm font-semibold text-center mt-3 text-gray-700">
        Order Fresh {product.name} Online
      </p>
    </Link>
  );
};

const CategorySection = ({ category, products }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">{category.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { ProductCard, CategorySection };