import express from "express";
import auth from "../config/auth.js";
import {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  profilePhotoCtrl,
  getProfilePhotoCtrl,
  updateProfileCtrl,
  forgotPassword,
} from "../controllers/userCtrl.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerCtrl);

userRoutes.post("/login", loginCtrl);

userRoutes.post("/forgot-password", forgotPassword);

userRoutes.get("/profile", auth, profileCtrl);

userRoutes.put("/update-profile", auth, updateProfileCtrl);

userRoutes.post("/profile-photo", auth, profilePhotoCtrl);

userRoutes.get("/profile-photo", auth, getProfilePhotoCtrl);

export default userRoutes;
