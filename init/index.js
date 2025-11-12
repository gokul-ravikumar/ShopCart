const Product = require("../models/Product");
const products = require("./data");
const mongoose = require("mongoose");

//connect to DB
main()
  .then(() => {
    console.log(`conneceted to DB`);
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ShopCart");
}

async function addData() {
  let allProducts = await Product.insertMany(products.products);
  console.log(allProducts);
}

addData();
