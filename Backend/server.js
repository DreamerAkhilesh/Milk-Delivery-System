import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import userRoutes from "./routers/user_router.js";
import adminRoutes from "./routers/admin_router.js";
import productRoutes from "./routers/product_router.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.urlencoded({extended:true})) ;
app.use(cookieParser()) ;
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions)) ;
app.use(express.json()); // To parse JSON request bodies


const PORT = process.env.PORT || 3000 ;
app.listen(PORT,()=> { 
    console.log(`Server running at port ${PORT}`) ;
}) ;



// Routes
app.use("/api/v1/user", userRoutes); // User routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user/products", productRoutes); // Products routes