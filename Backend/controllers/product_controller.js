export const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .select('name description price images category availability')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error fetching public products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products"
        });
    }
}; 