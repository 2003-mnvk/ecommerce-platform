import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

//get users cart

export const getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate(
        'items.product',
        "name slug price stock images isActive"
    );

    if(!cart) {
        cart = await Cart.create({ 
            user: userId,
            items: [], 
        });

        cart = await Cart.findById(cart._id).populate(
            "items.product",
            "name slug price stock images isActive"
        );
    }

    const items = cart.items
        .filter((item) => item.product && item.product.isActive)
        .map((item)=>({
            product: item.product,
            quantity: item.quantity,
            itemTotal: item.product.price * item.quantity,
        }));
    
    const subtotal = items.reduce(
        (total, item) => total + item.itemTotal, 
        0
    );

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return {
        cart: cart._id,
        items,
        totalItems,
        subtotal,
    };
}

//add product to cart
export const addToCart = async (
    userId, 
    productId, 
    quantity
) => {
    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });

    if(!product) {
        throw new ApiError(404, "Product not found");
    }

    if(product.stock < quantity) {
        throw new ApiError(400, `Only ${product.stock} units available in stock`);
    }

    let cart = await Cart.findOne({ user: userId });

    if(!cart) {
        cart = await Cart.create({
            user: userId,
            items: [
                {
                    product: productId, 
                    quantity 
                },
            ],
        });
        return cart;
    }
    
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId.toString()
    );

    if(existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if(newQuantity > product.stock) {
            throw new ApiError(400, `Only ${product.stock} units available in stock`);
        }

        existingItem.quantity = newQuantity;
    }else{
        cart.items.push({
            product:productId,
            quantity,
        });
    }

    await cart.save();

    return cart;
};

//update cart
export const updateCartItem = async (
    userId,
    productId,
    quantity
) => {
    const cart = await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404,"cart not found");
    }

    const item = cart.items.find(
        (item) => item.product.toString() === productId.toString()
    );

    if(!item){
        throw new ApiError(404,"Product is not in cart");
    }

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });

    if(!product){
        throw new ApiError(404,"Product not found");
    }

    if(quantity > product.stock){
        throw new ApiError(
            400,
            `Only ${product.stock} units available`
        );
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
};

//Remove product from cart
export const removeFromCart = async(
    userId,
    productId
) => {
    const cart = await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404,"Cart not found");
    }

    const itemExists = cart.items.some(
        (item) => item.product.toString() === productId.toString()
    );

    if(!itemExists){
        throw new ApiError(
            404,
            "Product is not in your cart"
        );
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();

    return cart;
};

export const clearCart = async(userId) => {
    const cart = await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404,"Cart not found");
    }

    cart.items = [];

    await cart.save();

    return cart;
};

