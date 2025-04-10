import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';


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



import userRoutes from "./routers/user_router.js"; // Import user routes
import adminRoutes from "./routers/admin_router.js";

// Routes
app.use("/api/v1/users", userRoutes); // User routes
app.use("/api/v1/admin", adminRoutes);