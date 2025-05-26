const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { auth } = require("../middleware/auth");

router.get("/", auth, cartController.getCart);
router.post("/add", auth, cartController.addToCart);
router.post("/increase", auth, cartController.increaseQty);
router.post("/decrease", auth, cartController.decreaseQty);
router.post("/remove", auth, cartController.removeFromCart);

module.exports = router;
