import axios from "axios";
import baseURL from "../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//initalsState
const initialState = {
  recipes: [],
  approvedRecipes: [],
  pendingRecipes: [],
  recipe: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create recipe action
export const createRecipeAction = createAsyncThunk(
  "recipe/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload);
    try {
      const { title, ingredients, category, instructions, video, file } =
        payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      console.log(token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      //FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", ingredients);
      formData.append("recipeType", category);
      formData.append("instructions", instructions);
      formData.append("file", file);
      formData.append("video", video);

      // console.log(formData)

      const { data } = await axios.post(
        `${baseURL}/recipes/create-recipe`,
        formData,
        config
      );
      return data;
    } catch (error) {
      // console.log(error?.response?.data);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch recipes action
export const fetchRecipesAction = createAsyncThunk(
  "recipes/list",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/recipes`);
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch recipe action
export const fetchRecipetAction = createAsyncThunk(
  "recipe/details",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      // console.log(payload)
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/recipes/${payload}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update recipe action
export const updateRecipeAction = createAsyncThunk(
  "recipe/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload);
    try {
      const { title, ingredients, category, instructions, file, video, id } =
        payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;

      // console.log(token)

      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", ingredients);
      formData.append("recipeType", category);
      formData.append("instructions", instructions);

      if (file) {
        formData.append("file", file);
      }
      if (video) {
        formData.append("video", video);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(
        `${baseURL}/recipes/${id}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      console.log(error?.response?.data);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete recipe action
export const removeRecipeAction = createAsyncThunk(
  "recipe/delete",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload);
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${baseURL}/recipes/${payload}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch pending recipes action
export const fetchPendingRecipesAction = createAsyncThunk(
  "pendingRecipes/list",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // console.log(config)

      const { data } = await axios.get(`${baseURL}/recipes/pending`, config);
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//approve recipe action
export const approveRecipeAction = createAsyncThunk(
  "approveRecipe/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      const { status, id } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}/recipes/approve-recipe/${id}`,
        {
          status,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch approved recipes action
export const approvedRecipesAction = createAsyncThunk(
  "approveRecipes/list",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      // console.log(token)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // console.log(config)

      const { data } = await axios.get(
        `${baseURL}/recipes/approved-recipes`,
        config
      );
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch approved recipes action
export const fetchApprovedRecipesAction = createAsyncThunk(
  "fetchApprovedRecipes/list",
  async ({ category, status }, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload)
    try {
      const { data } = await axios.get(
        `${baseURL}/recipes/approved-recipes-list`,
        { params: { recipeType: category, status } }
      );
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//reject recipe action
export const rejectRecipeAction = createAsyncThunk(
  "rejectRecipe/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload);
    try {
      const { status, id } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}/recipes/reject-recipe/${id}`,
        {
          status,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch rejected recipes action
export const fetchRejectedRecipesAction = createAsyncThunk(
  "rejectedRecipes/list",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${baseURL}/recipes/rejected-recipes`,
        config
      );
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch recipes details action
export const fetchRecipeDetailsAction = createAsyncThunk(
  "fetchRecipeDetails/RecipeDetails",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload)
    try {
      const { data } = await axios.get(
        `${baseURL}/recipes/recipe-details/${payload}`
      );
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//slice
const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  extraReducers: (builder) => {
    //create
    builder.addCase(createRecipeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createRecipeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipe = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createRecipeAction.rejected, (state, action) => {
      state.loading = false;
      state.recipe = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //fetch all
    builder.addCase(fetchRecipesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecipesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes = action.payload;
    });
    builder.addCase(fetchRecipesAction.rejected, (state, action) => {
      state.loading = false;
      state.recipes = null;
      state.error = action.payload;
    });
    //fetch single
    builder.addCase(fetchRecipetAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecipetAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipe = action.payload;
    });
    builder.addCase(fetchRecipetAction.rejected, (state, action) => {
      state.loading = false;
      state.recipe = null;
      state.error = action.payload;
    });
    //update
    builder.addCase(updateRecipeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateRecipeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipe = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateRecipeAction.rejected, (state, action) => {
      state.loading = false;
      state.recipe = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
    //delete
    builder.addCase(removeRecipeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeRecipeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
    });
    builder.addCase(removeRecipeAction.rejected, (state, action) => {
      state.loading = false;
      state.recipe = null;
      state.isDeleted = false;
      state.error = action.payload;
    });

    //pending
    builder.addCase(fetchPendingRecipesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPendingRecipesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingRecipes = action.payload;
    });
    builder.addCase(fetchPendingRecipesAction.rejected, (state, action) => {
      state.loading = false;
      state.pendingRecipes = null;
      state.error = action.payload;
    });

    //approve
    builder.addCase(approveRecipeAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(approveRecipeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipe = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(approveRecipeAction.rejected, (state, action) => {
      state.loading = false;
      state.recipe = null;
      state.isUpdated = false;
      state.error = action.payload;
    });

    //admin and contributor approved recipes
    builder.addCase(approvedRecipesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(approvedRecipesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.approvedRecipes = action.payload;
    });
    builder.addCase(approvedRecipesAction.rejected, (state, action) => {
      state.loading = false;
      state.approvedRecipes = null;
      state.error = action.payload;
    });

    //admin and contributor reject recipes
    builder.addCase(fetchRejectedRecipesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRejectedRecipesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes = action.payload;
    });
    builder.addCase(fetchRejectedRecipesAction.rejected, (state, action) => {
      state.loading = false;
      state.recipes = null;
      state.error = action.payload;
    });

    //fetch approved recipes
    builder.addCase(fetchApprovedRecipesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchApprovedRecipesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes = action.payload;
    });
    builder.addCase(fetchApprovedRecipesAction.rejected, (state, action) => {
      state.loading = false;
      state.recipes = null;
      state.error = action.payload;
    });

    //fetch recipe details
    builder.addCase(fetchRecipeDetailsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecipeDetailsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.recipe = action.payload;
    });
    builder.addCase(fetchRecipeDetailsAction.rejected, (state, action) => {
      state.loading = false;
      state.recipe = null;
      state.error = action.payload;
    });

    //reset error
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
      state.isAdded = false;
      state.isUpdated = false;
      state.isDeleted = false;
    });
    //reset success
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.error = null;
      state.isAdded = false;
      state.isUpdated = false;
      state.isDeleted = false;
    });
  },
});

//generate the reducer
const recipeReducer = recipeSlice.reducer;

export default recipeReducer;
