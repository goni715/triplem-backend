import ApiError from '../../errors/ApiError';
import { ColorSearchableFields } from './Color.constant';
import { IColor, TColorQuery } from './Color.interface';
import ColorModel from './Color.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';

const createColorService = async (
  payload: IColor,
) => {
  const result = await ColorModel.create(payload);
  return result;
};

const getAllColorsService = async (query: TColorQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, ColorSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ColorModel.aggregate([
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
  const totalReviewResult = await ColorModel.aggregate([
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

const getSingleColorService = async (colorId: string) => {
  const result = await ColorModel.findById(colorId);
  if (!result) {
    throw new ApiError(404, 'Color Not Found');
  }

  return result;
};

const updateColorService = async (colorId: string, payload: any) => {
 
  const color = await ColorModel.findById(colorId);
  if(!color){
    throw new ApiError(404, "Color Not Found");
  }
  const result = await ColorModel.updateOne(
    { _id: colorId },
    payload,
  );

  return result;
};

const deleteColorService = async (colorId: string) => {
  const color = await ColorModel.findById(colorId);
  if(!color){
    throw new ApiError(404, "Color Not Found");
  }
  const result = await ColorModel.deleteOne({ _id:colorId });
  return result;
};

export {
  createColorService,
  getAllColorsService,
  getSingleColorService,
  updateColorService,
  deleteColorService,
};
