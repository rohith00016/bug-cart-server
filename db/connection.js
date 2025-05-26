const mongoose = require("mongoose");
const seedDatabase = require("./seed");

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecommerce");
    console.log("MongoDB is connected");
    seedDatabase();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
