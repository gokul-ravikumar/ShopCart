const getCartItemCount = require("../helpers/cartHelper");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

//home route
const homeRouteUser = (req, res) => {
  if (req.session.user) {
    res.redirect("/product");
  } else {
    res.redirect("/user/login");
  }
};

// Load login page
const loadLogin = (req, res) => {
  const message = req.session.message;
  const messageType = req.session.messageType;
  req.session.message = null;
  req.session.messageType = null;

  res.set("Cache-Control", "no-store");
  res.render("user/login", { message, messageType });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("user/login", {
        message: "Invalid credentials",
        messageType: "error",
      });
    }

    // ✅ Blocked user check — render page, NOT JSON
    if (user.isBlocked) {
      return res.render("user/login", {
        message: "Your account has been blocked. Please contact support.",
        messageType: "error",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("user/login", {
        message: "Invalid credentials",
        messageType: "error",
      });
    }
    req.session.user = {
      id: user._id,
      email: user.email,
    };
    return res.redirect("/product");
  } catch (err) {
    console.error(err);
    return res.render("user/login", {
      message: "Something went wrong. Please try again.",
      messageType: "error",
    });
  }
};

// Load register page
const loadRegister = (req, res) => {
  const message = req.session.message;
  req.session.message = null;
  res.render("user/register", { message });
};

// Handle register POST
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.message = "User already exists";
      return res.redirect("/user/register");
    }

    const newUser = new User({ name, email, password, phone });
    console.log(newUser);
    await newUser.save();

    req.session.message = "Registered successfully!";
    res.redirect("/user/login");
  } catch (err) {
    console.error(err);
    req.session.message = "Server error";
    res.redirect("/user/register");
  }
};

// 📤 1. Send OTP
const sendOTP = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.render("user/otp-login", {
      message: "User not found. Please register.",
      messageType: "error",
    });
  }

  if (user.isBlocked) {
    return res.render("user/otp-login", {
      message: "Your account has been blocked. Please contact support.",
      messageType: "error",
    });
  }

  try {
    if (process.env.NODE_ENV === "production") {
      const otpResponse = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({
          to: phone,
          channel: "sms",
        });

      console.log("✅ OTP sent:", otpResponse.sid);
    }

    res.render("user/otp", {
      message: "✅ OTP sent successfully! Please check your phone.",
      messageType: "success",
      phone,
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    res.render("user/otp-login", {
      message: "Failed to send OTP. Please try again.",
      messageType: "error",
    });
  }
};

// ✅ 2. Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.render("user/otp-login", {
        message: "User not found.",
        messageType: "error",
      });
    }

    if (user.isBlocked) {
      return res.render("user/otp-login", {
        message: "Your account has been blocked. Please contact support.",
        messageType: "error",
      });
    }

    if (process.env.NODE_ENV === "production") {
      const verifiedResponse = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
          to: phone,
          code: otp,
        });

      if (verifiedResponse.status === "approved") {
        console.log("✅ OTP verified successfully!");
        req.session.user = { id: user._id, email: user.email, name: user.name };
        return res.redirect("/product");
      } else {
        return res.render("user/otp", {
          message: "Invalid OTP or expired!",
          messageType: "error",
          phone,
        });
      }
    } else {
      req.session.user = { id: user._id, email: user.email, name: user.name };
      return res.redirect("/product");
    }
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return res.render("user/otp-login", {
      message: "Something went wrong. Please try again.",
      messageType: "error",
    });
  }
};

const checkUser = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.render("user/forgot-password", {
      message: "We couldn't find an account for this Phone Number.",
      messageType: "error",
    });
  }

  if (user.isBlocked) {
    return res.render("user/forgot-password", {
      message: "Your account has been blocked. Please contact support.",
      messageType: "error",
    });
  }

  try {
    if (process.env.NODE_ENV === "production") {
      const otpResponse = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({
          to: phone,
          channel: "sms",
        });

      console.log("✅ OTP sent:", otpResponse.sid);
    }

    res.render("user/verifyForgotPasswordOtp", {
      message: "✅ OTP sent successfully! Please check your phone.",
      messageType: "success",
      phone,
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    res.render("user/forgot-password", {
      message: "Failed to send OTP. Please try again.",
      messageType: "error",
    });
  }
};

const verifyOtpForgot = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.render("user/forgot-password", {
        message: "User not found.",
        messageType: "error",
      });
    }

    if (user.isBlocked) {
      return res.render("user/forgot-password", {
        message: "Your account has been blocked. Please contact support.",
        messageType: "error",
      });
    }

    if (process.env.NODE_ENV === "production") {
      const verifiedResponse = await client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
          to: phone,
          code: otp,
        });

      if (verifiedResponse.status === "approved") {
        console.log("✅ OTP verified successfully!");
        return res.render("user/resetPassword", { message: null, phone });
      } else {
        return res.render("user/forgot-password", {
          message: "Invalid OTP or expired!",
          messageType: "error",
          phone,
        });
      }
    } else {
      res.render("user/resetPassword", { message: null, phone });
    }
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    return res.render("user/forgot-password", {
      message: "Something went wrong. Please try again.",
      messageType: "error",
    });
  }
};

