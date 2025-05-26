const Review = require("../model/review");
const Product = require("../model/product");

// Create a new review
exports.createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user._id;
  if (!productId || !rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "Product ID and valid rating (1-5) are required" });
  }

  // Check if product exists
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

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const reviews = await Review.find({ productId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ reviews, count: reviews.length });
};

// Update a review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  // Validate input
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Check if user owns the review
  if (review.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You can only update your own reviews" });
  }

  // Update fields
  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();
  res.status(200).json({ message: "Review updated successfully", review });
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
