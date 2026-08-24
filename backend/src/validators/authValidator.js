import {email, z} from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2,"Name must contain atleast 2 characters")
            .max(50,"Name cannot exceed 50 characters"),
        
        email: z
            .string()
            .trim()
            .email("Please provide a valid email"),
        
        password: z
            .string()
            .min(8,"Password must contain atleast 8 characters")
            .max(100,"Password cannot exceed 100 characters"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Please provide a valid email"),
        
        password: z
            .string()
            .min(1,"Password is required"),
    }),
});

