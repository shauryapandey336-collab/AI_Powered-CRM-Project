import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);

  res.cookie(env.COOKIE_NAME, token, cookieOptions);

  return sendSuccess(res, 201, "Registration successful", { user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie(env.COOKIE_NAME, token, cookieOptions);

  return sendSuccess(res, 200, "Login successful", { user, token });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax"
  });

  return sendSuccess(res, 200, "Logged out successfully");
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  return sendSuccess(res, 200, "Current user profile fetched", { user });
});
