import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import path from "path";
import fileUpload from "express-fileupload";
import __dirname from "../utils/__dirname.js";
import connectDB from "../config/db.js";
import userRoutes from "../routes/userRoute.js";
import recipesRoutes from "../routes/recipesRoute.js";
import contactRoutes from "../routes/contactRoute.js";
import User from "../models/User.js";

connectDB();

const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.use("/uploads", express.static(path.join((__dirname, "uploads"))));

const createAdminUser = async () => {
  const admin = {
    fullname: "Dawood Jan",
    email: "daudjan921@gmail.com",
    password: "Daud12@",
    role: "admin",
    isAdmin: true,
  };

  let user = await User.findOne({ email: admin?.email });

  if (!user) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin?.password, salt);
    const user = await User.create(admin);
    console.log(`Admin ${user.email} created`);
  }
};

createAdminUser();

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/contact", contactRoutes);

export default app;
