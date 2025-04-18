import express from "express";
import { getPublicProducts } from "../controllers/product_controller.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getPublicProducts);

export default router; 