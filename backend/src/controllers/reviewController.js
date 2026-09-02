import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
}  from "../services/reviewService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const create = async (req,res) => {
    const review = await createReview(
        req.validated.body,
        req.user
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Review created successfully",
            review
        )
    );
}

export const getByProduct = async (req,res) => {
    const result = await getProductReviews(
        req.validated.params.productId,
        req.validated.query
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Product reviews fetched successfully",
            result
        )
    );
}

export const update = async (req,res) => {
    const review = await updateReview(
        req.validated.params.id,
        req.validated.body,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Review updated successfully",
            review
        )
    );
}

export const remove = async (req,res) => {
    const review = await deleteReview(
        req.validated.params.id,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Review deleted successfully",
            review
        )
    );
}

