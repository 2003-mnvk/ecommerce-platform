import z from "zod";

export const objectIdSchema = z.object({
    params: z.object({
        id: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "Invalid MongoDB ObjectId"                
            ),
    }),
});