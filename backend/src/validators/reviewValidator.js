import z from 'zod';

const objectIdSchema = z
.string()
.regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const createReviewSchema = z.object({
    body: z.object({
        product: objectIdSchema,
        rating: z.coerce
            .number()
            .int("Rating must be an whole number")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot exceed 5"),
        
        title: z
            .string()
            .trim()
            .max(150, "Title cannot exceed 150 characters")
            .optional(),
        
        comment: z
            .string()
            .trim()
            .min(5, "Comment must be at least 5 characters")
            .max(2000, "Comment cannot exceed 2000 characters"),
    }),
});

export const getProductReviewsSchema = z.object({
    params: z.object({
        productId: objectIdSchema,
    }),

    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        rating: z.coerce.number().int().min(1).max(5).optional(),
        sort: z.enum(["createdAt","rating"]).default("createdAt"),
        order: z.enum(["asc","desc"]).default("desc"),
    }),
});

export const updateReviewSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),

    body: z
        .object({
            rating: z.coerce
                .number()
                .int("Rating must be an whole number")
                .min(1, "Rating must be at least 1")
                .max(5, "Rating cannot exceed 5"),
            
            title: z
                .string()
                .trim()
                .max(150, "Title cannot exceed 150 characters")
                .optional(),
            
            comment: z
                .string()
                .trim()
                .min(5, "Comment must be at least 5 characters")
                .max(2000, "Comment cannot exceed 2000 characters")
                .optional(),
        })
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field (rating, title, or comment) must be provided for update",
        }
    ),  
});

export const deleteReviewSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});

export const moderateReviewSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),

    body: z.object({
        isApproved: z.boolean(),
    }),
})