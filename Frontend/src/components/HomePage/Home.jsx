import React from 'react'
import HeroSection from './HeroSection'
import ProductsCatalogue from './ProductCatalogue'
import TrustSection from './TrustSection'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      {/* Main Content */}
      <main className="flex-grow overflow-hidden">
        {/* Hero Section with animation */}
        <div className="animate-fadeIn">
          <HeroSection />
        </div>

        {/* Products Section with slide-up animation */}
        <div className="py-16 animate-slideUp">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ProductsCatalogue />
          </div>
        </div>

        {/* Trust Section with fade-in animation */}
        <div className="bg-white py-16 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Us?
            </h2>
            <TrustSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Add these animations to your global CSS or tailwind.config.js
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeIn 1s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 1s ease-out;
  }
`;

export default Home