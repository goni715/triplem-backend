import { Request } from "express";
import ApiError from "../../errors/ApiError";
import UserModel from "../User/user.model";
import { IAdmin, TAccess, TAdministratorQuery, TUpdateAdministrator } from "./admin.interface";
import mongoose from "mongoose";
import AdministratorModel from "./administrator.model";
import config from "../../config";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { AdministratorSearchFields } from "./admin.constant";


const createAdminService = async (req:Request, payload:IAdmin) => {
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


const updateAccessService = async (administratorId: string, access: TAccess[]) => {
  const administrator = await AdministratorModel.findById(administratorId);
  if(!administrator){
    throw new ApiError(404, "Administrator Not found");
  }

  //update the administrator
  const result = await AdministratorModel.updateOne(
    { _id: administratorId },
    { access }
  )
  return result;
}

const getAdministratorsService = async (query: TAdministratorQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, AdministratorSearchFields);
      }
    
      //5 setup filters
      let filterQuery = {};
      if (filters) {
        filterQuery = makeFilterQuery(filters);
      }
  

  const result = await AdministratorModel.aggregate([
    {
      $lookup: {
        from : "users",
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
        _id:1,
        userId:1,
        access:1,
        name: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        profileImg: "$user.profileImg",
        status: "$user.status",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
      }
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }
  ])


  //total count
  const administratorResultCount = await AdministratorModel.aggregate([
    {
      $lookup: {
        from : "users",
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
        _id:1,
        userId:1,
        access:1,
        name: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        profileImg: "$user.profileImg",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
      }
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ]);

  
  const totalCount = administratorResultCount[0]?.totalCount || 0;
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

const deleteAdministratorService = async (administratorId: string) => {
  const administrator = await AdministratorModel.findById(administratorId);
  if(!administrator){
    throw new ApiError(404, "Administrator Not found");
  }

  const session = await mongoose.startSession();

  try{
    session.startTransaction();

    //delete the administrator
    const result = await AdministratorModel.deleteOne({
      _id: administratorId
    }, { session });


    //delete the user
    await UserModel.deleteOne(
      { _id: administrator.userId},
      { session }
    )

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

const getSingleAdministratorService = async (administratorId: string) => {
  const administrator = await AdministratorModel.findById(administratorId);
  if(!administrator){
    throw new ApiError(404, "Administrator Not found");
  }

  return administrator;
}

const updateAdministratorService = async (userId: string, payload:TUpdateAdministrator) => {
  const administrator = await AdministratorModel.findOne({ userId });
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
    updateAccessService,
    updateAdministratorService,
    getAdministratorsService,
    deleteAdministratorService,
    getSingleAdministratorService
}