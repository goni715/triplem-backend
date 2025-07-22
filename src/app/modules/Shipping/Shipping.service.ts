/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShippingSearchableFields } from './Shipping.constant';
import mongoose from 'mongoose';
import { IShipping, TShippingQuery } from './Shipping.interface';
import ShippingModel from './Shipping.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';

const createShippingService = async (
  loginUserId: string,
  payload: IShipping,
) => {
  
  const result = await ShippingModel.create(payload);
  return result;
};

const getAllShippingsService = async (query: TShippingQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, ShippingSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ShippingModel.aggregate([
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
  const totalReviewResult = await ShippingModel.aggregate([
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

const getSingleShippingService = async (shippingId: string) => {
  const result = await ShippingModel.findById(shippingId);
  if (!result) {
    throw new AppError(404, 'Shipping Not Found');
  }

  return result;
};

const updateShippingService = async (shippingId: string, payload: any) => {
 
  const shipping = await ShippingModel.findById(shippingId);
  if(!shipping){
    throw new AppError(404, "Shipping Not Found");
  }
  const result = await ShippingModel.updateOne(
    { _id: shippingId },
    payload,
  );

  return result;
};

const deleteShippingService = async (shippingId: string) => {
  const shipping = await ShippingModel.findById(shippingId);
  if(!shipping){
    throw new AppError(404, "Shipping Not Found");
  }
  const result = await ShippingModel.deleteOne({ _id:moduleName.toLowerCase()}Id });
  return result;
};

export {
  createShippingService,
  getAllShippingsService,
  getSingleShippingService,
  updateShippingService,
  deleteShippingService,
};
