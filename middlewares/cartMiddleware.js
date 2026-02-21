const Cart = require("../models/Cart");

const loadCartItemCount = async (req, res, next) => {
  const userId = req.session.user?.id;
  if (userId) {
    const cart = await Cart.findOne({ userId });
    const count =
      cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    console.log("total items:", JSON.stringify(count));

    req.session.user.totalItems = count;
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
}

module.exports = loadCartItemCount