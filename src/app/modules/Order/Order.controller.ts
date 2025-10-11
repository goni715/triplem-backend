import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { OrderValidFields, UserOrderValidFields } from './Order.constant';
import { getSingleOrderService, getAllOrdersService, updateOrderService, deleteOrderService, getUserOrdersService, verifySessionService, getIncomeOverviewService, createOrderWithPayNowService, createOrderWithStripeService } from './Order.service';

const createOrderWithStripe = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const userEmail = req.headers.email;
  const result = await createOrderWithStripeService(loginUserId as string, userEmail as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order is initiated successfully',
    data: result,
  });
});


const createOrderWithPayNow = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const userEmail = req.headers.email;
  const result = await createOrderWithPayNowService(loginUserId as string, userEmail as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order is initiated successfully',
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

const getUserOrders = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, UserOrderValidFields);
  const result = await getUserOrdersService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders are retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, OrderValidFields);
  const result = await getAllOrdersService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders are retrieved successfully',
    meta: result.meta,
    data: result.data
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

const verifySession = catchAsync(async (req, res) => {
  const { sessionId } = req.query;
  const result = await verifySessionService(sessionId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment Successful',
    data: result,
  });
});


const getIncomeOverview = catchAsync(async (req, res) => {
  const { year } = req.params;
  const result = await getIncomeOverviewService(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Income overview is retrieved successfully',
    data: result,
  });
});

const OrderController = {
  createOrderWithStripe,
  createOrderWithPayNow,
  getSingleOrder,
  getUserOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  verifySession,
  getIncomeOverview
};
export default OrderController;
