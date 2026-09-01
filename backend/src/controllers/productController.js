import { createProduct,getProducts, getProductById, updateProduct, deleteProduct } from "../services/productService.js";
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

export const getAll = async(req,res) =>{
    const result = await getProducts(req.validated.query);

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Products fetched successfully"
        )
    );
}

export const getById = async(req,res) => {
    const product = await getProductById(
        req.validated.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Products fetched successfully"
        )
    );
};

export const updateById = async(req,res) => {
    const product = await updateProduct(
        req.validated.params.id,
        req.validated.body,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );
}

export const deleteById = async(req,res) => {
    const product = await deleteProduct(
        req.validated.params.id,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product deleted successfully"
        )
    );
}
