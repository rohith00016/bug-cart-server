const User = require("../model/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const sendResetEmail = require("../emails/sendResetPasswordEmail");

//POST REQUEST
router.post("/signup", async (req, res) => {
  try {
    // Checking if the user is already registered
    let user = await User.findOne({ email: req.body.email });

    // If user already exists
    if (user) {
      console.log("User is found", req.body.email);
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating new user data
    const userData = new User({
      ...req.body, // Copying req.body data
      password: hashedPassword, // Setting the hashed password
    });

    // Saving user data to database
    await userData.save();

    // Sending response after user creation
    res.status(201).json({
      message: "Signup successful. Please log in.",
      user: {
        name: userData.name,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Some internal error occurred" });
  }
});

// Signin
router.post("/login", async (req, res) => {
  // res.send(req.body)
  try {
    // Checking Email address
    let user = await User.findOne({
      //checking by user detail with email
      email: req.body.email,
    });
    console.log(user);
    // console.log(req.body.password)
    if (!user) {
      return res.status(400).send({ message: "User Email Address Not Found" });
    }

    // Checking by user with Password
    const isMatch = await bcrypt.compare(req.body.password, user.password); //from postman, from the email
    if (!isMatch) {
      return res.status(400).send({ message: "User Password is incorrect" });
    }

    //if user and match both  validation are suvccessful then generate the token

    if (isMatch && user) {
      const token = await user.generateAuthToken();
      return res.status(200).send({
        message: "You have successfully Sign In!",
        user: user,
        token: token,
      });
    }
    // If all conditions failed it will come to this
    res.status(401).send({
      message:
        "Your login credentials are incorrect, kindly check and re-enter!",
    });
  } catch (e) {
    res.status(500).send({ message: "Some Internal Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) return res.status(404).send({ message: "User not found" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`; // adjust frontend URL

    await sendResetEmail(email, resetLink);
    res.send({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error sending email" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use same secret used in link generation

    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ message: "Invalid token or user not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Reset token is invalid or has expired" });
  }
});

// Get Routes
//userdetail
router.get("/user", auth, async (req, res) => {
  try {
    if (req.user) {
      res.send({ userDetail: req.user });
    } else {
      res.send({ message: "User Not Found" });
    }
  } catch (e) {
    res.send({ Message: "Some Internal Error" });
  }
});

module.exports = router;
