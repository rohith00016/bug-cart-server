const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Ensure a product can only be added once to a user's wishlist
wishlistSchema.index({ userId: 1, "items.productId": 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
