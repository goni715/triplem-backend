import ApiError from '../../errors/ApiError';
import { OrderSearchableFields } from './Order.constant';
import { TOrderQuery, TUserOrderQuery } from './Order.interface';
import OrderModel from './Order.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import CartModel from '../Cart/Cart.model';
import ObjectId from '../../utils/ObjectId';
import mongoose, { Types } from "mongoose";

const createOrderService = async (
  loginUserId: string
) => {

  const carts = await CartModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    {
      $project: {
        _id:0,
        userId: 0,
        createdAt:0,
        updatedAt:0
      }
    }
  ]);

  if(carts?.length===0){
    throw new ApiError(404, "No items in cart.")
  }
  
  //count totalPrice
  const totalPrice = carts?.reduce((total, currentValue)=>total+ (currentValue.price*currentValue.quantity), 0);
  const cartProducts = carts?.map((cv) => ({
    ...cv,
    total: Number(cv.price) * Number(cv.quantity)
  }))

   //generate token
  const token = Math.floor(100000 + Math.random() * 900000);

     //transaction & rollback
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      //delete from cart list
      await CartModel.deleteMany(
        { userId: new ObjectId(loginUserId) },
        { session }
      );
  
      const result = await OrderModel.create([
        {
          userId: loginUserId,
          token,
          products: cartProducts,
          totalPrice
        }
      ], {session});
  
      //transaction success
      await session.commitTransaction();
      await session.endSession();
      return result;
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }

};

const getUserOrdersService = async (loginUserId: string, query: TUserOrderQuery) => {
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


  const result = await OrderModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "colors",
        localField: "products.colorId",
        foreignField: "_id",
        as: "products.color"
      }
    },
    {
      $unwind: {
        path: "$products.color",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "reviews",
        let: {
          productId: "$products.productId",
          orderId: "$_id",
          userId: new ObjectId(loginUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$orderId", "$$orderId"] },
                  { $eq: ["$userId", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "products.reviews",
      },
    },
    {
      $addFields: {
        "products.isReview": {
          $cond: {
            if: { $gt: [{ $size: "$products.reviews" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        token: { $first: "$token" },
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        paymentStatus: { $first: "$paymentStatus" },
        status: { $first: "$status" },
        deliveryAt: { $first: "$deliveryAt" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        products: { $push: "$products" }
      }
    },
    {
      $project: {
        _id: 1,
        token: 1,
        totalPrice: 1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        createdAt: 1,
        products: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              productId: "$$product.productId",
              name: "$$product.name",
              price: "$$product.price",
              quantity: "$$product.quantity",
              total: "$$product.total",
              image: "$$product.image",
              size: "$$product.size",
              colorName: "$$product.color.name",
              colorHexCode: "$$product.color.hexCode",
              isReview: "$$product.isReview"
            }
          }
        }
      }
    }
  ]);

  // total count
  const totalCountResult = await OrderModel.aggregate([
     {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
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


const getAllOrdersService = async (query: TOrderQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, OrderSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await OrderModel.aggregate([
     {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        token:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count result
  const totalCountResult = await OrderModel.aggregate([
     {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
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

const getSingleOrderService = async (orderId: string) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "orderId must be a valid ObjectId")
  }

  const result = await OrderModel.aggregate([
    {
      $match: {
        _id: new ObjectId(orderId)
      }
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "colors",
        localField: "products.colorId",
        foreignField: "_id",
        as: "products.color"
      }
    },
    {
      $unwind: {
        path: "$products.color",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        token: { $first: "$token" },
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        paymentStatus: { $first: "$paymentStatus" },
        status: { $first: "$status" },
        deliveryAt: { $first: "$deliveryAt" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        products: { $push: "$products" }
      }
    },
    {
      $project: {
        _id: 1,
        token:1,
        totalPrice: 1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        createdAt: 1,
        products: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              productId: "$$product.productId",
              name: "$$product.name",
              price: "$$product.price",
              quantity: "$$product.quantity",
              total: "$$product.total",
              image: "$$product.image",
              size: "$$product.size",
              colorName: "$$product.color.name",
              colorHexCode: "$$product.color.hexCode"
            }
          }
        }
      }
    }
  ]);


  if (result.length===0) {
    throw new ApiError(404, 'orderId Not Found');
  }

  return result[0];
};

const updateOrderService = async (orderId: string, payload: any) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "orderId must be a valid ObjectId")
  }
  
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }
  const result = await OrderModel.updateOne(
    { _id: orderId },
    payload,
  );

  return result;
};

const deleteOrderService = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if(!order){
    throw new ApiError(404, "Order Not Found");
  }
  const result = await OrderModel.deleteOne({ _id:orderId });
  return result;
};

export {
  createOrderService,
  getUserOrdersService,
  getAllOrdersService,
  getSingleOrderService,
  updateOrderService,
  deleteOrderService,
};
