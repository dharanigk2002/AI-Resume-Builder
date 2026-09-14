import { ApiResponse } from "../utils/ApiResponse.js";

export function healthCheck(_, res) {
  return res.status(200).json(new ApiResponse(200, "Server is up and running"));
}
