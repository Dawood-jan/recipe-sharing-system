import express from "express";
import auth from "../config/auth.js";
import {
  createRecipe,
  getAllRecipeByUser,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getPendingRecipes,
  approveRecipes,
  approvedRecipesList,
  rejectRecipes,
  rejectedRecipesList,
  allRejectedRecipesList,
  getApprovedRecipes,
  recipeDetails,
} from "../controllers/recipesCtrl.js";

const recipesRoutes = express.Router();

recipesRoutes.post("/create-recipe", auth, createRecipe);

recipesRoutes.get("/", getAllRecipeByUser);

recipesRoutes.get("/pending", auth, getPendingRecipes);

recipesRoutes.get("/approved-recipes", auth, getApprovedRecipes);

recipesRoutes.get("/approved-recipes-list", approvedRecipesList);

recipesRoutes.get("/rejected-recipes", auth, rejectedRecipesList);

recipesRoutes.get("/:id", auth, getRecipeById);

recipesRoutes.put("/:id", auth, updateRecipe);

recipesRoutes.get("/recipe-details/:id", recipeDetails);

recipesRoutes.put("/reject-recipe/:id", auth, rejectRecipes);

recipesRoutes.put("/approve-recipe/:id", auth, approveRecipes);

recipesRoutes.delete("/:id", auth, deleteRecipe);

recipesRoutes.get("/admin-rejected-recipes", auth, allRejectedRecipesList);

export default recipesRoutes;
