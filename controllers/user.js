const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendResetEmail = require("../emails/sendResetPasswordEmail");

const signup = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userData = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await userData.save();

    res.status(201).json({
      message: "Signup successful. Please log in.",
      user: {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        shippingAddress: userData.shippingAddress,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Some internal error occurred" });
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "User Email Address Not Found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "User Password is incorrect" });
    }

    if (isMatch && user) {
      const token = await user.generateAuthToken();
      return res.status(200).send({
        message: "You have successfully signed in!",
        user: user,
        token: token,
      });
    }

    res.status(401).send({
      message:
        "Your login credentials are incorrect, kindly check and re-enter!",
    });
  } catch (e) {
    res.status(500).send({ message: "Some Internal Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).send({ message: "User not found" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await sendResetEmail(email, resetLink);
    res.send({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error sending email" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid token or user not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Reset token is invalid or has expired" });
  }
};

const getUser = async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      res.send({
        user: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          shippingAddress: user.shippingAddress,
        },
      });
    } else {
      res.send({ message: "User Not Found" });
    }
  } catch (e) {
    res.send({ message: "Some Internal Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const updates = req.body;
    const allowedUpdates = ["name", "email", "mobile", "shippingAddress"];
    const isValidUpdate = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).send({ message: "Invalid update fields" });
    }

    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.mobile) user.mobile = updates.mobile;
    if (updates.shippingAddress) {
      user.shippingAddress = {
        ...user.shippingAddress,
        ...updates.shippingAddress,
      };
    }

    await user.save();
    res.send({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        shippingAddress: user.shippingAddress,
      },
    });
  } catch (e) {
    console.error("Error updating profile:", e);
    res.status(500).send({ message: "Some internal error occurred" });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getUser,
  updateProfile,
};
