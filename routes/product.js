const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const Product = require("../models/Product");
const User = require("../models/User");

// 🧾 Show all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products/index", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
});

// 🆕 Render new product form
router.get("/new", async (req, res) => {
  res.render("products/new");
});

// 🧠 Show single product details
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // 👇 Note: keep the folder structure consistent
    res.render("products/product-detail", { product, hidePageHeader: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ➕ Create new product
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { product } = req.body;

    const newProduct = new Product({
      ...product,
      image: req.files.map((obj) => ({
        filename: obj.filename,
        url: `/uploads/${obj.filename}`,
      })),
    });
    console.log("obj",obj)

    await newProduct.save();
    console.log("✅ New product saved:", newProduct);

    res.redirect("/product");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating product");
  }
});

module.exports = router;
