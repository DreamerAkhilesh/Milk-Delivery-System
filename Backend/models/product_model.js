import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [
    {
      type: String, // URLs of product images
      required: true,
    },
  ],
  quantity: {
    type: String, // Example: "500ml", "1L"
    required: true,
  },
  category: {
    type: String,
    enum: ["Milk", "Curd", "Cheese", "Butter", "Paneer", "Other"],
    required: true,
  },
  subcategory: {
    type: String,
    enum: [
      "Cow Milk", "Buffalo Milk", "Toned Milk", "Full Cream Milk",
      "Greek Yogurt", "Probiotic Curd", "Fresh Cream",
      "Cottage Cheese", "Processed Cheese", "Mozzarella",
      "Unsalted Butter", "Salted Butter", "Ghee",
      "Soft Paneer", "Hard Paneer",
      "Other"
    ],
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
