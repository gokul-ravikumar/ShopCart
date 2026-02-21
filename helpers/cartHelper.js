const Cart = require("../models/Cart");

const getCartItemCount = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });
    const count =
      cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    console.log("total items:", JSON.stringify(count));
    return count;
  } catch (error) {
    console.error("Error calculating cart count:", error);
    return 0;
  }
};

module.exports = getCartItemCount;
