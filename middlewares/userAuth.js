// userAuth.js

// Protect routes for logged-in users
const checkUserSession = (req, res, next) => {
    if (req.session.user) {
        // User is logged in, allow access
        next();
    } else {
        // User not logged in, redirect to login page
        console.log("User not logged in, redirecting to login");
        res.redirect('/user/login'); // or your user login route
    }
};

// Prevent logged-in users from accessing login/register pages
const isUserLoggedIn = (req, res, next) => {
    if (req.session.user) {
        // User is already logged in, redirect to dashboard
        return res.redirect('/product');
    } else {
        // User not logged in, allow access
        console.log("User not logged in, allowing access");
        return next();
    }
};

module.exports = { checkUserSession, isUserLoggedIn };
