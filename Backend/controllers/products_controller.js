import Product from "../models/product_model.js";

/**
 * Add a new product (Admin only)
 */
export const addProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { name, description, pricePerDay, quantity, category = "Milk", availability } = req.body;

    // Validate required fields
    if (!name || !description || !pricePerDay || !quantity) {
      console.log('Missing required fields:', {
        name: !name,
        description: !description,
        pricePerDay: !pricePerDay,
        quantity: !quantity
      });
      return res.status(400).json({ 
        message: "Name, description, price, and quantity are required.",
        missingFields: {
          name: !name,
          description: !description,
          pricePerDay: !pricePerDay,
          quantity: !quantity
        }
      });
    }

    // Validate category
    const validCategories = ["Milk", "Milk Products", "Traditional Sweets"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: "Invalid category. Must be one of: Milk, Milk Products, Traditional Sweets" 
      });
    }

    // Convert price and quantity to numbers
    const numericPrice = parseFloat(pricePerDay);
    const numericQuantity = parseInt(quantity);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ 
        message: "Price must be a valid positive number." 
      });
    }

    if (isNaN(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ 
        message: "Quantity must be a valid positive number." 
      });
    }

    // Handle multiple image uploads
    const imagePaths = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imagePaths.push(`/uploads/products/${file.filename}`);
      });
    }

    // Create new product
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      pricePerDay: numericPrice,
      images: imagePaths,
      quantity: numericQuantity,
      category,
      availability: availability ?? true,
    });

    console.log('Creating new product:', newProduct);

    // Save product to database
    const savedProduct = await newProduct.save();
    console.log('Product saved successfully:', savedProduct);

    res.status(201).json({ 
      message: "Product added successfully", 
      data: {
        product: savedProduct
      }
    });

  } catch (error) {
    console.error("Error adding product:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // If there's a validation error, return specific error message
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        error: error.message,
        details: error.errors 
      });
    }

    res.status(500).json({ 
      message: "Failed to add product", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
};


/**
 * Get all products with optional filters
 */
export const getAllProducts = async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    
    const { category, subcategory, minPrice, maxPrice, availability } = req.query;

    // Build the query object
    let query = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerDay.$lte = parseFloat(maxPrice);
    }
    if (availability !== undefined) {
      query.availability = availability === "true";
    }

    console.log('Final query:', JSON.stringify(query));

    // Fetch products based on filters
    const products = await Product.find(query).exec();

    console.log(`Found ${products.length} products`);

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No products found",
        data: {
          products: [],
          count: 0
        }
      });
    }

    // Format the response
    const response = {
      message: "Products retrieved successfully",
      data: {
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          pricePerDay: Number(product.pricePerDay).toFixed(2),
          quantity: Number(product.quantity),
          category: product.category,
          subcategory: product.subcategory || '',
          availability: Boolean(product.availability),
          images: product.images || [],
          createdAt: product.createdAt
        })),
        count: products.length
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    res.status(500).json({ 
      message: "Failed to fetch products", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


/**
 * Get a single product by its ID
 */
export const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find product by ID
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product retrieved successfully",
        product,
      });
  
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };



  /**
 * Update product details
 */
export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
  
      // If new file is uploaded, update the image path
      if (req.file) {
        updateData.images = [`/src/assets/products/${req.file.filename}`];
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };



  /**
 * Get products by category or subcategory
 */
export const getProductsByCategory = async (req, res) => {
    try {
      const { category, subcategory } = req.params;
  
      let filter = {};
      if (category) filter.category = category;
      if (subcategory) filter.subcategory = subcategory;
  
      const products = await Product.find(filter);
  
      if (!products.length) {
        return res.status(404).json({ message: "No products found for the given category or subcategory" });
      }
  
      res.status(200).json(products);
  
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };





/**
 * Search products by name or description
 */
export const searchProducts = async (req, res) => {
    try {
      const { q } = req.query;
  
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
  
      const products = await Product.find({
        $or: [
          { name: { $regex: q, $options: "i" } },  // Case-insensitive search in name
          { description: { $regex: q, $options: "i" } } // Case-insensitive search in description
        ]
      });
  
      if (!products.length) {
        return res.status(404).json({ message: "No matching products found" });
      }
  
      res.status(200).json(products);
  
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Server error", error });
    }
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


