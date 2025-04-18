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
      required: false,
    },
  ],
  quantity: {
    type: Number, 
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ["Milk", "Milk Products", "Traditional Sweets"],
    required: true,
  },
  subcategory: {
    type: String,
    required: false,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.model("Product", productSchema);
