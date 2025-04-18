import React, { useState, useEffect } from "react";
import axios from "axios";
import { ADMIN_PRODUCTS_API_END_POINT } from "../../utils/constant";
import Navbar from "../shared/Navbar";
import AdminProductCard from "./ProductCardAdmin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const categoriesData = [
  { id: 1, name: "Milk", icon: "🥛" },
  { id: 2, name: "Milk Products", icon: "🥘" },
  { id: 3, name: "Traditional Sweets", icon: "🍬" },
];

const initialProducts = {
  1: [
    { id: 1, name: "Buffalo Milk", description: "Pure buffalo milk", image: "../src/assets/milk.jpg" },
  ],
  2: [
    { id: 2, name: "Paneer", description: "Soft paneer", image: "../src/assets/milk.jpg" },
  ],
  3: [
    { id: 3, name: "Ladoo", description: "Homemade ladoos", image: "../src/assets/milk.jpg" },
  ],
};

const AdminProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [products, setProducts] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    images: [""],
    quantity: "",
    category: "Milk",
    availability: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Add token management functions
  const getAdminToken = () => {
    const token = localStorage.getItem('adminToken');
    console.log('Token found in localStorage:', token ? 'Yes' : 'No');
    if (!token) {
      console.error('No admin token found in localStorage');
      window.location.href = '/admin/login';
      return null;
    }
    console.log('Token format:', {
      length: token.length,
      startsWith: token.substring(0, 10) + '...',
      endsWith: '...' + token.substring(token.length - 10)
    });
    return token;
  };

  // Add health check function
  const checkServerHealth = async () => {
    try {
      console.log('Checking server health...');
      const response = await axios.get('http://localhost:5000/health');
      console.log('Health check response:', response.data);
      return response.data.success && response.data.data?.status === 'ok';
    } catch (error) {
      console.error('Server health check failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      return false;
    }
  };

  const fetchProducts = async () => {
    try {
      // Check server health first
      const isServerHealthy = await checkServerHealth();
      if (!isServerHealthy) {
        toast.error("Backend server is not responding. Please make sure the server is running.");
        return;
      }

      const token = getAdminToken();
      if (!token) {
        return; // getAdminToken will handle the redirect
      }

      console.log('Making API request with config:', {
        url: 'http://localhost:5000/api/v1/admin/products',
        headers: {
          'Authorization': `Bearer ${token.substring(0, 10)}...`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      try {
        const response = await axios.get('http://localhost:5000/api/v1/admin/products', config);
        
        console.log('API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        });

        if (!response.data?.data?.products) {
          console.error('Invalid response format:', response.data);
          setProducts({}); // Set empty products object
          return;
        }

        // Group products by category
        const groupedProducts = response.data.data.products.reduce((acc, product) => {
          const categoryId = categoriesData.find(cat => cat.name === product.category)?.id;
          if (categoryId) {
            if (!acc[categoryId]) acc[categoryId] = [];
            acc[categoryId].push({
              ...product,
              id: product._id,
              image: product.images?.[0] || null
            });
          }
          return acc;
        }, {});
        setProducts(groupedProducts);
      } catch (error) {
        console.error("API Request Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          config: error.config
        });

        if (error.response?.status === 401) {
          console.error('Authentication failed - Token expired or invalid');
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        } else if (error.response?.status === 403) {
          console.error('Access forbidden - Insufficient permissions');
          toast.error("You don't have permission to access this page");
          window.location.href = '/admin/login';
        } else if (error.response?.status === 404) {
          console.error('Endpoint not found');
          toast.error("The requested resource was not found");
        } else if (error.response?.status === 500) {
          console.error('Server error:', error.response.data);
          toast.error("Server error. Please try again later.");
        } else if (!error.response) {
          console.error('Network error - No response from server');
          toast.error("Could not connect to the server. Please check your connection.");
        } else {
          console.error('Unexpected error:', error);
          toast.error(error.response?.data?.message || "An unexpected error occurred");
        }
        setProducts({}); // Set empty products object on error
      }
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      toast.error("An unexpected error occurred while fetching products");
      setProducts({});
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => URL.createObjectURL(file));
      setImageFile(files);
      setImagePreview(newImages);
      
      setNewProduct(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const token = getAdminToken();
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Add required fields
      formData.append('name', newProduct.name.trim());
      formData.append('description', newProduct.description.trim());
      formData.append('pricePerDay', parseFloat(newProduct.pricePerDay));
      formData.append('quantity', parseInt(newProduct.quantity));
      formData.append('category', newProduct.category);
      formData.append('availability', newProduct.availability);
      
      // Add images if present
      if (imageFile) {
        imageFile.forEach((file, index) => {
          formData.append('productImages', file); // Changed from 'images' to 'productImages' to match backend
        });
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      console.log('Sending product data:', {
        name: newProduct.name,
        description: newProduct.description,
        pricePerDay: newProduct.pricePerDay,
        quantity: newProduct.quantity,
        category: newProduct.category,
        availability: newProduct.availability,
        imageCount: imageFile ? imageFile.length : 0
      });

      const endpoint = editMode 
        ? `${ADMIN_PRODUCTS_API_END_POINT}/${newProduct.id}`
        : `${ADMIN_PRODUCTS_API_END_POINT}/add`;

      const response = editMode
        ? await axios.put(endpoint, formData, config)
        : await axios.post(endpoint, formData, config);

      console.log('Product API Response:', response.data);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Invalid response from server');
      }

      await fetchProducts();
      setIsOpen(false);
      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);
      setNewProduct({
        name: "",
        description: "",
        pricePerDay: "",
        images: [],
        quantity: "",
        category: "Milk",
        availability: true,
      });
      setFormErrors({});

      toast.success(`Product ${editMode ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error("Error saving product:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Invalid product data";
        toast.error(errorMessage);
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = '/admin/login';
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (!error.response) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(error.response?.data?.message || "Error saving product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = getAdminToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      };

      await axios.delete(`${ADMIN_PRODUCTS_API_END_POINT}/${id}`, config);
      await fetchProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(error.response?.data?.message || "Error deleting product");
      }
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      ...product,
      pricePerDay: product.pricePerDay || "",
      images: [product.image || ""],
    });
    setEditMode(true);
    setIsOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setNewProduct((prev) => ({ ...prev, category: value }));
  };

  const validateForm = () => {
    // Implement form validation logic here
    return true; // Placeholder return, actual implementation needed
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 flex">
        <div className="w-1/4 h-[80vh] overflow-y-auto border-r border-gray-300 pr-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800">Categories</h2>
          <div className="flex flex-col space-y-2">
            {categoriesData.map((category) => (
              <button
                key={category.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  selectedCategory === category.id ? "bg-[#00B86C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-lg font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-3/4 pl-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Manage {categoriesData.find((cat) => cat.id === selectedCategory)?.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products[selectedCategory] || []).map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onDelete={removeProduct}
                onEdit={handleEdit}
              />
            ))}

            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setEditMode(false); }}>
              <DialogTrigger asChild>
                <div
                  onClick={() => { setIsOpen(true); setEditMode(false); }}
                  className="flex flex-col justify-center items-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:shadow-lg transition"
                >
                  <span className="text-5xl text-gray-400">+</span>
                  <p className="mt-2 text-gray-600 font-medium">Add New Product</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white text-black shadow-2xl border border-gray-300">
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <Input name="name" value={newProduct.name} onChange={handleFormChange} placeholder="Product Name" />
                  <Textarea name="description" value={newProduct.description} onChange={handleFormChange} placeholder="Description" />
                  <Input name="pricePerDay" type="number" value={newProduct.pricePerDay} onChange={handleFormChange} placeholder="Price Per Day" />
                  <Input name="quantity" value={newProduct.quantity} onChange={handleFormChange} placeholder="Quantity" />
                  
                  {/* Image upload section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <Select value={newProduct.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Milk">Milk</SelectItem>
                      <SelectItem value="Milk Products">Milk Products</SelectItem>
                      <SelectItem value="Traditional Sweets">Traditional Sweets</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddOrUpdateProduct}>{editMode ? "Update" : "Add"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductPage;
