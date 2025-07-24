import ApiError from '../../errors/ApiError';
import { ColorSearchableFields } from './Color.constant';
import { IColor, TColorQuery } from './Color.interface';
import ColorModel from './Color.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import slugify from 'slugify';
import { Types } from "mongoose";
import ObjectId from '../../utils/ObjectId';
import ProductModel from '../Product/Product.model';

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
    { $sort: { [sortBy]: sortDirection } }, 
    {
      $project: {
        _id: 1,
        name: 1,
        hexCode: 1
      },
    },
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

const updateColorService = async (colorId: string, payload: Partial<IColor>) => {
 
  if (!Types.ObjectId.isValid(colorId)) {
    throw new ApiError(400, "colorId must be a valid ObjectId")
  }

  const existingColor = await ColorModel.findById(colorId);
  if (!existingColor) {
    throw new ApiError(404, 'This colorId not found');
  }

  //check color name is already existed
  if (payload?.name) {
    const slug = slugify(payload.name).toLowerCase();
    payload.slug = slug;
    const existingColorName = await ColorModel.findOne({
      _id: { $ne: colorId },
      slug
    })

    if (existingColorName) {
      throw new ApiError(409, 'This color name is already existed');
    }
  }
    

  if (payload.hexCode) {
    const existingHexCode = await ColorModel.findOne({
      _id: { $ne: colorId },
      hexCode: payload.hexCode
    });

    if (existingHexCode) {
      throw new ApiError(409, 'This Hex Code is already existed');
    }
  }


  const result = await ColorModel.updateOne(
    { _id: colorId },
    payload
  );

  return result;
};

const deleteColorService = async (colorId: string) => {
  if (!Types.ObjectId.isValid(colorId)) {
    throw new ApiError(400, "colorId must be a valid ObjectId")
  }

  const color = await ColorModel.findById(colorId);
  if (!color) {
    throw new ApiError(404, "colorId Not Found");
  }

  //check if colorId is associated with Product
  const associateWithProduct = await ProductModel.findOne({
    colors: new ObjectId(colorId),
  });
  if (associateWithProduct) {
    throw new ApiError(409, 'Failled to delete, This color is associated with Product');
  }

  const result = await ColorModel.deleteOne({ _id: colorId });
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
