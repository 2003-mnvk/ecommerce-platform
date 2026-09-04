import express from "express";

import {
    get,
    add,
    update,
    remove,
    clear,
} from "../controllers/cartController.js";

import {
    addToCartSchema,
    updateCartSchema,
    removeFromCartSchema,
} from "../validators/cartValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

//get cart
router.get(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    asyncHandler(get)
);

//add product to cart
router.post(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    validate(addToCartSchema),
    asyncHandler(add)
);

//update cart item
router.patch(
    "/:productId",
    authMiddleware,
    roleMiddleware("customer"),
    validate(updateCartSchema),
    asyncHandler(update)
);

//remove product from cart
router.delete(
    "/:productId",
    authMiddleware,
    roleMiddleware("customer"),
    validate(removeFromCartSchema),
    asyncHandler(remove)
);

//clear cart
router.delete(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    asyncHandler(clear)
);

export default router;