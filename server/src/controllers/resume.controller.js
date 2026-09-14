import mongoose from "mongoose";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import Resume from "../db/models/resume.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import imageKit from "../config/imagekit.js";

// POST: /api/resumes/create
export async function createResume(req, res) {
  try {
    const userId = req.user._id;
    const { title } = req.body;
    const resume = await Resume.create({ userId, title });
    return res
      .status(201)
      .json(new ApiResponse(201, { resume }, "Resume created successfully"));
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return res
        .status(400)
        .json(new ApiError(400, { errors }, "validation failed"));
    }
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
}

// DELETE:/api/resumes/:resumeId
export async function deleteResume(req, res) {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.deleteOne({
      _id: resumeId,
      userId: req.user._id,
    });
    if (resume.deletedCount === 0)
      return res.status(404).json(new ApiError(404, "Resume does not exists"));
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Resume deleted successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
}

// GET: /api/resumes/:resumeId
export async function getResumeById(req, res) {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    }).select("-createdAt -__v -updatedAt");
    if (!resume)
      return res.status(404).json(new ApiError(404, "Resume does not exists"));
    return res.status(200).json(new ApiResponse(200, { resume }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
}

// GET: /api/resumes/public
export async function getPublicResumeById(req, res) {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
      public: true,
    }).select("-__v");
    if (!resume)
      return res.status(404).json(new ApiError(404, "Resume does not exists"));
    return res.status(200).json(new ApiResponse(200, { resume }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
}

// PUT: /api/resumes/update
export async function updateResume(req, res) {
  try {
    const userId = req.user._id;
    const { resumeId, removeBackground } = req.body;
    const resumeData = JSON.parse(req.body.resumeData);
    const image = req.file;

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.jpg",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeData.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      resumeData,
      { runValidators: true, returnDocument: "after" },
    );
    return res
      .status(200)
      .json(new ApiResponse(200, { resume }, "Resume updated successfully"));
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
