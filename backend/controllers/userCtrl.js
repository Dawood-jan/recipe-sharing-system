import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
uuidv4();
import __dirname from "../utils/__dirname.js";
import User from "../models/User.js";

export const registerCtrl = async (req, res) => {
  try {
    const { fullname, password, confirmPassword, email } = req.body;
    // console.log(req.body);
    if (!fullname || !password || !email || !confirmPassword) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    if (!/^[a-zA-Z\s]+$/.test(fullname.trim())) {
      return res.status(422).json({
        message:
          "Name can only contain characters and must not exceed 25 characters!",
      });
    }

    let newEmail = email?.trim().toLowerCase();

    if (!newEmail.endsWith("@gmail.com")) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    const userExist = await User.findOne({ email: newEmail });

    if (userExist) {
      return res.status(403).json({ message: "Email exists already!" });
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
        .status(403)
        .json({ message: "Password must be at least 6 characters!" });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({ message: "Passwords do not match!" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      password: encryptPassword,
      email,
      role: "contributor",
      isAdmin: false,
      isContributor: true,
    });

    if (!newUser) {
      return res.status(403).json({ message: "There was an error signing up" });
    }

    res.status(200).json({ success: true, newUser });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const loginCtrl = async (req, res) => {
  try {
    const { password, email } = req.body;
    // console.log(password, email)

    if (!password || !email) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    let receivedEmail = email?.toLowerCase();

    const userExist = await User.findOne({ email: receivedEmail });
    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatched = await bcrypt.compare(password, userExist.password);

    if (!isMatched) {
      return res.status(403).json({ message: "Invalid credentials!" });
    }

    const { _id: id } = userExist;

    const token = JWT.sign(
      { id, email: receivedEmail },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      id,
      email: receivedEmail,
      isAdmin: userExist?.isAdmin,
      isContributor: userExist?.isContributor,
      role: userExist?.role,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const profileCtrl = async (req, res) => {
  try {
    const userExist = await User.findById(req?.user?.id);

    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    res
      .status(200)
      .json({ userExist, message: "Profile fetched successfully." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const updateProfileCtrl = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    // console.log(req.body);

    const userExist = await User.findById(req.user.id);

    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    const lowerEmail = email?.trim().toLowerCase();

    if (!fullname && !email && !password && !confirmPassword) {
      return res.status(422).json({ message: "No field to update!" });
    }

    // const isTaken = await User.findOne({ email: lowerEmail });

    if (email) {
      const isTaken = await User.findOne({
        email: lowerEmail,
        _id: { $ne: req.user.id },
      });

      if (isTaken) {
        return res.status(422).json({ message: "Email already taken!" });
      }
    }

    const userData = {};

    if (fullname) {
      userData.fullname = fullname;
    }

    if (email) {
      userData.email = lowerEmail;
    }

    if (password) {
      if (password?.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "Password must be at lease 6 characters!" });
      }

      if (password !== confirmPassword?.trim()) {
        return res.status(422).json({ message: "Passwords do not match!" });
      }
      // console.log(userData);

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      userData.password = hashPass;
    }

    // console.log(userData);

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { ...userData },
      { new: true }
    );

    // console.log(updateUser);

    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const profilePhotoCtrl = async (req, res) => {
  try {
  // console.log(req?.files)
    if (!req.files) {
      return res.status(422).json({ message: "Please choose an image!" });
    }
    const avatar = req?.files?.profilePhoto;
    // console.log(req.files)

    // console.log(avatar);

    const userExist = await User.findById(req.user.id);

    // console.log(userExist);

    if (avatar.size > 50 * 1024 * 1024) {
      return res
        .status(422)
        .json({ message: "Picture must be less than 50kb!" });
    }

    const uploadDir = path.join(__dirname, "..", "uploads", "profile");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (userExist.profilePhoto) {
      try {
        await fs.promises.unlink(
          path.join(
            __dirname,
            "..",
            "uploads",
            "profile",
            userExist.profilePhoto
          )
        );
      } catch (error) {
        console.error("Error deleting old avatar:", error);
      }
    }

    const fileName = avatar.name;
    const fileExtension = fileName.split(".").pop();
    const newFileName = `${uuidv4()}.${fileExtension}`;

    // console.log(newFileName);

    avatar.mv(path.join(uploadDir, newFileName), async (err) => {
      if (err) {
        console.log(err.message);
        return res.status(422).json(err.message);
      }

      // console.log(fileName);

      await User.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: newFileName },
        { new: true }
      );

      const photoUrl = `/uploads/profile/${newFileName}`;
      // console.log(photoUrl);
      const fullPhotoUrl = `${process.env.Base_Url}/${photoUrl}`;
      res.status(200).json({ fullPhotoUrl });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const getProfilePhotoCtrl = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    // console.log(userExist);

    const photoUrl = userExist.profilePhoto;
    // console.log(photoUrl);

    const Base_Url = `${process.env.BASE_URL}/uploads/profile/${photoUrl}`;
    // console.log(Base_Url);

    res.status(200).json({ Base_Url });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    // console.log(req.body);

    if (!email || !password || !confirmPassword) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    let lowerEmail = email.trim().toLowerCase();

    const userExist = await User.findOne({ email: lowerEmail });

    if (!userExist) {
      return res.status(404).json({ message: "Wrong email!" });
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
        .status(403)
        .json({ message: "Password must be at least 6 characters!" });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({ message: "Passwords do not match!" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);

    const newPassword = await User.findOneAndUpdate(
      { email: lowerEmail },
      {
        password: encryptPassword,
      },
      { new: true }
    );

    if (!newPassword) {
      return res
        .status(403)
        .json({ message: "There was an error creating new password!" });
    }

    res.status(200).json(newPassword);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};
