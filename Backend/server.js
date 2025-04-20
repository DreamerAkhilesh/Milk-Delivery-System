import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from "./routers/user_router.js";
import adminRoutes from "./routers/admin_router.js";
import adminProductRoutes from "./routers/admin_product_router.js";
import userProductRoutes from "./routers/user_product_router.js";
import publicProductRoutes from "./routers/public_product_router.js";
import subscriptionRoutes from "./routers/subscription_router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Connect to MongoDB Atlas
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://milk-delivery-frontend.onrender.com']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600, // Cache preflight request for 10 minutes
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Add CORS middleware before other middleware
app.use(cors(corsOptions));

// Add response formatter middleware
app.use((req, res, next) => {
  // Store the original json method
  const originalJson = res.json;

  // Override the json method
  res.json = function(data) {
    // Format the response
    const formattedResponse = {
      success: res.statusCode >= 200 && res.statusCode < 300,
      statusCode: res.statusCode,
      message: data.message || 'Operation successful',
      data: data.data || data
    };

    // Call the original json method with the formatted response
    return originalJson.call(this, formattedResponse);
  };

  next();
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Headers:', req.headers);
  next();
});

app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);
app.use("/api/v1/user/products", userProductRoutes);
app.use("/api/v1/products", publicProductRoutes);
app.use("/api/v1/user/subscriptions", subscriptionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'Atlas connected',
    frontend_url: process.env.FRONTEND_URL
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle CORS errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      message: 'Unauthorized access',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle Atlas errors
  if (err.name === 'MongoError') {
    return res.status(500).json({ 
      message: 'Atlas database error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle other errors
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Allowed origins: ${corsOptions.origin}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Atlas URL: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
});