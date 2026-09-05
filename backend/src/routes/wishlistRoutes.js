import express from "express";

import {
    get,
    add,
    remove,
    clear,
} from "../controllers/wishlistController.js";

import {
    addToWishlistSchema,
    removeFromWishlistSchema,
} from "../validators/wishlistValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

//get wishlist
router.get(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    asyncHandler(get)
);

//add product to wishlist
router.post(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    validate(addToWishlistSchema),
    asyncHandler(add)
);

//remove product from wishlist
router.delete(
    "/:productId",
    authMiddleware,
    roleMiddleware("customer"),
    validate(removeFromWishlistSchema),
    asyncHandler(remove)
);

//clear wishlist
router.delete(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    asyncHandler(clear)
);

export default router;