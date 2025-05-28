const Cart = require("../model/cart");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(200).json({ userId: req.user._id, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, size }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size });
      }
    }

    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const increaseQty = async (req, res) => {
  const { productId, size } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity += 1;
    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const decreaseQty = async (req, res) => {
  const { productId, size } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId, size } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );
    await cart.save();
    await cart.populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
};