//resetting password
const changePassword = async (req, res) => {
  const { phone, password, confirmPassword } = req.body;
  const user = await User.findOne({ phone });

  if (!user) {
    return res.render("user/resetPassword", {
      message: "User not found.",
      messageType: "error",
    });
  }

  if (password === confirmPassword) {
    user.password = confirmPassword;
    await user.save();
    res.redirect("/user/login");
  } else {
    return res.render("user/resetPassword", {
      message: "Passwords are not matching, Try Again",
      messageType: "error",
      phone,
    });
  }
};

//cart
const cart = async (req, res) => {
  const userId = req.session.user.id;
  const cartProducts = await Cart.findOne({ userId }).populate(
    "items.productId",
  );
  console.log("cartProduct", cartProducts);

  let subtotal = 0;
  if (cartProducts && cartProducts.items.length > 0) {
    cartProducts.items.forEach((item) => {
      if (item.productId) {
        subtotal += item.productId.price * item.quantity;
      }
    });
  }
  const shipping = 100; // example
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  res.render("user/cart", {
    cartProducts,
    subtotal,
    shipping,
    tax,
    total,
    hidePageFooter: true,
    hidePageHeader: true,
  });
};

//add to cart
const addToCartProduct = async (req, res) => {
  const userId = req.session.user.id;
  const productId = req.body.productId;

  const userCart = await Cart.findOne({ userId });
  let newQuantity = 1; // default 1 for new cart

  if (!userCart) {
    const data = {
      userId,
      items: [{ productId, quantity: 1 }],
    };
    console.log("DATA =>", data);
    const newCart = new Cart(data);
    await newCart.save();
  } else {
    function checkingProductInCart(productId, data) {
      for (let i = 0; i <= data.items.length - 1; i++) {
        if (data.items[i].productId.toString() === productId) {
          return true;
        }
      }
      return false;
    }
    const isProductAvail = checkingProductInCart(productId, userCart);
    if (isProductAvail) {
      for (let i = 0; i <= userCart.items.length - 1; i++) {
        if (userCart.items[i].productId.toString() === productId) {
          userCart.items[i].quantity += 1;
          newQuantity = userCart.items[i].quantity; // capture updated qty
          break;
        }
      }
      await userCart.save();
    } else {
      const newProduct = { productId, quantity: 1 };
      userCart.items.push(newProduct);
      console.log("saved the product");
      await userCart.save();
    }
  }

  const count = await getCartItemCount(userId);

  const cartProducts = await Cart.findOne({ userId }).populate(
    "items.productId",
  );

  let subtotal = 0;
  if (cartProducts && cartProducts.items.length > 0) {
    cartProducts.items.forEach((item) => {
      if (item.productId) {
        subtotal += item.productId.price * item.quantity;
      }
    });
  }
  const shipping = 100; // example
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  res.status(201).json({
    success: true,
    newQuantity,
    newCartItemCount: count,
    shipping,
    subtotal,
    tax,
    total,
  }); // ✅ added newQuantity
};

