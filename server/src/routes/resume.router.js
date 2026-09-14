import express from "express";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
} from "../controllers/resume.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const resumeRouter = express.Router();

resumeRouter.route("/create").post(isAuthenticated, createResume);
resumeRouter
  .route("/:resumeId")
  .all(isAuthenticated)
  .delete(deleteResume)
  .get(getResumeById);
resumeRouter.route("/public").get(isAuthenticated, getPublicResumeById);
resumeRouter
  .route("/update")
  .put(isAuthenticated, upload.single("image"), updateResume);

export default resumeRouter;
