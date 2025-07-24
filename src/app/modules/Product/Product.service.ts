import ApiError from '../../errors/ApiError';
import { ProductSearchableFields } from './Product.constant';
import { IProduct, TProductQuery } from './Product.interface';
import ProductModel from './Product.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import slugify from 'slugify';
import CategoryModel from '../Category/Category.model';
import ColorModel from '../Color/Color.model';
import SizeModel from '../Size/Size.model';
import { Request } from 'express';
import { Types } from "mongoose";

const createProductService = async (
  req: Request,
  payload: IProduct,
) => {

  return "create product service"
  let images = []

  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    const files = req.files as Express.Multer.File[];
    for (const file of files) {
      const path = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;  //for local machine
      images.push(path)
    }
  }
  else {
    throw new ApiError(400, "Minimum one image required");
  }

  //set image to payload
  if(images && images?.length > 0){
    payload.images=images;
  }


  //destructuring the payload
  const { name, categoryId, colors, sizes } = payload;
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

  //check color
  if(colors && colors?.length > 0){
     for (let i = 0; i < colors.length; i++) {
      const color = await ColorModel.findById(colors[i]);
      if(!color){
        throw new ApiError(400, `This '${colors[i]}' colorId not found`)
      }
    }
  }

  //check size
  if(sizes && sizes?.length > 0){
     for (let i = 0; i < sizes.length; i++) {
      const size = await SizeModel.findById(sizes[i]);
      if(!size){
        throw new ApiError(400, `This '${sizes[i]}' sizeId not found`)
      }
    }
  }


  const result = await ProductModel.create(payload);
  return result;
};

const getUserProductsService = async (query: TProductQuery) => {
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
 // const sortDirection = sortOrder === "asc" ? 1 : -1;

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
    {
      $match: {
        ...searchQuery, 
        ...filterQuery,
        status: "visible"
    },
    },
    { $sort: { ratings:-1 } },
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalCountResult = await ProductModel.aggregate([
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
    {
      $match: {
        ...searchQuery,
        ...filterQuery,
        status: "visible"
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
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
 // const sortDirection = sortOrder === "asc" ? 1 : -1;

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
    {
      $match: {
        ...searchQuery, 
        ...filterQuery
    },
    },
    { $sort: { ratings:-1 } },
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalCountResult = await ProductModel.aggregate([
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
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
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

const updateProductService = async (req:Request, productId: string, payload: Partial<IProduct>) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  //desctructuring the payload
  const { name } = payload;
 
  //check product name is already existed
  if (name) {
    const slug = slugify(name).toLowerCase();
    payload.slug = slug;
    const existingProductName = await ProductModel.findOne({
      _id: { $ne: productId },
      slug
    })

    if (existingProductName) {
      throw new ApiError(409, 'This Product name is already existed');
    }
  }

  //update the product
  const result = await ProductModel.updateOne(
    { _id: productId },
    payload,
  );

  return result;
};

const updateProductImgService = async (req: Request, productId: string) => {
  let images = []

  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    const files = req.files as Express.Multer.File[];
    for (const file of files) {
      const path = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;  //for local machine
      images.push(path)
    }
  }
  else {
    throw new ApiError(400, "Minimum one image required");
  }

  const result = await ProductModel.updateOne(
    { _id: productId },
    { images },
    { runValidators: true}
  );

  return result;
}

const deleteProductService = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }
  const product = await ProductModel.findById(productId);
  if(!product){
    throw new ApiError(404, "Product Not Found");
  }
  const result = await ProductModel.deleteOne({ _id:productId });
  return result;
};

export {
  createProductService,
  getUserProductsService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  updateProductImgService,
  deleteProductService,
};
