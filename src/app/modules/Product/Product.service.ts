import ApiError from '../../errors/ApiError';
import { ProductSearchableFields } from './Product.constant';
import { IProduct, TProductQuery } from './Product.interface';
import ProductModel from './Product.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';

const createProductService = async (
  payload: IProduct,
) => {
  return payload;
  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductsService = async (query: TProductQuery) => {
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
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender:1,
        role: 1,
        status: 1,
        profileImg: 1,
        createdAt: 1,
        updatedAt: 1,
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
    page: Number(page), //currentPage
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
  getAllProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
};
