import {object, trim, z} from "zod";

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

export const getCategoriesSchema = z.object({
    query : z.object({
        page : z.coerce
            .number()
            .int()
            .min(1)
            .default(1),
        
        limit : z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(10),
        
        search : z
            .string()
            .trim()
            .optional(),
        
        isActive : z   
            .enum(["true","false"])
            .optional(),
        
        sort : z
            .enum(["name","createdAt","updatedAt"])
            .default("createdAt"),
        
        order : z
            .enum(["asc","desc"])
            .default("desc"),
    }),
});

export const updateCategorySchema = z.object({
    params:z.object({
        id: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "Invalid MongoDB ObjectId"
            ),
    }),

    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(2,"Category name must contain at least 2 characters")
                .max(50,"Category name cannot exceed 50 characters")
                .optional(),
            
            slug: z
                .string()
                .trim()
                .min(2,"Slug must contain at least 2 characters")
                .max(60,"Slug cannot exceed 60 characters")
                .regex(
                    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    "Slug must contain only lowercase letters, numbers and hyphens"
                )
                .optional(),
            
            description: z
                .string()
                .trim()
                .max(500,"Description cannot exceed 500 characters")
                .optional(),
            
            isActive: z
                .boolean()
                .optional()
        })
        .refine(
            (data) => Object.keys(data).length>0,
            {
                message:"At least one field is required for update",
            }
        ),
});