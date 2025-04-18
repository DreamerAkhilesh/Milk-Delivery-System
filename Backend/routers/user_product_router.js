import express from "express";
import { 
    getAllProducts, 
    getProductById, 
    getProductsByCategory, 
    searchProducts 
} from "../controllers/products_controller.js";

const router = express.Router();

// User product viewing routes
router.get("/", getAllProducts); // Public view of all products
router.get("/:id", getProductById); // Public view of single product
router.get("/category/:category", getProductsByCategory); // Products by category
router.get("/search", searchProducts); // Search products

export default router; 