import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

//Get users wishlist
export const getWishlist = async(userId) => {
    let wishlist = await Wishlist.findOne({
        user:userId,
    }).populate(
        "products",
        "name slug price stock images ratings numReviews isActive"
    );

    if(!wishlist){
        wishlist = await Wishlist.create({
            user:userId,
            products:[],
        });

        wishlist = await Wishlist.findById(wishlist._id).populate(
            "products",
            "name slug price stock images ratings numReviews isActive"
        );
    }

    const products = wishlist.products.filter(
        (product) => product && product.isActive
    );

    return{
        wishlist:wishlist._id,
        products,
        totalItems: products.length,
    };
};

//add product to wishlist
export const addToWishlist = async (userId,productId) => {
    const product = await Product.findOne({
        _id:productId,
        isActive:true,
    });

    if(!product){
        throw new ApiError(404,"Product not found");
    }

    let wishlist = await Wishlist.findOne({
        user:userId,
    });

    if(!wishlist){
        wishlist = await Wishlist.create({
            user:userId,
            products:[productId],
        });

        return wishlist;
    }

    const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId.toString()
    );

    if(alreadyExists){
        throw new ApiError(409,"Product is already in your wishlist")
    };

    wishlist.products.push(productId);

    await wishlist.save();

    return wishlist;
}

//remove product from wishlist
export const removeFromWishlist = async(
    userId,
    productId
) => {
    const wishlist = await Wishlist.findOne({user:userId});

    if(!wishlist){
        throw new ApiError(404,"Wishlist not found");
    }

    const productExists = wishlist.products.some(
        (id) => id.toString() === productId.toString()
    );

    if(!productExists){
        throw new ApiError(404,"Product is not in your wishlist");
    }

    wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();

    return wishlist;
}

//clear wishlist
export const clearWishlist = async(userId) => {
    const wishlist = await Wishlist.findOne({
        user:userId,
    });

    if(!wishlist){
        throw new ApiError(404,"Wishlist not found");
    }

    wishlist.products = [];

    await wishlist.save();

    return wishlist;
}

