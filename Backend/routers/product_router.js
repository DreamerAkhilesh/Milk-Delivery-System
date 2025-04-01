import express from "express";
import { addProduct , getAllProducts , getProductById , updateProduct , deleteProduct , getProductsByCategory , searchProducts } from "../controllers/product_controller.js";

const router = express.Router();


router.post("/admin/products/add", addProduct); // Route to add a new product (only admin can access)
router.get("/products", getAllProducts); // Route to get all products with optional filters
router.get("/products/:id", getProductById); // Route to get a single product by its ID
router.put("/products/:id", updateProduct); // Route to update a product by its ID (only admin can access)
router.delete("/products/:id", deleteProduct); // Route to delete a product by its ID (only admin can access)
router.get("/products/category/:category", getProductsByCategory); // Route to get products by category
router.get("/products/category/:category/:subcategory", getProductsByCategory); // Route to get products by category and subcategory
router.get("/products/search", searchProducts); // Route to search products by name or description


export default router;

