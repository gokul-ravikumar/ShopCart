const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const useCloudinary = process.env.NODE_ENV === "production";

let storage;

if (useCloudinary) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ShopCart/products",
      allowed_formats: ["png", "jpg", "jpeg", "webp"],
    },
  });
  console.log("✅ Using Cloudinary Storage");
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });
  console.log("📁 Using Local Upload Storage");
}

module.exports = { cloudinary, storage, useCloudinary };