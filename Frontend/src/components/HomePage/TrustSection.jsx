import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Delivery from "../../assets/Delivery.png";
import Farm from "../../assets/Farm.png";
import Factory from "../../assets/Factory.png";

const TrustSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-10 text-left">
          Farm to Home, Everyday!
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-5 gap-8 items-center relative">
          {/* Milk Collection */}
          <div
            className="flex flex-col items-center relative"
            data-aos="fade-up"
          >
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-4 shadow-md relative overflow-visible">
              <img
                src={Farm}
                alt="Milk Collection"
                className="w-32 h-32 absolute bottom-0"
              />
            </div>
            <p className="text-gray-700 font-bold text-lg text-center">
              Milk collection from healthy cattle
            </p>
          </div>

          {/* Line */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-16 border-t-2 border-[#025C9C] border-dashed"></div>
          </div>
          <div className="block md:hidden flex items-center justify-center">
            <div className="h-12 border-l-2 border-[#025C9C] border-dashed"></div>
          </div>

          {/* Quality Testing */}
          <div
            className="flex flex-col items-center relative"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-4 shadow-md relative overflow-visible">
              <img
                src={Factory}
                alt="Quality Testing"
                className="w-32 h-32 absolute bottom-0"
              />
            </div>
            <p className="text-gray-700 font-bold text-lg text-center">
              Quality tested for 100+ common adulterants
            </p>
          </div>

          {/* Line */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-16 border-t-2 border-[#025C9C] border-dashed"></div>
          </div>
          <div className="block md:hidden flex items-center justify-center">
            <div className="h-12 border-l-2 border-[#025C9C] border-dashed"></div>
          </div>

          {/* Home Delivery */}
          <div
            className="flex flex-col items-center relative"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-4 shadow-md relative overflow-visible">
              <img
                src={Delivery}
                alt="Home Delivery"
                className="w-32 h-32 absolute bottom-0"
              />
            </div>
            <p className="text-gray-700 font-bold text-lg text-center">
              Home delivery by 7 AM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;