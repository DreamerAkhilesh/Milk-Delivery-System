import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import ChatWindow from "../LiveChat/ChatWindow";
import ChatButton from "../LiveChat/ChatButton";

const AboutUs = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Welcome to</span>
                    <span className="block text-[#00B86C]">Divya Dairy</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                    Your trusted partner in delivering farm-fresh dairy products since 2024.
                  </p>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">Our Story</h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                Founded in 2024, Divya Dairy began with a simple mission: to bridge the gap between local dairy farmers and urban households. What started as a small delivery service has now grown into a trusted name in dairy distribution.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Beginning</h3>
                <p className="text-gray-600">Started with just 50 customers and 3 local dairy farmers, delivering fresh milk in the local community.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-gray-600">Expanded our network to include more farmers and introduced a wider range of dairy products.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Today</h3>
                <p className="text-gray-600">Serving 1000+ happy customers with a network of 20+ certified dairy farmers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-[#00B86C]/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver the purest dairy products while supporting local farmers and promoting sustainable dairy practices. We aim to:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Ensure timely delivery of fresh products
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Support local dairy farmers
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Maintain highest quality standards
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-[#00B86C]/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🔮</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become the most trusted dairy delivery service in India, known for:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Innovation in dairy distribution
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Farmer welfare and empowerment
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Customer satisfaction
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Standards */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Our Quality Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧪</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Testing</h3>
                <p className="text-gray-600">Regular quality checks at every stage</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❄️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cold Chain</h3>
                <p className="text-gray-600">Temperature controlled delivery</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Packaging</h3>
                <p className="text-gray-600">Hygienic and eco-friendly packaging</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                <p className="text-gray-600">FSSAI certified operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#00B86C]/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">👨</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Rahul Sharma</h4>
                    <p className="text-sm text-gray-500">Customer since 2024</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The quality of milk is exceptional, and the delivery is always on time. Best dairy service in the city!"
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#00B86C]/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">👩</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Priya Patel</h4>
                    <p className="text-sm text-gray-500">Customer since 2024</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Their subscription service is very convenient, and the products are always fresh. Highly recommended!"
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#00B86C]/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">👨</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Amit Kumar</h4>
                    <p className="text-sm text-gray-500">Customer since 2024</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Great customer service and pure products. My family loves their dairy products!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Contact Us
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                We're here to help! Reach out through any of these channels:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Phone Contact */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">📞</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h3>
                  <a 
                    href="tel:+919838339148"
                    className="text-[#00B86C] hover:text-[#00B86C]/80 font-medium text-lg"
                  >
                    +91 9838339148
                  </a>
                  <p className="mt-2 text-gray-500">Available 24/7</p>
                </div>
              </div>

              {/* Email Contact */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">📧</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Us</h3>
                  <a 
                    href="mailto:support@divyadairy.com"
                    className="text-[#00B86C] hover:text-[#00B86C]/80 font-medium text-lg break-all"
                  >
                    support@divyadairy.com
                  </a>
                  <p className="mt-2 text-gray-500">Response within 24 hours</p>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#00B86C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Chat</h3>
                  <Button 
                    variant="outline"
                    className="text-[#00B86C] hover:text-white hover:bg-[#00B86C] border-[#00B86C]"
                    onClick={() => setIsChatOpen(true)}
                  >
                    Start Chat
                  </Button>
                  <p className="mt-2 text-gray-500">Available on website & app</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Business Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monday - Saturday</span>
                    <span className="text-gray-900 font-medium">6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900 font-medium">6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-4 pt-4 border-t">
                    * Emergency support available 24/7 via phone
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Components */}
      {isChatOpen ? (
        <ChatWindow onClose={() => setIsChatOpen(false)} />
      ) : (
        <ChatButton onClick={() => setIsChatOpen(true)} />
      )}
    </>
  );
};

export default AboutUs; 