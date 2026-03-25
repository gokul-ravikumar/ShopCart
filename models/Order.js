const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: (v) => /^\+?[0-9\s\-()]{7,20}$/.test(v),
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    },

    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "OnLine", "Debit Card", "Credit Card", "UPI"],
      required: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);

module.exports = Order;
