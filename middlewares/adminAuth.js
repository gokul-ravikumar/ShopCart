

const checkSession = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/adminLogin')
            console.log("hlooo")

    }
}

const isLogin = (req, res, next) => {
    if (req.session.admin) {
        return res.redirect('/admin/dashboard'); // ✅ stop here
    } else {
        console.log("hlooo22"); // will run only when NOT logged in
        return next();
    }
};


module.exports = { checkSession, isLogin }