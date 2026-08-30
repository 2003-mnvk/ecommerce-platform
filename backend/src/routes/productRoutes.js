import express from "express";
import { create,getAll } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createProductSchema,getProductSchema } from "../validators/productValidator.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("seller","admin"),
    validate(createProductSchema),
    asyncHandler(create)
);

router.get(
    "/",
    validate(getProductSchema),
    asyncHandler(getAll)
);

export default router;