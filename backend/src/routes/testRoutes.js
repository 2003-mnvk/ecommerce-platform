import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = express.Router();

const testSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must contain at least 2 characters"),

    age: z
      .number()
      .int()
      .min(18, "Age must be at least 18"),
  }),
});

router.post(
  "/test-validation",
  validate(testSchema),
  asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse(
        200,
        req.validated.body,
        "Validation successful"
      )
    );
  })
);

export default router;