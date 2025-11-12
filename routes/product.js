const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/product");
const Product = require("../models/Product");
const User = require("../models/User");

//show products
router.get("/", async (req, res) => {
  let products = await Product.find();
  res.render("products/index.ejs", { products, user: req.session.user });
});

//render product form
router.get("/new", async (req, res) => {
  res.render("products/new.ejs");
});

//create product
router.post("/", upload.array("product[images][]", 5), async (req, res) => {
  let { product } = req.body;

  let newProduct = new Product({
    ...product,
  });

  newProduct.image = req.files.map((obj) => {
    return {
      filename: obj.filename,
      url: obj.path,
    };
  });

  let productRes = await newProduct.save();
  console.log(productRes);
  res.redirect("/product");
});

module.exports = router;
