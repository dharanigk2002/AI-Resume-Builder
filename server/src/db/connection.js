import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export default async function getConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo DB connected successfully");
  } catch (error) {
    console.error(error);
  }
}
