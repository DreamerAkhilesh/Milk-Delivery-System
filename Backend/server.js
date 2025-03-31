import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies


const PORT = process.env.PORT || 3000 ;
app.listen(PORT,()=> { 
    console.log(`Server running at port ${PORT}`) ;
}) ;



import userRoutes from "./routers/user_router.js"; // Import user routes


// Routes
app.use("/api/v1/users", userRoutes); // User routes