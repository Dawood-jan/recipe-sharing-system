import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slice/userSlice";
import recipeReducer from "../slice/recipesSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    recipes: recipeReducer,
  },
});

export default store;
