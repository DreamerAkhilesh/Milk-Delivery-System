import React, { useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Card from "./ProductCard";

const items = [
  { id: 1, name: "Milk", price: 50, image: "../src/assets/milk.jpg" },
  { id: 2, name: "Curd", price: 40, image: "../src/assets/curd.png" },
  { id: 3, name: "Butter", price: 150, image: "../src/assets/butter.jpg" },
  { id: 4, name: "Ghee", price: 500, image: "../src/assets/ghee.jpg" },
  { id: 5, name: "Cheese", price: 250, image: "../src/assets/cheese.jpg" },
  { id: 6, name: "Paneer", price: 200, image: "../src/assets/paneer.jpg" },
  { id: 7, name: "Ice Cream", price: 120, image: "../src/assets/icecream.jpg" },
  { id: 8, name: "Lassi", price: 30, image: "../src/assets/lassi.jpg" },
  { id: 9, name: "Yogurt", price: 60, image: "../src/assets/yoghurt.jpg" },
];

const ProductsCatalogue = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleWheelScroll = (e) => {
    e.preventDefault();
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY * 2;
    }
  };

  return (
    <div className="container mx-auto py-12" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#014D87]">
        Our Products
      </h2>

      {/* Horizontally Scrollable Product List */}
      <div
        ref={scrollRef}
        onWheel={handleWheelScroll}
        className="flex space-x-6 overflow-x-auto px-6 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          WebkitOverflowScrolling: "touch",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((product) => (
          <div
            key={product.id}
            className="w-[220px] h-[300px] flex-shrink-0"
            data-aos="zoom-in"
          >
            <Card product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsCatalogue;