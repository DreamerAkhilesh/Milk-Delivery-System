import React from 'react';
import { Link } from 'react-router-dom';
import Background from '../../assets/Background.png';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -mt-90">
        <img
          src={Background}
          alt="Fresh dairy products"
          className="w-full h-full object-cover"
        />
        {/* Enhanced Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 via-[#00B86C]/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto h-full">
        <div className="relative z-10 h-full flex items-center">
          <main className="px-4 sm:px-6 lg:px-8 w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Fresh Dairy Products</span>
                <span className="block text-[#00B86C] mt-2">Delivered Daily</span>
              </h1>
              <p className="text-lg text-gray-600 sm:text-xl max-w-xl leading-relaxed">
                Start your day with fresh, pure dairy products delivered right to your doorstep. 
                Experience the goodness of farm-fresh milk and dairy products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#00B86C] hover:bg-[#00955A] md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Browse Products
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/about"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-[#00B86C] bg-white hover:bg-[#E6F4F1] border-[#00B86C] md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;