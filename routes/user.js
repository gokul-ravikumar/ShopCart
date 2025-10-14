const express = require("express")
const router = express.Router()
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/user")


//render register form
router.get("/register",controllers.renderRegisterForm)


//create user
router.post("/register", upload.single('user[image]'), controllers.registerUser)

//render login form
router.get("/login", controllers.renderLoginForm)

//login user
router.post("/login", controllers.loginUser)

module.exports = router