import express from "express";

import {
  register,
  login,
  refreshToken,
  logout
} from "../controllers/authController.js";

import validate from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/authValidator.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.post(
  "/refresh",
  asyncHandler(refreshToken)
)

router.post(
  "/logout",
  asyncHandler(logout)
)
export default router;