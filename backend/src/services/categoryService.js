import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

export const createCategory = async ({
    name,
    slug,
    description,
}) =>{
    const existingCategory = await Category.findOne({
        $or :[{name},{slug}],
    });

    if(existingCategory){
        throw new ApiError(
            409,
            "Category with this name or slug already exists"
        );
    }

    const category = await Category.create({
        name,
        slug,
        description
    });

    return category;
}