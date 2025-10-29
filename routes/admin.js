const express = require("express")
const router = express.Router()
const multer = require("multer")
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const controllers = require("../controllers/admin")
const adminAuth = require("../middlewares/adminAuth.js")

// === Admin Registration ===
router.get('/register', adminAuth.isLogin, controllers.loadRegister) // load register page
router.post('/register', controllers.register) // handle register form

// === Admin Login ===
router.get('/login', adminAuth.isLogin, controllers.loadLogin) // load login page
router.post('/login', controllers.login) // handle login form

// === Admin dashboard ===
router.get('/dashboard', controllers.loadDashboard);

// === User List ===
router.get('/user', controllers.loadUserList);

// === Product List ===
router.get('/product', controllers.loadProductList);

// === Product Delete ===
router.get('/product/delete/:id', controllers.deleteProduct);

// User Management
router.post('/user/add', controllers.addUser);

router.post('/user/edit', controllers.editUser);

router.get('/user/delete/:id', controllers.deleteUser);

router.post('/user/block/:id', controllers.blockUser);

router.post('/user/unblock/:id', controllers.unblockUser);

// Show Add User Form
router.get('/user/add', controllers.loadAddUserForm);


// Product Management
router.get('/product/add', controllers.addProductForm);

router.post('/product/add', upload.array('image', 5), controllers.addProduct);


// ✅ To view the edit page
router.get('/product/edit/:id', controllers.getEditProduct);

// ✅ To handle form submission (update product)
router.post('/product/edit/:id', upload.array('image', 5), controllers.postEditProduct);






module.exports = router;
