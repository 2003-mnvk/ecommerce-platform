import {z} from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format");

export const addToCartSchema = z.object({
    body: z.object({
        product: objectIdSchema,
        quantity: z 
            .number()
            .int("Quantity must be an Whole number")
            .min(1, "Quantity must be at least 1"),
    }),
});

export const updateCartSchema = z.object({
    params: z.object({
        productId: objectIdSchema,
    }),

    body: z.object({
        quantity: z
            .number()
            .int("Quantity must be an Whole number")
            .min(1, "Quantity must be at least 1"),
    }),
});

export const removeFromCartSchema = z.object({
    params: z.object({
        productId: objectIdSchema,
    }),
}); 