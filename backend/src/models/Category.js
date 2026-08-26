import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Category name is required"],
        trim:true,
        minLength:[2,"Category name must contain atleast 2 characters"],
        maxLength:[50,"Category name must not exceed 50 characters"],
    },
    slug:{
        type:String,
        required:[true,"Category Slug is required"],
        trim:true,
        unique:true,
        lowercase:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
        maxLength:[500,"Description cannot exceed 500 characters"],
    },
    isActive:{
        type:Boolean,
        default:true,
    },
},{
    timestamps:true,
});

const Category = mongoose.model("Category",categorySchema);

export default Category;