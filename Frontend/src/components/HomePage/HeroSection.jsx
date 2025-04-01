import React from "react";


const HeroSection = () => {
  return (
    <div className="relative w-full h-[90vh] flex items-center justify-center bg-[#00B86C] text-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Fresh & Pure Dairy Products Delivered to Your Doorstep
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Enjoy the richness of farm-fresh milk and dairy, sourced directly
            from trusted farms. Experience purity like never before.
          </p>
          <button className="bg-white text-[#00B86C] font-semibold px-6 py-3 rounded-lg hover:bg-gray-200">
            Order Now
          </button>
        </div>
        
        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            src={"../src/assets/logo1.png"}
            alt="Fresh Milk Delivery"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;