//decrementing
const decrementCartProduct = async (req, res) => {
  const userId = req.session.user.id;
  const productId = req.body.productId;

  const userCart = await Cart.findOne({ userId });

  let newQuantity = 0; // default 0 means item got deleted

  for (let i = 0; i <= userCart.items.length - 1; i++) {
    if (userCart.items[i].productId.toString() === productId) {
      if (userCart.items[i].quantity > 1) {
        userCart.items[i].quantity -= 1;
        newQuantity = userCart.items[i].quantity; // capture updated qty
      } else {
        userCart.items.splice(i, 1); // newQuantity stays 0
      }
      break;
    }
  }

  await userCart.save();

  const count = await getCartItemCount(userId);
  const cartProducts = await Cart.findOne({ userId }).populate(
    "items.productId",
  );

  let subtotal = 0;
  if (cartProducts && cartProducts.items.length > 0) {
    cartProducts.items.forEach((item) => {
      if (item.productId) {
        subtotal += item.productId.price * item.quantity;
      }
    });
  }
  const shipping = 100; // example
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;
  res.status(200).json({
    success: true,
    newQuantity,
    newCartItemCount: count,
    shipping,
    subtotal,
    tax,
    total,
  });
};

// Checkout page (GET)
const checkout = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    const cartProducts = await Cart.findOne({ userId }).populate(
      "items.productId",
    );

    if (!cartProducts || cartProducts.items.length === 0) {
      return res.redirect("/product");
    }

    // Calculate totals
    let subtotal = 0;
    cartProducts.items.forEach((item) => {
      if (item.productId) {
        subtotal += item.productId.price * item.quantity;
      }
    });
    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    res.render("user/checkout", {
      cartProducts,
      user,
      subtotal,
      shipping,
      tax,
      total,
      message: null,
      messageType: null,
      hidePageFooter: true,
      hidePageHeader: true,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.render("user/checkout", {
      cartProducts: null,
      user: null,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      message: "An error occurred while loading checkout page",
      messageType: "error",
      hidePageFooter: true,
      hidePageHeader: true,
    });
  }
};

// Process checkout (POST)
const processCheckout = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
    } = req.body;

    // Fetch cart items
    const cartProducts = await Cart.findOne({ userId }).populate(
      "items.productId",
    );

    if (!cartProducts || cartProducts.items.length === 0) {
      return res.redirect("/product/cart");
    }

    // Prepare order items
    const orderItems = cartProducts.items
      .filter((item) => item.productId) // remove null products
      .map((item) => ({
        productId: item.productId._id,
        title: item.productId.title,
        quantity: item.quantity,
        price: item.productId.price,
      }));

    // Calculate totals
    let subtotal = 0;
    orderItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    console.log("order items:", orderItems);

    // Create order
    const Order = require("../models/Order");
    const order = new Order({
      userId,
      customerInfo: { name, email, phone },
      address: { street, city, state, zipCode, country },
      items: orderItems,
      subtotal,
      shipping,
      tax,
      totalAmount: total,
      paymentMethod,
      orderStatus: "pending",
    });

    const razorpay = require("../helpers/razorpay");

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // integer
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    await order.save();

    // Clear cart
    await Cart.updateOne({ userId }, { items: [] });

    // Render success message
    res.render("user/checkout", {
      cartProducts: null,
      user: null,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      message: "Order placed successfully!",
      messageType: "success",
      razorpayOrder,
      hidePageFooter: true,
      hidePageHeader: true,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const userId = req.session.user.id;
    const cartProducts = await Cart.findOne({ userId }).populate(
      "items.productId",
    );

    let subtotal = 0;
    if (cartProducts && cartProducts.items.length > 0) {
      cartProducts.items.forEach((item) => {
        subtotal += item.productId.price * item.quantity;
      });
    }
    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    res.render("user/checkout", {
      cartProducts,
      user: await User.findById(userId),
      subtotal,
      shipping,
      tax,
      total,
      message: "Error processing checkout. Please try again.",
      messageType: "error",
      hidePageFooter: true,
      hidePageHeader: true,
    });
  }
};

// Simple Razorpay Order Creation
const createOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
    } = req.body;
    const userId = req.session.user.id;

    const cartProducts = await Cart.findOne({ userId }).populate(
      "items.productId",
    );

    if (!cartProducts || cartProducts.items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // Calculate total
    let subtotal = 0;
    const items = [];
    cartProducts.items.forEach((item) => {
      if (item.productId) {
        subtotal += item.productId.price * item.quantity;
        items.push({
          productId: item.productId._id,
          title: item.productId.title,
          quantity: item.quantity,
          price: item.productId.price,
        });
      }
    });

    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    // Create Razorpay order
    const razorpay = require("../helpers/razorpay");
    const orderAmountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: orderAmountInPaise, // integer now
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    // Save temporary order
    const newOrder = new Order({
      userId,
      customerInfo: { name, email, phone },
      address: { street, city, state, zipCode, country },
      items,
      subtotal,
      shipping,
      tax,
      totalAmount: total,
      paymentMethod,
      razorpayOrderId: razorpayOrder.id,
      orderStatus: "pending",
    });

    await newOrder.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: orderAmountInPaise, // return integer paise
      apiKey: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating order" });
  }
};

