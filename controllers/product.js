const Product = require("../model/product");

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, sort, search = "", category, subCategory } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = type;
    }

    // Sorting
    let sortOption = {};
    if (sort === "lowToHigh") {
      sortOption.price = 1;
    } else if (sort === "highToLow") {
      sortOption.price = -1;
    }

    // Count total with filters
    const total = await Product.countDocuments(query);

    // Fetch paginated and sorted products
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page: Number(page),
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};
