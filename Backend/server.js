import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import userRoutes from "./routers/user_router.js";
import adminRoutes from "./routers/admin_router.js";
import adminProductRoutes from "./routers/admin_product_router.js";
import userProductRoutes from "./routers/user_product_router.js";
import publicProductRoutes from "./routers/public_product_router.js";

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://milk-delivery-frontend.onrender.com', 'http://localhost:5173'] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);
app.use("/api/v1/user/products", userProductRoutes);
app.use("/api/v1/products", publicProductRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
    console.log(`Allowed origins: ${corsOptions.origin}`);
});