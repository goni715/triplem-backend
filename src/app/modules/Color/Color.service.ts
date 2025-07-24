import ApiError from '../../errors/ApiError';
import { ColorSearchableFields } from './Color.constant';
import { IColor, TColorQuery } from './Color.interface';
import ColorModel from './Color.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import slugify from 'slugify';

const createColorService = async (
  payload: IColor,
) => {
  const { name, hexCode } = payload;
  const slug = slugify(name).toLowerCase();
  payload.slug=slug;

  //check color name is already existed
  const existingColorName = await ColorModel.findOne({
    slug
  });

  if (existingColorName) {
    throw new ApiError(409, 'This color name is already existed');
  }

  //check color code is already existed
  const existingHexCode = await ColorModel.findOne({
    hexCode
  });

  if (existingHexCode) {
    throw new ApiError(409, 'This Hex Code is already existed');
  }

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
        name: 1,
        hexCode: 1
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count
  const totalCountResult = await ColorModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
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


const getColorDropDownService = async () => {
    const result = await ColorModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


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
  getColorDropDownService,
  getSingleColorService,
  updateColorService,
  deleteColorService,
};
