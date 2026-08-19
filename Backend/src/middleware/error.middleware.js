import { sendError } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught in middleware:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  if (env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack
    });
  }

  return sendError(res, statusCode, message);
};
