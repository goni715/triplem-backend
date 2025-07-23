import ApiError from '../../errors/ApiError';
import { ProductSearchableFields } from './Product.constant';
import { IProduct, TProductQuery } from './Product.interface';
import ProductModel from './Product.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import slugify from 'slugify';
import CategoryModel from '../Category/Category.model';

const createProductService = async (
  payload: IProduct,
) => {
  const { name, categoryId } = payload;
  const slug = slugify(name).toLowerCase();
  payload.slug=slug;

  //check product name is already existed
  const product = await ProductModel.findOne({
    slug
  });

  if(product){
    throw new ApiError(409, "This name is already taken.")
  }


  //check categoryId
  const existingCategory = await CategoryModel.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, 'This categoryId not found');
  }

  const result = await ProductModel.create(payload);
  return result;
};

const getProductsService = async (query: TProductQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, ProductSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ProductModel.aggregate([
    {
      $match: {
        ...searchQuery, 
        ...filterQuery
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: 1,
        categoryName: "$category.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        totalReview: "$totalReview",
        images: "$images",
        colors: "$colors",
        sizes: "$sizes",
        introduction: "$introduction",
        description: "$description",
        status: "$status"
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalReviewResult = await ProductModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), 
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getSingleProductService = async (productId: string) => {
  const result = await ProductModel.findById(productId);
  if (!result) {
    throw new ApiError(404, 'Product Not Found');
  }

  return result;
};

const updateProductService = async (productId: string, payload: any) => {
 
  const product = await ProductModel.findById(productId);
  if(!product){
    throw new ApiError(404, "Product Not Found");
  }
  const result = await ProductModel.updateOne(
    { _id: productId },
    payload,
  );

  return result;
};

const deleteProductService = async (productId: string) => {
  const product = await ProductModel.findById(productId);
  if(!product){
    throw new ApiError(404, "Product Not Found");
  }
  const result = await ProductModel.deleteOne({ _id:productId });
  return result;
};

export {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
};
