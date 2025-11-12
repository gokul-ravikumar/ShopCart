const User = require("../models/User");
const bcrypt = require("bcrypt");

// Load login page
const loadLogin = (req, res) => {
  const message = req.session.message;
  req.session.message = null;
  res.set("Cache-Control", "no-store");
  res.render("user/login", { message });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body.user;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("1111");
      return res.render("user/login", { message: "Invalid credentials" });
    }

    // ✅ Blocked user check — render page, NOT JSON
    if (user.isBlocked) {
      console.log("2222");
      return res.render("user/login", {
        message: "Your account has been blocked. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("3333");
      return res.render("user/login", { message: "Invalid credentials" });
    }

    req.session.user = { id: user._id, email: user.email };
    return res.redirect("/product");
  } catch (err) {
    console.error(err);
    console.log("4444");
    return res.render("user/login", {
      message: "Something went wrong. Please try again.",
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
    console.log("hi user");
    const { name, email, password } = req.body.user;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.message = "User already exists";
      return res.redirect("/user/register");
    }

    const newUser = new User({ name, email, password });
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

// Load dashboard
const loadDashboard = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    res.render("user/dashboard", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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
  loadLogin,
  login,
  loadRegister,
  register,
  loadDashboard,
  logout,
};
