const checkSession = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/adminLogin");
  }
};

const isLogin = (req, res, next) => {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard"); // ✅ stop here
  } else {
    return next();
  }
};

module.exports = { checkSession, isLogin };
