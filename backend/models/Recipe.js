// backend/models/Notice.js
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: String },
  instructions: { type: String },
  image: { type: String },
  video: { type: String },
  recipeType: {
    type: String,
    enum: ["dessert", "diatery", "vegan"],
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type:  String,
    enum: ["Pending", "Approved", "Reject"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);
