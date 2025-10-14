const express = require("express")
const router = express.Router()
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/product")
const Product = require("../models/Product")
const User = require("../models/User")

//show products
router.get("/product", async (req, res) => {
    let products = await Product.find()
    res.render("products/index.ejs", { products })
})

//render product form
router.get("/product/new", async (req, res) => {
    res.render("products/new.ejs")
})

//create product
router.post("/product", upload.array("product[images][]", 5), async (req, res) => {
    console.log(req.body)
})


module.exports = router