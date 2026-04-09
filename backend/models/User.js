import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserShema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isContributor: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["contributor", "admin"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserShema);

export default User;
