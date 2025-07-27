import ApiError from '../../errors/ApiError';
import { OrderSearchableFields } from './Order.constant';
import { TOrderQuery } from './Order.interface';
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
    }
  ])
  return carts;
  const result = await OrderModel.create(payload);
  return result;
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
  getAllOrdersService,
  getSingleOrderService,
  updateOrderService,
  deleteOrderService,
};
