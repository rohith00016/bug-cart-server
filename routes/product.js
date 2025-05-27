const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getLatestProducts,
  getBestSellers,
  getRelatedProducts,
} = require("../controllers/product");

router.get("/", getAllProducts);
router.get("/latest", getLatestProducts);
router.get("/bestsellers", getBestSellers);
router.get("/related", getRelatedProducts);
router.get("/:id", getProductById);

module.exports = router;
