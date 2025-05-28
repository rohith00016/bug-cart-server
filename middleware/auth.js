const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization Header is Missing" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid Authorization Format" });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // ✅ match signing secret

    req.token = token;
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.error("Auth Error:", e.message);
    return res.status(401).json({ message: "Authentication Error" });
  }
};

const conditionalAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    return auth(req, res, next);
  }
  return next();
};

module.exports = { auth, conditionalAuth };
