import {z} from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

//add product to wishlist
export const addToWishlistSchema = z.object({
    body: z.object({
        product: objectIdSchema,
    }),
});

//remove from wishlist
export const removeFromWishlistSchema = z.object({
    params: z.object({
        productId: objectIdSchema,
    }),
});

