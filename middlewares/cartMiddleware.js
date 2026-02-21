const Cart = require("../models/Cart");
const getCartItemCount = require("../helpers/cartHelper");

const loadCartItemCount = async (req, res, next) => {
  const userId = req.session.user?.id;
  try {
    if (userId) {
      const count = await getCartItemCount(userId);
      console.log("total items:", count);

      req.session.user.totalItems = count;
      res.locals.user = req.session.user;
    } else {
      res.locals.user = null;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = loadCartItemCount;
