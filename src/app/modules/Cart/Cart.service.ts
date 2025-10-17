
import ApiError from '../../errors/ApiError';
import { ICartPayload } from './Cart.interface';
import CartModel from './Cart.model';
import ProductModel from '../Product/Product.model';
import ColorModel from '../Color/Color.model';
import SizeModel from '../Size/Size.model';
import { Types } from "mongoose";
import ObjectId from '../../utils/ObjectId';

const createCartService = async (
  loginUserId: string,
  payload: ICartPayload,
) => {
  const { productId, colorId, sizeId } = payload;

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "productId not found");
  }

  //check product status
  if(product.status==="hidden"){
    throw new ApiError(404, "This product is hidden")
  }
 
  //check product quantity
  if(product.quantity===0){
    throw new ApiError(400, "This product is Out of Stock")
  }

  if (payload.quantity > product.quantity) {
    throw new ApiError(
      400,
      `Only ${product.quantity} item(s) available in stock. Please adjust your quantity.`
    );
  }

  //check colorId
  if (colorId) {
    const color = await ColorModel.findById(colorId);
    if (!color) {
      throw new ApiError(404, "colorId not found");
    }
    //check this colorId is not associated with Product
    const associateWithProduct = await ProductModel.findOne({
      _id: productId,
      colors: { $in: [new ObjectId(colorId)] }
    });
    if (!associateWithProduct) {
      throw new ApiError(409, 'This colorId is not associated with this product');
    }
  }
  
  //check size
  if (sizeId) {
    const size = await SizeModel.findById(sizeId);
    if (!size) {
      throw new ApiError(404, "sizeId not found");
    }
    //check this sizeId is not associated with Product
    const associateWithProduct = await ProductModel.findOne({
      _id: productId,
      sizes: { $in: [new ObjectId(sizeId)] }
    });
    if (!associateWithProduct) {
      throw new ApiError(409, 'This sizeId is not associated with this product');
    }
    //set size
    payload.size=size.size;
  }

  //check product has already been added to your cart
  const cart = await CartModel.findOne({
    userId: loginUserId,
    productId,
  });
  if (cart) {
    throw new ApiError(409, "This product has already been added to your cart");
  }

  const result = await CartModel.create({
    ...payload,
    userId: loginUserId,
    name: product.name,
    price: product.currentPrice,
    image: product.images[0]
  });
  return result;
};

const getCartsService = async (loginUserId: string) => {
  const result = await CartModel.aggregate([
    {
      $match: {
         userId: new Types.ObjectId(loginUserId)
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        quantity: 1,
        image:1
      },
    },
    { $sort: { createdAt: -1 } }, 
  ]);



  return result?.length > 0 ? result?.map((cv)=>({
    ...cv,
    total: Number(cv.price) * Number(cv.quantity)
  })) : [];
};

const updateCartService = async (loginUserId: string, cartId: string, quantity: number) => {
  if (!Types.ObjectId.isValid(cartId)) {
    throw new ApiError(400, "cartId must be a valid ObjectId")
  }

  const cart = await CartModel.findOne({
    _id: cartId,
    userId: loginUserId
  });
  if (!cart) {
    throw new ApiError(404, "cartId not found");
  }

  //check product quantity
  const product = await ProductModel.findById(cart.productId);
  if (!product) {
    throw new ApiError(404, "productId not found");
  }

  if (quantity > product.quantity) {
    throw new ApiError(
      400,
      `Only ${product.quantity} item(s) available in stock.`
    );
  }

  const result = await CartModel.updateOne(
    { userId: loginUserId, _id: cartId },
    { quantity },
  );

  return result;
};


const deleteCartService = async (loginUserId: string, cartId: string) => {
  if (!Types.ObjectId.isValid(cartId)) {
    throw new ApiError(400, "cartId must be a valid ObjectId")
  }
  
  //check cartId
  const cart = await CartModel.findOne({
    _id: cartId,
    userId: loginUserId
  });
  if (!cart) {
    throw new ApiError(404, "cartId not found");
  }

  const result = await CartModel.deleteOne({ _id:cartId, userId: loginUserId });
  return result;
};

export {
  createCartService,
  getCartsService,
  updateCartService,
  deleteCartService,
};
