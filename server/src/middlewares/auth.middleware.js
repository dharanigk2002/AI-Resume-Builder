import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../db/models/user.model.js";

export async function isVerified(req, res, next) {
  try {
    const token =
      req.cookies.token ?? req.headers["authorization"]?.split(" ")[1];
    if (!token) return next();
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(400).json(new ApiError(400, "Invalid or expired token"));
  }
}

export async function isAuthenticated(req, res, next) {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Please login to continue"));
  const user = await User.findById(req.user.id);
  if (!user)
    return res.status(404).json(new ApiError(404, "Please login to continue"));
  req.user = user;
  return next();
}
