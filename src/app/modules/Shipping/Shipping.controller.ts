import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createShippingService, getSingleShippingService, getAllShippingsService, updateShippingService, deleteShippingService } from './Shipping.service';

const createShipping = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createShippingService(loginUserId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Shipping is created successfully',
    data: result,
  });
});

const getSingleShipping = catchAsync(async (req, res) => {
  const { shippingId } = req.params;
  const result = await getSingleShippingService(shippingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping is retrieved successfully',
    data: result,
  });
});

const getAllShippings = catchAsync(async (req, res) => {
  const result = await getAllShippingsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shippings are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateShipping = catchAsync(async (req, res) => {
  const { shippingId } = req.params;
  const result = await updateShippingService(shippingId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping is updated successfully',
    data: result,
  });
});

const deleteShipping = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteShippingService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping is deleted successfully',
    data: result,
  });
});

const ShippingController = {
  createShipping,
  getSingleShipping,
  getAllShippings,
  updateShipping,
  deleteShipping,
};
export default ShippingController;
