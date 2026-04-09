import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    process.exit(1);
  }
};

export default  connectDB;


