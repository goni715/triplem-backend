import slugify from "slugify";
import DiningModel from "./Size.model";
import ObjectId from "../../utils/ObjectId";
import { TDiningQuery } from "./Size.interface";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { DiningSearchFields } from "./Size.constant";
import ApiError from "../../errors/ApiError";
import SizeModel from "./Size.model";



const createSizeService = async (loginUserId:string, size: string) => {
    const slug = slugify(size).toLowerCase();
    
    //check size is already existed
    const existingSize = await SizeModel.findOne({
        slug
    });

    if(existingSize){
        throw new ApiError(409, 'This size is already existed');
    }

    const result = await SizeModel.create({
         size,
         slug
    })
    return result;
}



const getDiningListService = async (loginUserId: string, query: TDiningQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, DiningSearchFields);
      }
    
      //5 setup filters
      let filterQuery = {};
      if (filters) {
        filterQuery = makeFilterQuery(filters);
      }
   const result = await DiningModel.aggregate([
      {
          $match: {
              ownerId: new ObjectId(loginUserId),
              ...searchQuery,
              ...filterQuery
          }
      },
      {
        $project: {
            _id:1,
            name:1
        }
      },
      { $sort: { [sortBy]: sortDirection } },
      { $skip: skip },
      { $limit: Number(limit) },
  ])

//total count
const totalDiningResult = await DiningModel.aggregate([
  {
    $match: {
      ownerId: new ObjectId(loginUserId),
      ...searchQuery,
      ...filterQuery
    }
  },
  { $count: "totalCount" }
])

const totalCount = totalDiningResult[0]?.totalCount || 0;
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

const getSizeDropDownService = async (loginUserId:string) => {
    return "Size Drop Down Service";
    const result = await DiningModel.find({
        ownerId: loginUserId
    }).select('-createdAt -updatedAt -slug -ownerId -restaurantId').sort('-createdAt');
    return result;
}



const updateSizeService = async (loginUserId:string, diningId: string, name: string) => {
    
    return "Update Size Service"

    const dining = await DiningModel.findOne({
        ownerId: loginUserId,
        _id: diningId
    })
    if(!dining){
        throw new ApiError(404, 'This diningId not found');
    }

    const slug = slugify(name).toLowerCase();
    const diningExist = await DiningModel.findOne({
         _id: { $ne: diningId },
         ownerId: loginUserId,
        slug 
    })
    if(diningExist){
        throw new ApiError(409, 'Sorry! This dining name is already taken');
    }

    const result = await DiningModel.updateOne(
        { _id: diningId, ownerId:loginUserId},
        {
            name,
            slug
        }
    )

    return result;
}

const deleteSizeService = async (diningId: string) => {
    return "Delete Size Service";
    const dining = await DiningModel.findById(diningId)
    if(!dining){
        throw new ApiError(404, 'This diningId not found');
    }

    //check if diningId is associated with table
    // const associateWithTable = await TableModel.findOne({
    //      diningId
    // });
    // if(associateWithTable){
    //     throw new ApiError(409, 'Failled to delete, This dining is associated with Table');
    // }


    const result = await DiningModel.deleteOne({ _id: dining})
    return result;
}



export {
    createSizeService,
    getDiningListService,
    getSizeDropDownService,
    updateSizeService,
    deleteSizeService
}