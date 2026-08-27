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

export const getCategories = async ({
  page = 1,
  limit = 10,
  search,
  isActive,
  sort = "createdAt",
  order = "desc",
}) => {
  const filter = {};

  // Search by category name
  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const skip = (page - 1) * limit;

  const sortOrder = order === "asc" ? 1 : -1;

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit),

    Category.countDocuments(filter),
  ]);

  return {
    categories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};


export const getCategoryById = async (categoryId) => {
    const category = await Category.findById(categoryId);

    if(!category){
        throw new ApiError(404,"Category Not Found")
    }

    return category;
}

export const updateCategory = async(categoryId,updateData) => {
    const category = await Category.findById(categoryId);

    if(!category){
        new ApiError(404,"Category not found");
    }

    if(updateData.name || updateData.slug){
        const duplicate = await Category.findOne({
            _id:{$ne:categoryId},
            $or:[
                ...(updateData.name
                    ? [{name:updateData.name}]
                    :[]),
                ...(updateData.slug
                    ? [{slug:updateData.slug}]
                    :[]),
            ],
        });

        if(duplicate){
            throw new ApiError(
                409,
                "Category with this name or slug already exists",
            );
        }
    }

    Object.assign(category,updateData);

    await category.save();

    return category;
}

export const deleteCategory = async(categoryId) =>{
    const category = await Category.findById(categoryId);

    if(!category){
        throw new ApiError(404,"Category not Found");
    }

    if(!category.isActive){
        throw new ApiError(400,"Category is already inactive")
    }

    category.isActive = false;

    await category.save();

    return category;
};


