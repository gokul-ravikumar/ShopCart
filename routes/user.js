const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");
const userAuth = require("../middlewares/userAuth");
const { sendOTP, verifyOTP } = require("../controllers/user");

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

// GET: Render the OTP login page (phone input)
router.get("/otp-page", (req, res) => {
  res.render("user/otp-login", { message: null });
});

router.post("/send-otp", sendOTP);

//GET: render verify-otp
router.get("/verify-otp", (req, res) => {
  res.render("user/otp", { message: null });
});

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", sendOTP);

// Logout
router.get("/logout", userAuth.checkUserSession, controllers.logout);

module.exports = router;
