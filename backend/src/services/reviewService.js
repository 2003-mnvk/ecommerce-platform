import Review from "../models/Review.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

//Create Review
export const createReview = async (reviewData,user) => {
    const {product,rating,title,comment} = reviewData;

    const existingproduct = await Product.findOne({
        _id: product,
        isActive: true,
    });

    if(!existingproduct){
        throw new ApiError(404, "Product not found");
    }

    const existingReview = await Review.findOne({
        product,
        user: user._id,
    });

    if(existingReview){
        throw new ApiError(409, "You have already reviewed this product");
    }

    const review = await Review.create({
        product,
        user:user._id,
        rating,
        title,
        comment,
    });
    
    return review;
}

//get product reviews

export const getProductReviews = async (productId,query) => {
    const {
        page = 1,
        limit = 10,
        rating,
        sort = "createdAt",
        order = "desc",
    }= query;

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });

    if(!product){
        throw new ApiError(404, "Product not found");
    }

    const filter = {
        product: productId,
        isApproved: true,
    };

    if(rating !== undefined){
        filter.rating = rating;
    }

    const skip = (page - 1) * limit;

    const sortOrder = order === "asc" ? 1 : -1;

    const reviews = await Review.find(filter)
        .populate("user", "name")
        .sort({[sort]: sortOrder})
        .skip(skip)
        .limit(limit);

    const total = await Review.countDocuments(filter);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            toitalPages: Math.ceil(total / limit),
        },
    };
};

//update review
export const updateReview = async (reviewId, reviewData, user) => {
    const review = await Review.findById(reviewId);

    if(!review){
        throw new ApiError(404, "Review not found");
    }

    if(user.role !== "admin" && review.user.toString() !== user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this review");
    }

    Object.assign(review, reviewData);

    await review.save();

    return review;
};

//delete review
export const deleteReview = async (reviewId, user) => {
    const review = await Review.findById(reviewId);

    if(!review){
        throw new ApiError(404, "Review not found");
    }

    if(user.role !== "admin" && review.user.toString() !== user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.deleteOne();

    return review;
};