import { Request } from "express";
import ApiError from "../../errors/ApiError";
import UserModel from "../User/user.model";
import mongoose from "mongoose";
import config from "../../config";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { TAdminQuery } from "./admin.interface";
import { AdminSearchFields } from "./admin.constant";


const createAdminService = async (req:Request, payload:any) => {
    const { email, password } = payload;
    const user = await UserModel.findOne({ email });
    if (user) {
        throw new ApiError(409, 'This Email is already existed')
    }

    if(!password){
        payload.password=config.administrator_default_password as string;
    }
    
    //create admin
    const result = await UserModel.create({
      ...payload,
      role: "admin",
      isVerified: true
    });

    result.password=""
    return result;

}



const getAdminsService = async (query: TAdminQuery) => {
  // 1. Extract query parameters
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
    searchQuery = makeSearchQuery(searchTerm, AdminSearchFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  const result = await UserModel.aggregate([
    {
      $match: {
        role: "admin",
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
        gender: 1,
        status: 1
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalCount = await UserModel.countDocuments({
    role: "admin",
    ...searchQuery,
    ...filterQuery,
  });

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)),
      total: totalCount,
    },
    data: result,
  };

};



const deleteAdminService = async (administratorId: string) => {
  const administrator = await UserModel.findById(administratorId);
  if(!administrator){
    throw new ApiError(404, "Administrator Not found");
  }

  const session = await mongoose.startSession();

  try{
    session.startTransaction();

    //delete the administrator
    const result = await UserModel.deleteOne({
      _id: administratorId
    }, { session });


    // //delete the user
    // await UserModel.deleteOne(
    //   { _id: administrator.userId},
    //   { session }
    //)

    //transaction success
    await session.commitTransaction();
    await session.endSession();
    return result; 
  }catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
}

const getSingleAdminService = async (administratorId: string) => {
  const administrator = await UserModel.findById(administratorId);
  if(!administrator){
    throw new ApiError(404, "Administrator Not found");
  }

  return administrator;
}

const updateAdminService = async (userId: string, payload:any) => {
  const administrator = await UserModel.findOne({ userId });
  if(!administrator){
    throw new ApiError(404, "Administrator Not Found");
  }
  const result = UserModel.updateOne(
    { _id: userId },
    payload
  )

  return result;
}

export {
    createAdminService,
    updateAdminService,
    getAdminsService,
    deleteAdminService,
    getSingleAdminService
}