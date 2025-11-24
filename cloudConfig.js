const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Load environment variables
require("dotenv").config();

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ⚙️ Hybrid setup
let storage;

if (process.env.NODE_ENV === "production") {
  
  // --- Use Cloudinary in Production ---
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ShopCart/products",
      allowed_formats: ["png", "jpg", "jpeg", "webp"],
    },
  });
  console.log("✅ Using Cloudinary Storage");

} else {

  // --- Use Local Uploads in Development ---
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "uploads")); // local 'uploads' folder
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });
  console.log("📁 Using Local Upload Storage");
}

module.exports = { cloudinary, storage };
