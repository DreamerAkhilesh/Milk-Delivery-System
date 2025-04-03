import React from "react";
import delivery from "../../assets/Delivery.jpg";
import cattle from "../../assets/Farm.jpg";
import farms from "../../assets/Factory.jpg";

const TrustSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-20 relative">
      <div className="max-w-7xl mx-auto relative">
        {/* Heading */}
        <h2 className="text-lg font-semibold text-gray-600 mb-10 text-left">
          Farm to Home, Every Day Online Milk & Groceries Delivery
        </h2>

        {/* Dotted Line Behind Circles */}
        <div className="absolute top-1/2 left-0 w-full flex justify-center items-center z-0">
          <div className="w-3/5 border-t-2 border-green-500 border-dashed"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-16 items-center relative z-10">
          {/* Milk Collection */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-white border-1 border-gray-200 rounded-full flex items-center justify-center shadow-lg relative">
              <img src={cattle} alt="Milk Collection" className="w-44 h-44 object-contain" />
            </div>
            <p className="text-gray-800 font-medium mt-2 text-center">Milk collection from healthy cattle</p>
          </div>

          {/* Quality Testing */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-white border-1 border-gray-200 rounded-full flex items-center justify-center shadow-lg relative">
              <img src={farms} alt="Quality Testing" className="w-44 h-44 object-contain" />
            </div>
            <p className="text-gray-800 font-medium mt-2 text-center">Quality tested for 100+ common adulterants</p>
          </div>

          {/* Home Delivery */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-white border-1 border-gray-200 rounded-full flex items-center justify-center shadow-lg relative">
              <img src={delivery} alt="Home Delivery" className="w-44 h-44 object-contain" />
            </div>
            <p className="text-gray-800 font-medium mt-2 text-center">Home delivery by 7 AM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
