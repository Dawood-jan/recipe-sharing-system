// backend/controllers/noticeController.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, recipeType, instructions } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
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

    // console.log(req.files.file.name)

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image!",
      });
    }

    let imagePath = null;
    let videoPath = null;

    if (req.files && req.files.file) {
      const image = req.files.file;
      // console.log(image);

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

    // if (req.files.video) {
    //   const video = req.files.video;

    //   const videoDir = path.join(__dirname, "../uploads/videos");
    //   if (!fs.existsSync(videoDir)) {
    //     fs.mkdirSync(videoDir, { recursive: true });
    //   }
    //   const videoPathFull = path.join(videoDir, video.name);
    //   await video.mv(videoPathFull);
    //   videoPath = `/uploads/videos/${video.name}`;
    // }

    if (req.files.video) {
      const video = req.files.video;
      const videoDir = path.join(__dirname, "../uploads/videos");

      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      const uniqueVideoName = `${uuid()}${path.extname(video.name)}`;
      const videoPathFull = path.join(videoDir, uniqueVideoName);

      await video.mv(videoPathFull);
      videoPath = `/uploads/videos/${uniqueVideoName}`;
    }

    const recipeData = {
      name: title,
      ingredients,
      recipeType,
      instructions,
      status: "Pending",
      postedBy: userId,
    };

    // console.log(recipeData);

    if (imagePath) recipeData.image = imagePath;
    if (videoPath) recipeData.video = videoPath;

    const recipe = await Recipe.create(recipeData);

    // console.log(recipe);

    return res.status(200).json({
      success: true,
      newRecipe: recipe,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const getRecipeById = async (req, res) => {
  try {
    // console.log(req.params.id);
    const user = req.user;

    // console.log(user);

    const recipeId = req.params.id;
    // console.log(recipeId);

    if (!recipeId) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }

    const recipeFound = await Recipe.findById(recipeId);

    // if (String(recipeFound.postedBy._id) !== String(user.id)) {
    //   return res
    //     .status(403)
    //     .json({ message: "User can only see his/her recipe" });
    // }

    const image = `${process.env.BASE_URL}${recipeFound.image}`;

    let video;

    // console.log(video);

    recipeFound.image = image;

    if (recipeFound.video === undefined) {
      video = `${process.env.BASE_URL}/${recipeFound.video}`;
      recipeFound.video = video;
    } else {
      video = `${process.env.BASE_URL}${recipeFound.video}`;
      recipeFound.video = video;
    }

    if (!recipeFound) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // console.log(recipeFound);

    return res.status(200).json({ recipeFound });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllRecipeByUser = async (req, res) => {
  try {
    const recipeFound = await Recipe.find({
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

const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, recipeType } = req.body;
    const userId = req.user.id;

    // console.log(title, ingredients, instructions, recipeType);
    // console.log(req.files.file.name)

    // Find the user and check if they are an admin
    const userExist = await User.findById(userId);
    if (!userExist || userExist.role !== "contributor") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    // Find the notice to be updated
    const recipeFound = await Recipe.findById(req.params.id);
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

      // Delete the old image if it exists and is not the default image
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

      // console.log(image);
      // Move the uploaded file to the desired location
      await image.mv(uploadPath);

      // Set the new image path
      imagePath = `/uploads/recipes/${image.name}`;
    }

    if (req.files && req.files.video) {
      const video = req.files.video;

      // Define the directory for storing videos
      const videoDir = path.join(__dirname, "../uploads/videos");

      // Delete the old video if it exists
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

      // Generate a unique filename for the new video
      const uniqueVideoName = `${uuid()}${path.extname(video.name)}`;
      const videoPathFull = path.join(videoDir, uniqueVideoName);

      // Create the directory if it does not exist
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      // Move the new video to the directory
      await video.mv(videoPathFull);

      // Set the new video path for database update
      videoPath = `/uploads/videos/${uniqueVideoName}`;
    }

    // console.log(videoPath)

    // Update the notice with the new details
    const updatedRecipe = await Recipe.findByIdAndUpdate(
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

    return res.status(200).json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const userExist = await User.findById(userId);
    // console.log(req.params);
    // console.log(userExist);

    if (!userExist || userExist.role !== "contributor") {
      return res.status(403).json({ message: "Access denied!" });
    }

    const recipeFound = await Recipe.findById(req.params.id);

    // console.log(recipeFound);

    if (!recipeFound) {
      return res
        .status(404)
        .json({ status: "fail", message: "Recipe not found" });
    }

    if (userId.toString() !== recipeFound.postedBy.toString()) {
      return res
        .status(403)
        .json({ status: "fail", message: "Access denied!" });
    }

    // Check if notice has an associated image and delete it
    if (recipeFound.image) {
      const imagePath = path.join(__dirname, "..", recipeFound.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const getPendingRecipes = async (req, res) => {
  try {
    const user = req.user;

    // console.log(user);

    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Access denied" });
    }

    const pendingRecipes = await Recipe.find({ status: "Pending" }).populate(
      "postedBy",
      "fullname"
    );

    // console.log(pendingRecipes);

    if (!pendingRecipes) {
      return res.status(404).json({ message: "Recipes not found" });
    }

    return res.status(200).json(pendingRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const approveRecipes = async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.body;
    // console.log(status);
    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Access denied" });
    }

    const approvedRecipes = await Recipe.findByIdAndUpdate(
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

    return res
      .status(200)
      .json({ success: true, message: "Recipe approved successfully" });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const approvedRecipesList = async (req, res) => {
  try {
    const { status, recipeType } = req.query;
    // console.log(status);

    const filter = { status: status };

    if (recipeType) {
      filter.recipeType = recipeType;
    }

    const approvedRecipes = await Recipe.find(filter).populate(
      "postedBy",
      "fullname"
    );

    // console.log(approvedRecipes);
    if (!approvedRecipes) {
      return res
        .status(404)
        .json({ status: false, message: "No Approved recipes found!" });
    }

    return res.status(200).json({ status: "success", approvedRecipes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

const rejectRecipes = async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.body;
    // console.log(status);
    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Access denied" });
    }

    const rejectRecipes = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
      },
      { new: true }
    );

    // console.log(rejectRecipes);

    if (!rejectRecipes) {
      return res.status(404).json({ message: "Recipes not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Recipe rejected successfully" });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const rejectedRecipesList = async (req, res) => {
  try {
    // console.log(status);
    const rejectedRecipes = await Recipe.find({
      postedBy: req.user.id,
      status: "Reject",
    });

    // console.log(rejectedRecipes);
    if (!rejectedRecipes) {
      return res
        .status(404)
        .json({ status: false, message: "No Rejected recipes found!" });
    }

    return res.status(200).json({ status: "success", rejectedRecipes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

const allRejectedRecipesList = async (req, res) => {
  try {
    // console.log(req.user);
    if (req.user.role !== "admin") {
      return res.status(400).json({
        status: false,
        message: "Only admin can see rejected recipes!",
      });
    }
    const rejectedRecipes = await Recipe.find({
      status: "Reject",
    }).populate("postedBy recipeType");

    // console.log(rejectedRecipes);
    if (!rejectedRecipes) {
      return res
        .status(404)
        .json({ status: false, message: "No Rejected recipes found!" });
    }

    return res.status(200).json({ status: "success", rejectedRecipes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

module.exports = {
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
  allRejectedRecipesList,
};
