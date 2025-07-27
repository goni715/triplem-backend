import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createOrderService, getSingleOrderService, getAllOrdersService, updateOrderService, deleteOrderService } from './Order.service';

const createOrder = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createOrderService(loginUserId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order is created successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await getSingleOrderService(orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is retrieved successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await getAllOrdersService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await updateOrderService(orderId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteOrderService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is deleted successfully',
    data: result,
  });
});

const OrderController = {
  createOrder,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
export default OrderController;
