import React, { useState, useEffect } from "react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../utils/constant";
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

  // Add axios config with authorization
  const axiosConfig = {
    headers: {
      'Authorization': localStorage.getItem('adminToken')
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/products`, axiosConfig);
      // Group products by category
      const groupedProducts = response.data.products.reduce((acc, product) => {
        const categoryId = categoriesData.find(cat => cat.name === product.category)?.id;
        if (categoryId) {
          if (!acc[categoryId]) acc[categoryId] = [];
          acc[categoryId].push({
            ...product,
            id: product._id,
            image: product.images[0]
          });
        }
        return acc;
      }, {});
      setProducts(groupedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update newProduct state with the preview URL
      setNewProduct(prev => ({
        ...prev,
        images: [previewUrl]
      }));
    }
  };

  const handleAddOrUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('pricePerDay', newProduct.pricePerDay);
      formData.append('quantity', newProduct.quantity);
      formData.append('category', newProduct.category);
      formData.append('availability', newProduct.availability);
      
      if (imageFile) {
        formData.append('productImage', imageFile);
      }

      const config = {
        headers: {
          'Authorization': localStorage.getItem('adminToken'),
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editMode) {
        await axios.put(
          `${ADMIN_API_END_POINT}/products/${newProduct.id}`,
          formData,
          config
        );
      } else {
        await axios.post(
          `${ADMIN_API_END_POINT}/products/add`,
          formData,
          config
        );
      }

      // Refresh products list
      await fetchProducts();
      
      // Reset form
      setIsOpen(false);
      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);
      setNewProduct({
        name: "",
        description: "",
        pricePerDay: "",
        images: [""],
        quantity: "",
        category: "Milk",
        availability: true,
      });

      toast.success(`Product ${editMode ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Error saving product");
    }
  };

  const removeProduct = async (id) => {
    try {
      await axios.delete(`${ADMIN_API_END_POINT}/products/${id}`, axiosConfig);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Error deleting product");
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
