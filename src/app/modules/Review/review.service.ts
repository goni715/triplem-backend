import mongoose, { Types } from "mongoose";
import ApiError from "../../errors/ApiError";
import { IReviewPayload, TReviewQuery } from "./review.interface";
import ReviewModel from "./review.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { ReviewSearchFields } from "./review.constant";
import OrderModel from "../Order/Order.model";
import ObjectId from "../../utils/ObjectId";
import ProductModel from "../Product/Product.model";


const createReviewService = async (
  loginUserId: string,
  payload: IReviewPayload
) => {
  
  const { orderId, productId, star, comment } = payload;
   if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  //check order
   const order = await OrderModel.findOne({
    _id: orderId,
    userId: loginUserId
   });
  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }

  if(order.status !== "delivered"){
    throw new ApiError(409, "Your order has not been delivered yet");
  }

  return "create review service";
  //check if you already put the comment
  const review = await ReviewModel.findOne({
    userId: loginUserId,
    orderId,
  })

  if(review){
    throw new ApiError(409, "You have already reviewed this order");
  }

  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create a new review
    await ReviewModel.create(
      [{
        userId: loginUserId,
        orderId,
        star,
        comment,
      }],
      { session }
    );

    //find the average ratings value
    const averageRatingsResult = await ReviewModel.aggregate(
      [
        {
          $match: { restaurantId: new ObjectId(restaurantId) },
        },
        {
          $group: {
            _id: "$restaurantId",
            averageRating: { $avg: "$star" },
          },
        },
      ],
      { session }
    );

    const averageRatings =
      averageRatingsResult.length > 0
        ? Number((averageRatingsResult[0]?.averageRating).toFixed(1))
        : restaurant.ratings;

    //update the ratings
    const result = await RestaurantModel.updateOne(
      { _id: new ObjectId(restaurantId) },
      { ratings: averageRatings },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const deleteReviewService = async (loginUserId: string, reviewId: string) => {
  const ObjectId = Types.ObjectId;  

   //check review not exist
   const review = await ReviewModel.findOne({
    _id: reviewId,
    ownerId: loginUserId
   });
   if (!review) {
     throw new ApiError(404, "Review Not Found");
   }

   //delete the review
   const result = await ReviewModel.deleteOne({
    _id: new ObjectId(reviewId),
    ownerId : new ObjectId(loginUserId)
   })

   return result;
}


const getMyRestaurantReviewsService = async (loginUserId: string, query: TReviewQuery) => {
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
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, ReviewSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }

    return
  
   //check restaurant not exist
   const restaurant = await RestaurantModel.findOne({ownerId: loginUserId});
   if (!restaurant) {
     throw new ApiError(404, "Restaurant Not Found");
   }

  const result = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurant._id) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        reviewId: "$_id",
        userId: "$user._id",
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        profileImg: "$user.profileImg",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt",
        _id:0
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])

   // total count of matching users 
  const totalReviewResult = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurant._id) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
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
   
}

const getRestaurantReviewsService = async (restaurantId: string, query: TReviewQuery) => {
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
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, ReviewSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }
  
   //check restaurant not exist
   const restaurant = await RestaurantModel.findById(restaurantId);
   if (!restaurant) {
     throw new ApiError(404, "Restaurant Not Found");
   }

  const result = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        fullName: "$user.fullName",
        profileImg: "$user.profileImg",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt",
        _id:0
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])

   // total count of matching users 
  const totalReviewResult = await ReviewModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
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
   
}


const getUserRestaurantReviewsService = async (loginUserId: string, query: TReviewQuery) => {
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
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, ReviewSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }
  
  const result = await ReviewModel.aggregate([
    {
      $match: { userId: new ObjectId(loginUserId) }
    },
     {
      $lookup: {
        from: "restaurants",
        localField: "restaurantId",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        restaurantId:1,
        restaurantName: "$restaurant.name",
        restaurantImg: "$restaurant.restaurantImg",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt",
        _id:0
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])

   // total count of matching users 
  const totalReviewResult = await ReviewModel.aggregate([
    {
       $match: { userId: new ObjectId(loginUserId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
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
   
}

export {
    createReviewService,
    deleteReviewService,
    getRestaurantReviewsService,
    getMyRestaurantReviewsService,
    getUserRestaurantReviewsService
}