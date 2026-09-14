import express from "express";
import http from "http";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dns from "dns/promises";

import { healthCheck } from "./controllers/health.controller.js";
import { ApiError } from "./utils/ApiError.js";
import getConnection from "./db/connection.js";
import userRouter from "./routes/user.router.js";
import resumeRouter from "./routes/resume.router.js";
import aiRouter from "./routes/ai.router.js";
import { isVerified } from "./middlewares/auth.middleware.js";

const PORT = process.env.PORT ?? 8000;
dns.setServers(["8.8.8.8", "0.0.0.0"]);

const app = express();
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(", "),
    allowedHeaders: process.env.CORS_HEADERS.split(","),
    methods: process.env.CORS_METHODS.split(","),
    credentials: true,
  }),
);

app.route("/").get(healthCheck);
app.use(isVerified);
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

app.use((err, _, res, _1) => {
  console.error(err.message);
  return res
    .status(err.statusCode ?? 500)
    .json(new ApiError(err.statusCode ?? 500, "Something went wrong"));
});

const server = http.createServer(app);
server.listen(PORT, async () => {
  console.log("Server is running on port", PORT);
  await getConnection();
});
