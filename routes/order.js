const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
} = require("../controllers/order");
const { auth } = require("../middleware/auth");

router.post("/", auth, createOrder);
router.get("/", auth, getUserOrders);
router.get("/:id", auth, getOrderById);

module.exports = router;
