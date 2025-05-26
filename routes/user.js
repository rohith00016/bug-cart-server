const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getUser,
  updateProfile,
} = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-profile", auth, updateProfile);

router.get("/user", auth, getUser);

module.exports = router;
