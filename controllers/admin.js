const Admin = require("../models/adminModel");
const User = require("../models/User"); // make sure this path is correct
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcrypt"); // Needed for login comparison
const path = require("path");
const fs = require("fs");

const useCloudinary = process.env.USE_CLOUDINARY === "true";

// Load Register Page
const loadRegister = (req, res) => {
  const message = req.session.message;
  req.session.message = null; // clear it after use
  res.render("admin/register", { message });
};

// Register Admin
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      req.session.message = "Admin already exists!";
      return res.redirect("/admin/register");
    }

    // Pre-save hook in adminModel handles hashing
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    req.session.message = "Admin registered successfully!";
    res.redirect("/admin/login");
  } catch (error) {
    console.error("Register error:", error);
    req.session.message = "Server error!";
    res.redirect("/admin/register");
  }
};

// Load Login Page
const loadLogin = async (req, res) => {
  try {
    if (req.session.admin) return res.redirect("/admin/dashboard");

    const message = req.session.message || null;
    delete req.session.message;
    res.render("admin/login", { message });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Admin Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.render("admin/login", { message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.render("admin/login", { message: "Invalid credentials" });
    }

    // Save the logged-in admin to the session
    req.session.admin = { id: admin._id, email: admin.email };
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
};

// Load Dashboard
const loadDashboard = async (req, res) => {
  try {
    const admin = req.session.admin;
    if (!admin) return res.redirect("/admin/login");
    const users = await User.find({}).limit(3)
    const orders = await Order.find({}).limit(3)

    const activeUsers = await User.find({ isBlocked: false });
    const blockedUsers = await User.find({ isBlocked: true });
    let active = activeUsers.length;
    let blocked = blockedUsers.length;

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 7,
      },
    ]);

    res.render("admin/dashboard", {
      admin,
      users,
      orders,
      active,
      blocked,
      userGrowth,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Server error");
  }
};

const loadProductList = async (req, res) => {
  try {
    const admin = req.session.admin;
    if (!admin) return res.redirect("/admin/login");

    const page = parseInt(req.query.page) || 1;
    const limit = 10; // number of products per page
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.render("admin/productList", {
      admin,
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error("Error loading product dashboard:", error);
    res.status(500).send("Server error");
  }
};

const loadUserList = async (req, res) => {
  try {
    const admin = req.session.admin;
    if (!admin) return res.redirect("/admin/login");

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.render("admin/userList", {
      admin,
      users,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error loading user list:", error);
    res.status(500).send("Server error");
  }
};

// Add User
const addUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();
    res.redirect("/admin/user");
  } catch (error) {
    console.log(error);
  }
};

// Load Add User Form Page
const loadAddUserForm = (req, res) => {
  const admin = req.session.admin;
  if (!admin) return res.redirect("/admin/login");

  res.render("admin/addUserForm", { admin, message: "" });
};

// Edit User
const editUser = async (req, res) => {
  try {
    const { id, name, email } = req.body;
    await User.findByIdAndUpdate(id, { name, email });
    res.redirect("/admin/user");
  } catch (error) {
    console.log(error);
  }
};

// Load Edit User Form
const loadEditUserForm = async (req, res) => {
  try {
    const admin = req.session.admin;
    if (!admin) return res.redirect("/admin/login");

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      req.session.message = "User not found!";
      return res.redirect("/admin/user");
    }

    res.render("admin/editUser", { admin, user, message: null });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ _id: id });
    res.redirect("/admin/user");
  } catch (error) {
    console.log(error);
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { isBlocked: true });
    res.redirect("/admin/user"); // 👈 back to user list page
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Unblock user
const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { isBlocked: false });
    res.redirect("/admin/user"); // 👈 back to user list page
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Add product form
const addProductForm = (req, res) => {
  res.render("admin/addProduct");
};

// Add Product
const addProduct = async (req, res) => {
  try {
    const { title, description, category, price, stock } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      if (useCloudinary) {
        // Cloudinary
        images = req.files.map((file) => ({
          filename: file.filename,
          url: file.path, // Cloudinary URL
        }));
      } else {
        // Local uploads
        images = req.files.map((file) => ({
          filename: file.filename,
          url: `/uploads/${file.filename}`,
        }));
      }
    }

    const product = new Product({
      title,
      description,
      category,
      price,
      stock,
      image: images,
    });

    await product.save();
    res.redirect("/admin/product");
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send("Error adding product");
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
  }
};

// Show edit form
const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/editProduct", { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit page");
  }
};

// ✅ Handle edit form submission (update product)
const postEditProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Update fields
    product.title = title;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.category = category;

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      if (useCloudinary) {
        product.image = req.files.map((file) => ({
          filename: file.filename,
          url: file.path,
        }));
      } else {
        product.image = req.files.map((file) => ({
          filename: file.filename,
          url: `/uploads/${file.filename}`,
        }));
      }
    }

    await product.save();

    res.redirect("/admin/product");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating product");
  }
};

//orders
const orderList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const admin = req.session.admin;
    const orders = await Order.find()
      .populate("userId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalOrders = await Order.countDocuments();

    res.render("admin/orderList", {
      admin,
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (err) {
    console.log(err);
  }
};

//order view
const orderView = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("order id", orderId);

    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("items.productId");

    if (!order) {
      return res.redirect("/admin/order");
    }

    const customer = order.userId;
    console.log("customer", customer);

    const orderItems = order.items.map((item) => ({
      productName: item.productId ? item.productId.title : "Product Item",
      price: item.price,
      quantity: item.quantity,
    }));

    res.render("admin/orderView", {
      order,
      customer,
      orderItems,
      shippingAddress: order.address,
    });
  } catch (error) {
    console.log("Order View Error:", error);
    res.redirect("/admin/order");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: orderStatus },
      { new: true }, // ensures updated document
    );

    res.redirect("/admin/order");
  } catch (error) {
    console.log("Status Update Error:", error);
    res.redirect("/admin/order");
  }
};

// Logout
const logout = async (req, res) => {
  req.session.admin = null;
  res.redirect("/admin/login");
};

module.exports = {
  loadRegister,
  register,
  loadLogin,
  login,
  loadDashboard,
  loadProductList,
  loadUserList,
  addUser,
  loadAddUserForm,
  editUser,
  loadEditUserForm,
  deleteUser,
  blockUser,
  unblockUser,
  addProduct,
  deleteProduct,
  getEditProduct,
  postEditProduct,
  addProductForm,
  orderList,
  orderView,
  updateOrderStatus,
  logout,
};
