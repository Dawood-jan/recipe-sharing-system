const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (value) {
          // Allow only letters (both uppercase and lowercase) and spaces
          return /^[A-Za-z\s]+$/.test(value);
        },
      },
      {
        validator: function (value) {
          // Ensure the name has a maximum length of 25 characters
          return value.length <= 25;
        },
        message: "Name must not exceed 25 characters.",
      },
    ],
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["contributor", "admin"],
    required: true,
  },

  file: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
