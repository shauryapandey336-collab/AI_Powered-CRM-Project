import { sendError } from "../utils/apiResponse.js";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.errors) {
      const formattedErrors = error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message
      }));
      return sendError(res, 400, "Validation failed", formattedErrors);
    }
    return sendError(res, 400, error.message || "Invalid input payload");
  }
};
