import ApiError from '../../errors/ApiError';
import { OrderSearchableFields } from './Order.constant';
import { TOrderQuery, TUserOrderQuery } from './Order.interface';
import OrderModel from './Order.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import CartModel from '../Cart/Cart.model';
import ObjectId from '../../utils/ObjectId';

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


 //transaction & rollback

  const result = await OrderModel.create({
    userId: loginUserId,
    products: cartProducts,
    totalPrice
  });
  return result;

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
        as:"products.color"
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
      _id:1,
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
  const totalReviewResult = await OrderModel.aggregate([
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

const getSingleOrderService = async (orderId: string) => {
  const result = await OrderModel.findById(orderId);
  if (!result) {
    throw new ApiError(404, 'Order Not Found');
  }

  return result;
};

const updateOrderService = async (orderId: string, payload: any) => {
 
  const order = await OrderModel.findById(orderId);
  if(!order){
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
