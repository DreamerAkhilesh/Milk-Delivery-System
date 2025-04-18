import express from "express";
import { upload, handleUploadError } from "../middlewares/upload_middleware.js";
import { 
    addProduct, 
    updateProduct, 
    deleteProduct,
    getAllProducts,
    getProductById
} from "../controllers/products_controller.js";
import { verifyAdmin } from "../middlewares/auth_middleware.js";

const router = express.Router();

// Admin product management routes
router.post("/add", verifyAdmin, upload.array('productImages', 5), handleUploadError, addProduct); // Allow up to 5 images
router.put("/:id", verifyAdmin, upload.array('productImages', 5), handleUploadError, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);
router.get("/", verifyAdmin, getAllProducts); // Admin view of all products
router.get("/:id", verifyAdmin, getProductById); // Admin view of single product

export default router; 