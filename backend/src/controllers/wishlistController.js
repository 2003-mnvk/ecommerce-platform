import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} from "../services/wishlistService.js";
import ApiResponse from "../utils/ApiResponse.js";

//getwishlist
export const get = async (req,res) => {
    const wishlist = await getWishlist(
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Wishlist fetched successfully"
        )
    );
};

//add to wishlist
export const add = async(req,res) => {
    const {product} = req.validated.body;
    const result = await addToWishlist(
        req.user._id,
        product
    );

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Product added to wishlist successfully"
        )
    );
};

//remove from wishlist
export const remove = async (req,res) => {
    const {productId} = req.validated.params;
    const wishlist = await removeFromWishlist(
        req.user._id,
        productId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Product removed from wishlist successfully"
        )
    );
};

//clear from wishlist
export const clear = async (req,res) => {
    const wishlist = await clearWishlist(
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            wishlist,
            "Wishlist cleared successfully"
        )
    );
};


