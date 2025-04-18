import express from "express";
import { getAllProducts } from "../controllers/products_controller.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getAllProducts);

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error('Product router error:', err);
  res.status(500).json({
    message: "Error processing product request",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default router; 