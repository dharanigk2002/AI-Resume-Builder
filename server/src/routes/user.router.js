import express from "express";
import {
  getUser,
  getUserResumes,
  login,
  register,
  logout,
} from "../controllers/user.controller.js";
import { isAuthenticated, isVerified } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);

userRouter.route("/data").get(isAuthenticated, getUser);
userRouter.route("/resumes").get(isAuthenticated, getUserResumes);
userRouter.route("/logout").post(isAuthenticated, logout);

export default userRouter;
