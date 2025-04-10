import express from "express";
import { upload } from "../middlewares/upload_middleware.js";
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, searchProducts } from "../controllers/products_controller.js";
import { verifyAdmin } from "../middlewares/auth_middleware.js";

const router = express.Router();

// Admin routes
router.post("/add", verifyAdmin, upload.single('productImage'), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", verifyAdmin, upload.single('productImage'), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/search", searchProducts);

export default router;

