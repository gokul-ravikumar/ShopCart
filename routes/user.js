const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");
const userAuth = require("../middlewares/userAuth");
const {
  sendOTP,
  verifyOTP,
  checkUser,
  verifyOtpForgot,
  changePassword,
} = require("../controllers/user");

// Render login page (GET)
router.get("/login", userAuth.isUserLoggedIn, controllers.loadLogin);

// Handle login form submission (POST)
router.post("/login", controllers.login);

// Render register page (GET)
router.get("/register", userAuth.isUserLoggedIn, controllers.loadRegister);

// Handle register form submission (POST)
router.post("/register", controllers.register);

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

//forgot-password
router.get("/forgotPassword", (req, res) => {
  res.render("user/forgot-password", { message: null });
});

//forgot-password POST
router.post("/forgotPassword", checkUser);

//verifying otp
router.get("/verify-forgotOtp", (req, res) => {
  res.render("/user/verifyForgotPasswordOtp", { message: null });
});

router.post("/verify-forgotOtp", verifyOtpForgot);

//reset-password
router.get("/reset-password", (req, res) => {
  res.render("user/resetPassword", { message: null });
});

router.post("/reset-password", changePassword);

//cart
router.get("/cart", userAuth.checkUserSession, controllers.cart);

//add to cart
router.post(
  "/addToCart",
  userAuth.checkUserSession,
  controllers.addToCartProduct,
);

// quantity operation( decrementing quantity , incrementing already in add to cart route --above--)
router.post(
  "/decrementCart",
  userAuth.checkUserSession,
  controllers.decrementCartProduct,
);

// Checkout (GET)
router.get("/checkout", userAuth.checkUserSession, controllers.checkout);

// Checkout (POST)
router.post("/checkout", userAuth.checkUserSession, controllers.processCheckout);

//my orders
router.get("/myOrders", userAuth.checkUserSession, controllers.myOrders);

// Logout
router.get("/logout", userAuth.checkUserSession, controllers.logout);

module.exports = router;
