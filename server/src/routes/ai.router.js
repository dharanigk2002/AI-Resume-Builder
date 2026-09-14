import express from "express";
import {
  enhanceJobDesc,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/ai.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const aiRouter = express.Router();

aiRouter
  .route("/enhance-pro-sum")
  .post(isAuthenticated, enhanceProfessionalSummary);

aiRouter.route("/enhance-job-desc").post(isAuthenticated, enhanceJobDesc);

aiRouter.route("/upload-resume").post(isAuthenticated, uploadResume);

export default aiRouter;
