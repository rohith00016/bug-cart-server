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
      query.category = { $in: category.split(",") };
    }

    if (subCategory) {
      query.subCategory = { $in: subCategory.split(",") };
    }

    let sortOption = {};
    if (sort === "lowToHigh") {
      sortOption.price = 1;
    } else if (sort === "highToLow") {
      sortOption.price = -1;
    } else if (sort === "relevant") {
      sortOption = { bestseller: -1, date: -1 };
    }

    const total = await Product.countDocuments(query);

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

const getLatestProducts = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({});
    const products = await Product.find({})
      .sort({ date: -1 })
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
    res.status(500).json({ message: "Failed to fetch latest products", error });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({ bestseller: true });
    const products = await Product.find({ bestseller: true })
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
    res.status(500).json({ message: "Failed to fetch bestsellers", error });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    if (!category || !subCategory) {
      return res
        .status(400)
        .json({ message: "Category and subCategory are required" });
    }

    const products = await Product.find({
      category,
      subCategory,
    }).limit(5);

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch related products", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getLatestProducts,
  getBestSellers,
  getRelatedProducts,
};
