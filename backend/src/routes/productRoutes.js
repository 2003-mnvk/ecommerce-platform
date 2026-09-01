import express from "express";
import { create,getAll, getById, updateById, deleteById } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createProductSchema,getProductSchema, getProductByIdSchema, updateProductByIdSchema, deleteProductByIdSchema } from "../validators/productValidator.js";

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

router.get(
    "/:id",
    validate(getProductByIdSchema),
    asyncHandler(getById)
)

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("seller","admin"),
    validate(updateProductByIdSchema),
    asyncHandler(updateById)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("seller","admin"),
    validate(deleteProductByIdSchema),
    asyncHandler(deleteById)
);
export default router;