import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

export const authenticateUser = async (req, res, next) => {
  try {
    let token = req.cookies?.[env.COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, 401, "Authentication required. Please login.");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        role: true,
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!user) {
      return sendError(res, 401, "User not found or session invalid.");
    }

    req.user = user;
    req.organizationId = user.organizationId;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return sendError(res, 401, "Session expired or invalid token. Please login again.");
    }
    next(error);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, "Access denied. Insufficient permissions.");
    }
    next();
  };
};
