import Product from "../models/product_model.js";

/**
 * Add a new product (Admin only)
 */
export const addProduct = async (req, res) => {
  try {
    const { name, description, pricePerDay, quantity, category, availability } = req.body;

    // Validate required fields
    if (!name || !description || !pricePerDay || !quantity || !category) {
      return res.status(400).json({ message: "Name, description, price, quantity, and category are required." });
    }

    // Create image path if file was uploaded
    const imagePath = req.file ? `/src/assets/products/${req.file.filename}` : null;

    // Create new product
    const newProduct = new Product({
      name,
      description,
      pricePerDay,
      images: imagePath ? [imagePath] : [], // Store the relative path
      quantity,
      category,
      availability: availability ?? true,
    });

    // Save product to database
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


/**
 * Get all products with optional filters
 */
export const getAllProducts = async (req, res) => {
  try {
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

    // Fetch products based on filters
    const products = await Product.find(query);

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No products found",
        products: []
      });
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ 
      message: "Failed to fetch products", 
      error: error.message 
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