// Simple Payment Verification
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;
    const crypto = require("crypto");

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        orderStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      });

      // Clear cart
      const userId = req.session.user.id;
      await Cart.updateOne({ userId }, { items: [] });

      res.json({ success: true, message: "Payment verified" });
    } else {
      res.json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Verification failed" });
  }
};

//buy now
const forBuyNow = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    const product = await Product.findById(req.params.id);
    // ✅ create fake cart for EJS
    const cartProducts = {
      items: [
        {
          productId: product,
          quantity: 1,
        },
      ],
    };

    // ✅ correct calculation
    const subtotal = product.price;
    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    res.render("user/buyNow-checkOut", {
      product,
      user,
      cartProducts,
      subtotal,
      shipping,
      tax,
      total,
      message: null,
      messageType: null,
      hidePageFooter: true,
      hidePageHeader: true,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.render("user/buyNow-checkOut", {
      product: null,
      user: null,
      cartProducts: { items: [] }, // ✅ prevent crash
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      message: "An error occurred while loading checkout page",
      messageType: "error",
      hidePageFooter: true,
      hidePageHeader: true,
    });
  }
};

//Post buy now
const postBuyNow = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
    } = req.body;
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.redirect("/product");
    }

    // create order item
    const orderItem = [
      {
        productId: product._id,
        title: product.title,
        quantity: 1,
        price: product.price,
      },
    ];

    // Calculate totals
    const subtotal = product.price;
    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const orderPayload = new Order({
      userId,
      customerInfo: { name, email, phone },
      address: { street, city, state, zipCode, country },
      items: orderItem,
      subtotal,
      shipping,
      tax,
      totalAmount: total,
      paymentMethod,
      orderStatus: "pending",
    });

    await orderPayload.save();

    res.render("user/checkout", {
      message: "Order placed successfully!",
      messageType: "success",
      hidePageFooter: true,
      hidePageHeader: true,
    });
  } catch (error) {
    console.error("Buy Now Error:", error);
    res.redirect("/product");
  }
};

// Create Razorpay Order for Buy Now
const createBuyNowOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      productId,
    } = req.body;

    const userId = req.session.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Order items
    const items = [
      {
        productId: product._id,
        title: product.title,
        quantity: 1,
        price: product.price,
      },
    ];

    const subtotal = product.price;
    const shipping = 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const razorpay = require("../helpers/razorpay");

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `buynow_${Date.now()}`,
    });

    const newOrder = new Order({
      userId,
      customerInfo: { name, email, phone },
      address: { street, city, state, zipCode, country },
      items,
      subtotal,
      shipping,
      tax,
      totalAmount: total,
      paymentMethod: "OnLine",
      razorpayOrderId: razorpayOrder.id,
      orderStatus: "pending",
    });

    await newOrder.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      dbOrderId: newOrder._id,
      amount: Math.round(total * 100),
      apiKey: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
};

const verifyBuyNowPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const crypto = require("crypto");

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, {
        orderStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      });

      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
};

//my orders
const myOrders = async (req, res) => {
  const userId = req.session.user.id;
  const orders = await Order.find({ userId }).populate("items.productId");
  res.render("user/my-orders", {
    orders,
    hidePageHeader: true,
    hidePageFooter: true,
  });
};

//order cancellation
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndUpdate(id, {
      orderStatus: "Cancelled",
    });

    res.redirect("/user/myOrders");
  } catch (err) {
    console.log(err);
    res.redirect("/user/myOrders");
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid"); // 🧹 Clears session cookie
    res.redirect("/user/login");
  });
};

module.exports = {
  homeRouteUser,
  loadLogin,
  login,
  loadRegister,
  register,
  sendOTP,
  verifyOTP,
  checkUser,
  verifyOtpForgot,
  changePassword,
  cart,
  checkout,
  processCheckout,
  createOrder,
  verifyPayment,
  forBuyNow,
  postBuyNow,
  createBuyNowOrder,
  verifyBuyNowPayment,
  addToCartProduct,
  decrementCartProduct,
  myOrders,
  cancelOrder,
  logout,
};
