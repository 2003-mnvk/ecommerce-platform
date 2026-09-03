import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    moderateReview,
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
            review,
            "Review created successfully",
            
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
            result,
            "Product reviews fetched successfully",
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
            review,
            "Review updated successfully"
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
            review,
            "Review deleted successfully",
        )
    );
}

export const moderate = async (req,res) => {
    const review = await moderateReview(
        req.validated.params.id,
        req.validated.body.isApproved
    );

    res.status(200).json(
        new ApiResponse(
            200,
            review,
            req.validated.body.isApproved ? "Review approved successfully" : "Review rejected successfully",
            
        )
    );
}