import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../services/cartService.js";

import ApiResponse from "../utils/ApiResponse.js";

//getCart
export const get = async (req,res) => {
    const cart = await getCart(
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart fetched successfully"
        )
    );
}

//add to cart
export const add = async (req,res) => {
    const {product,quantity} = req.validated.body;

    const cart = await addToCart(
        req.user._id,
        product,
        quantity
    );

    res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product added to cart successfully"
        )
    );
}

//update cart item
export const update = async (req,res) =>{
    const {productId} = req.validated.params;
    const {quantity} = req.validated.body;

    const cart = await updateCartItem(
        req.user._id,
        productId,
        quantity
    );

    res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart item updated successfully"
        )
    );
};

//remove from cart
export const remove = async (req,res) =>{
    const {productId} = req.validated.params;

    const cart = await removeFromCart(
        req.user._id,
        productId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product removed from cart successfully"
        )
    );
};

//clear cart
export const clear = async(req,res) => {
    const cart = await clearCart(req.user._id);

    res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart cleared successfully"
        )
    );
};

