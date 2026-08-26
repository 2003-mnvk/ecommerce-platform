import {trim, z} from "zod";

export const createCategorySchema = z.object({
    body:z.object({
        name: z
            .string()
            .trim()
            .min(2,"Category name must contain at least 2 characters")
            .max(50,"Category name cannot exceed 50 characters"),
        
        slug: z
            .string()
            .trim()
            .min(2,"Slug must contain at least 2 characters")
            .max(50,"Slug cannot exceed 60 characters")
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Slug must contain only lowercase letters, numbers and hyphens"
            ),
        
        description: z
            .string()
            .trim()
            .max(500,"Description cannot exceed 500 characters")
            .optional(),
    }),
});