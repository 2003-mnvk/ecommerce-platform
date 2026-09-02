import express from 'express';
import {
    create,
    getByProduct,
    update,
    remove,
} from '../controllers/reviewController.js';
import { 
    createReviewSchema, 
    getProductReviewsSchema, 
    updateReviewSchema, 
    deleteReviewSchema 
} from '../validators/reviewValidator.js';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

//create review - Customers only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    validate(createReviewSchema),
    asyncHandler(create)
);

//get product reviews - public
router.get(
    "/product/:productId",
    validate(getProductReviewsSchema),
    asyncHandler(getByProduct)
);

//update review - Customers/admin
router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("customer","admin"),
    validate(updateReviewSchema),
    asyncHandler(update)
);

//delete review - Customers/admin
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("customer","admin"),
    validate(deleteReviewSchema),
    asyncHandler(remove)
);

export default router;