require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const nocache = require("nocache");

// 1️⃣ Apply no-cache before anything else
app.use(nocache());

// 2️⃣ View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3️⃣ Parse incoming data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4️⃣ Serve static files (public + uploads)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Local image access

// 5️⃣ Sessions (after nocache)
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// ✅ 5.5️⃣ Make session user available in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 6️⃣ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/ShopCart")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 7️⃣ Routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const adminRoutes = require("./routes/admin");
const { homeRouteUser } = require("./controllers/user");

app.get("/", homeRouteUser);

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);

// 8️⃣ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
