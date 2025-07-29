import { Types } from "mongoose";
import FavouriteModel from "./favourite.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { FavouriteSearchFields } from "./favourite.constant";
import { TFavouriteQuery } from "./favourite.interface";
import ApiError from "../../errors/ApiError";
import ProductModel from "../Product/Product.model";
import ObjectId from "../../utils/ObjectId";


const addOrRemoveFavouriteService = async (
  loginUserId: string,
  productId: string
) => {
  const ObjectId = Types.ObjectId;

  //check Product doesn't exist
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  //cheack produsct is already existed to favourite list
  const favourite = await FavouriteModel.findOne({
    userId: loginUserId,
    productId
  })

  
  let result;
  let message;

  //if exist, remove it
  if(favourite){
    result = await FavouriteModel.deleteOne({ _id: new ObjectId(favourite._id) })
    message = "Removed from your favourite list"
  }


   //if not exist, create a new one
   if(!favourite){
    result = await FavouriteModel.create({
        userId: loginUserId,
        productId
    })
    message = "Added to your favourite list"
   }

   return {
      message,
      data: result
   }
 
};


const getFavouriteListService = async ( loginUserId: string, query:TFavouriteQuery ) => {
    const ObjectId = Types.ObjectId;
    
  // 1. Extract query parameters
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters // Any additional filters
  } = query;


  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery: any = {};
   if (searchTerm) {
     searchQuery = makeSearchQuery(searchTerm, FavouriteSearchFields);
   }



  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  

  const result = await FavouriteModel.aggregate([
    {
      $match: { userId: new ObjectId(loginUserId) },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product"
    },
    {
      $lookup: {
        from: "categories",
        localField: "product.categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $addFields: {
        isFavourite: true
      },
    },
    {
      $project: {
        _id: "$product._id",
        name: "$product.name",
        categoryId: "$product.categoryId",
        categoryName: "$category.name",
        currentPrice: "$product.currentPrice",
        originalPrice: "$product.originalPrice",
        discount: "$product.discount",
        ratings: "$product.ratings",
        totalReview: "$product.totalReview",
        images: "$product.images",
        colors: "$product.colors",
        sizes: "$product.sizes",
        introduction: "$product.introduction",
        description: "$product.description",
        status: "$product.status",
        isFavourite: "$isFavourite"
      },
    },
     {
      $match: { ...searchQuery, ...filterQuery },
    },
    { $skip: skip },
    { $limit: Number(limit) },
    { $sort: { [sortBy]: sortDirection } },
  ]);


    //count total for pagination
    const totalResultCount = await FavouriteModel.aggregate([
      {
        $match: { userId: new ObjectId(loginUserId) },
      },
      {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product"
    },
    {
      $lookup: {
        from: "categories",
        localField: "product.categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $project: {
        _id: "$product._id",
        name: "$product.name",
        categoryId: "$product.categoryId",
        categoryName: "$category.name",
        currentPrice: "$product.currentPrice",
        originalPrice: "$product.originalPrice",
        discount: "$product.discount",
        ratings: "$product.ratings",
        totalReview: "$product.totalReview",
        images: "$product.images",
        colors: "$product.colors",
        sizes: "$product.sizes",
        introduction: "$product.introduction",
        description: "$product.description",
        status: "$product.status"
      },
    },
     {
      $match: { ...searchQuery, ...filterQuery },
    },
      { $count: "totalCount" },
    ]);


    const totalCount = totalResultCount[0]?.totalCount || 0;
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
    
}


const getFavouriteIdsService = async (loginUserId: string) => {
  const products = await FavouriteModel.aggregate([
    {
      $match: { userId: new ObjectId(loginUserId)}
    }
  ]);

  return products?.length > 0 ? products?.map((product)=>product.productId) : [];
}



export {
    addOrRemoveFavouriteService,
    getFavouriteListService,
    getFavouriteIdsService
}