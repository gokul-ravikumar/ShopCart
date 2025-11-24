const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // good practice to add this too
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^\+?[0-9\s\-()]{7,20}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: true
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      filename: String,
      url: String,
      _id: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // ✅ this line automatically adds createdAt & updatedAt

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password during login
userSchema.methods.validatePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model("User", userSchema);
module.exports = User;
