const Wishlist = require("../model/wishlist");

// Get wishlist by user ID
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId }],
      });
    } else {
      if (
        !wishlist.items.find((item) => item.productId.toString() === productId)
      ) {
        wishlist.items.push({ productId });
      } else {
      }
    }

    await wishlist.save();
    await wishlist.populate("items.productId");
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await wishlist.save();
    await wishlist.populate("items.productId");
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
