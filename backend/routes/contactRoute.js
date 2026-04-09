import express from "express";
const contactRoutes = express.Router();
import { contactCtrl } from "../controllers/contactCtrl.js";

//user/contact-us
contactRoutes.post("/contact-us", contactCtrl);

export default contactRoutes;
