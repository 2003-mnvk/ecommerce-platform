import { createCategory,  } from "../services/categoryService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const create  = async(req,res)=>{
    const category = await createCategory(req.validated.body);

    res.status(201).json(
        new ApiResponse(
            201,
            category,
            "Category created Sucessfully"
        )
    );
};