const Review = require("../model/review");
const Product = require("../model/product");

exports.createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user._id;
  if (!productId || !rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "Product ID and valid rating (1-5) are required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    const review = new Review({
      userId,
      productId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const reviews = await Review.find({ productId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length) *
            10
        ) / 10
      : 0;

  res.status(200).json({
    reviews,
    count: reviews.length,
    averageRating: avgRating,
  });
};

exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ reviews, count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
