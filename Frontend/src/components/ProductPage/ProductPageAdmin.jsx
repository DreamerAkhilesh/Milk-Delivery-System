import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import AdminProductCard from "./ProductCardAdmin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const [products, setProducts] = useState(initialProducts);
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

  const removeProduct = (id) => {
    setProducts({
      ...products,
      [selectedCategory]: products[selectedCategory].filter((product) => product.id !== id),
    });
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

  const handleAddOrUpdateProduct = () => {
    const categoryId = categoriesData.find((cat) => cat.name === newProduct.category)?.id;

    if (!categoryId) return;

    if (editMode) {
      setProducts({
        ...products,
        [categoryId]: products[categoryId].map((product) =>
          product.id === newProduct.id ? { ...newProduct, image: newProduct.images[0] } : product
        ),
      });
    } else {
      const updated = {
        ...products,
        [categoryId]: [
          ...(products[categoryId] || []),
          {
            ...newProduct,
            id: Date.now(),
            image: newProduct.images[0] || "default.jpg",
          },
        ],
      };
      setProducts(updated);
    }

    setIsOpen(false);
    setEditMode(false);
    setNewProduct({
      name: "",
      description: "",
      pricePerDay: "",
      images: [""],
      quantity: "",
      category: "Milk",
      availability: true,
    });

    setSelectedCategory(categoryId);
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
                  <Input name="images" value={newProduct.images[0]} onChange={(e) => setNewProduct((prev) => ({ ...prev, images: [e.target.value] }))} placeholder="Image URL" />
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
