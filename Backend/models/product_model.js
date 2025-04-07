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
      type: String, 
      required: true,
    },
  ],
  quantity: {
    type: String, 
    required: true,
  },
  category: {
    type: String,
    enum: ["Milk", "Milk Products", "Traditional Sweets"],
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
