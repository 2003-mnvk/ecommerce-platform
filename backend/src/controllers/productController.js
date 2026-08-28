import { createProduct } from "../services/productService.js";
import ApiResponse from "../utils/ApiResponse.js";

export const create = async(req,res) =>{
    const product = await createProduct(req.validated.body,req.user);

    res.status(201).json(
        new ApiResponse(
            201,
            product,
            "Product created successfully"
        )
    );
};

