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
        compareAtPrice,
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
        compareAtPrice,
        stock,
        sku,
        images,
        specifications,
    });

    return product;
}

export const getProducts = async({
    page =  1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort = "createdAt",
    order = "desc",
}) =>{
    const filter = {isActive: true,};

    //search
    if (search) {
    filter.$or = [
        {
            name: {
                $regex: search,
                $options: "i",
            },
        },
        {
            description: {
                $regex: search,
                $options: "i",
            },
        },
        {
            brand: {
                $regex: search,
                $options: "i",
            },
        },
    ];
}

    //category filter
    if(category){
        filter.category = category;
    }

    //price filter
    if(minPrice !== undefined || maxPrice !== undefined){
        filter.price = {};

        if(minPrice !== undefined){
            filter.price.$gte = minPrice;
        }

        if(maxPrice !== undefined){
            filter.price.$lte = maxPrice
        }
    }

    //rating filter
    if(minRating !== undefined){
        filter.ratings = {
            $gte: minRating,
        };
    }

    const skip = (page -1)*limit;

    const sortOrder = order === "asc" ? 1 : -1

    const [products,total] = await Promise.all([
        Product.find(filter)
            .populate("category","name slug")
            .populate("seller","name email")
            .sort({[sort]:sortOrder})
            .skip(skip)
            .limit(limit),

        Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total/limit);

    return {
        products,
        pagination:{
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page < 1,
        },
    };
};

