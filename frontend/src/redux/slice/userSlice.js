import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL, { uploadUrl } from "../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions";

const initialState = {
  loading: false,
  error: null,
  users: [],
  user: {},
  profile: {},
  profilePhoto: "",
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//Register action
export const registerAction = createAsyncThunk(
  "user/register",
  async (
    { fullname, email, password, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        Headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `${baseURL}/users/register`,
        { fullname, email, password, confirmPassword },
        config
      );

      return res.data;
    } catch (error) {
      // console.log(error?.response?.data)
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update user shipping address action
export const updateUserShippingAddressAction = createAsyncThunk(
  "users/update-shipping-address",
  async (
    { firstName, lastName, address, city, postalCode, phone, region },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // console.log(province, region)

      //get token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/users/shipping-address`,
        {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          region,
          phone,
        },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Login action
export const loginAction = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        Headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${baseURL}/users/login`,
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Logout
export const logoutAction = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("userInfo");
  return null;
});

//Profile
export const profileAction = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      // console.log(token)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(`${baseURL}/users/profile`, config);

      // console.log(response)

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

//Update Profile
export const updateProfileAction = createAsyncThunk(
  "user/updateProfile",
  async (
    { fullname, email, password, confirmPassword },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      // console.log(fullname)

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${baseURL}/users/update-profile`,
        { fullname, email, password, confirmPassword },
        config
      );

      // console.log(response)

      return response.data;
    } catch (error) {
      console.log(error?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

//Upload ProfilePhoto
export const profilePhotoAction = createAsyncThunk(
  "user/uploadProfilePhoto",
  async (file, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log(file)
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await axios.post(
        `${baseURL}/users/profile-photo`,
        formData,
        config
      );

      // console.log(response);

      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response);
    }
  }
);

export const getProfilePhotoAction = createAsyncThunk(
  "user/getProfilePhoto",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      // console.log(token)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${baseURL}/users/profile-photo`,
        config
      );

      // console.log(response);

      // localStorage.setItem("profilePhoto", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response);
    }
  }
);

export const getAllUsersAction = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      // console.log(token)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${baseURL}/users/all-users`,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response);
    }
  }
);

//Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    //Register
    builder.addCase(registerAction.pending, (state) => {
      state.userAuth.loading = true;
      state.userAuth.error = null;
    });

    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.userAuth.loading = false;
      state.userAuth.userInfo = action.payload;
    });

    builder.addCase(registerAction.rejected, (state, action) => {
      state.userAuth.loading = false;
      state.userAuth.error = action.payload;
    });

    //Login
    builder.addCase(loginAction.pending, (state) => {
      state.userAuth.loading = true;
    });

    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.userAuth.loading = false;
      state.userAuth.userInfo = action.payload;
      state.userAuth.error = null;
    });

    builder.addCase(loginAction.rejected, (state, action) => {
      state.userAuth.loading = false;
      state.userAuth.error = action.payload;
    });

    //Logout
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.userAuth.userInfo = null;
    });

    //Profile
    builder.addCase(profileAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(profileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(profileAction.rejected, (state, action) => {
      state.loading = false;
      state.profile = null;
      state.error = action.payload;
    });

    //Update Profile
    builder.addCase(updateProfileAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(updateProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.profile = null;
      state.error = action.payload;
    });

    //Upload ProfilePhoto
    builder.addCase(profilePhotoAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(profilePhotoAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profilePhoto = action.payload;
    });

    builder.addCase(profilePhotoAction.rejected, (state, action) => {
      state.loading = false;
      state.profilePhoto = null;
      state.error = action.payload;
    });

    //Get ProfilePhoto
    builder.addCase(getProfilePhotoAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getProfilePhotoAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profilePhoto = action.payload;
    });

    builder.addCase(getProfilePhotoAction.rejected, (state, action) => {
      state.loading = false;
      state.profilePhoto = null;
      state.error = action.payload;
    });

    //Get All Users
    builder.addCase(getAllUsersAction.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllUsersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });

    builder.addCase(getAllUsersAction.rejected, (state) => {
      state.loading = false;
    });

    //shipping address
    builder.addCase(
      updateUserShippingAddressAction.pending,
      (state, action) => {
        state.loading = true;
      }
    );
    builder.addCase(
      updateUserShippingAddressAction.fulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      updateUserShippingAddressAction.rejected,
      (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    );
    //reset error
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
      state.userAuth.error = null;
      state.isAdded = false;
      state.isUpdated = false;
      state.isDeleted = false;
    });
    //reset success
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
      state.isUpdated = false;
      state.isDeleted = false;
    });
  },
});

const usersReducer = userSlice.reducer;

export default usersReducer;
