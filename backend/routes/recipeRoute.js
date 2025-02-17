const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipeById,
  getAllRecipeByUser,
  updateRecipe,
  deleteRecipe,
  approvedRecipesList,
  rejectedRecipesList,
  getPendingRecipes,
  approveRecipes,
  rejectRecipes,
  allRejectedRecipesList
} = require("../controllers/recipeCtrl");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/create-recipe", authMiddleware, createRecipe);

router.get("/all-approved-recipes", approvedRecipesList);

router.get("/all-rejected-recipes", authMiddleware, rejectedRecipesList);

router.get("/rejected-recipes", authMiddleware, allRejectedRecipesList);

router.get("/pending-recipes", authMiddleware, getPendingRecipes);

router.get("/users-approve-recipes", authMiddleware, getAllRecipeByUser);

router.get("/users-recipe/:id", getRecipeById);

router.put("/approve-recipes/:id", authMiddleware, approveRecipes);

router.put("/approve-recipes/:id", authMiddleware, rejectRecipes);

router.put("/update-recipe/:id", authMiddleware, updateRecipe);

router.delete("/delete-recipe/:id", authMiddleware, deleteRecipe);

module.exports = router;
