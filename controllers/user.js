const User = require("../models/User");
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

    req.session.user = { id: user._id, email: user.email, name: user.name };
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
      message: "We couldn’t find an account for this Phone Number.",
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
  logout,
};
