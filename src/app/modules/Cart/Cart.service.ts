
import ApiError from '../../errors/ApiError';
import { CartSearchableFields } from './Cart.constant';
import { ICart, TCartQuery } from './Cart.interface';
import CartModel from './Cart.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import ProductModel from '../Product/Product.model';
import ColorModel from '../Color/Color.model';
import SizeModel from '../Size/Size.model';

const createCartService = async (
  loginUserId: string,
  payload: ICart,
) => {
  const { productId, colorId, sizeId } = payload;

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "productId not found");
  }

  //check colorId
  if (colorId) {
    const color = await ColorModel.findById(colorId);
    if (!color) {
      throw new ApiError(404, "colorId not found");
    }
  }
  
  //check size
  if (sizeId) {
    const size = await SizeModel.findById(sizeId);
    if (!size) {
      throw new ApiError(404, "sizeId not found");
    }
  }

  //check product has already been added to your cart
  const cart = await CartModel.findOne({
    userId: loginUserId,
    productId
  });
  if (cart) {
    throw new ApiError(409, "This product has already been added to your cart");
  }

  const result = await CartModel.create({
    ...payload,
    userId: loginUserId
  });
  return result;
};

const getAllCartsService = async (query: TCartQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, CartSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await CartModel.aggregate([
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
  const totalReviewResult = await CartModel.aggregate([
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

const getSingleCartService = async (cartId: string) => {
  const result = await CartModel.findById(cartId);
  if (!result) {
    throw new ApiError(404, 'Cart Not Found');
  }

  return result;
};

const updateCartService = async (cartId: string, payload: any) => {
 
  const cart = await CartModel.findById(cartId);
  if(!cart){
    throw new ApiError(404, "Cart Not Found");
  }
  const result = await CartModel.updateOne(
    { _id: cartId },
    payload,
  );

  return result;
};

const deleteCartService = async (cartId: string) => {
  const cart = await CartModel.findById(cartId);
  if(!cart){
    throw new ApiError(404, "Cart Not Found");
  }
  const result = await CartModel.deleteOne({ _id:cartId });
  return result;
};

export {
  createCartService,
  getAllCartsService,
  getSingleCartService,
  updateCartService,
  deleteCartService,
};
