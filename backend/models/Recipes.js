import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipesSchema = new Schema(
  {
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
      type: String,
      enum: ["Pending", "Approved", "Reject"],
    },
  },
  {
    timestamps: true,
  }
);

const Recipes = mongoose.model("Recipe", RecipesSchema);

export default Recipes;
