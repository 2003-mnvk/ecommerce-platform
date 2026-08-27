import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../services/categoryService.js";
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

export const getAll = async (req,res) =>{
    const result = await getCategories(req.validated.query);

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Categories Fetched Sucessfully"
        )
    );
};

export const getById = async (req,res) =>{
    const result = await  getCategoryById(req.validated.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Category Fetched Sucessfully!"
        )
    );
};

export const update = async(req,res)=>{
    const result = await updateCategory(
        req.validated.params.id,
        req.validated.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Category Updated Sucessfully"
        )
    );
};

export const remove = async (req,res)=>{
    const result = await deleteCategory(req.validated.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Category deleted successfully"
        )
    );
};


