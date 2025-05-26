const Product = require("../model/product");
const { products } = require("../data/products");

async function seedDatabase() {
  try {
    const productList = await Product.find();
    if (productList.length > 0) {
      console.log("Database is already seeded");
      return;
    }
    await Product.insertMany(products);

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = seedDatabase;
