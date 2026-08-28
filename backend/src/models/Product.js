import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must contain at least 3 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [
        10,
        "Product description must contain at least 10 characters",
      ],
      maxlength: [
        5000,
        "Product description cannot exceed 5000 characters",
      ],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product seller is required"],
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand cannot exceed 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    compareAtPrice: {
      type: Number,
      min: [0, "Compare-at price cannot be negative"],
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },

        alt: {
          type: String,
          trim: true,
          maxlength: [
            150,
            "Image alt text cannot exceed 150 characters",
          ],
        },
      },
    ],

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    numReviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

// Category + active products
productSchema.index({
  category: 1,
  isActive: 1,
});

// Seller + active products
productSchema.index({
  seller: 1,
  isActive: 1,
});

// Price sorting/filtering
productSchema.index({
  price: 1,
});

// Rating sorting
productSchema.index({
  ratings: -1,
});

// Compare-at price validation
productSchema.pre("validate", function () {
  if (
    this.compareAtPrice !== undefined &&
    this.compareAtPrice < this.price
  ) {
    throw new Error(
      "Compare-at price must be greater than or equal to price"
    );
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;