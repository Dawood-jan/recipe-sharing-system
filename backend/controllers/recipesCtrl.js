import { v4 as uuid } from "uuid";
uuid();
import path from "path";
import fs from "fs";
import __dirname from "../utils/__dirname.js";
import User from "../models/User.js";
import Recipes from "../models/Recipes.js";

export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, recipeType, instructions } = req.body;
    // console.log(req.body);

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "contributor") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Ensure the admin can only create notices for their department
    if (!title || !ingredients || !recipeType || !instructions) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required!" });
    }

    // console.log(req.files.file)

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image!",
      });
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({
        message: "Please choose video file!",
      });
    }

    let imagePath = null;
    let videoPath = null;

    if (req.files.file) {
      const image = req.files.file;
      // console.log(image);

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/png",
      ];

      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(400).json({
          message: `Only ${allowedTypes.join(", ")} file types are allowed!`,
        });
      }

      const uploadDir = path.join(__dirname, "../uploads/recipes");
      // console.log(uploadDir);

      // Check if the notification directory exists, if not, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, image.name);
      // console.log(uploadPath);

      await image.mv(uploadPath);
      imagePath = `/uploads/recipes/${image.name}`;
      // console.log(imagePath);
    }

    if (req.files.video) {
      const video = req.files.video;

      // console.log(video);

      if (!video.mimetype.includes("mp4")) {
        return res.status(400).json({
          message: "Only mp4 file type is allowed!",
        });
      }

      const videoDir = path.join(__dirname, "../uploads/videos");
      // console.log(videoDir);

      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      const uniqueVideoName = `${uuid()}${path.extname(video.name)}`;
      const videoPathFull = path.join(videoDir, uniqueVideoName);

      await video.mv(videoPathFull);
      videoPath = `/uploads/videos/${uniqueVideoName}`;
      // console.log(videoPath);
    }

    const recipeData = {
      name: title,
      ingredients,
      recipeType,
      instructions,
      status: "Pending",
      postedBy: req.user.id,
    };

    // console.log(recipeData);

    if (imagePath) recipeData.image = imagePath;
    if (videoPath) recipeData.video = videoPath;

    const newRecipe = await Recipes.create(recipeData);
    // console.log(recipeData);

    // console.log(user);

    res.status(200).json({ message: "Recipe created successfully." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    if (userExist?.role !== "contributor") {
      return res
        .status(404)
        .json({ message: "Only contributor can see the recipe details." });
    }

    const recipeFound = await Recipes.findById(req.params.id);

    if (!recipeFound) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // console.log(recipeFound);

    res.status(200).json(recipeFound);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllRecipeByUser = async (req, res) => {
  try {
    const recipeFound = await Recipes.find({
      postedBy: req.user.id,
      status: "Approved",
    }).populate("postedBy", "fullname");

    // console.log(recipeFound);

    if (!recipeFound) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipeWithImage = recipeFound.map((recipe) => {
      const imgUrl = `${process.env.BASE_URL}${recipe.image}`;
      return {
        ...recipe._doc, // Spread existing document
        image: imgUrl, // Replace image with full URL
      };
    });
    // console.log(recipeWithImage);
    return res.status(200).json({ recipeWithImage });
  } catch (error) {
    console.error(error.message); // Improved error logging for better debugging
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, recipeType } = req.body;
    const userId = req.user.id;

    const userExist = await User.findById(userId);
    if (!userExist || userExist.role !== "contributor") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Find the notice to be updated
    const recipeFound = await Recipes.findById(req.params.id);
    if (!recipeFound) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found!" });
    }

    if (userId.toString() !== recipeFound.postedBy.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    let imagePath = recipeFound.image;
    let videoPath = recipeFound.video;

    if (req.files && req.files.file) {
      const image = req.files.file;
      // console.log(image);
      const uploadPath = path.join(__dirname, "../uploads/recipes", image.name);
      // console.log(uploadPath);

      if (imagePath) {
        const oldImagePath = path.join(__dirname, "..", imagePath);
        // console.log(oldImagePath);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete old image:", unlinkErr);
              }
            });
          }
        });
      }

      await image.mv(uploadPath);

      imagePath = `/uploads/recipes/${image.name}`;
    }

    if (req.files && req.files.video) {
      const video = req.files.video;

      const videoDir = path.join(__dirname, "../uploads/videos");

      if (videoPath) {
        const oldVideoPath = path.join(__dirname, "..", videoPath);
        fs.access(oldVideoPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldVideoPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Failed to delete old video:", unlinkErr);
              }
            });
          }
        });
      }

      const uniqueVideoName = `${uuid()}${path.extname(video.name)}`;
      const videoPathFull = path.join(videoDir, uniqueVideoName);

      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      await video.mv(videoPathFull);

      videoPath = `/uploads/videos/${uniqueVideoName}`;
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        name: title,
        instructions,
        image: imagePath,
        ingredients,
        recipeType,
        video: videoPath,
      },
      { new: true }
    );

    // console.log(updateRecipe);

    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found!" });
    }

    res.status(200).json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    if (!userExist || userExist.role !== "contributor") {
      return res.status(403).json({ message: "Access denied!" });
    }

    const recipeFound = await Recipes.findById(req.params.id);

    // console.log(recipeFound);

    if (!recipeFound) {
      return res
        .status(404)
        .json({ status: "fail", message: "Recipe not found" });
    }

    if (userExist?._id.toString() !== recipeFound?.postedBy.toString()) {
      return res.status(403).json({ message: "Access denied!" });
    }

    if (recipeFound.image) {
      const imagePath = path.join(__dirname, "..", recipeFound.image);

      // console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (recipeFound.video) {
      const videoPath = path.join(__dirname, "..", recipeFound.video);

      // console.log(videoPath);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await Recipes.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const getPendingRecipes = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    // console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ message: "Access denied" });
    }

    if (userExist?.role === "admin") {
      const pendingRecipes = await Recipes.find({ status: "Pending" }).populate(
        "postedBy",
        "fullname"
      );

      // console.log(pendingRecipes);

      if (!pendingRecipes) {
        return res.status(404).json({ message: "Recipes not found" });
      }

      res.status(200).json(pendingRecipes);
    } else {
      const pendingRecipes = await Recipes.find({
        status: "Pending",
        postedBy: req.user.id,
      }).populate("postedBy", "fullname");

      // console.log(pendingRecipes);

      if (!pendingRecipes) {
        return res.status(404).json({ message: "Recipes not found" });
      }

      res.status(200).json(pendingRecipes);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const approveRecipes = async (req, res) => {
  try {
    const { status } = req.body;
    // console.log(req.params.id);

    const userExist = await User.findById(req.user.id);

    if (!userExist || userExist.role !== "admin") {
      return res.status(400).json({ message: "Access denied" });
    }

    const approvedRecipes = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
      },
      { new: true }
    );

    // console.log(approvedRecipes);

    // if (!approvedRecipes) {
    //   return res.status(404).json({ message: "Recipes not found" });
    // }

    res
      .status(200)
      .json({ success: true, message: "Recipe approved successfully" });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getApprovedRecipes = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    // console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ message: "Access denied" });
    }

    if (userExist?.role === "admin") {
      const approvedRecipes = await Recipes.find({
        status: "Approved",
      }).populate("postedBy", "fullname");

      // console.log(approvedRecipes);

      if (!approvedRecipes) {
        return res.status(404).json({ message: "Recipes not found" });
      }

      res.status(200).json(approvedRecipes);
    } else {
      const approvedRecipes = await Recipes.find({
        status: "Approved",
        postedBy: req.user.id,
      }).populate("postedBy", "fullname");

      // console.log(pendingRecipes);

      if (!approvedRecipes) {
        return res.status(404).json({ message: "Recipes not found" });
      }

      res.status(200).json(approvedRecipes);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const approvedRecipesList = async (req, res) => {
  try {
    const { status, recipeType } = req.query;
    // console.log(req.query);

    const filter = { status: status };

    if (recipeType) {
      filter.recipeType = recipeType;
    }

    const approvedRecipes = await Recipes.find(filter).populate(
      "postedBy",
      "fullname"
    );

    // console.log(approvedRecipes);
    if (!approvedRecipes) {
      return res
        .status(404)
        .json({ status: false, message: "No Approved recipes found!" });
    }

    res.status(200).json(approvedRecipes);
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const recipeDetails = async (req, res) => {
  try {
    const recipeDetails = await Recipes.findById(req.params.id).populate(
      "postedBy",
      "fullname"
    );

    // console.log(recipeDetails);

    if (!recipeDetails) {
      return res
        .status(404)
        .json({ status: false, message: "No Approved recipes found!" });
    }

    res.status(200).json(recipeDetails);
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const rejectRecipes = async (req, res) => {
  try {
    const { status } = req.body;
    const userExist = await User.findById(req.user.id);
    // console.log(req.params.id);
    if (!userExist || userExist.role !== "admin") {
      return res.status(400).json({ message: "Access denied" });
    }

    const rejectRecipes = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      { new: true }
    );

    // console.log(rejectRecipes);

    if (!rejectRecipes) {
      return res.status(404).json({ message: "Recipes not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Recipe rejected successfully" });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const rejectedRecipesList = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    if (userExist?.role === "admin") {
      const rejectedRecipes = await Recipes.find({
        status: "Reject",
      });

      if (!rejectedRecipes) {
        return res
          .status(404)
          .json({ status: false, message: "No Rejected recipes found!" });
      }

      res.status(200).json(rejectedRecipes);
    } else {
      const rejectedRecipes = await Recipes.find({
        postedBy: req.user.id,
        status: "Reject",
      });

      // console.log(rejectedRecipes);

      if (!rejectedRecipes) {
        return res
          .status(404)
          .json({ status: false, message: "No Rejected recipes found!" });
      }

      res.status(200).json(rejectedRecipes);
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const allRejectedRecipesList = async (req, res) => {
  try {
    // console.log(req.user.id);
    if (req.user.role !== "admin") {
      return res.status(400).json({
        status: false,
        message: "Only admin can see rejected recipes!",
      });
    }
    const rejectedRecipes = await Recipes.find({
      status: "Reject",
    }).populate("postedBy recipeType");

    // console.log(rejectedRecipes);
    if (!rejectedRecipes) {
      return res
        .status(404)
        .json({ status: false, message: "No Rejected recipes found!" });
    }

    res.status(200).json({ status: "success", rejectedRecipes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
