import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
