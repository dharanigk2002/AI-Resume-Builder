import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../db/models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Resume from "../db/models/resume.model.js";

// api/users/register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(409)
        .json(new ApiError(409, "User with this email already exists"));
    const user = await User.create({
      name,
      email,
      password,
    });
    const token = user.generateToken(user._id);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .status(201)
      .json(new ApiResponse(201, { user, token }, "User created successfully"));
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res
        .status(400)
        .json(new ApiError(400, errors, "Validation failed"));
    }
    return res.status(500).json(new ApiError(500, error.message));
  }
}

// api/users/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json(new ApiError(400, "Invalid credentials"));

    if (!(await user.isPasswordMatching(password)))
      return res.status(400).json(new ApiError(400, "Invalid credentials"));

    const token = user.generateToken(user._id);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .status(200)
      .json(new ApiResponse(200, { user, token }, "Logged in successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, error.message));
  }
}

// api/users/data
export async function getUser(req, res) {
  try {
    const user = req.user;
    return res.status(200).json(new ApiResponse(200, { user }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, error.message));
  }
}

// GET: /api/users/resumes
export async function getUserResumes(req, res) {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort(
      "-updatedAt",
    );
    return res.status(200).json(new ApiResponse(200, { resumes }));
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return res
        .status(400)
        .json(new ApiError(400, { errors }, "Validation failed"));
    }
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
}

export const logout = asyncHandler(async function (_, res) {
  return res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});
