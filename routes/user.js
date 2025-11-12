const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");
const userAuth = require("../middlewares/userAuth");

// Render login page (GET)
router.get("/login", userAuth.isUserLoggedIn, controllers.loadLogin);

// Handle login form submission (POST)
router.post("/login", controllers.login);

// Render register page (GET)
router.get("/register", userAuth.isUserLoggedIn, controllers.loadRegister);

// Handle register form submission (POST)
router.post("/register", controllers.register);

// Protected dashboard
router.get("/dashboard", userAuth.checkUserSession, controllers.loadDashboard);

// Logout
router.get("/logout", userAuth.checkUserSession, controllers.logout);

module.exports = router;
