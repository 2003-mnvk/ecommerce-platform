import express from "express";
import {create,getAll,getById,update,remove} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import validate from "../middleware/validate.js";

import { createCategorySchema,getCategoriesSchema, updateCategorySchema } from "../validators/categoryValidator.js";
import { objectIdSchema } from "../validators/commonValidator.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    validate(createCategorySchema),
    asyncHandler(create)
);

router.get(
    "/",
    validate(getCategoriesSchema),
    asyncHandler(getAll)
);

router.get(
    "/:id",
    validate(objectIdSchema),
    asyncHandler(getById)
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    validate(updateCategorySchema),
    asyncHandler(update)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    validate(objectIdSchema),
    asyncHandler(remove)
);

export default router;

