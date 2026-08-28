import express from "express";
import { create } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createProductSchema } from "../validators/productValidator.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("seller","admin"),
    validate(createProductSchema),
    asyncHandler(create)
);

export default router;