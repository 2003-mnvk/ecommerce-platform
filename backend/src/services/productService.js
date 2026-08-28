import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

export const createProduct = async(productData,user) =>{
    const{
        name,
        slug,
        description,
        category,
        brand,
        price,
        comparedAtPrice,
        stock,
        sku,
        images,
        specifications,
    } = productData;

    const existingCategory = await Category.findById(category);

    if(!existingCategory){
        throw new ApiError(404,"Category not found");
    }

    if(!existingCategory.isActive){
        throw new ApiError(400,"Category is inactive");
    }

    const existingSlug = await Product.findOne({slug});

    if(existingSlug){
        throw new ApiError(409,"Product with this slug already exists");
    }

    const existingSku = await Product.findOne({sku});

    if(existingSku){
        throw new ApiError(409,"Product with this SKU already exists");
    }

    const product = await Product.create({
        name,
        slug,
        description,
        category,
        seller:user._id,
        brand,
        price,
        comparedAtPrice,
        stock,
        sku,
        images,
        specifications,
    });

    return product;
}