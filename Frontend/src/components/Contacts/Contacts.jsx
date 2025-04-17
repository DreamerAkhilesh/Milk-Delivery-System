import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Navbar />
      <motion.div 
        className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
              Get in Touch
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <FaPhone className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <CardTitle className="text-sm font-semibold mb-1">Phone</CardTitle>
                  <p className="text-xs text-gray-600">+1 (123) 456-7890</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <FaEnvelope className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <CardTitle className="text-sm font-semibold mb-1">Email</CardTitle>
                  <p className="text-xs text-gray-600">info@milkdelivery.com</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <FaMapMarkerAlt className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <CardTitle className="text-sm font-semibold mb-1">Address</CardTitle>
                  <p className="text-xs text-gray-600">123 Milk Street, Dairy City, DC 12345</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <FaClock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <CardTitle className="text-sm font-semibold mb-1">Working Hours</CardTitle>
                  <p className="text-xs text-gray-600">Mon-Fri: 9AM-6PM</p>
                  <p className="text-xs text-gray-600">Sat: 10AM-4PM</p>
                  <p className="text-xs text-gray-600">Sun: Closed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              variants={itemVariants}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    required
                    className="h-24"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
                >
                  <FaPaperPlane className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Contacts;
