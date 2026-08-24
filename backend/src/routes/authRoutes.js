import express from "express";

import {
  register,
  login,
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

export default router;