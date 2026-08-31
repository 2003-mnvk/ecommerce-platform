import { optional, trim, z } from "zod";

const imageSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Image URL must be a valid URL"),

  alt: z
    .string()
    .trim()
    .max(
      150,
      "Image alt text cannot exceed 150 characters"
    )
    .optional(),
});

export const createProductSchema = z
  .object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(
          3,
          "Product name must contain at least 3 characters"
        )
        .max(
          150,
          "Product name cannot exceed 150 characters"
        ),

      slug: z
        .string()
        .trim()
        .min(
          3,
          "Product slug must contain at least 3 characters"
        )
        .max(
          160,
          "Product slug cannot exceed 160 characters"
        )
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain only lowercase letters, numbers and hyphens"
        ),

      description: z
        .string()
        .trim()
        .min(
          10,
          "Product description must contain at least 10 characters"
        )
        .max(
          5000,
          "Product description cannot exceed 5000 characters"
        ),

      category: z
        .string()
        .regex(
          /^[0-9a-fA-F]{24}$/,
          "Invalid category ID"
        ),

      brand: z
        .string()
        .trim()
        .max(
          100,
          "Brand cannot exceed 100 characters"
        )
        .optional(),

      price: z
        .number()
        .min(
          0,
          "Price cannot be negative"
        ),

      compareAtPrice: z
        .number()
        .min(
          0,
          "Compare-at price cannot be negative"
        )
        .optional(),

      stock: z
        .number()
        .int(
          "Stock must be a whole number"
        )
        .min(
          0,
          "Stock cannot be negative"
        ),

      sku: z
        .string()
        .trim()
        .min(
          2,
          "SKU must contain at least 2 characters"
        )
        .max(
          50,
          "SKU cannot exceed 50 characters"
        )
        .regex(
          /^[a-zA-Z0-9-]+$/,
          "SKU can contain only letters, numbers and hyphens"
        ),

      images: z
        .array(imageSchema)
        .max(
          10,
          "A product can have a maximum of 10 images"
        )
        .optional(),

      specifications: z
        .record(z.string())
        .optional(),
    }),
  })
  .refine(
    (data) => {
      const { price, compareAtPrice } = data.body;

      return (
        compareAtPrice === undefined ||
        compareAtPrice >= price
      );
    },
    {
      message:
        "Compare-at price must be greater than or equal to price",
      path: ["body", "compareAtPrice"],
    }
  );


export const getProductSchema = z.object({
  query: z.object({
    page: z.coerce
            .number()
            .int()
            .min(1)
            .default(1),
    
    limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(10),
    
    search: z
            .string()
            .trim()
            .optional(),

    category: z
            .string()
            .regex(
              /^[0-9a-fA-F]{24}$/,
              "Invalid category ID"
            )        
            .optional(),
    
    minPrice: z.coerce
            .number()
            .min(0,"Minimum price cannot be negative")
            .optional(),
    
    maxPrice: z.coerce
            .number()
            .min(0,"Maximum price cannot be negative")
            .optional(),
    
    minRating: z.coerce
            .number()
            .min(0)
            .max(5)
            .optional(),
    
    sort: z
            .enum(["name","price","ratings","createdAt",])
            .default("createdAt"),
    
    order: z
            .enum(["asc","desc"])
            .default("desc"),
  }),
})
.refine(
  (data)=>{
    const {minPrice,maxPrice} = data.query;

    return(
      minPrice === undefined ||
      maxPrice === undefined ||
      minPrice<=maxPrice
    );
  },
  {
    message:
      "Minimum price cannot be greater than maximum price",
    path:["query","minPrice"],
  }
);


export const getProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid product ID"
      ),
  }),
});

export const updateProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(
          /^[0-9a-fA-F]{24}$/,
          "Invalid product ID"
      ),
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(
          3,
          "Product name must contain at least 3 characters"
        )
        .max(
          150,
          "Product name cannot exceed 150 characters"
        )
        .optional(),
      
      slug: z
        .string()
        .trim()
        .min(
          3,
          "Product slug must contain at least 3 characters"
        )
        .max(
          160,
          "Product slug cannot exceed 160 characters"
        )
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain only lowercase letters, numbers and hyphens"
        )
        .optional(),
      
      description: z
        .string()
        .trim()
        .min(
          10,
          "Product description must contain at least 10 characters"
        )
        .max(
          5000,
          "Product description cannot exceed 5000 characters"
        )
        .optional(),

      category: z
        .string()
        .regex(
          /^[0-9a-fA-F]{24}$/,
          "Invalid category ID"
        )
        .optional(),

      brand: z
        .string()
        .trim()
        .max(
          100,
          "Brand cannot exceed 100 characters"
        )
        .optional(),

      price: z
        .number()
        .min(
          0,
          "Price cannot be negative"
        )
        .optional(),

      compareAtPrice: z
        .number()
        .min(
          0,
          "Compare-at price cannot be negative"
        )
        .optional(),

      stock: z
        .number()
        .int(
          "Stock must be a whole number"
        )
        .min(
          0,
          "Stock cannot be negative"
        )
        .optional(),

      sku: z
        .string()
        .trim()
        .min(
          2,
          "SKU must contain at least 2 characters"
        )
        .max(
          50,
          "SKU cannot exceed 50 characters"
        )
        .regex(
          /^[a-zA-Z0-9-]+$/,
          "SKU can contain only letters, numbers and hyphens"
        )
        .optional(),

      images: z
        .array(imageSchema)
        .max(
          10,
          "A product can have a maximum of 10 images"
        )
        .optional(),

      specifications: z
        .record(z.string())
        .optional(),
      
      isActive: z
        .boolean()
        .optional(),
    })
    .refine(
      (body) => Object.keys(body).length > 0,
      {
        message: "At least one field is required for update",
      }
    ),
})