const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const User = require("../models/User");
// const Notice = require("../models/Notice");

//register
const registerCtrl = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;
    console.log(password, confirmPassword);

    if (!fullname || !email || !password || !confirmPassword) {
      return res.status(422).json({ message: "All fields are required!" });
    }

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return res.status(422).json({
        message:
          "Name can only contain characters and must not exceed 25 characters!",
      });
    }

    const newEmail = email.trim().toLowerCase();

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(newEmail)) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    const userExist = await User.findOne({ email: newEmail });
    if (userExist) {
      return res.status(422).json({ message: "Email already exists" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password.trim()
      )
    ) {
      return res.status(422).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    if (password.trim().length < 6) {
      return res
        .status(422)
        .json({ message: "Password should be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email: newEmail,
      role: "contributor",
      password: hashPass,
    });

    // console.log(newUser);

    return res.status(200).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(email, password);

    // Check if all required fields are provided
    if (!email || !password) {
      return res
        .status(422)
        .json({ status: "error", message: "All fields are required!" });
    }

    const userEmail = email.trim().toLowerCase();

    // console.log(userEmail);

    // Find the user by email
    const userExist = await User.findOne({ email: userEmail });
    // console.log(userExist);

    // Check if the user exists
    if (!userExist) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const { _id: id, fullname, role } = userExist;

    if (password.trim().length < 6) {
      return res.status(422).json({
        status: "error",
        message: "Password should be at least 6 characters",
      });
    }

    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Generate the JWT token, including relevant fields
    const token = jwt.sign(
      {
        id,
        fullname,
        role,
        email: userEmail,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7h" }
    );

    // Prepare the response object
    const response = {
      token,
      id,
      fullname,
      role,
      email: userEmail,
    };

    return res.status(200).json({ user: response });
  } catch (error) {
    console.error("Login error:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

//profile
const profileCtrl = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this is set by authMiddleware

    // console.log(userId);

    const userExist = await User.findById(userId).select("-password");

    // console.log(userExist);

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    const roleDirectory = userExist.role === "admin" ? "admin" : "contributor";
    // console.log(roleDirectory);

    // const uploadDir = path.join( "..", "uploads", roleDirectory);

    const photoUrl = `${process.env.BASE_URL}/uploads/${roleDirectory}/${userExist.avatar}`;

    userExist.avatar = photoUrl;

    return res
      .status(200)
      .json({ userProfile: userExist, fullPhotoUrl: photoUrl });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error!" });
  }
};

//upload profile photo
const profilePhotCtrl = async (req, res) => {
  try {
    // Find the user in the database
    const userExist = await User.findById(req.user.id);

    if (!userExist) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found!" });
    }

    if (!req.files) {
      return res
        .status(422)
        .json({ status: "error", message: "Please choose an image!" });
    }

    // console.log(userExist);

    const avatar = req.files;

    // console.log(avatar);

    // Check the size of the picture
    if (avatar.size > 5000000) {
      return res.status(422).json({
        status: "error",
        message: "Profile picture should not be too big!",
      });
    }

    // Determine the user's role and set the appropriate directory
    const roleDirectory = userExist.role === "admin" ? "admin" : "contributor";

    const uploadDir = path.join(__dirname, "..", "uploads", roleDirectory);

    // Ensure the directory exists; create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete the old pic if it exists
    if (userExist.avatar) {
      try {
        await fs.promises.unlink(
          path.join(__dirname, "..", "uploads", roleDirectory, userExist.avatar)
        );
      } catch (err) {
        // Log the error but don't stop the execution
        console.error("Error deleting old avatar:", err);
      }
    }

    // Generate a new file name for the avatar
    const fileName = avatar.profilePhoto.name;
    const splittedName = fileName.split(".");
    const newFileName =
      splittedName[0] + uuid() + "." + splittedName[splittedName.length - 1];

    // Move the new file to the appropriate directory
    avatar.profilePhoto.mv(path.join(uploadDir, newFileName), async (err) => {
      if (err) {
        console.log(err.message);
        return res.status(422).json(err.message);
      }

      // Update the user's avatar in the database
      const updateAvatar = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: newFileName },
        { new: true }
      );

      if (!updateAvatar) {
        return res.status(422).json({ message: "Avatar couldn't be changed" });
      }

      const photoUrl = `/uploads/${roleDirectory}/${newFileName}`;

      // console.log(photoUrl);

      // Return the URL of the uploaded photo
      res.status(200).json({
        success: true,
        photoUrl,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProfilePhotCtrl = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const userExist = await User.findById(userId).select("role avatar"); // Assuming 'photoUrl' is stored in the User model

    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure user.avatar exists and is not undefined
    if (!userExist.avatar) {
      return res
        .status(404)
        .json({ success: false, message: "Profile photo not found" });
    }

    // Safely check user's role before setting the directory
    const roleDirectory = userExist.role === "admin" ? "admin" : "contributor";

    // Construct the full URL to the profile photo
    const photoUrl = `uploads/${roleDirectory}/${userExist.avatar}`;

    // console.log(photoUrl);

    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update user
const updateUserCtrl = async (req, res) => {
  try {
    const { fullname, email, oldPassword, newPassword, confirmNewPassword } =
      req.body;

    // console.log(oldPassword);

    if (
      !fullname &&
      !email &&
      !oldPassword &&
      !newPassword &&
      !confirmNewPassword
    ) {
      return res.status(422).json({ message: "No update field provided" });
    }

    // Create an update object to store fields to be updated
    let updateData = {};

    // Validate and prepare fullname
    if (fullname) {
      updateData.fullname = fullname;
    }

    // Validate and prepare email
    if (email) {
      const newEmail = email.toLowerCase();
      const emailExists = await User.findOne({ email: newEmail });

      if (emailExists) {
        return res.status(422).json({ message: "Email already exists!" });
      }

      updateData.email = newEmail;
    }

    console.log(oldPassword);

    // Validate and prepare password
    if (oldPassword) {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res
          .status(422)
          .json({ message: "Please provide all password fields!" });
      }
      const user = await User.findById(req.user.id);

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(422)
          .json({ message: "Current password is incorrect!" });
      }

      if (newPassword.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "New password should be at least 6 characters!" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(422).json({ message: "New passwords do not match!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPassword, salt);

      updateData.password = hashPass;
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return res.status(422).json({ message: "No update fields provided!" });
    }

    console.log(updateData);

    // Update the user in the database and fetch the updated user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from the returned data

    console.log(updatedUser);

    return res.status(200).json({
      status: "success",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  profilePhotCtrl,
  updateUserCtrl,
  getProfilePhotCtrl,
};
