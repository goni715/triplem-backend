import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createCartService, getSingleCartService, getAllCartsService, updateCartService, deleteCartService } from './Cart.service';

const createCart = catchAsync(async (req, res) => {
  const result = await createCartService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Cart is created successfully',
    data: result,
  });
});

const getSingleCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  const result = await getSingleCartService(cartId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart is retrieved successfully',
    data: result,
  });
});

const getAllCarts = catchAsync(async (req, res) => {
  const result = await getAllCartsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Carts are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  const result = await updateCartService(cartId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart is updated successfully',
    data: result,
  });
});

const deleteCart = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteCartService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart is deleted successfully',
    data: result,
  });
});

const CartController = {
  createCart,
  getSingleCart,
  getAllCarts,
  updateCart,
  deleteCart,
};
export default CartController;
