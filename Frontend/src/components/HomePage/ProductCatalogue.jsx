import React, { useRef, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CatalogueCard from "./CatalogueCard";
import axios from "axios";
import { USER_PRODUCTS_API_END_POINT, ADMIN_PRODUCTS_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";

const ProductsCatalogue = ({ isAdmin = false }) => {
  const scrollRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: true,
      offset: 100
    });
    fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = isAdmin ? ADMIN_PRODUCTS_API_END_POINT : USER_PRODUCTS_API_END_POINT;
      const response = await axios.get(endpoint);
      
      console.log('Products API Response:', response.data);

      // Handle empty or invalid response
      if (!response.data?.data?.products) {
        console.error('Invalid response format:', response.data);
        setProducts([]);
        return;
      }

      const productsData = response.data.data.products;
      const limitedProducts = productsData.slice(0, 8).map(product => ({
        ...product,
        _id: product.id // Map id to _id for consistency
      }));
      
      console.log('Limited products:', limitedProducts);
      setProducts(limitedProducts);
    } catch (error) {
      console.error("Error fetching products:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.message);
      setProducts([]); // Set empty products array on error
      
      if (error.response) {
        toast.error(`Failed to load products: ${error.response.data?.message || 'Server error'}`);
      } else if (!error.response) {
        toast.error("Failed to load products: No response from server. Please make sure the backend server is running.");
      } else {
        toast.error(`Failed to load products: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const scrollProgress = scrollLeft / (scrollWidth - clientWidth);
        const section = Math.round(scrollProgress * 2);
        setActiveSection(Math.min(Math.max(section, 0), 2));
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleWheelScroll = (e) => {
    e.preventDefault();
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleTouchScroll = (e) => {
    if (scrollRef.current) {
      const touch = e.touches[0];
      const startX = touch.clientX;
      
      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const diff = startX - touch.clientX;
        scrollRef.current.scrollLeft += diff / 5;
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', handleTouchMove);
      }, { once: true });
    }
  };

  const scrollToSection = (section) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const scrollableWidth = scrollWidth - clientWidth;
      const targetScroll = (section / 2) * scrollableWidth;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-[#E6F4FA]">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 p-4 bg-red-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error Loading Products</h2>
            <p>{error}</p>
            <button 
              onClick={fetchProducts} 
              className="mt-4 px-4 py-2 bg-[#49BDE9] text-white rounded-md hover:bg-[#3A9BC7] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-[#E6F4FA]">
      <div className="container mx-auto px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Our Premium Products
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover our range of fresh, high-quality dairy products sourced directly from local farms.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BDE9]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Available</h3>
              <p className="text-gray-600 mb-4">
                {isAdmin 
                  ? "You haven't added any products yet. Click the button below to add your first product."
                  : "We're currently updating our product catalog. Please check back soon!"}
              </p>
              {isAdmin && (
                <button
                  onClick={() => window.location.href = '/admin/products/add'}
                  className="px-4 py-2 bg-[#49BDE9] text-white rounded-md hover:bg-[#3A9BC7] transition-colors"
                >
                  Add New Product
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              onWheel={handleWheelScroll}
              onTouchStart={handleTouchScroll}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="transform transition-transform hover:scale-105"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <CatalogueCard product={product} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <a
                href="/products"
                className="inline-block px-6 py-2 bg-[#49BDE9] text-white rounded-md hover:bg-[#3A9BC7] transition-colors"
              >
                View All Products
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsCatalogue;