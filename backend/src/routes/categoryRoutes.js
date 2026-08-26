import express from "express";
import {create} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import validate from "../middleware/validate.js";

import { createCategorySchema } from "../validators/categoryValidator.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    validate(createCategorySchema),
    asyncHandler(create)
);

export default router;

