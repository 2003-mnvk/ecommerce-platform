import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

// Update product ratings and review count
const updateProductRatings = async (productId) => {
  const productObjectId =
    productId instanceof mongoose.Types.ObjectId
      ? productId
      : new mongoose.Types.ObjectId(productId);

  const result = await Review.aggregate([
    {
      $match: {
        product: productObjectId,
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    await Product.findByIdAndUpdate(productObjectId, {
      ratings: 0,
      numReviews: 0,
    });

    return;
  }

  await Product.findByIdAndUpdate(productObjectId, {
    ratings: Number(result[0].averageRating.toFixed(2)),
    numReviews: result[0].numReviews,
  });
};

// Create Review
export const createReview = async (reviewData, user) => {
  const {
    product,
    rating,
    title,
    comment,
  } = reviewData;

  const existingProduct = await Product.findOne({
    _id: product,
    isActive: true,
  });

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const existingReview = await Review.findOne({
    product,
    user: user._id,
  });

  if (existingReview) {
    throw new ApiError(
      409,
      "You have already reviewed this product"
    );
  }

  const review = await Review.create({
    product,
    user: user._id,
    rating,
    title,
    comment,
  });

  await updateProductRatings(product);

  return review;
};

// Get Product Reviews
export const getProductReviews = async (
  productId,
  query
) => {
  const {
    page = 1,
    limit = 10,
    rating,
    sort = "createdAt",
    order = "desc",
  } = query;

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const filter = {
    product: productId,
    isApproved: true,
  };

  if (rating !== undefined) {
    filter.rating = rating;
  }

  const skip = (page - 1) * limit;

  const sortOrder = order === "asc" ? 1 : -1;

  const reviews = await Review.find(filter)
    .populate("user", "name")
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update Review
export const updateReview = async (
  reviewId,
  reviewData,
  user
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (
    user.role !== "admin" &&
    review.user.toString() !== user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to update this review"
    );
  }

  Object.assign(review, reviewData);

  await review.save();

  await updateProductRatings(review.product);

  return review;
};

// Delete Review
export const deleteReview = async (
  reviewId,
  user
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (
    user.role !== "admin" &&
    review.user.toString() !== user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to delete this review"
    );
  }

  const productId = review.product;

  await review.deleteOne();

  await updateProductRatings(productId);

  return review;
};

export const moderateReview = async (reviewId, isApproved) => {
    const review = await Review.findById(reviewId);

    if(!review) {
        throw new ApiError(404, "Review not found");
    }

    review.isApproved = isApproved;

    await review.save();

    await updateProductRatings(review.product);

    return review;
}